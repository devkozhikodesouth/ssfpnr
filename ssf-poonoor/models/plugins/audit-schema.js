const mongoose = require('mongoose')

/**
 * Adds createdBy, updatedBy, createdAt, updatedAt, publishedAt, version.
 * Bumps version on every save after creation.
 */
function auditSchemaPlugin(schema) {
  schema.add({
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date },
    version: { type: Number, default: 1 },
  })

  schema.pre('save', function (next) {
    this.updatedAt = new Date()
    if (!this.isNew) {
      this.version = (this.version || 1) + 1
    }
    next()
  })
}

module.exports = auditSchemaPlugin
