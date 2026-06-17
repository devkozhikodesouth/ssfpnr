import { makeListHandler, makeCreateHandler } from '@/lib/content-api'
import Campaign from '@/models/Campaign'

export const dynamic = 'force-dynamic'

const config = {
  Model: Campaign,
  permissionPrefix: 'campaigns',
  hasCustomCss: true,
  searchFields: ['title', 'content'],
}

export const GET = makeListHandler(config)
export const POST = makeCreateHandler(config)
