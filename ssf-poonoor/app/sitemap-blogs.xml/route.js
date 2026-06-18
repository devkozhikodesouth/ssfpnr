import { fetchPublishedDocs, urlEntry, urlSetXml, xmlResponse, getBaseUrl } from '@/lib/sitemap'
import { publicCacheControl } from '@/lib/perf'

export const dynamic = 'force-dynamic'

/** Blogs sitemap (PLAN §13.3). */
export async function GET() {
  const docs = await fetchPublishedDocs('blogs')
  const base = getBaseUrl()
  const entries = docs.map((d) =>
    urlEntry({
      loc: `${base}/blogs/${d.slug}`,
      lastmod: d.updatedAt || d.publishedAt || d.createdAt,
      changefreq: 'weekly',
      priority: '0.7',
    })
  )
  return xmlResponse(urlSetXml(entries), publicCacheControl())
}
