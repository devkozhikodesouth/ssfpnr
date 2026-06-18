const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { seoSchemaPlugin } = require('./plugins/seo-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')
const { sortSchemaPlugin } = require('./plugins/sort-schema')
const { calcReadTime } = require('../lib/read-time')

const authorSchema = new mongoose.Schema(
  {
    name: { type: String },
    role: { type: String },
    image: { type: String },
  },
  { _id: false }
)

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    content: { type: String },
    excerpt: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    secondaryCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    language: { type: String, enum: ['ml', 'en', 'both'], default: 'ml' },
    readTime: { type: Number, default: 1 },
    author: { type: authorSchema, default: () => ({}) },
    customCss: { type: String, maxlength: 51200 },
    viewCount: { type: Number, default: 0 },
  },
  { collection: 'news' }
)

newsSchema.plugin(seoSchemaPlugin)
newsSchema.plugin(visibilitySchemaPlugin)
newsSchema.plugin(sortSchemaPlugin)
newsSchema.plugin(auditSchemaPlugin)
newsSchema.plugin(softDeletePlugin)

newsSchema.pre('save', function (next) {
  if (this.isModified('content')) this.readTime = calcReadTime(this.content)
  next()
})

// Composite indexes for the common public-list and category queries (PLAN §22).
newsSchema.index({ 'visibility.isPublished': 1, isDeleted: 1, publishedAt: -1 })
newsSchema.index({ categoryId: 1, 'visibility.isPublished': 1 })

module.exports = mongoose.models.News || mongoose.model('News', newsSchema)
