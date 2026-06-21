import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Redirect from '@/models/Redirect'

// Public redirect resolver. `/go/<slug>` looks up an active Redirect rule and
// forwards to its destination (308 permanent / 307 temporary). Isolated under
// /go/ so it never collides with content routes. Unknown/inactive slug → 404.
export const dynamic = 'force-dynamic'

export async function GET(_request, { params }) {
  await connectDB()
  const rule = await Redirect.findOne({ slug: params.slug, isActive: true })

  if (!rule || !rule.destination) {
    return new NextResponse('Redirect not found', { status: 404 })
  }

  // Fire-and-forget hit counter; never block the redirect on it.
  Redirect.updateOne({ _id: rule._id }, { $inc: { hits: 1 } }).catch(() => {})

  return NextResponse.redirect(rule.destination, rule.permanent ? 308 : 307)
}
