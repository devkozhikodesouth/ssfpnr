import { fetchPublishedDocs, urlEntry, urlSetXml, xmlResponse, xmlEscape, w3cDate, getBaseUrl } from '@/lib/sitemap'
import { getSiteConfig } from '@/lib/public-content'
import { publicCacheControl } from '@/lib/perf'

export const dynamic = 'force-dynamic'

// Google News only includes articles from the last 2 days.
const NEWS_WINDOW_MS = 2 * 24 * 60 * 60 * 1000

/** News sitemap with Google News <news:news> tags (PLAN §13.3). */
export async function GET() {
  const docs = await fetchPublishedDocs('news', 'title')
  const config = await getSiteConfig().catch(() => null)
  const base = getBaseUrl()
  const publication = config?.branding?.siteName || 'SSF Poonoor'
  const now = Date.now()

  const entries = docs.map((d) => {
    const date = d.publishedAt || d.createdAt
    const recent = date && now - new Date(date).getTime() < NEWS_WINDOW_MS
    const newsBlock = recent
      ? `    <news:news>\n` +
        `      <news:publication>\n` +
        `        <news:name>${xmlEscape(publication)}</news:name>\n` +
        `        <news:language>ml</news:language>\n` +
        `      </news:publication>\n` +
        `      <news:publication_date>${w3cDate(date)}</news:publication_date>\n` +
        `      <news:title>${xmlEscape(d.title || d.slug)}</news:title>\n` +
        `    </news:news>`
      : ''
    return urlEntry({
      loc: `${base}/news/${d.slug}`,
      lastmod: d.updatedAt || date,
      changefreq: 'daily',
      priority: '0.8',
      extra: newsBlock,
    })
  })

  const xml = urlSetXml(entries, ' xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"')
  return xmlResponse(xml, publicCacheControl())
}
