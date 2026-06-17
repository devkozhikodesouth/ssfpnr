const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const auditSchemaPlugin = require('./plugins/audit-schema')
const softDeletePlugin = require('./plugins/soft-delete')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, sparse: true },
  phone: { type: String },
  password: { type: String, required: true, select: false },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  permissions: [{ type: String }],
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
})

userSchema.plugin(auditSchemaPlugin)
userSchema.plugin(softDeletePlugin)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

module.exports = User
