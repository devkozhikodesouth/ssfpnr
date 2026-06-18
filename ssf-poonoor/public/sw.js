/* SSF Poonoor service worker (PLAN §14.4). Basic offline support:
 *  - precaches an offline fallback page
 *  - navigations: network-first, falling back to the cached page, then offline
 *  - same-origin static assets (_next/static, icons): cache-first
 *  - never caches API calls or non-GET requests
 * Bump CACHE_VERSION to invalidate old caches on deploy. */
const CACHE_VERSION = 'ssf-v1'
const RUNTIME = `${CACHE_VERSION}-runtime`
const PRECACHE = `${CACHE_VERSION}-precache`
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll([OFFLINE_URL, '/icons/icon.svg'])).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  // Navigations → network-first so visited pages are cached for offline use.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(RUNTIME).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL)))
    )
    return
  }

  // Static assets → cache-first.
  if (url.pathname.startsWith('/_next/static') || url.pathname.startsWith('/icons')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open(RUNTIME).then((cache) => cache.put(request, copy))
            return response
          })
      )
    )
  }
})
