import { fetchPublishedDocs, urlEntry, urlSetXml, xmlResponse, xmlEscape, getBaseUrl } from '@/lib/sitemap'
import { publicCacheControl } from '@/lib/perf'
import { youTubeId } from '@/lib/format'

export const dynamic = 'force-dynamic'

/** Videos sitemap with Google Video <video:video> tags (PLAN §13.3). */
export async function GET() {
  const docs = await fetchPublishedDocs('video', 'title description thumbnail youTubeLink')
  const base = getBaseUrl()

  const entries = docs.map((d) => {
    const loc = `${base}/video/${d.slug}`
    const ytId = youTubeId(d.youTubeLink)
    const thumb =
      d.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '')
    const title = d.title || d.slug
    const desc = (d.description ? String(d.description).replace(/<[^>]*>/g, ' ') : title)
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 2000)

    const videoBlock =
      `    <video:video>\n` +
      (thumb ? `      <video:thumbnail_loc>${xmlEscape(thumb)}</video:thumbnail_loc>\n` : '') +
      `      <video:title>${xmlEscape(title)}</video:title>\n` +
      `      <video:description>${xmlEscape(desc || title)}</video:description>\n` +
      (d.youTubeLink ? `      <video:content_loc>${xmlEscape(d.youTubeLink)}</video:content_loc>\n` : '') +
      (ytId ? `      <video:player_loc>https://www.youtube.com/embed/${ytId}</video:player_loc>\n` : '') +
      `      <video:live>no</video:live>\n` +
      `    </video:video>`

    return urlEntry({ loc, lastmod: d.updatedAt || d.publishedAt || d.createdAt, changefreq: 'weekly', priority: '0.6', extra: videoBlock })
  })

  const xml = urlSetXml(entries, ' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"')
  return xmlResponse(xml, publicCacheControl())
}
