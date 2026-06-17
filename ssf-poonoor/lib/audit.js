import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/db'
import AuditLog from '@/models/AuditLog'

/**
 * Trim a Mongoose document / plain object into a JSON-safe snapshot for the
 * audit trail. Strips Mongoose internals and bulky/irrelevant fields so the
 * before/after diff stays readable.
 */
function snapshot(value) {
  if (value === null || value === undefined) return null
  const obj = typeof value.toObject === 'function' ? value.toObject() : value
  try {
    const plain = JSON.parse(JSON.stringify(obj))
    delete plain.__v
    return plain
  } catch {
    return null
  }
}

/**
 * Record a mutation in the audit_logs collection. Centralised so every mutation
 * route logs identically without inlining duplicate code (PLAN §7.15).
 *
 * Never throws — a failed audit write must not break the underlying request.
 *
 * @param {Request} req                  the incoming request (for IP / user-agent)
 * @param {object}  entry
 * @param {string}  entry.action         'create' | 'update' | 'delete' | 'restore' | 'purge' | ...
 * @param {string}  entry.module         module key, e.g. 'news', 'campaigns'
 * @param {*}       entry.itemId         affected document id
 * @param {*}       [entry.before]       state before the mutation
 * @param {*}       [entry.after]        state after the mutation
 */
export async function logAction(req, { action, module, itemId, before, after }) {
  try {
    const session = await getServerSession(authOptions)
    const headers = req?.headers
    const ipAddress =
      headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers?.get?.('x-real-ip') ||
      undefined
    const userAgent = headers?.get?.('user-agent') || undefined

    await connectDB()
    await AuditLog.create({
      userId: session?.user?.id,
      action,
      module,
      itemId,
      before: snapshot(before),
      after: snapshot(after),
      ipAddress,
      userAgent,
    })
  } catch (err) {
    // Swallow: auditing is best-effort and must not affect the request.
    console.error('[audit] failed to log action:', err?.message)
  }
}

export default logAction
