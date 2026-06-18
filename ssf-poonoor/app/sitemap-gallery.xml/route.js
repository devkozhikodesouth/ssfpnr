import { fetchPublishedDocs, urlEntry, urlSetXml, xmlResponse, getBaseUrl } from '@/lib/sitemap'
import { publicCacheControl } from '@/lib/perf'

export const dynamic = 'force-dynamic'

/** Gallery sitemap (PLAN §13.3). */
export async function GET() {
  const docs = await fetchPublishedDocs('gallery')
  const base = getBaseUrl()
  const entries = docs.map((d) =>
    urlEntry({
      loc: `${base}/gallery/${d.slug}`,
      lastmod: d.updatedAt || d.publishedAt || d.createdAt,
      changefreq: 'weekly',
      priority: '0.6',
    })
  )
  return xmlResponse(urlSetXml(entries), publicCacheControl())
}
