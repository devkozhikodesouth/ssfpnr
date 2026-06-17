import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import connectDB from '@/lib/db'
import Category from '@/models/Category'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '50', 10)
    const skip = (page - 1) * limit

    const filter = {}
    if (searchParams.get('type')) filter.type = searchParams.get('type')
    if (searchParams.get('appliesTo')) filter.appliesTo = searchParams.get('appliesTo')
    if (searchParams.get('featured') === 'true') filter.isFeatured = true
    if (searchParams.get('standalone') === 'true') filter.isStandalone = true

    const [sortField, sortDir] = (searchParams.get('sort') ?? 'order-asc').split('-')
    const sort = { [sortField]: sortDir === 'desc' ? -1 : 1, _id: -1 }

    const [categories, total] = await Promise.all([
      Category.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Category.countDocuments(filter),
    ])

    return NextResponse.json({
      success: true,
      data: categories,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'categories.manage')

    await connectDB()
    const body = await request.json()

    const category = await Category.create({ ...body, createdBy: session.user.id })

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (err) {
    if (err.status) return NextResponse.json({ success: false, error: err.message }, { status: err.status })
    if (err.code === 11000) return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
