import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import { errorResponse, httpError } from '@/lib/api-errors'
import { logAction } from '@/lib/audit'
import { slugify } from '@/lib/slugify'
import connectDB from '@/lib/db'
import Redirect from '@/models/Redirect'

export const dynamic = 'force-dynamic'

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'paths.manage')

    await connectDB()
    const doc = await Redirect.findById(params.id)
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    const before = doc.toObject()
    const body = await request.json()

    if (body.slug !== undefined || body.label !== undefined) {
      const slug = slugify(body.slug || body.label || doc.slug)
      if (!slug) throw httpError('Slug is required')
      if (slug !== doc.slug) {
        const clash = await Redirect.findOne({ slug, _id: { $ne: doc._id } }).select('_id').lean()
        if (clash) throw httpError('A redirect with that slug already exists')
        doc.slug = slug
      }
    }
    if (body.destination !== undefined) {
      if (!body.destination) throw httpError('Destination is required')
      doc.destination = body.destination
    }
    if (body.label !== undefined) doc.label = body.label
    if (body.permanent !== undefined) doc.permanent = body.permanent
    if (body.isActive !== undefined) doc.isActive = body.isActive

    doc.updatedBy = session.user.id
    await doc.save()

    await logAction(request, { action: 'update', module: 'redirects', itemId: doc._id, before, after: doc })

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
    const doc = await Redirect.findById(params.id)
    if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    const before = doc.toObject()
    await Redirect.findByIdAndDelete(doc._id)

    await logAction(request, { action: 'delete', module: 'redirects', itemId: params.id, before })

    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    return errorResponse(err)
  }
}
