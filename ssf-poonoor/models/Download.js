const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { seoSchemaPlugin } = require('./plugins/seo-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')
const { sortSchemaPlugin } = require('./plugins/sort-schema')

const downloadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    file: { type: String },
    fileType: { type: String },
    fileSize: { type: Number },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    downloadCount: { type: Number, default: 0 },
    requiresAuth: { type: Boolean, default: false },
  },
  { collection: 'downloads' }
)

downloadSchema.plugin(seoSchemaPlugin)
downloadSchema.plugin(visibilitySchemaPlugin)
downloadSchema.plugin(sortSchemaPlugin)
downloadSchema.plugin(auditSchemaPlugin)
downloadSchema.plugin(softDeletePlugin)

// Composite indexes for the common public-list and category queries (PLAN §22).
downloadSchema.index({ 'visibility.isPublished': 1, isDeleted: 1, publishedAt: -1 })
downloadSchema.index({ categoryId: 1, 'visibility.isPublished': 1 })

module.exports = mongoose.models.Download || mongoose.model('Download', downloadSchema)
