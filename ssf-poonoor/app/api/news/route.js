import { makeListHandler, makeCreateHandler } from '@/lib/content-api'
import News from '@/models/News'

export const dynamic = 'force-dynamic'

const config = {
  Model: News,
  permissionPrefix: 'news',
  hasCustomCss: true,
  searchFields: ['title', 'content', 'excerpt'],
}

export const GET = makeListHandler(config)
export const POST = makeCreateHandler(config)
