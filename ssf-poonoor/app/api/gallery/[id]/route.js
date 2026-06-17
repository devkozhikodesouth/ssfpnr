import { makeGetOneHandler, makeUpdateHandler, makeDeleteHandler } from '@/lib/content-api'
import Gallery from '@/models/Gallery'

export const dynamic = 'force-dynamic'

const config = { Model: Gallery, permissionPrefix: 'gallery', hasCustomCss: false }

export const GET = makeGetOneHandler(config)
export const PUT = makeUpdateHandler(config)
export const DELETE = makeDeleteHandler(config)
