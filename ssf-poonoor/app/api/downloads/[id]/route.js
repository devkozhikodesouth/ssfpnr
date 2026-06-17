import { makeGetOneHandler, makeUpdateHandler, makeDeleteHandler } from '@/lib/content-api'
import Download from '@/models/Download'

export const dynamic = 'force-dynamic'

const config = { Model: Download, permissionPrefix: 'downloads', hasCustomCss: false }

export const GET = makeGetOneHandler({ ...config, populate: [{ path: 'categoryId', select: 'name slug' }] })
export const PUT = makeUpdateHandler(config)
export const DELETE = makeDeleteHandler(config)
