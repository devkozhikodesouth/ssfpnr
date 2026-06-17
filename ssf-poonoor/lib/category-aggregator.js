const mongoose = require('mongoose')

// Requiring the models registers them on the mongoose connection so the
// dynamic lookups below resolve. Phase 4 adds Event + Campaign here.
require('../models/Category')
require('../models/News')
require('../models/Blog')
require('../models/Video')
require('../models/Gallery')
require('../models/Event')
require('../models/Campaign')

const PER_MODULE_LIMIT = 20

/**
 * Fetch published, non-deleted items of a model linked to a category either as
 * primary categoryId or via secondaryCategories. Returns [] if the model is not
 * yet registered (e.g. Event/Campaign before Phase 4).
 */
function queryByCategory(modelName, categoryId) {
  const Model = mongoose.models[modelName]
  if (!Model) return Promise.resolve([])
  return Model.find({
    'visibility.isPublished': true,
    $or: [{ categoryId }, { secondaryCategories: categoryId }],
  })
    .sort({ 'visibility.isPinned': -1, 'sort.sortOrder': 1, publishedAt: -1, createdAt: -1 })
    .limit(PER_MODULE_LIMIT)
    .lean()
    .catch(() => [])
}

/**
 * Aggregate every content type linked to a category slug into one payload.
 * @param {string} slug
 * @param {{ requirePublished?: boolean }} [opts]  category must itself be published
 * @returns {Promise<null | { category: object, news, videos, gallery, blogs, events, campaigns }>}
 */
async function aggregateForCategory(slug, opts = {}) {
  const Category = mongoose.models.Category || require('../models/Category')

  const categoryFilter = { slug }
  if (opts.requirePublished) categoryFilter['visibility.isPublished'] = true

  const category = await Category.findOne(categoryFilter).lean()
  if (!category) return null

  const [news, videos, gallery, blogs, events, campaigns] = await Promise.all([
    queryByCategory('News', category._id),
    queryByCategory('Video', category._id),
    queryByCategory('Gallery', category._id),
    queryByCategory('Blog', category._id),
    queryByCategory('Event', category._id),
    queryByCategory('Campaign', category._id),
  ])

  return { category, news, videos, gallery, blogs, events, campaigns }
}

module.exports = { aggregateForCategory, queryByCategory }
