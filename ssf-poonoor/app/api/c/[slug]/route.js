import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/db'
import Category from '@/models/Category'

// Returns [] if model not yet registered (Phase 3/4 will register News/Video/etc.)
async function queryModule(modelName, categoryId) {
  const Model = mongoose.models[modelName]
  if (!Model) return []
  try {
    return await Model.find({ categoryId, 'visibility.isPublished': true })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()
  } catch {
    return []
  }
}

export async function GET(_request, { params }) {
  try {
    await connectDB()

    const category = await Category.findOne({ slug: params.slug }).lean()
    if (!category) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    const [news, videos, gallery, blogs, events] = await Promise.all([
      queryModule('News', category._id),
      queryModule('Video', category._id),
      queryModule('Gallery', category._id),
      queryModule('Blog', category._id),
      queryModule('Event', category._id),
    ])

    return NextResponse.json({
      success: true,
      data: { category, news, videos, gallery, blogs, events },
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
