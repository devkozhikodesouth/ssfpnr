import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { errorResponse } from '@/lib/api-errors'
import { releaseFontFromConfig } from '@/lib/font-assignment'
import { deleteAsset } from '@/lib/cloudinary'
import connectDB from '@/lib/db'
import Font from '@/models/Font'

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  try {
    await connectDB()
    const font = await Font.findById(params.id).lean()
    if (!font) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    delete font.cloudinaryIds
    return NextResponse.json({ success: true, data: font })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'fonts.upload')

    await connectDB()
    const font = await Font.findById(params.id)
    if (!font) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    // Unassign from any active site role before removing.
    await releaseFontFromConfig(font)

    // Remove the raw font assets from Cloudinary (best-effort).
    for (const publicId of Object.values(font.cloudinaryIds || {})) {
      if (publicId) {
        try {
          await deleteAsset(publicId, 'raw')
        } catch {
          // ignore individual asset cleanup failures
        }
      }
    }

    await Font.findByIdAndDelete(font._id)
    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    return errorResponse(err)
  }
}
