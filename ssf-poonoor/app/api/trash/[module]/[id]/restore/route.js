import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import connectDB from '@/lib/db'
import { getModule } from '@/lib/modules'
import { logAction } from '@/lib/audit'

export const dynamic = 'force-dynamic'

/** POST /api/trash/[module]/[id]/restore — clears the soft-delete flag. */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'trash.restore')

    const mod = getModule(params.module)
    if (!mod) return NextResponse.json({ success: false, error: 'Unknown module' }, { status: 404 })

    await connectDB()
    const doc = await mod.Model.findOneAndUpdate(
      { _id: params.id, isDeleted: true },
      { $set: { isDeleted: false }, $unset: { deletedAt: '', deletedBy: '', deleteReason: '' } },
      { new: true }
    )
    if (!doc) return NextResponse.json({ success: false, error: 'Not found in trash' }, { status: 404 })

    await logAction(request, { action: 'restore', module: params.module, itemId: doc._id, after: doc })

    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    const status = err?.status || 500
    return NextResponse.json({ success: false, error: err.message }, { status })
  }
}
