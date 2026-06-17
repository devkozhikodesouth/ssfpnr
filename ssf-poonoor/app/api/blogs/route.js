import { makeListHandler, makeCreateHandler } from '@/lib/content-api'
import Blog from '@/models/Blog'

export const dynamic = 'force-dynamic'

const config = {
  Model: Blog,
  permissionPrefix: 'blogs',
  hasCustomCss: true,
  searchFields: ['title', 'content', 'excerpt'],
}

export const GET = makeListHandler(config)
export const POST = makeCreateHandler(config)
