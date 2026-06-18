// Verifies the MongoDB Atlas connection using the project's own lib/db.js.
// Usage:  node scripts/verify-db.js
// Loads .env.local (falls back to .env) then connects via connectDB().

const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const mongoose = require('mongoose')
const connectDB = require('../lib/db')

;(async () => {
  const uri = process.env.MONGODB_URI || ''
  console.log('Connecting to:', uri.replace(/\/\/[^@]*@/, '//***:***@').split('?')[0] || '(MONGODB_URI not set)')
  const started = Date.now()
  try {
    await connectDB()
    const ping = await mongoose.connection.db.admin().ping()
    const cols = await mongoose.connection.db.listCollections().toArray()
    console.log('Ping:', JSON.stringify(ping))
    console.log('Database:', mongoose.connection.name)
    console.log('Collections:', cols.map((c) => c.name).join(', ') || '(none yet)')
    console.log(`\n✅ SUCCESS — connected in ${Date.now() - started} ms`)
    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('\n❌ FAILED:', err.message)
    process.exit(1)
  }
})()
