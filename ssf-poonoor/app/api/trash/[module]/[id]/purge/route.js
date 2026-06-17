import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import connectDB from '@/lib/db'
import { getModule } from '@/lib/modules'
import { deleteItemAssets } from '@/lib/cloudinary-cleanup'
import { logAction } from '@/lib/audit'

export const dynamic = 'force-dynamic'

/**
 * DELETE /api/trash/[module]/[id]/purge — permanent removal.
 * Deletes referenced Cloudinary assets first, then drops the document.
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'trash.purge')

    const mod = getModule(params.module)
    if (!mod) return NextResponse.json({ success: false, error: 'Unknown module' }, { status: 404 })

    await connectDB()
    // Only purge items already in trash — prevents bypassing soft-delete.
    const doc = await mod.Model.findOne({ _id: params.id, isDeleted: true }).lean()
    if (!doc) return NextResponse.json({ success: false, error: 'Not found in trash' }, { status: 404 })

    await deleteItemAssets(doc, mod.assets)
    await mod.Model.deleteOne({ _id: params.id })

    await logAction(request, { action: 'purge', module: params.module, itemId: params.id, before: doc })

    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    const status = err?.status || 500
    return NextResponse.json({ success: false, error: err.message }, { status })
  }
}
