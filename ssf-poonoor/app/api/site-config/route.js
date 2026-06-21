import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { errorResponse } from '@/lib/api-errors'
import { deepMerge } from '@/lib/deep-merge'
import { logAction } from '@/lib/audit'
import connectDB from '@/lib/db'
import SiteConfig from '@/models/SiteConfig'

export const dynamic = 'force-dynamic'

// Top-level branches a client may submit. Anything else in the body is ignored
// so updates can't reshape the document with arbitrary keys.
const CONFIG_KEYS = [
  'branding',
  'theme',
  'header',
  'layout',
  'modules',
  'homepage',
  'seo',
  'social',
  'contact',
  'footer',
  'mobile',
  'performance',
]

async function getOrCreateConfig() {
  let config = await SiteConfig.findOne()
  if (!config) config = await SiteConfig.create({})
  return config
}

// Public: the homepage, theme injector and nav all read the singleton.
export async function GET() {
  try {
    await connectDB()
    const config = await getOrCreateConfig()
    return NextResponse.json({ success: true, data: config })
  } catch (err) {
    return errorResponse(err)
  }
}

// Update the singleton via deep merge (objects merge, arrays replace).
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'site.configure')

    await connectDB()
    const body = await request.json()

    const config = await getOrCreateConfig()

    for (const key of CONFIG_KEYS) {
      if (body[key] === undefined) continue
      // Merge into the existing branch, then assign + flag so Mongoose persists
      // the Mixed/nested changes.
      config[key] = deepMerge(config[key]?.toObject?.() ?? config[key], body[key])
      config.markModified(key)
    }

    await config.save()

    await logAction(request, {
      action: 'update',
      module: 'site-config',
      itemId: config._id,
      after: config,
    })

    return NextResponse.json({ success: true, data: config })
  } catch (err) {
    return errorResponse(err)
  }
}
