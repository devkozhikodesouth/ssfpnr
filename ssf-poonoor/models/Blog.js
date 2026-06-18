const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { seoSchemaPlugin } = require('./plugins/seo-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')
const { sortSchemaPlugin } = require('./plugins/sort-schema')
const { calcReadTime } = require('../lib/read-time')

const blogAuthorSchema = new mongoose.Schema(
  {
    name: { type: String },
    role: { type: String },
    image: { type: String },
    bio: { type: String },
  },
  { _id: false }
)

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    content: { type: String },
    excerpt: { type: String },
    author: { type: blogAuthorSchema, default: () => ({}) },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    secondaryCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tags: [{ type: String }],
    readTime: { type: Number, default: 1 },
    customCss: { type: String, maxlength: 51200 },
    viewCount: { type: Number, default: 0 },
  },
  { collection: 'blogs' }
)

blogSchema.plugin(seoSchemaPlugin)
blogSchema.plugin(visibilitySchemaPlugin)
blogSchema.plugin(sortSchemaPlugin)
blogSchema.plugin(auditSchemaPlugin)
blogSchema.plugin(softDeletePlugin)

blogSchema.pre('save', function (next) {
  if (this.isModified('content')) this.readTime = calcReadTime(this.content)
  next()
})

// Composite indexes for the common public-list and category queries (PLAN §22).
blogSchema.index({ 'visibility.isPublished': 1, isDeleted: 1, publishedAt: -1 })
blogSchema.index({ categoryId: 1, 'visibility.isPublished': 1 })

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
