/**
 * SEO helper library (Phase 8 — replaces the Phase 1 stub).
 *
 * Single source of truth for everything Next.js metadata + structured data:
 *   - buildMetadata({ item, type, siteConfig, ... })  → Next.js Metadata object
 *   - buildJsonLd({ item, type, siteConfig, ... })     → JSON-LD object
 *       (Article / Event / VideoObject / ImageGallery / Organization /
 *        BreadcrumbList)
 *   - resolveTitleTemplate / resolveCanonical / resolveOgImage
 *
 * Pure functions — no DB access here. Callers pass the already-loaded SiteConfig
 * (read once per request via lib/public-content `getSiteConfig`, which is
 * React-cached) so generateMetadata + the page body share one config read.
 */

import { youTubeId, youTubeThumb } from '@/lib/format'

/** schema.org type per content module (PLAN §13.2). */
export const MODULE_SCHEMA_TYPE = {
  news: 'NewsArticle',
  blogs: 'BlogPosting',
  video: 'VideoObject',
  gallery: 'ImageGallery',
  events: 'Event',
  campaigns: 'Article',
}

/** Absolute origin for canonical/OG/sitemap URLs (no trailing slash). */
export function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return raw.replace(/\/+$/, '')
}

/** Make any (possibly relative) URL absolute against the site origin. */
function absolute(url) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${getBaseUrl()}${url.startsWith('/') ? '' : '/'}${url}`
}

/** Plain-text excerpt from an HTML/string body, trimmed to 160 chars. */
function excerptFromHtml(html) {
  if (!html) return ''
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)
}

function toIso(value) {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

/** BCP-47-ish language for inLanguage. 'both' → both tags. */
function langTag(lang) {
  if (lang === 'en') return 'en'
  if (lang === 'both') return ['ml', 'en']
  return 'ml'
}

/** Recursively drop undefined / null / empty-string keys so JSON-LD stays lean. */
function clean(value) {
  if (Array.isArray(value)) {
    const arr = value.map(clean).filter((v) => v !== undefined && v !== null && v !== '')
    return arr.length ? arr : undefined
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      const cv = clean(v)
      if (cv !== undefined && cv !== null && cv !== '') out[k] = cv
    }
    return Object.keys(out).length ? out : undefined
  }
  return value
}

/* ------------------------------------------------------------------ */
/* Resolvers                                                          */
/* ------------------------------------------------------------------ */

/**
 * Apply SiteConfig.seo.titleTemplate ("%s | SSF Poonoor") to a page title.
 * Falls back to the configured default title when no title is supplied, and
 * avoids double-branding when the title already equals the default.
 */
export function resolveTitleTemplate(title, siteConfig) {
  const seo = siteConfig?.seo || {}
  const fallback = seo.defaultTitle || siteConfig?.branding?.siteName || 'SSF Poonoor'
  if (!title) return fallback
  if (title === fallback) return fallback
  const template = seo.titleTemplate || '%s'
  return template.includes('%s') ? template.replace('%s', title) : title
}

/** Absolute canonical URL for a page path. */
export function resolveCanonical(path = '/', _siteConfig) {
  const base = getBaseUrl()
  if (!path || path === '/') return `${base}/`
  return base + (path.startsWith('/') ? path : `/${path}`)
}

/**
 * Resolve the OG/share image for an item:
 *   per-item seo.ogImage → item media → branding.ogDefaultImage →
 *   dynamic @vercel/og fallback (/api/seo/og-image).
 */
export function resolveOgImage(item, siteConfig, opts = {}) {
  const explicit =
    item?.seo?.ogImage ||
    opts.image ||
    item?.image ||
    item?.coverImage ||
    item?.bannerImage ||
    item?.thumbnail ||
    (item?.youTubeLink ? youTubeThumb(item.youTubeLink) : null)
  if (explicit) return absolute(explicit)

  const branding = siteConfig?.branding || {}
  if (branding.ogDefaultImage) return absolute(branding.ogDefaultImage)

  // Last resort: generate one on the fly with title + brand subtitle.
  const title =
    opts.title ||
    item?.seo?.metaTitle ||
    item?.title ||
    item?.name ||
    branding.siteName ||
    'SSF Poonoor'
  const params = new URLSearchParams({ title: String(title).slice(0, 120) })
  const subtitle = opts.subtitle || branding.siteName || 'SSF Poonoor'
  if (subtitle) params.set('subtitle', String(subtitle).slice(0, 80))
  return `${getBaseUrl()}/api/seo/og-image?${params.toString()}`
}

/* ------------------------------------------------------------------ */
/* Metadata                                                           */
/* ------------------------------------------------------------------ */

/**
 * Build a Next.js Metadata object. Works for both content items (pass `item`)
 * and list/static pages (pass `title`/`description`/`path`).
 *
 * @param {object}  o
 * @param {object} [o.siteConfig] loaded SiteConfig
 * @param {object} [o.item]       content document (detail pages)
 * @param {string} [o.type]       OpenGraph type ('article' | 'website')
 * @param {string} [o.title]      explicit title override
 * @param {string} [o.description] explicit description override
 * @param {string} [o.path]       page path for canonical (default '/')
 * @param {string} [o.image]      explicit OG image override
 * @param {string[]} [o.keywords]
 * @param {boolean} [o.noIndex]
 * @returns {import('next').Metadata}
 */
export function buildMetadata({
  siteConfig,
  item,
  type,
  title,
  description,
  path = '/',
  image,
  keywords,
  noIndex,
} = {}) {
  const seoCfg = siteConfig?.seo || {}
  const branding = siteConfig?.branding || {}
  const siteName = branding.siteName || seoCfg.defaultTitle || 'SSF Poonoor'

  const rawTitle = title || item?.seo?.metaTitle || item?.title || item?.name
  const resolvedTitle = resolveTitleTemplate(rawTitle, siteConfig)

  const desc =
    description ||
    item?.seo?.metaDescription ||
    item?.excerpt ||
    excerptFromHtml(item?.content || item?.description) ||
    seoCfg.defaultDescription ||
    `${siteName} — official web portal.`

  const canonical = item?.seo?.canonicalUrl
    ? absolute(item.seo.canonicalUrl)
    : resolveCanonical(path, siteConfig)

  const ogImage = resolveOgImage(item, siteConfig, { title: rawTitle, image })
  const kw = keywords || item?.seo?.metaKeywords || seoCfg.defaultKeywords || []
  const robotsNoIndex = noIndex ?? item?.seo?.noIndex ?? false
  const ogType = type || (item ? 'article' : 'website')

  // hreflang: site is Malayalam-default but content is bilingual (PLAN §13.2).
  const languages = {
    'ml-IN': canonical,
    'en-IN': canonical,
    'x-default': canonical,
  }

  const metadata = {
    metadataBase: new URL(getBaseUrl()),
    title: resolvedTitle,
    description: desc,
    keywords: kw.length ? kw : undefined,
    alternates: { canonical, languages },
    robots: robotsNoIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
    openGraph: {
      type: ogType,
      title: resolvedTitle,
      description: desc,
      url: canonical,
      siteName,
      locale: 'ml_IN',
      alternateLocale: ['en_US'],
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: rawTitle || siteName }] : undefined,
      ...(item && ogType === 'article'
        ? {
            publishedTime: toIso(item.publishedAt || item.createdAt),
            modifiedTime: toIso(item.updatedAt || item.createdAt),
            authors: item.author?.name ? [item.author.name] : undefined,
            section: item.categoryId?.name || undefined,
            tags: item.tags?.length ? item.tags : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: desc,
      images: ogImage ? [ogImage] : undefined,
      site: seoCfg.twitterHandle || undefined,
      creator: seoCfg.twitterHandle || undefined,
    },
  }

  if (seoCfg.googleSearchConsoleId) {
    metadata.verification = { google: seoCfg.googleSearchConsoleId }
  }
  if (seoCfg.facebookAppId) {
    metadata.other = { 'fb:app_id': seoCfg.facebookAppId }
  }

  return metadata
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                            */
/* ------------------------------------------------------------------ */

/** Compact publisher Organization reference embedded inside content schemas. */
function orgRef(siteConfig) {
  const branding = siteConfig?.branding || {}
  const logo = branding.logo || branding.logoLight || branding.logoDark
  return clean({
    '@type': 'Organization',
    name: branding.siteName || 'SSF Poonoor',
    logo: logo ? { '@type': 'ImageObject', url: absolute(logo) } : undefined,
  })
}

/** Full Organization node for site-wide injection (PLAN §13.2). */
export function buildOrganizationJsonLd(siteConfig) {
  const branding = siteConfig?.branding || {}
  const social = siteConfig?.social || {}
  const contact = siteConfig?.contact || {}
  const logo = branding.logo || branding.logoLight || branding.logoDark
  const sameAs = [
    social.facebook,
    social.instagram,
    social.youtube,
    social.twitter,
    social.telegram,
  ].filter(Boolean)

  return clean({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: branding.siteName || 'SSF Poonoor',
    url: getBaseUrl(),
    logo: logo ? absolute(logo) : undefined,
    description: siteConfig?.seo?.defaultDescription || branding.tagline || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint:
      contact.email || contact.phone
        ? clean({
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: contact.email || undefined,
            telephone: contact.phone || undefined,
          })
        : undefined,
    address: contact.address
      ? { '@type': 'PostalAddress', streetAddress: contact.address }
      : undefined,
  })
}

/**
 * BreadcrumbList from a visible breadcrumb trail.
 * @param {{label:string, href?:string}[]} crumbs
 */
export function buildBreadcrumbJsonLd(crumbs = [], _siteConfig) {
  if (!Array.isArray(crumbs) || !crumbs.length) return null
  const base = getBaseUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) =>
      clean({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        item: c.href ? (/^https?:/i.test(c.href) ? c.href : base + c.href) : undefined,
      })
    ),
  }
}

/**
 * Build a JSON-LD object for a content item or a named site-level type.
 * Honours a per-item seo.structuredData override (PLAN §13.1).
 *
 * @param {object}  o
 * @param {object} [o.item]    content document (or breadcrumb array for BreadcrumbList)
 * @param {string}  o.type     schema type / 'Organization' / 'BreadcrumbList'
 * @param {object} [o.siteConfig]
 * @param {string} [o.path]    page path for canonical
 * @param {Array}  [o.crumbs]  breadcrumb trail for BreadcrumbList
 */
export function buildJsonLd({ item, type, siteConfig, path, crumbs } = {}) {
  if (type === 'Organization') return buildOrganizationJsonLd(siteConfig)
  if (type === 'BreadcrumbList') return buildBreadcrumbJsonLd(crumbs || item, siteConfig)

  if (!item) return null

  // Per-item custom structured data wins outright.
  const custom = item.seo?.structuredData
  if (custom && typeof custom === 'object' && Object.keys(custom).length) return custom

  const schemaType = type || 'Article'
  const url = item.seo?.canonicalUrl ? absolute(item.seo.canonicalUrl) : resolveCanonical(path, siteConfig)
  const image = resolveOgImage(item, siteConfig, { title: item.title || item.name })
  const org = orgRef(siteConfig)
  const description =
    item.seo?.metaDescription || item.excerpt || excerptFromHtml(item.content || item.description)
  const datePublished = toIso(item.publishedAt || item.createdAt)
  const dateModified = toIso(item.updatedAt || item.publishedAt || item.createdAt)

  if (schemaType === 'Event') {
    const place = item.venue || item.location
    return clean({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: item.title,
      description,
      image: image ? [image] : undefined,
      url,
      startDate: toIso(item.fromDate),
      endDate: toIso(item.toDate || item.fromDate),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: place
        ? {
            '@type': 'Place',
            name: item.venue || item.location,
            address: [item.venue, item.location].filter(Boolean).join(', '),
          }
        : undefined,
      organizer: org,
      offers: item.registrationLink
        ? {
            '@type': 'Offer',
            url: item.registrationLink,
            availability: 'https://schema.org/InStock',
            price: '0',
            priceCurrency: 'INR',
          }
        : undefined,
    })
  }

  if (schemaType === 'VideoObject') {
    const ytId = youTubeId(item.youTubeLink)
    const thumb =
      (item.thumbnail && absolute(item.thumbnail)) ||
      (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : image)
    return clean({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: item.title,
      description,
      thumbnailUrl: thumb ? [thumb] : undefined,
      uploadDate: datePublished,
      contentUrl: item.youTubeLink || undefined,
      embedUrl: ytId ? `https://www.youtube.com/embed/${ytId}` : undefined,
      duration: item.duration || undefined,
      publisher: org,
    })
  }

  if (schemaType === 'ImageGallery') {
    const imgs = [...(item.images || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    return clean({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: item.title,
      description,
      url,
      datePublished,
      publisher: org,
      image: imgs.length
        ? imgs.map((im) =>
            clean({
              '@type': 'ImageObject',
              contentUrl: absolute(im.url),
              caption: im.caption || im.alt || undefined,
            })
          )
        : image
          ? [image]
          : undefined,
    })
  }

  // Article family: NewsArticle / BlogPosting / Article.
  return clean({
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: item.title || item.name,
    name: item.title || item.name,
    description,
    image: image ? [image] : undefined,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished,
    dateModified,
    inLanguage: langTag(item.language),
    author: item.author?.name
      ? clean({ '@type': 'Person', name: item.author.name, jobTitle: item.author.role || undefined })
      : org,
    publisher: org,
    articleSection: item.categoryId?.name || undefined,
    keywords: item.seo?.metaKeywords?.length
      ? item.seo.metaKeywords.join(', ')
      : item.tags?.length
        ? item.tags.join(', ')
        : undefined,
    isAccessibleForFree: true,
  })
}
