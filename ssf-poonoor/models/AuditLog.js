const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  module: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId },
  before: { type: mongoose.Schema.Types.Mixed },
  after: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema)

module.exports = AuditLog
