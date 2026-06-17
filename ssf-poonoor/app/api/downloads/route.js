import { makeListHandler, makeCreateHandler } from '@/lib/content-api'
import Download from '@/models/Download'

export const dynamic = 'force-dynamic'

const config = {
  Model: Download,
  permissionPrefix: 'downloads',
  hasCustomCss: false,
  searchFields: ['name'],
}

export const GET = makeListHandler(config)
export const POST = makeCreateHandler(config)
