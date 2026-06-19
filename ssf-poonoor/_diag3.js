const path = require('path')
require('dotenv').config({ path: path.join(process.cwd(), '.env') })
const mongoose = require('mongoose')
const connectDB = require('./lib/db')
async function main() {
  await connectDB()
  console.log('CONNECTED db =', mongoose.connection.name)
  const db = mongoose.connection.db
  const users = await db.collection('users').find({}).toArray()
  const roles = await db.collection('roles').find({}).project({name:1,slug:1}).toArray()
  console.log('ROLES:', roles.map(r=>r.slug+':'+r._id).join(' , '))
  console.log('TOTAL USERS:', users.length)
  for (const u of users) {
    console.log('--- username:', JSON.stringify(u.username),
      '| isActive:', u.isActive,
      '| isDeleted:', u.isDeleted,
      '| roleId:', u.roleId,
      '| hash:', (u.password||'(none)').slice(0,7),
      '| bcrypt?', /^\$2[aby]\$/.test(u.password||''),
      '| len:', (u.password||'').length)
  }
  process.exit(0)
}
main().catch(e=>{console.error('ERR:',e.message);process.exit(1)})
