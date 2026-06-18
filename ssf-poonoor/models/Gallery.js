const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { seoSchemaPlugin } = require('./plugins/seo-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')
const { sortSchemaPlugin } = require('./plugins/sort-schema')

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String },
    alt: { type: String },
    order: { type: Number, default: 0 },
  },
  { _id: false }
)

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    images: [galleryImageSchema],
    coverImage: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    secondaryCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    albumType: { type: String, enum: ['single', 'album'], default: 'album' },
    viewCount: { type: Number, default: 0 },
  },
  { collection: 'gallery' }
)

gallerySchema.plugin(seoSchemaPlugin)
gallerySchema.plugin(visibilitySchemaPlugin)
gallerySchema.plugin(sortSchemaPlugin)
gallerySchema.plugin(auditSchemaPlugin)
gallerySchema.plugin(softDeletePlugin)

// Composite indexes for the common public-list and category queries (PLAN §22).
gallerySchema.index({ 'visibility.isPublished': 1, isDeleted: 1, publishedAt: -1 })
gallerySchema.index({ categoryId: 1, 'visibility.isPublished': 1 })

module.exports = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema)
