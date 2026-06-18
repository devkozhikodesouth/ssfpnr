import { cache } from 'react'
import connectDB from '@/lib/db'
import SiteConfig from '@/models/SiteConfig'
import Category from '@/models/Category'
import NavPath from '@/models/NavPath'
import { MODULES } from '@/lib/modules'

/**
 * Server-side data layer for the public portal (Phase 7). Centralises every
 * read used by public list/detail/home pages so the components themselves never
 * embed Mongoose queries (CONVENTIONS: no inline DB queries in components).
 *
 * All queries here are PUBLIC: they hard-filter to published, non-deleted items
 * and can never be widened by a query param (PLAN §6.2).
 */

// Map public-facing module keys → the singular `appliesTo` value categories use.
const MODULE_TO_APPLIESTO = {
  news: 'news',
  gallery: 'gallery',
  video: 'video',
  blogs: 'blog',
  campaigns: 'campaign',
  events: 'event',
  downloads: 'download',
}

// Universal sort keys shared by every list page (PLAN §12.1). Pinned items are
// always floated first so editorial picks stay on top regardless of sort.
const PUBLIC_SORT_MAP = {
  newest: { 'visibility.isPinned': -1, publishedAt: -1, createdAt: -1 },
  oldest: { 'visibility.isPinned': -1, publishedAt: 1, createdAt: 1 },
  'title-asc': { title: 1 },
  'title-desc': { title: -1 },
  'most-viewed': { 'visibility.isPinned': -1, viewCount: -1, publishedAt: -1 },
  'most-downloaded': { downloadCount: -1, createdAt: -1 },
  featured: { 'visibility.isFeatured': -1, publishedAt: -1, createdAt: -1 },
  manual: { 'sort.sortOrder': 1, publishedAt: -1, createdAt: -1 },
}

// Per-module free-text search fields.
const SEARCH_FIELDS = {
  news: ['title', 'content', 'excerpt'],
  gallery: ['title'],
  video: ['title', 'description'],
  blogs: ['title', 'content', 'excerpt'],
  campaigns: ['title', 'content'],
  events: ['title', 'content', 'location', 'venue'],
  downloads: ['name'],
}

/** Read the SiteConfig singleton once per request (deduped via React cache). */
export const getSiteConfig = cache(async () => {
  await connectDB()
  const config = await SiteConfig.findOne().lean()
  return config || null
})

/** Resolve a single search param that may arrive as string | string[]. */
function pick(searchParams, key) {
  const v = searchParams?.[key]
  return Array.isArray(v) ? v[0] : v
}

/** Resolve a category slug (or id) to its ObjectId, or null when unknown. */
async function resolveCategoryId(value) {
  if (!value) return undefined
  if (/^[0-9a-fA-F]{24}$/.test(value)) return value
  const cat = await Category.findOne({ slug: value }).select('_id').lean()
  return cat?._id ?? null // null → matches nothing, so a bad slug returns []
}

/**
 * The active categories applicable to a module, for filter UIs and badges.
 * @param {string} moduleKey
 */
export const getCategoriesForModule = cache(async (moduleKey) => {
  await connectDB()
  const appliesTo = MODULE_TO_APPLIESTO[moduleKey]
  if (!appliesTo) return []
  return Category.find({ appliesTo }).sort({ order: 1, name: 1 }).select('name slug color').lean()
})

/** Standalone categories featured for the homepage / nav (PLAN §15.1 #3). */
export const getFeaturedCategories = cache(async () => {
  await connectDB()
  return Category.find({ isStandalone: true, isFeatured: true })
    .sort({ order: 1, name: 1 })
    .lean()
})

/**
 * Translate an events `status` filter into a date-range Mongo filter, since
 * status is a virtual computed from fromDate/toDate (PLAN §7.8) and cannot be
 * queried directly.
 */
function eventStatusFilter(status) {
  const now = new Date()
  if (status === 'upcoming') return { fromDate: { $gt: now } }
  if (status === 'past') return { toDate: { $lt: now } }
  if (status === 'ongoing') return { fromDate: { $lte: now }, toDate: { $gte: now } }
  return {}
}

/**
 * Fetch a paginated, filtered, sorted page of PUBLISHED items for a module.
 * Filter/sort/page all come from the URL (PLAN §12.3 — shareable links).
 *
 * @param {string} moduleKey one of MODULES keys
 * @param {object} searchParams Next.js route searchParams
 * @param {{ perPage?: number }} [opts]
 * @returns {Promise<{ items: object[], meta: { page, limit, total, totalPages } }>}
 */
export async function fetchPublicList(moduleKey, searchParams = {}, opts = {}) {
  const mod = MODULES[moduleKey]
  if (!mod) throw new Error(`fetchPublicList: unknown module "${moduleKey}"`)
  await connectDB()
  const Model = mod.Model

  const cfg = await getModuleConfig(moduleKey)
  const limit = Math.min(Math.max(opts.perPage || cfg.perPage || 12, 1), 60)
  const page = Math.max(parseInt(pick(searchParams, 'page') || '1', 10) || 1, 1)
  const skip = (page - 1) * limit

  // Public always sees only published, non-deleted content — non-negotiable.
  const filter = { 'visibility.isPublished': true }

  const category = pick(searchParams, 'category')
  if (category) {
    const id = await resolveCategoryId(category)
    filter.categoryId = id
  }

  if (pick(searchParams, 'featured') === 'true') filter['visibility.isFeatured'] = true

  // Module-specific filters (PLAN §12.2).
  if (moduleKey === 'news') {
    const lang = pick(searchParams, 'language')
    if (lang) filter.language = lang
    const author = pick(searchParams, 'author')
    if (author) filter['author.name'] = { $regex: author, $options: 'i' }
  }
  if (moduleKey === 'blogs') {
    const tag = pick(searchParams, 'tag')
    if (tag) filter.tags = tag
    const author = pick(searchParams, 'author')
    if (author) filter['author.name'] = { $regex: author, $options: 'i' }
  }
  if (moduleKey === 'gallery') {
    const albumType = pick(searchParams, 'album-type')
    if (albumType) filter.albumType = albumType
  }
  if (moduleKey === 'video') {
    const speaker = pick(searchParams, 'speaker')
    if (speaker) filter['speakers.name'] = { $regex: speaker, $options: 'i' }
  }
  if (moduleKey === 'downloads') {
    const fileType = pick(searchParams, 'file-type')
    if (fileType) filter.fileType = fileType
  }
  if (moduleKey === 'campaigns') {
    const active = pick(searchParams, 'active')
    if (active === 'true') filter.isActive = true
    else if (active === 'false') filter.isActive = false
  }
  if (moduleKey === 'events') {
    const status = pick(searchParams, 'status')
    if (status) Object.assign(filter, eventStatusFilter(status))
  }

  // Date range (skipped for events, which use status instead).
  if (moduleKey !== 'events') {
    const from = pick(searchParams, 'from')
    const to = pick(searchParams, 'to')
    if (from || to) {
      filter.publishedAt = {}
      if (from) filter.publishedAt.$gte = new Date(from)
      if (to) filter.publishedAt.$lte = new Date(to)
    }
  }

  const q = pick(searchParams, 'q')
  const fields = SEARCH_FIELDS[moduleKey] || []
  if (q && fields.length) {
    filter.$or = fields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }))
  }

  const sortKey = pick(searchParams, 'sort')
  const sort = PUBLIC_SORT_MAP[sortKey] || PUBLIC_SORT_MAP.newest

  const [items, total] = await Promise.all([
    Model.find(filter)
      .populate('categoryId', 'name slug color')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ])

  return {
    items: JSON.parse(JSON.stringify(items)),
    meta: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) },
  }
}

/** Resolve the merged module config from SiteConfig (with safe fallbacks). */
export async function getModuleConfig(moduleKey) {
  const config = await getSiteConfig()
  const entry = config?.modules?.[moduleKey]
  return entry ? JSON.parse(JSON.stringify(entry)) : {}
}

/**
 * Fetch a single published item by slug for a detail page.
 * @returns the lean doc (plain object) or null.
 */
export async function fetchPublicItem(moduleKey, slug) {
  const mod = MODULES[moduleKey]
  if (!mod) throw new Error(`fetchPublicItem: unknown module "${moduleKey}"`)
  await connectDB()
  const doc = await mod.Model.findOne({ slug, 'visibility.isPublished': true })
    .populate('categoryId', 'name slug color')
    .lean()
  return doc ? JSON.parse(JSON.stringify(doc)) : null
}

/**
 * Related published items in the same primary category (PLAN §13.2), excluding
 * the current item. Defaults to 3.
 */
export async function fetchRelated(moduleKey, { categoryId, excludeId, limit = 3 }) {
  const mod = MODULES[moduleKey]
  if (!mod || !categoryId) return []
  await connectDB()
  const items = await mod.Model.find({
    'visibility.isPublished': true,
    categoryId,
    _id: { $ne: excludeId },
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean()
  return JSON.parse(JSON.stringify(items))
}

// Public path for each module's list page.
const MODULE_PATH = {
  news: '/news',
  gallery: '/gallery',
  video: '/video',
  blogs: '/blogs',
  campaigns: '/campaigns',
  events: '/events',
  downloads: '/downloads',
}

/** Visible nav entries for a location (top-nav | bottom-nav | footer). */
export const getNavPaths = cache(async (location) => {
  await connectDB()
  const q = { isVisible: true }
  if (location) q.location = location
  const items = await NavPath.find(q).sort({ order: 1 }).lean()
  return JSON.parse(JSON.stringify(items))
})

/**
 * Resolve the primary (top) navigation. Uses managed nav-paths when present;
 * otherwise derives a sensible default from the enabled modules so a fresh
 * install still has a working menu. Disabled modules are filtered out either
 * way (PLAN §9.6).
 */
export async function getPrimaryNav() {
  const config = await getSiteConfig()
  const mods = config?.modules || {}
  const enabled = (key) => mods[key]?.enabled !== false

  const managed = await getNavPaths('top-nav')
  if (managed.length) {
    return managed
      .map((i) => ({ label: i.label, labelMl: i.labelMl, path: i.path, isExternal: i.isExternal }))
      // Hide links that point at a disabled module's list page.
      .filter((i) => {
        const key = Object.keys(MODULE_PATH).find((k) => MODULE_PATH[k] === i.path)
        return !key || enabled(key)
      })
  }

  const order = Object.keys(MODULE_PATH).sort(
    (a, b) => (mods[a]?.navOrder ?? 99) - (mods[b]?.navOrder ?? 99)
  )
  const links = [{ label: 'Home', path: '/' }]
  for (const key of order) {
    if (!enabled(key)) continue
    links.push({ label: mods[key]?.label || key, labelMl: mods[key]?.labelMl, path: MODULE_PATH[key] })
  }
  links.push({ label: 'About', path: '/about' })
  return links
}

/** Mobile bottom-nav items from SiteConfig.mobile (PLAN §9.2). */
export async function getBottomNav() {
  const config = await getSiteConfig()
  const mobile = config?.mobile || {}
  if (mobile.bottomNavEnabled === false) return null
  const items = (mobile.bottomNavItems || []).map((i) => ({
    label: i.label,
    icon: i.icon,
    path: i.path,
  }))
  return items.length ? items : null
}

/**
 * Resolve a campaign/event `linkedItems` map (arrays of ObjectIds) into the
 * actual published documents per type (PLAN §15.7/§15.8).
 * @param {{ news?:[], videos?:[], gallery?:[], blogs?:[] }} linked
 */
export async function fetchLinkedItems(linked = {}) {
  await connectDB()
  const byIds = (Model, ids) =>
    ids?.length
      ? Model.find({ _id: { $in: ids }, 'visibility.isPublished': true })
          .populate('categoryId', 'name slug color')
          .lean()
      : Promise.resolve([])

  const [news, videos, gallery, blogs] = await Promise.all([
    byIds(MODULES.news.Model, linked.news),
    byIds(MODULES.video.Model, linked.videos),
    byIds(MODULES.gallery.Model, linked.gallery),
    byIds(MODULES.blogs.Model, linked.blogs),
  ])
  return JSON.parse(JSON.stringify({ news, videos, gallery, blogs }))
}

export { MODULE_TO_APPLIESTO, MODULE_PATH }
