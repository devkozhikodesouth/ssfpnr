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

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'paths.manage')

    await connectDB()
    const rules = await Redirect.find().sort({ slug: 1 }).lean()
    return NextResponse.json({ success: true, data: rules })
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

    const slug = slugify(body.slug || body.label)
    if (!slug) throw httpError('Slug is required')
    if (!body.destination) throw httpError('Destination is required')

    const exists = await Redirect.findOne({ slug }).select('_id').lean()
    if (exists) throw httpError('A redirect with that slug already exists')

    const doc = await Redirect.create({
      slug,
      destination: body.destination,
      label: body.label,
      permanent: body.permanent ?? false,
      isActive: body.isActive ?? true,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    })

    await logAction(request, { action: 'create', module: 'redirects', itemId: doc._id, after: doc })

    return NextResponse.json({ success: true, data: doc }, { status: 201 })
  } catch (err) {
    return errorResponse(err)
  }
}
