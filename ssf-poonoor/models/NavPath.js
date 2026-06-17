const mongoose = require('mongoose')
const auditSchemaPlugin = require('./plugins/audit-schema')

// Navigation entries managed from /app/path-manage. Each item belongs to one of
// three locations (top nav, mobile bottom nav, footer) and carries a manual
// `order` used for drag-to-reorder within that location.
const navPathSchema = new mongoose.Schema({
  label: { type: String, required: true },
  labelMl: { type: String },
  path: { type: String, required: true },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  isExternal: { type: Boolean, default: false },
  icon: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'NavPath', default: null },
  location: {
    type: String,
    enum: ['top-nav', 'bottom-nav', 'footer'],
    default: 'top-nav',
    index: true,
  },
})

navPathSchema.plugin(auditSchemaPlugin)

module.exports = mongoose.models.NavPath || mongoose.model('NavPath', navPathSchema)
