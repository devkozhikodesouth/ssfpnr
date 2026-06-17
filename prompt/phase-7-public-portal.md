# Phase 7 — Public Portal (Mobile-First) + PWA

**Tool:** Claude Code (Opus 4.7)
**Depends on:** phase-6-site-setup
**Parallel with:** nothing (large phase, claims many shared dirs)
**Owns:** All public routes, public components, bottom nav, filters, lightbox, view counter API, PWA

---

## Prompt

```
Read PLAN.md §11 (config layers), §12 (sort/filter), §14 (mobile-first),
§15 (public pages spec), §19 (UI). Phases 1–6 complete.

If you have docs/mockups/ screenshots from Phase 7-Design, use them as
visual reference.

PHASE 7 — Public Portal. Owns ONLY:

  Public components (server components by default, 'use client' only when
  needed):

  Layout:
    - components/public/layout/Navbar.jsx          (reads nav-paths)
    - components/public/layout/BottomNav.jsx       (mobile-only, reads
                                                     site_config.mobile)
    - components/public/layout/Footer.jsx          (reads site_config)
    - components/public/layout/MobileMenu.jsx

  Home sections (data-driven from site_config.homepage.sections):
    - components/public/home/HeroSection.jsx
    - components/public/home/AboutSection.jsx
    - components/public/home/FeaturedCategories.jsx
    - components/public/home/ModuleSection.jsx
      GENERIC — used for News, Blogs, Videos, Gallery, Events, Campaigns
      on home. Props: type, limit, title, config from site_config.
      NO per-module duplication.
    - components/public/home/Newsletter.jsx

  Cards (one component per content type):
    - components/public/cards/NewsCard.jsx
    - components/public/cards/BlogCard.jsx
    - components/public/cards/VideoCard.jsx
    - components/public/cards/GalleryCard.jsx
    - components/public/cards/EventCard.jsx
    - components/public/cards/CampaignCard.jsx
    - components/public/cards/DownloadItem.jsx

  Filters (URL-based state):
    - components/public/filters/SortDropdown.jsx
    - components/public/filters/FilterBottomSheet.jsx  (mobile)
    - components/public/filters/FilterSidebar.jsx      (desktop)
    - components/public/filters/FilterChips.jsx        (active filters)

  Shared:
    - components/public/Lightbox.jsx                   (swipeable for Gallery)
    - components/public/VideoModal.jsx                 (YouTube embed)
    - components/public/Breadcrumbs.jsx
    - components/public/ShareButtons.jsx               (Web Share API +
                                                         WhatsApp deep link)
    - components/public/CustomCssScope.jsx             (wraps detail
                                                         content with
                                                         data-article +
                                                         scoped <style>
                                                         per PLAN §11.2)
    - components/public/ListPageLayout.jsx
      Shared layout for all 7 list pages. Props: title, fetcher,
      CardComponent, filterConfig. Each list page is a thin wrapper.

  Public routes:
    - app/(public)/layout.jsx
      Uses Navbar, BottomNav, Footer. Reads SiteConfig + nav-paths
      server-side ONCE.
    - app/(public)/page.jsx
      Home. Renders sections in order from site_config.homepage.sections
      by mapping section.type → component.
    - app/(public)/about/page.jsx
    - app/(public)/news/page.jsx + [slug]/page.jsx
    - app/(public)/blogs/page.jsx + [slug]/page.jsx
    - app/(public)/video/page.jsx + [slug]/page.jsx
    - app/(public)/gallery/page.jsx + [slug]/page.jsx
    - app/(public)/campaigns/page.jsx + [slug]/page.jsx
    - app/(public)/events/page.jsx + [slug]/page.jsx
    - app/(public)/downloads/page.jsx
    - REPLACE Phase 2's app/(public)/c/[slug]/page.jsx skeleton with full
      tabbed implementation.

  Every list page MUST:
    - Call ensureModuleEnabled() (Phase 6 helper) at top
    - Read sort/filter from URL params
    - Use shared FilterSidebar (desktop) + FilterBottomSheet (mobile)
    - Use shared SortDropdown
    - Render appropriate Card component via ListPageLayout

  Every detail page MUST:
    - Increment viewCount (POST to /api/{module}/[id]/view)
    - Render CustomCssScope wrapper for items with customCss
    - Show related items (same category, 3)
    - Show Breadcrumbs
    - Use ShareButtons

  Small API additions:
    - app/api/news/[id]/view/route.js  (and same for blog, video, gallery,
                                          event, campaign, download)
      POST → atomic $inc viewCount, no auth required
      Rate limit by IP (in-memory map, 1 view per 30s per IP per item)

  PWA:
    - app/manifest.json
    - public/icons/ (placeholders, 192/512)
    - app/sw.js (basic service worker: cache visited pages, offline fallback)
    - Register SW in app/layout.jsx

DO NOT:
  - Duplicate card markup — each card is ONE component
  - Build SEO meta tags (Phase 8)
  - Build sitemap (Phase 8)
  - Modify any admin files

CRITICAL ANTI-DUPLICATION:
  - Home section rendering is data-driven from site_config.homepage.sections.
    Map type → component once in app/(public)/page.jsx; do NOT hardcode
    a stack of <NewsSection /><BlogSection /> components.
  - SortDropdown + FilterSidebar/BottomSheet are shared by ALL list pages.
  - All 7 list pages use ListPageLayout as the base.

VERIFICATION:
  Mobile viewport (375):
    - Bottom nav visible, content scrolls under it
    - Tap filter → bottom sheet opens
    - Apply category filter → URL updates → list filters
    - Tap image in gallery → lightbox opens, swipe between images
    - Tap video → modal opens, plays YouTube embed
  Desktop:
    - Sidebar filters visible (not bottom sheet)
    - 3-column grids
  Category:
    - Visit /c/sahityotsav-26 → tabs show only modules with content
  Site Setup integration:
    - Reorder homepage sections in /app/site-setup → homepage reflects
      change after reload
    - Toggle modules.gallery.enabled = false → /gallery returns 404
  Custom CSS:
    - View a news item with custom CSS → styles applied ONLY inside article
      scope (verify via devtools — no leakage)
  PWA:
    - Add to home screen prompt available on mobile
    - Disconnect network → previously-viewed page loads from cache
```

---

## Verification Gate

- [ ] All public routes render mobile-first
- [ ] Filters and sort work via URL params (shareable links)
- [ ] PWA installable
- [ ] Custom CSS scoped correctly (no leakage)
- [ ] Module toggles enforced (404 when disabled)
- [ ] Homepage section order driven by site_config
- [ ] View counter increments + rate limits
- [ ] No duplicate card or list page markup (manual grep)
