import { makeListHandler, makeCreateHandler } from '@/lib/content-api'
import Video from '@/models/Video'

export const dynamic = 'force-dynamic'

const config = {
  Model: Video,
  permissionPrefix: 'video',
  hasCustomCss: true,
  searchFields: ['title', 'description', 'transcript'],
}

export const GET = makeListHandler(config)
export const POST = makeCreateHandler(config)
