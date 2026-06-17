const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { seoSchemaPlugin } = require('./plugins/seo-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')
const { sortSchemaPlugin } = require('./plugins/sort-schema')

// Cross-module references gathered under a campaign (PLAN §7.7).
const linkedItemsSchema = new mongoose.Schema(
  {
    news: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' }],
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  },
  { _id: false }
)

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    bannerImage: { type: String },
    content: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    fromDate: { type: Date },
    toDate: { type: Date },
    isActive: { type: Boolean, default: true },
    linkedItems: { type: linkedItemsSchema, default: () => ({}) },
    customCss: { type: String, maxlength: 51200 },
  },
  { collection: 'campaigns' }
)

campaignSchema.plugin(seoSchemaPlugin)
campaignSchema.plugin(visibilitySchemaPlugin)
campaignSchema.plugin(sortSchemaPlugin)
campaignSchema.plugin(auditSchemaPlugin)
campaignSchema.plugin(softDeletePlugin)

module.exports = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema)
