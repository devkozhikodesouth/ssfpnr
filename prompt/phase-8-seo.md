# Phase 8 — SEO & Performance

**Tool:** Claude Code (Opus 4.7)
**Depends on:** phase-7-public-portal
**Parallel with:** nothing
**Owns:** real lib/seo.js, sitemap routes, robots.txt, JSON-LD, OG image generation, generateMetadata exports

---

## Prompt

```
Read PLAN.md §13 (SEO). Phases 1–7 complete.

PHASE 8 — SEO + Performance. Owns ONLY:

  REPLACE lib/seo.js stub from Phase 1 with full implementation:
    - buildMetadata({ item, type, siteConfig }) → Next.js Metadata object
    - buildJsonLd({ item, type }) → JSON-LD object
      Supports types: Article, Event, VideoObject, ImageGallery,
                      Organization, BreadcrumbList
    - resolveTitleTemplate(title, siteConfig)
    - resolveCanonical(path, siteConfig)
    - resolveOgImage(item, siteConfig)

  Add generateMetadata to all public pages built in Phase 7
  (modify ONLY the metadata exports, not page bodies):
    - app/(public)/news/[slug]/page.jsx  → export async generateMetadata
    - blogs, video, gallery, campaigns, events — same pattern
    - All list pages — basic metadata
    - Home + about + category — metadata

  Dynamic sitemap routes:
    - app/sitemap.xml/route.js              (index linking all sub-sitemaps)
    - app/sitemap-news.xml/route.js         (with Google News tags)
    - app/sitemap-blogs.xml/route.js
    - app/sitemap-events.xml/route.js
    - app/sitemap-videos.xml/route.js       (with VideoObject schema)
    - app/sitemap-gallery.xml/route.js
    - app/sitemap-categories.xml/route.js
    - app/sitemap-static.xml/route.js

  Robots:
    - app/robots.txt/route.js
      Reads SiteConfig.seo.robotsTxtCustom override OR generates default.

  Dynamic OG image:
    - app/api/seo/og-image/route.js
      Uses @vercel/og. Accepts query params: title, subtitle, theme.
      Returns PNG. SEO helper falls back to this when item has no custom OG.

  JSON-LD injection:
    - components/public/seo/JsonLd.jsx  (server component, takes data prop)
    - Add to app/layout.jsx        → Organization JSON-LD site-wide
    - Add to each detail page      → Article/Event/Video/etc.
    - Add to all pages             → BreadcrumbList

  Analytics:
    - components/public/seo/GoogleAnalytics.jsx
      Conditional render — only mounts if site_config.seo.googleAnalyticsId
      is set.
    - Add to app/layout.jsx.

  Performance:
    - next.config.js: enable Cloudinary domain for images,
      formats: ['image/avif', 'image/webp']
    - Verify next/image used on all public pages with proper width/height
    - Add ISR: `export const revalidate = 60` to public list pages
    - Detail pages: read revalidate seconds from site_config.performance
      via constant import (no per-request DB hit for revalidate value)

DO NOT:
  - Add new content models or admin features
  - Modify Phase 7 component internals — only add metadata exports and
    JsonLd renders at page level

VERIFICATION:
  - View /news/[slug] → <head> has full Open Graph + Twitter meta + JSON-LD
    Article
  - curl /sitemap.xml → returns index with all sub-sitemaps
  - curl /sitemap-news.xml → returns published news with Google News tags
  - curl /api/seo/og-image?title=Test → returns PNG
  - Lighthouse SEO score > 95 on /news/[slug]
  - robots.txt accessible at /robots.txt
  - hreflang tags present for bilingual pages
  - View source on home → BreadcrumbList + Organization JSON-LD present
```

---

## Verification Gate

- [ ] All public pages have full metadata
- [ ] Sitemap accessible and validates in Google Search Console validator
- [ ] OG images render via @vercel/og
- [ ] Lighthouse SEO score ≥ 95 on home + at least one detail page
- [ ] Cloudinary image domain configured in next.config.js
- [ ] ISR working (verify build output shows static + revalidate)
