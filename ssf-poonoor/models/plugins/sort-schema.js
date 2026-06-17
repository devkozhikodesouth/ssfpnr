const mongoose = require('mongoose')

const sortSubSchema = new mongoose.Schema(
  {
    sortOrder: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
  },
  { _id: false }
)

/**
 * Embeds the sort sub-document (manual order + algorithmic weight) on any schema.
 */
function sortSchemaPlugin(schema) {
  schema.add({ sort: { type: sortSubSchema, default: () => ({}) } })
}

module.exports = { sortSchemaPlugin, sortSubSchema }
