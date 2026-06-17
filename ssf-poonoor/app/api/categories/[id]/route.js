import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requirePermission } from '@/lib/permissions'
import connectDB from '@/lib/db'
import Category from '@/models/Category'

export async function GET(_request, { params }) {
  try {
    await connectDB()
    const category = await Category.findById(params.id).lean()
    if (!category) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: category })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'categories.manage')

    await connectDB()
    const body = await request.json()

    const category = await Category.findByIdAndUpdate(
      params.id,
      { ...body, updatedBy: session.user.id, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!category) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: category })
  } catch (err) {
    if (err.status) return NextResponse.json({ success: false, error: err.message }, { status: err.status })
    if (err.code === 11000) return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    requirePermission(session, 'categories.manage')

    await connectDB()

    // soft-delete plugin pre-hook on findOneAndUpdate auto-adds { isDeleted: false }
    // to the filter, so only non-deleted docs are matched — correct behavior
    const category = await Category.findByIdAndUpdate(
      params.id,
      { isDeleted: true, deletedAt: new Date(), deletedBy: session.user.id },
      { new: true }
    )

    if (!category) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: { id: params.id } })
  } catch (err) {
    if (err.status) return NextResponse.json({ success: false, error: err.message }, { status: err.status })
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
