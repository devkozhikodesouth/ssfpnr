/**
 * Performance constants (Phase 8).
 *
 * The default revalidate / cache window mirrors SiteConfig.performance
 * (`revalidateSeconds`, default 60 — PLAN §9.2). It is kept here as a static
 * constant so route handlers and ISR can reference it WITHOUT a per-request DB
 * read just to learn the cache TTL.
 */
export const REVALIDATE_SECONDS = 60

/**
 * Cache-Control value for public, CDN-cacheable responses (sitemaps, robots,
 * OG images). `s-maxage` lets the CDN serve a cached copy; `stale-while-revalidate`
 * keeps responses warm while a fresh one is generated in the background.
 */
export function publicCacheControl(seconds = REVALIDATE_SECONDS) {
  return `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 10}`
}
