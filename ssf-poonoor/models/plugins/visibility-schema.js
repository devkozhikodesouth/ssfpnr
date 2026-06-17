const mongoose = require('mongoose')

const visibilitySubSchema = new mongoose.Schema(
  {
    isPublished: { type: Boolean, default: false },
    publishAt: { type: Date },
    unpublishAt: { type: Date },
    isPinned: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { _id: false }
)

/**
 * Embeds the visibility sub-document on any schema.
 */
function visibilitySchemaPlugin(schema) {
  schema.add({ visibility: { type: visibilitySubSchema, default: () => ({}) } })
}

module.exports = { visibilitySchemaPlugin, visibilitySubSchema }
