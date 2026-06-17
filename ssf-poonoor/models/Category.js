const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  coverImage: { type: String },
  icon: { type: String },
  color: { type: String },
  type: {
    type: String,
    enum: ['event-based', 'topical', 'permanent'],
    required: true,
  },
  appliesTo: [{
    type: String,
    enum: ['news', 'video', 'gallery', 'blog', 'event', 'campaign', 'download'],
  }],
  isStandalone: { type: Boolean, default: false },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  order: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
})

categorySchema.plugin(softDeletePlugin)
categorySchema.plugin(auditSchemaPlugin)
categorySchema.plugin(visibilitySchemaPlugin)

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema)

module.exports = Category
