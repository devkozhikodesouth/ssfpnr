import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'

/**
 * Self-hosted view counter (PLAN §13.4). Builds a POST handler that atomically
 * $inc's a counter field on a content item — no auth required — with a simple
 * in-memory per-IP-per-item rate limit so a single visitor cannot inflate
 * counts by refreshing.
 *
 * The rate-limit map lives in module scope; on Vercel each serverless instance
 * keeps its own map, which is acceptable for soft abuse-prevention (this is a
 * vanity metric, not billing). A fixed window of 30s per IP+item is enforced.
 */

const WINDOW_MS = 30 * 1000
const hits = new Map() // key `${ip}:${id}` → last timestamp

// Opportunistically evict stale entries so the map cannot grow unbounded.
function sweep(now) {
  if (hits.size < 5000) return
  for (const [k, t] of hits) {
    if (now - t > WINDOW_MS) hits.delete(k)
  }
}

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

/**
 * @param {{ Model: import('mongoose').Model, field?: string }} cfg
 *   field defaults to 'viewCount'; downloads pass 'downloadCount'.
 */
export function makeViewHandler({ Model, field = 'viewCount' }) {
  return async function POST(request, { params }) {
    try {
      const { id } = params
      if (!/^[0-9a-fA-F]{24}$/.test(id || '')) {
        return NextResponse.json({ success: false, error: 'Invalid id' }, { status: 400 })
      }

      const now = Date.now()
      const key = `${clientIp(request)}:${id}`
      const last = hits.get(key)
      if (last && now - last < WINDOW_MS) {
        // Within the cooldown — acknowledge without double-counting.
        return NextResponse.json({ success: true, data: { counted: false } })
      }
      hits.set(key, now)
      sweep(now)

      await connectDB()
      const doc = await Model.findOneAndUpdate(
        { _id: id, 'visibility.isPublished': true },
        { $inc: { [field]: 1 } },
        { new: true, projection: { [field]: 1 } }
      ).lean()

      if (!doc) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, data: { counted: true, [field]: doc[field] } })
    } catch (err) {
      return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 })
    }
  }
}
