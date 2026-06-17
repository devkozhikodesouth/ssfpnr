const mongoose = require('mongoose')
const auditSchemaPlugin = require('./plugins/audit-schema')

// URLs of the uploaded font files (Cloudinary raw resources).
const fontFilesSchema = new mongoose.Schema(
  {
    woff2: { type: String },
    woff: { type: String },
    ttf: { type: String },
  },
  { _id: false }
)

const fontSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  files: { type: fontFilesSchema, default: () => ({}) },
  // Cloudinary public ids, kept for cleanup on delete (not exposed publicly).
  cloudinaryIds: { type: fontFilesSchema, default: () => ({}) },
  weights: { type: [Number], default: [400] },
  styles: { type: [String], default: ['normal'] },
  isActive: { type: Boolean, default: false },
  assignedTo: [{ type: String, enum: ['heading', 'body', 'arabic'] }],
  // Pre-generated @font-face string (see lib/font-face.js).
  fontFace: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

fontSchema.plugin(auditSchemaPlugin)

module.exports = mongoose.models.Font || mongoose.model('Font', fontSchema)
