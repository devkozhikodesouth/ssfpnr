/**
 * Convert arbitrary text into a URL-safe kebab-case slug.
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate a unique slug for a model, appending -2, -3, … on collision.
 * Checks deleted documents too so soft-deleted slugs are not reused.
 * @param {import('mongoose').Model} Model
 * @param {string} text  source text (title/name) or an explicit slug
 * @param {string} [excludeId]  document id to ignore (for updates)
 * @returns {Promise<string>}
 */
async function generateUniqueSlug(Model, text, excludeId) {
  const base = slugify(text) || `item-${Date.now()}`
  let slug = base
  let n = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Setting isDeleted explicitly disables the soft-delete auto-filter so
    // collisions with trashed documents are detected too.
    const query = { slug, isDeleted: { $in: [true, false] } }
    if (excludeId) query._id = { $ne: excludeId }

    const existing = await Model.findOne(query).select('_id').lean()
    if (!existing) return slug

    n += 1
    slug = `${base}-${n}`
  }
}

module.exports = { slugify, generateUniqueSlug }
