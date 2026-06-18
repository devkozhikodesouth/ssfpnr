/**
 * Sitemap helpers (Phase 8). XML serialisation + the published-content reads
 * that back the dynamic sitemap routes (PLAN §13.3). Centralised so every
 * sub-sitemap route stays a thin wrapper and the public "published + not
 * deleted" filter is applied in exactly one place.
 */

import connectDB from '@/lib/db'
import { MODULES } from '@/lib/modules'
import Category from '@/models/Category'
import { getBaseUrl } from '@/lib/seo'

const SITEMAP_LIMIT = 5000 // sitemap.org caps a single file at 50k URLs.

/** Escape the 5 XML predefined entities. */
export function xmlEscape(value) {
  return String(value ?? '').replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c])
  )
}

/** W3C datetime (full ISO) from any date-ish value, or '' when invalid. */
export function w3cDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
}

/** A single <url> entry. `extra` carries namespaced child XML (news/video). */
export function urlEntry({ loc, lastmod, changefreq, priority, extra = '' }) {
  const parts = [`    <loc>${xmlEscape(loc)}</loc>`]
  const mod = w3cDate(lastmod)
  if (mod) parts.push(`    <lastmod>${mod}</lastmod>`)
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`)
  if (priority) parts.push(`    <priority>${priority}</priority>`)
  if (extra) parts.push(extra.trimEnd())
  return `  <url>\n${parts.join('\n')}\n  </url>`
}

/** Wrap <url> entries in a <urlset>. `xmlns` adds extra namespace attributes. */
export function urlSetXml(entries, xmlns = '') {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xmlns}>\n` +
    `${entries.join('\n')}\n` +
    `</urlset>\n`
  )
}

/** Sitemap index linking the sub-sitemaps. */
export function sitemapIndexXml(sitemaps) {
  const items = sitemaps
    .map((s) => {
      const mod = w3cDate(s.lastmod)
      return (
        `  <sitemap>\n    <loc>${xmlEscape(s.loc)}</loc>` +
        (mod ? `\n    <lastmod>${mod}</lastmod>` : '') +
        `\n  </sitemap>`
      )
    })
    .join('\n')
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${items}\n` +
    `</sitemapindex>\n`
  )
}

/** Standard XML Response with public CDN caching. */
export function xmlResponse(xml, cacheControl) {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      ...(cacheControl ? { 'Cache-Control': cacheControl } : {}),
    },
  })
}

/**
 * Published, non-deleted docs for a module, slimmed to sitemap-relevant fields.
 * Respects per-item seo.noIndex (excluded from sitemaps).
 *
 * @param {string} moduleKey
 * @param {string} [extraFields] space-separated extra select fields
 */
export async function fetchPublishedDocs(moduleKey, extraFields = '') {
  const mod = MODULES[moduleKey]
  if (!mod) return []
  try {
    await connectDB()
    const select = ['slug', 'updatedAt', 'publishedAt', 'createdAt', 'seo.noIndex', extraFields]
      .filter(Boolean)
      .join(' ')
    const docs = await mod.Model.find({ 'visibility.isPublished': true })
      .select(select)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(SITEMAP_LIMIT)
      .lean()
    return docs.filter((d) => !d.seo?.noIndex)
  } catch {
    // Serve a valid (empty) sitemap rather than 500 on a transient DB outage.
    return []
  }
}

/** Standalone, published categories for /c/[slug] (PLAN §13.3). */
export async function fetchStandaloneCategories() {
  try {
    await connectDB()
    return await Category.find({ isStandalone: true })
      .select('slug updatedAt createdAt')
      .sort({ order: 1, name: 1 })
      .limit(SITEMAP_LIMIT)
      .lean()
  } catch {
    return []
  }
}

export { getBaseUrl }
