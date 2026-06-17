import { makeGetOneHandler, makeUpdateHandler, makeDeleteHandler } from '@/lib/content-api'
import News from '@/models/News'

export const dynamic = 'force-dynamic'

const config = { Model: News, permissionPrefix: 'news', hasCustomCss: true }

export const GET = makeGetOneHandler(config)
export const PUT = makeUpdateHandler(config)
export const DELETE = makeDeleteHandler(config)
