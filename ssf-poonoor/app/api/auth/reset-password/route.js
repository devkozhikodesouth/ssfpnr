import crypto from 'crypto'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { errorResponse, httpError } from '@/lib/api-errors'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { logAction } from '@/lib/audit'

export const dynamic = 'force-dynamic'

// Constant-time string comparison that does not leak length via early return.
function safeEqual(a, b) {
  const ba = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ba.length !== bb.length) {
    // Still spend the work to keep timing uniform, then fail.
    crypto.timingSafeEqual(ba, ba)
    return false
  }
  return crypto.timingSafeEqual(ba, bb)
}

/**
 * Emergency password reset for any account (including Super Admin) when no one
 * can log in to use /app/users. Intentionally powerful, so it is gated hard:
 *
 *   - Disabled unless ADMIN_RESET_KEY is set in the environment.
 *   - Caller must present that secret key (constant-time compared).
 *   - Rate limited (10/min/IP, shared 'auth' bucket).
 *   - Enforces a minimum password policy.
 *   - Every successful reset is written to the audit log.
 *
 * See ADMIN.md §"Resetting passwords" for usage and security guidance.
 */
export async function POST(request) {
  try {
    const { allowed, retryAfter } = rateLimit('auth', clientIp(request))
    if (!allowed) {
      throw httpError(`Too many attempts. Try again in ${retryAfter}s.`, 429)
    }

    const expectedKey = process.env.ADMIN_RESET_KEY
    if (!expectedKey) {
      // Feature is off by default — operators must opt in by setting the secret.
      throw httpError('Password reset is disabled on this server.', 403)
    }

    const body = await request.json().catch(() => ({}))
    const username = String(body.username || '').trim()
    const password = String(body.password || '')
    const resetKey = String(body.resetKey || '')

    if (!safeEqual(resetKey, expectedKey)) {
      throw httpError('Invalid reset key.', 401)
    }
    if (!username) throw httpError('Username is required.')
    if (password.length < 10) {
      throw httpError('Password must be at least 10 characters.')
    }
    if (password.toLowerCase() === username.toLowerCase()) {
      throw httpError('Password must not match the username.')
    }

    await connectDB()
    // findOne auto-excludes soft-deleted users (soft-delete plugin).
    const user = await User.findOne({ username })
    if (!user) throw httpError('No active user with that username.', 404)

    user.password = password // hashed by the User pre-save hook
    user.isActive = true // recover accidentally-deactivated accounts
    await user.save()

    await logAction(request, {
      action: 'reset-password',
      module: 'auth',
      itemId: user._id,
      after: { username: user.username },
    })

    return NextResponse.json({
      success: true,
      message: 'Password updated. You can now sign in.',
    })
  } catch (err) {
    return errorResponse(err)
  }
}
