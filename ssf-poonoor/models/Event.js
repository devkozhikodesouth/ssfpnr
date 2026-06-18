const mongoose = require('mongoose')
const softDeletePlugin = require('./plugins/soft-delete')
const auditSchemaPlugin = require('./plugins/audit-schema')
const { seoSchemaPlugin } = require('./plugins/seo-schema')
const { visibilitySchemaPlugin } = require('./plugins/visibility-schema')
const { sortSchemaPlugin } = require('./plugins/sort-schema')

const linkedItemsSchema = new mongoose.Schema(
  {
    news: [{ type: mongoose.Schema.Types.ObjectId, ref: 'News' }],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    gallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gallery' }],
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
  },
  { _id: false }
)

/** Derive event status from its date range relative to now (PLAN §7.8). */
function computeStatus(fromDate, toDate) {
  const now = Date.now()
  const from = fromDate ? new Date(fromDate).getTime() : null
  const to = toDate ? new Date(toDate).getTime() : from
  if (from && now < from) return 'upcoming'
  if (to && now > to) return 'past'
  if (from) return 'ongoing'
  return 'upcoming'
}

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    content: { type: String },
    fromDate: { type: Date },
    toDate: { type: Date },
    location: { type: String },
    venue: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
    registrationLink: { type: String },
    capacity: { type: Number },
    linkedItems: { type: linkedItemsSchema, default: () => ({}) },
    customCss: { type: String, maxlength: 51200 },
  },
  {
    collection: 'events',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Auto-computed, always reflects the current time — never stored stale.
eventSchema.virtual('status').get(function () {
  return computeStatus(this.fromDate, this.toDate)
})

eventSchema.plugin(seoSchemaPlugin)
eventSchema.plugin(visibilitySchemaPlugin)
eventSchema.plugin(sortSchemaPlugin)
eventSchema.plugin(auditSchemaPlugin)
eventSchema.plugin(softDeletePlugin)

// Composite indexes for the common public-list and category queries (PLAN §22).
eventSchema.index({ 'visibility.isPublished': 1, isDeleted: 1, publishedAt: -1 })
eventSchema.index({ categoryId: 1, 'visibility.isPublished': 1 })

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema)

module.exports = Event
module.exports.computeStatus = computeStatus
