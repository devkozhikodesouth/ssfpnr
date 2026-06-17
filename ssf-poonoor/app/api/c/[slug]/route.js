import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { aggregateForCategory } from '@/lib/category-aggregator'

export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  try {
    await connectDB()

    const result = await aggregateForCategory(params.slug)
    if (!result) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
