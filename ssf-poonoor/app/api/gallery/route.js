import { makeListHandler, makeCreateHandler } from '@/lib/content-api'
import Gallery from '@/models/Gallery'

export const dynamic = 'force-dynamic'

const config = {
  Model: Gallery,
  permissionPrefix: 'gallery',
  hasCustomCss: false,
  searchFields: ['title'],
}

export const GET = makeListHandler(config)
export const POST = makeCreateHandler(config)
