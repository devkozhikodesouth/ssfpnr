const mongoose = require('mongoose')
const auditSchemaPlugin = require('./plugins/audit-schema')

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  permissions: [{ type: String }],
  isSystem: { type: Boolean, default: false },
  color: { type: String },
})

roleSchema.plugin(auditSchemaPlugin)

const Role = mongoose.models.Role || mongoose.model('Role', roleSchema)

module.exports = Role
