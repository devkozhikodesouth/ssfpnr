import { makeGetOneHandler, makeUpdateHandler, makeDeleteHandler } from '@/lib/content-api'
import Event from '@/models/Event'

export const dynamic = 'force-dynamic'

const config = { Model: Event, permissionPrefix: 'events', hasCustomCss: true }

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
