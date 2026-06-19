// Diagnose + repair the Super Admin login.
//
// Why this exists:
//   `scripts/seed.js` only CREATES the admin "if it doesn't already exist".
//   Changing SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD (in .env or on Vercel)
//   therefore does NOT update an existing DB record, so the live login keeps
//   rejecting the new credentials. This script force-repairs the record.
//
// What it does:
//   1. Connects to MongoDB (same DB as production — shared Atlas cluster).
//   2. Prints every user already in the DB (username, active/deleted, role).
//   3. Tests whether SEED_ADMIN_PASSWORD already matches the target user.
//   4. Repairs / creates the Super Admin user so that it is EXACTLY:
//        username  = SEED_ADMIN_USERNAME   (from .env)
//        password  = SEED_ADMIN_PASSWORD   (from .env, freshly bcrypt-hashed)
//        isActive  = true,  isDeleted = false,  role = Super Admin
//   5. Re-reads and verifies the password matches.
//
// Usage (run from the ssf-poonoor folder, where the DB connection works):
//   node scripts/reset-admin.js
//
// Optional override without editing .env:
//   ADMIN_USERNAME=notion@pnr ADMIN_PASSWORD='kpm@pnr' node scripts/reset-admin.js

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const connectDB = require('../lib/db')
const User = require('../models/User')
const Role = require('../models/Role')

const USERNAME = process.env.ADMIN_USERNAME || process.env.SEED_ADMIN_USERNAME
const PASSWORD = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD

;(async () => {
  if (!USERNAME || !PASSWORD) {
    console.error('❌ SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD not set in .env')
    process.exit(1)
  }

  await connectDB()
  console.log('Connected to DB:', mongoose.connection.name)
  console.log('Target admin username:', JSON.stringify(USERNAME))
  console.log('')

  // ---- 1. Show every user currently in the DB (raw, bypassing soft-delete) ----
  const raw = await mongoose.connection.db.collection('users').find({}).toArray()
  console.log(`Existing users (${raw.length}):`)
  for (const u of raw) {
    const matches = u.password ? await bcrypt.compare(PASSWORD, u.password) : false
    console.log(
      `  • username=${JSON.stringify(u.username)}` +
        ` active=${u.isActive} deleted=${u.isDeleted}` +
        ` role=${u.roleId || '(none)'}` +
        ` hash=${(u.password || '(none)').slice(0, 7)}` +
        ` passwordMatchesTarget=${matches}`
    )
  }
  console.log('')

  // ---- 2. Ensure the Super Admin role exists ----
  let role = await Role.findOne({ slug: 'super-admin' })
  if (!role) {
    console.log('Super Admin role missing — creating it.')
    role = await Role.create({
      name: 'Super Admin',
      slug: 'super-admin',
      description: 'System owner with full access',
      isSystem: true,
      permissions: ['users.manage', 'roles.manage', 'site.configure', 'analytics.view'],
    })
  }

  // ---- 3. Repair (or create) the target admin user ----
  // Hash manually and write straight to the collection. This bypasses the
  // soft-delete query middleware (which can hide a deleted record) and the
  // pre-save hashing hook (so there is zero risk of double-hashing).
  const users = mongoose.connection.db.collection('users')
  const hash = await bcrypt.hash(PASSWORD, 12)
  const now = new Date()

  await users.updateOne(
    { username: USERNAME },
    {
      $set: {
        name: 'Super Admin',
        username: USERNAME,
        password: hash,
        roleId: role._id,
        permissions: [],
        isActive: true,
        isDeleted: false,
        deletedAt: null,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  )

  // ---- 4. Verify by reading the record back and comparing ----
  const check = await users.findOne({ username: USERNAME })
  const ok = check && check.password ? await bcrypt.compare(PASSWORD, check.password) : false
  console.log('')
  console.log('Repaired user:')
  console.log('  username :', check.username)
  console.log('  isActive :', check.isActive)
  console.log('  role     :', role.name, `(${role._id})`)
  console.log('  password verifies:', ok)
  console.log('')
  console.log(ok ? '✅ DONE — log in with these credentials now.' : '❌ Verification failed.')

  await mongoose.disconnect()
  process.exit(ok ? 0 : 1)
})().catch((err) => {
  console.error('❌ FAILED:', err.message)
  process.exit(1)
})
