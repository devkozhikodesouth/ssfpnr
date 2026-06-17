const mongoose = require('mongoose')

/**
 * Adds isDeleted, deletedAt, deletedBy, deleteReason to any schema.
 * Automatically filters out deleted documents from all find queries
 * unless { isDeleted: true } is explicitly set in the query.
 */
function softDeletePlugin(schema) {
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deleteReason: { type: String },
  })

  const autoFilter = function () {
    if (this.getQuery().isDeleted === undefined) {
      this.where({ isDeleted: false })
    }
  }

  schema.pre('find', autoFilter)
  schema.pre('findOne', autoFilter)
  schema.pre('findOneAndUpdate', autoFilter)
  schema.pre('countDocuments', autoFilter)
  schema.pre('count', autoFilter)
}

module.exports = softDeletePlugin
