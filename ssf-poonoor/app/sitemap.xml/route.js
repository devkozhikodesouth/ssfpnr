import { getSiteConfig } from '@/lib/public-content'
import { sitemapIndexXml, xmlResponse, getBaseUrl } from '@/lib/sitemap'
import { publicCacheControl } from '@/lib/perf'

// DB-backed → must render per request (never prerendered at build).
export const dynamic = 'force-dynamic'

/**
 * Sitemap index (PLAN §13.3). Links every sub-sitemap, hiding modules that are
 * disabled in SiteConfig.modules so a turned-off section is not advertised.
 */
export async function GET() {
  const base = getBaseUrl()
  // Degrade gracefully if config is unavailable: list every sub-sitemap.
  let mods = {}
  try {
    const config = await getSiteConfig()
    mods = config?.modules || {}
  } catch {
    mods = {}
  }
  const enabled = (key) => mods[key]?.enabled !== false

  const moduleSitemaps = [
    ['news', 'sitemap-news.xml'],
    ['blogs', 'sitemap-blogs.xml'],
    ['events', 'sitemap-events.xml'],
    ['video', 'sitemap-videos.xml'],
    ['gallery', 'sitemap-gallery.xml'],
    ['campaigns', 'sitemap-campaigns.xml'],
  ]
    .filter(([key]) => enabled(key))
    .map(([, file]) => ({ loc: `${base}/${file}` }))

  // No <lastmod> on the index entries: this route is dynamic, so `new Date()`
  // reported "just changed" on every single fetch. An always-now lastmod is a
  // signal crawlers learn to distrust, which is worse than sending none — the
  // real per-URL lastmod still lives in each sub-sitemap. sitemapIndexXml omits
  // the tag when the date is absent.
  const sitemaps = [
    { loc: `${base}/sitemap-static.xml` },
    ...moduleSitemaps,
    { loc: `${base}/sitemap-categories.xml` },
  ]

  return xmlResponse(sitemapIndexXml(sitemaps), publicCacheControl())
}
