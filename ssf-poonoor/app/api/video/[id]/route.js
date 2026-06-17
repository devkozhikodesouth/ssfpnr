import { makeGetOneHandler, makeUpdateHandler, makeDeleteHandler } from '@/lib/content-api'
import Video from '@/models/Video'

export const dynamic = 'force-dynamic'

const config = { Model: Video, permissionPrefix: 'video', hasCustomCss: true }

export const GET = makeGetOneHandler(config)
export const PUT = makeUpdateHandler(config)
export const DELETE = makeDeleteHandler(config)
