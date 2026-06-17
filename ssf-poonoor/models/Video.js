const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { seoSchemaPlugin } = require('./plugins/seo-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')
const { sortSchemaPlugin } = require('./plugins/sort-schema')

const speakerSchema = new mongoose.Schema(
  {
    name: { type: String },
    role: { type: String },
  },
  { _id: false }
)

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    youTubeLink: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    transcript: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    secondaryCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    speakers: [speakerSchema],
    duration: { type: String },
    customCss: { type: String, maxlength: 51200 },
    viewCount: { type: Number, default: 0 },
  },
  { collection: 'videos' }
)

videoSchema.plugin(seoSchemaPlugin)
videoSchema.plugin(visibilitySchemaPlugin)
videoSchema.plugin(sortSchemaPlugin)
videoSchema.plugin(auditSchemaPlugin)
videoSchema.plugin(softDeletePlugin)

module.exports = mongoose.models.Video || mongoose.model('Video', videoSchema)
