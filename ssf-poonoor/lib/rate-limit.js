/**
 * Minimal in-memory token-bucket rate limiter (PLAN Phase 9a hardening).
 *
 * Each named bucket has a capacity and a steady refill rate. A caller is
 * identified by a key (typically client IP, or IP+action). Buckets live in
 * module scope, so on a serverless platform each instance keeps its own state —
 * acceptable for soft abuse-prevention (not a billing-grade limiter).
 *
 * Documented limits (also enforced at the call sites):
 *   - upload:  20 requests / minute / IP   (capacity 20, refill 20/60s)
 *   - auth:    10 attempts  / minute / IP   (capacity 10, refill 10/60s)
 *   - view:    handled separately by lib/view-counter (30s per IP+item cooldown)
 */

const buckets = new Map() // bucketName -> Map(key -> { tokens, updatedAt })

const LIMITS = {
  upload: { capacity: 20, refillPerSec: 20 / 60 },
  auth: { capacity: 10, refillPerSec: 10 / 60 },
}

function getStore(name) {
  let store = buckets.get(name)
  if (!store) {
    store = new Map()
    buckets.set(name, store)
  }
  return store
}

// Keep a bucket's map from growing unbounded under many distinct keys.
function sweep(store, now) {
  if (store.size < 5000) return
  for (const [k, v] of store) {
    // A full bucket that hasn't been touched recently can be forgotten.
    if (now - v.updatedAt > 5 * 60 * 1000) store.delete(k)
  }
}

/**
 * Consume one token from `bucketName` for `key`.
 * @returns {{ allowed: boolean, retryAfter: number }} retryAfter in seconds.
 */
function rateLimit(bucketName, key) {
  const cfg = LIMITS[bucketName]
  if (!cfg) return { allowed: true, retryAfter: 0 }

  const store = getStore(bucketName)
  const now = Date.now()
  const entry = store.get(key) || { tokens: cfg.capacity, updatedAt: now }

  // Refill based on elapsed time, capped at capacity.
  const elapsedSec = (now - entry.updatedAt) / 1000
  entry.tokens = Math.min(cfg.capacity, entry.tokens + elapsedSec * cfg.refillPerSec)
  entry.updatedAt = now

  if (entry.tokens < 1) {
    store.set(key, entry)
    const retryAfter = Math.ceil((1 - entry.tokens) / cfg.refillPerSec)
    return { allowed: false, retryAfter }
  }

  entry.tokens -= 1
  store.set(key, entry)
  sweep(store, now)
  return { allowed: true, retryAfter: 0 }
}

/**
 * Best-effort client IP from forwarding headers. Accepts either a Fetch
 * `Request` (Headers with .get) or a Node-style req whose `headers` is a plain
 * lowercased object (as NextAuth passes into `authorize`).
 */
function clientIp(request) {
  const h = request?.headers
  const read = (name) =>
    typeof h?.get === 'function' ? h.get(name) : h?.[name]
  const fwd = read('x-forwarded-for')
  if (fwd) return String(fwd).split(',')[0].trim()
  return read('x-real-ip') || 'unknown'
}

module.exports = { rateLimit, clientIp }
