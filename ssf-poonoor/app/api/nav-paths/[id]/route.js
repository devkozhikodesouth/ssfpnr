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

const EDITABLE = ['label', 'labelMl', 'path', 'order', 'isVisible', 'isExternal', 'icon', 'parent']

export async function GET(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'paths.manage')

    await connectDB()
    const doc = await NavPath.findById(params.id).lean()
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: doc })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'paths.manage')

    await connectDB()
    const doc = await NavPath.findById(params.id)
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    const before = doc.toObject()
    const body = await request.json()

    for (const key of EDITABLE) {
      if (body[key] === undefined) continue
      doc[key] = key === 'parent' ? body[key] || null : body[key]
    }
    if (body.location !== undefined) {
      if (!LOCATIONS.includes(body.location)) throw httpError('Invalid location')
      doc.location = body.location
    }

    doc.updatedBy = session.user.id
    await doc.save()

    await logAction(request, { action: 'update', module: 'nav-paths', itemId: doc._id, before, after: doc })

    return NextResponse.json({ success: true, data: doc })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'paths.manage')

    await connectDB()
    const doc = await NavPath.findById(params.id)
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    const before = doc.toObject()
    await NavPath.findByIdAndDelete(doc._id)

    await logAction(request, { action: 'delete', module: 'nav-paths', itemId: params.id, before })

    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    return errorResponse(err)
  }
}
