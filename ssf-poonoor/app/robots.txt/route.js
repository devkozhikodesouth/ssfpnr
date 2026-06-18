import { getSiteConfig } from '@/lib/public-content'
import { getBaseUrl } from '@/lib/seo'
import { publicCacheControl } from '@/lib/perf'

export const dynamic = 'force-dynamic'

/**
 * robots.txt (PLAN §13.2). Serves SiteConfig.seo.robotsTxtCustom verbatim when
 * an admin override is set, otherwise generates a sensible default that keeps
 * the admin panel + API out of the index and points crawlers at the sitemap.
 */
export async function GET() {
  const base = getBaseUrl()
  // robots.txt must never hard-fail (crawlers hit it constantly); fall back to
  // defaults if the config read fails (e.g. transient DB outage).
  let seo = {}
  try {
    const config = await getSiteConfig()
    seo = config?.seo || {}
  } catch {
    seo = {}
  }

  let body
  if (seo.robotsTxtCustom && seo.robotsTxtCustom.trim()) {
    body = seo.robotsTxtCustom.trim()
  } else {
    const lines = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /app/',
      'Disallow: /api/',
    ]
    if (seo.sitemapEnabled !== false) lines.push('', `Sitemap: ${base}/sitemap.xml`)
    body = lines.join('\n')
  }

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': publicCacheControl(),
    },
  })
}
