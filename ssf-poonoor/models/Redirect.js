const mongoose = require('mongoose')
const auditSchemaPlugin = require('./plugins/audit-schema')

// Admin-managed redirect rules. A redirect has an internal `slug` reached at
// `/go/<slug>` and an external (or internal) `destination` it forwards to. This
// is the "link that doesn't appear in any menu but redirects somewhere" case —
// distinct from NavPath (which renders a visible/hidden menu item). Nothing is
// rendered for a Redirect; it only forwards when its `/go/<slug>` URL is visited.
const redirectSchema = new mongoose.Schema({
  // Reached at /go/<slug>. Unique + indexed for fast lookup.
  slug: { type: String, required: true, unique: true, index: true },
  // Where to send the visitor (absolute URL, e.g. https://… , or an internal path).
  destination: { type: String, required: true },
  // Optional human label so admins can tell rules apart in the list.
  label: { type: String },
  // 308 (permanent) vs 307 (temporary). Default temporary so a wrong target is
  // not cached forever by browsers.
  permanent: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  // Simple click counter, incremented on each successful forward.
  hits: { type: Number, default: 0 },
})

redirectSchema.plugin(auditSchemaPlugin)

module.exports = mongoose.models.Redirect || mongoose.model('Redirect', redirectSchema)
