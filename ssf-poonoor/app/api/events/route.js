import { makeListHandler, makeCreateHandler } from '@/lib/content-api'
import Event from '@/models/Event'

export const dynamic = 'force-dynamic'

const config = {
  Model: Event,
  permissionPrefix: 'events',
  hasCustomCss: true,
  searchFields: ['title', 'content', 'location', 'venue'],
}

export const GET = makeListHandler(config)
export const POST = makeCreateHandler(config)
