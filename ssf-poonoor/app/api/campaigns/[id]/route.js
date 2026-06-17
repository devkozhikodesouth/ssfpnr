import { makeGetOneHandler, makeUpdateHandler, makeDeleteHandler } from '@/lib/content-api'
import Campaign from '@/models/Campaign'

export const dynamic = 'force-dynamic'

const config = { Model: Campaign, permissionPrefix: 'campaigns', hasCustomCss: true }

// Populate linked cross-module items so the detail view resolves them (PLAN §7.7).
const populate = [
  { path: 'categoryId', select: 'name slug' },
  { path: 'linkedItems.news', select: 'title slug image' },
  { path: 'linkedItems.videos', select: 'title slug thumbnail' },
  { path: 'linkedItems.gallery', select: 'title slug coverImage' },
  { path: 'linkedItems.blogs', select: 'title slug image' },
]

export const GET = makeGetOneHandler({ ...config, populate })
export const PUT = makeUpdateHandler(config)
export const DELETE = makeDeleteHandler(config)
