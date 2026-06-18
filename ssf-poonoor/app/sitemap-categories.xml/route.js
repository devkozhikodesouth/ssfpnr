import { fetchStandaloneCategories, urlEntry, urlSetXml, xmlResponse, getBaseUrl } from '@/lib/sitemap'
import { publicCacheControl } from '@/lib/perf'

export const dynamic = 'force-dynamic'

/** Standalone category pages /c/[slug] (PLAN §13.3). */
export async function GET() {
  const cats = await fetchStandaloneCategories()
  const base = getBaseUrl()
  const entries = cats.map((c) =>
    urlEntry({
      loc: `${base}/c/${c.slug}`,
      lastmod: c.updatedAt || c.createdAt,
      changefreq: 'weekly',
      priority: '0.7',
    })
  )
  return xmlResponse(urlSetXml(entries), publicCacheControl())
}
