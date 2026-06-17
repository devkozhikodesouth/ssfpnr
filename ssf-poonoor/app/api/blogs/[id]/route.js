import { makeGetOneHandler, makeUpdateHandler, makeDeleteHandler } from '@/lib/content-api'
import Blog from '@/models/Blog'

export const dynamic = 'force-dynamic'

const config = { Model: Blog, permissionPrefix: 'blogs', hasCustomCss: true }

export const GET = makeGetOneHandler(config)
export const PUT = makeUpdateHandler(config)
export const DELETE = makeDeleteHandler(config)
