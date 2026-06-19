const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

async function main() {
  const uri = process.env.MONGODB_URI
  console.log('URI host:', uri.replace(/\/\/.*@/, '//***@').slice(0,60))
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  console.log('CONNECTED. db =', mongoose.connection.name)
  const User = require('./models/User')
  const Role = require('./models/Role')
  const users = await User.find({}).select('+password').populate('roleId').lean()
  console.log('TOTAL USERS:', users.length)
  for (const u of users) {
    console.log('---')
    console.log('username:', u.username)
    console.log('name:', u.name)
    console.log('isActive:', u.isActive)
    console.log('isDeleted:', u.isDeleted)
    console.log('roleId:', u.roleId ? (u.roleId.name||u.roleId._id) : null)
    console.log('passwordHashPrefix:', u.password ? u.password.slice(0,7) : '(none)')
    console.log('hashLooksBcrypt:', /^\$2[aby]\$/.test(u.password||''))
  }
  await mongoose.disconnect()
}
main().catch(e => { console.error('ERR:', e.message); process.exit(1) })
