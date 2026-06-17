import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { errorResponse, httpError } from '@/lib/api-errors'
import { logAction } from '@/lib/audit'
import connectDB from '@/lib/db'
import NavPath from '@/models/NavPath'

export const dynamic = 'force-dynamic'

const LOCATIONS = ['top-nav', 'bottom-nav', 'footer']

// Public: navbar / bottom nav / footer all read this list.
export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    const query = {}
    if (location) {
      if (!LOCATIONS.includes(location)) throw httpError('Invalid location')
      query.location = location
    }

    const paths = await NavPath.find(query).sort({ location: 1, order: 1 }).lean()
    return NextResponse.json({ success: true, data: paths })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'paths.manage')

    await connectDB()
    const body = await request.json()

    if (!body.label) throw httpError('Label is required')
    if (!body.path) throw httpError('Path is required')
    const location = body.location || 'top-nav'
    if (!LOCATIONS.includes(location)) throw httpError('Invalid location')

    // Append to the end of its location group.
    const last = await NavPath.findOne({ location }).sort({ order: -1 }).select('order').lean()
    const order = body.order ?? (last ? (last.order || 0) + 1 : 0)

    const doc = await NavPath.create({
      label: body.label,
      labelMl: body.labelMl,
      path: body.path,
      location,
      order,
      isVisible: body.isVisible ?? true,
      isExternal: body.isExternal ?? false,
      icon: body.icon,
      parent: body.parent || null,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    })

    await logAction(request, { action: 'create', module: 'nav-paths', itemId: doc._id, after: doc })

    return NextResponse.json({ success: true, data: doc }, { status: 201 })
  } catch (err) {
    return errorResponse(err)
  }
}
