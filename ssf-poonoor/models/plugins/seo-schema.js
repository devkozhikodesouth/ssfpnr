const mongoose = require('mongoose')

const seoSubSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
    metaKeywords: [{ type: String }],
    ogImage: { type: String },
    canonicalUrl: { type: String },
    noIndex: { type: Boolean, default: false },
    structuredData: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
)

/**
 * Embeds the seo sub-document on any schema.
 */
function seoSchemaPlugin(schema) {
  schema.add({ seo: { type: seoSubSchema, default: () => ({}) } })
}

module.exports = { seoSchemaPlugin, seoSubSchema }
