import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { errorResponse, httpError } from '@/lib/api-errors'
import { logAction } from '@/lib/audit'
import connectDB from '@/lib/db'
import NavPath from '@/models/NavPath'

export const dynamic = 'force-dynamic'

// PUT /api/nav-paths/reorder  body: { order: [id1, id2, ...] }
// Persists each id's array index as its `order`. The ids are expected to be a
// single location group (the Path Manage UI reorders within one location).
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'paths.manage')

    await connectDB()
    const body = await request.json()
    const order = body?.order

    if (!Array.isArray(order) || order.length === 0) {
      throw httpError('order must be a non-empty array of nav-path ids')
    }

    await NavPath.bulkWrite(
      order.map((id, index) => ({
        updateOne: { filter: { _id: id }, update: { $set: { order: index, updatedBy: session.user.id } } },
      }))
    )

    await logAction(request, { action: 'reorder', module: 'nav-paths', itemId: null, after: { order } })

    const paths = await NavPath.find({ _id: { $in: order } }).sort({ order: 1 }).lean()
    return NextResponse.json({ success: true, data: paths })
  } catch (err) {
    return errorResponse(err)
  }
}
