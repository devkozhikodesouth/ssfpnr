const mongoose = require('mongoose')
const dns = require('dns')

// On some local/dev networks Node's c-ares resolver has no reachable DNS server
// (every lookup fails with ECONNREFUSED) even though the OS resolves fine — this
// breaks the SRV/TXT lookups that `mongodb+srv://` URIs require at connect time.
// When DNS_SERVERS is set we (1) point a dedicated resolver at those servers and
// (2) expand the SRV URI to a standard `mongodb://` URI up front, so the actual
// connection uses Node's reliable getaddrinfo path instead of c-ares. Left unset
// in production (e.g. Vercel), where the default resolver works natively.
const DNS_SERVERS = (process.env.DNS_SERVERS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

if (DNS_SERVERS.length) {
  try {
    dns.setServers(DNS_SERVERS)
  } catch (err) {
    console.warn('Failed to apply DNS_SERVERS override:', err.message)
  }
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) throw new Error('MONGODB_URI environment variable is not defined')

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = resolveUri(MONGODB_URI).then((uri) =>
      connectWithRetry(uri)
    )
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}

// Expand a mongodb+srv:// URI into a standard mongodb:// URI by resolving the SRV
// (host list) and TXT (connection options) records via a dedicated resolver. Only
// done when DNS_SERVERS is configured; otherwise the original URI is returned and
// the driver handles SRV itself.
async function resolveUri(uri) {
  if (!DNS_SERVERS.length || !uri.startsWith('mongodb+srv://')) return uri

  const m = uri.match(/^mongodb\+srv:\/\/([^@]+@)?([^/?]+)(\/[^?]*)?(\?.*)?$/)
  if (!m) return uri
  const [, userinfo = '', host, pathPart = '', queryPart = ''] = m

  const resolver = new dns.promises.Resolver()
  resolver.setServers(DNS_SERVERS)

  try {
    const srv = await withRetry(() => resolver.resolveSrv(`_mongodb._tcp.${host}`))
    const hosts = srv.map((r) => `${r.name}:${r.port}`).join(',')

    let txtOpts = ''
    try {
      const txt = await withRetry(() => resolver.resolveTxt(host))
      txtOpts = txt.map((parts) => parts.join('')).join('&')
    } catch {
      // TXT is optional; fall back to sensible Atlas defaults below.
    }

    const params = new URLSearchParams(queryPart.replace(/^\?/, ''))
    params.set('ssl', 'true')
    for (const pair of txtOpts.split('&').filter(Boolean)) {
      const [k, v] = pair.split('=')
      if (k && !params.has(k)) params.set(k, v ?? '')
    }

    return `mongodb://${userinfo}${hosts}${pathPart}?${params.toString()}`
  } catch (err) {
    console.warn('SRV expansion failed, falling back to original URI:', err.message)
    return uri
  }
}

async function withRetry(fn, attempts = 8) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 400 * (i + 1)))
    }
  }
  throw lastErr
}

// Retry the connection itself for transient network blips during startup.
async function connectWithRetry(uri, attempts = 3) {
  let lastErr
  for (let i = 0; i < attempts; i++) {
    try {
      return await mongoose.connect(uri, { bufferCommands: false })
    } catch (err) {
      lastErr = err
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 500 * (i + 1)))
    }
  }
  throw lastErr
}

module.exports = connectDB
