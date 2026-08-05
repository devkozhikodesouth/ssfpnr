import { revalidatePath } from 'next/cache'

/**
 * Maps a content module's permission prefix to its public base path. Public
 * detail/list pages use ISR (lib/perf REVALIDATE_SECONDS), so without an
 * explicit purge a freshly published item would not appear until the TTL
 * elapsed. Calling revalidatePath on write makes publish/edit/delete reflect on
 * the public site instantly (the prompt's "update without any delay").
 */
const PUBLIC_BASE = {
  news: '/news',
  blogs: '/blogs',
  video: '/video',
  gallery: '/gallery',
  campaigns: '/campaigns',
  events: '/events',
  downloads: '/downloads',
}

/**
 * Purge the ISR cache for everywhere a content item can surface: its module
 * list + detail pages, the homepage strips, and the standalone category pages
 * that aggregate it. Never throws — a revalidation failure must not fail the
 * write it follows.
 *
 * @param {string} permissionPrefix e.g. 'news'
 */
export function revalidateModule(permissionPrefix) {
  const base = PUBLIC_BASE[permissionPrefix]
  try {
    if (base) {
      revalidatePath(base) // list page
      revalidatePath(`${base}/[slug]`, 'page') // every detail page
    }
    revalidatePath('/') // homepage strips / featured
    revalidatePath('/c/[slug]', 'page') // standalone category aggregations
  } catch {
    // best-effort; ignore (e.g. called outside a request scope)
  }
}

/**
 * Purge every public page after a site-wide config change (SiteConfig, nav
 * paths, fonts). These feed the public layout's chrome — navbar, footer, bottom
 * nav, theme and typography — plus the homepage sections and the About page, so
 * a change to any of them can surface anywhere on the site.
 *
 * The public layout used to be `force-dynamic`, which made these edits appear
 * instantly at the cost of a DB round-trip on every request (including every
 * crawler hit). It now uses ISR, so the purge here is what preserves the
 * no-delay admin experience.
 */
export function revalidateSiteConfig() {
  try {
    // 'layout' at '/' cascades to every route beneath the root layout.
    revalidatePath('/', 'layout')
  } catch {
    // best-effort; ignore (e.g. called outside a request scope)
  }
}
