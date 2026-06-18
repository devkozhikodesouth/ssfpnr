import { getSiteConfig } from '@/lib/public-content'
import { urlEntry, urlSetXml, xmlResponse, getBaseUrl } from '@/lib/sitemap'
import { publicCacheControl } from '@/lib/perf'

export const dynamic = 'force-dynamic'

// module key → public list path (only listed if the module is enabled).
const MODULE_PATHS = {
  news: '/news',
  gallery: '/gallery',
  video: '/video',
  blogs: '/blogs',
  campaigns: '/campaigns',
  events: '/events',
  downloads: '/downloads',
}

/** Static / list pages sitemap: home, about + enabled module list pages. */
export async function GET() {
  const base = getBaseUrl()
  let mods = {}
  try {
    const config = await getSiteConfig()
    mods = config?.modules || {}
  } catch {
    mods = {}
  }

  const entries = [
    urlEntry({ loc: `${base}/`, changefreq: 'daily', priority: '1.0' }),
    urlEntry({ loc: `${base}/about`, changefreq: 'monthly', priority: '0.5' }),
  ]

  for (const [key, path] of Object.entries(MODULE_PATHS)) {
    if (mods[key]?.enabled === false) continue
    entries.push(urlEntry({ loc: `${base}${path}`, changefreq: 'daily', priority: '0.9' }))
  }

  return xmlResponse(urlSetXml(entries), publicCacheControl())
}
