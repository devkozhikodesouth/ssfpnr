# Phase 9c — Live QA on Deployment

**Tool:** Claude in Chrome
**Depends on:** phase-9a-hardening AND phase-9b-deploy-prep (merged + deployed)
**Parallel with:** nothing (final phase)
**Owns:** QA report only — produces no project files

---

## Prerequisites

The site must be deployed to a Vercel URL (staging or production) before
running this phase. Get the URL from your Vercel dashboard.

---

## Prompt

```
Visit the deployed SSF Poonoor URL: [PASTE YOUR VERCEL URL HERE]

Run this QA checklist and report results with screenshots for any failures.

═════════════════════════════════════════════════════════════
1. MOBILE (Chrome DevTools, iPhone 14 viewport — 390×844)
═════════════════════════════════════════════════════════════
   [ ] Home page loads under 3 seconds
   [ ] Bottom navigation visible and sticky
   [ ] All homepage sections render in order set in Site Setup
   [ ] Tap each bottom nav item → navigates correctly
   [ ] News list page: tap filter button → bottom sheet opens
   [ ] Apply a category filter → URL updates, list filters
   [ ] Gallery: tap an image → lightbox opens, swipe between images
   [ ] Video: tap thumbnail → YouTube modal plays inline
   [ ] Pull-to-refresh works on list pages
   [ ] Detail pages: share button triggers native share sheet

═════════════════════════════════════════════════════════════
2. TABLET (768×1024)
═════════════════════════════════════════════════════════════
   [ ] Layout shifts to 2-column grids where applicable
   [ ] Bottom nav hidden, top nav visible

═════════════════════════════════════════════════════════════
3. DESKTOP (1280×800)
═════════════════════════════════════════════════════════════
   [ ] Sidebar filters appear (not bottom sheet)
   [ ] 3-column grids on list pages
   [ ] Hover states work on cards

═════════════════════════════════════════════════════════════
4. ADMIN PANEL (separate browser session, log in as Super Admin)
═════════════════════════════════════════════════════════════
   [ ] /app/login form works
   [ ] /app/dashboard loads with stats
   [ ] Create test news → publish → verify on public /news
   [ ] Soft delete the test news → check /app/trash → restore it
   [ ] Verify restored news back on public /news
   [ ] Change theme primary color in /app/site-setup → save
   [ ] Verify public site recolors after revalidation period
   [ ] Toggle modules.gallery.enabled = false → verify /gallery 404
   [ ] Toggle back to true → verify /gallery returns

═════════════════════════════════════════════════════════════
5. SEO
═════════════════════════════════════════════════════════════
   [ ] View source on /news/[slug] → JSON-LD Article + OG tags present
   [ ] Visit /sitemap.xml → returns valid index XML
   [ ] Visit /robots.txt → returns content
   [ ] /api/seo/og-image?title=Test → returns PNG image

═════════════════════════════════════════════════════════════
6. ACCESSIBILITY
═════════════════════════════════════════════════════════════
   [ ] Tab through homepage → focus rings visible on all interactive elements
   [ ] Run Lighthouse Accessibility audit → score ≥ 95
   [ ] All images have alt text (spot check 5 images)
   [ ] Color contrast passes on text vs background

═════════════════════════════════════════════════════════════
7. PERFORMANCE
═════════════════════════════════════════════════════════════
   [ ] Lighthouse Performance audit (mobile, Slow 3G throttle):
       - LCP < 2.5s
       - CLS < 0.1
       - INP < 200ms
       - Overall score ≥ 90
   [ ] Images served as WebP/AVIF (check Network tab)
   [ ] No console errors on any visited page

═════════════════════════════════════════════════════════════
8. PWA
═════════════════════════════════════════════════════════════
   [ ] manifest.json accessible
   [ ] "Add to Home Screen" prompt available on mobile
   [ ] Service worker registered (DevTools → Application → Service Workers)
   [ ] Disconnect network → previously-viewed page loads from cache

═════════════════════════════════════════════════════════════
9. SECURITY SPOT CHECKS
═════════════════════════════════════════════════════════════
   [ ] Logged out: visit /app/dashboard → redirects to /app/login
   [ ] Logged out: POST to /api/news → returns 401
   [ ] Try uploading a .exe file → rejected
   [ ] Try POST /api/news with custom CSS containing @import → rejected
   [ ] /api/site-config GET returns config without sensitive fields

Report each failure with:
- Page URL
- What you did
- What happened
- Screenshot
- Browser console errors (if any)

For passes, give a one-line summary per section.
```

---

## Verification Gate (final project gate)

- [ ] All 9 checklist sections completed
- [ ] No critical failures
- [ ] Lighthouse scores meet targets (Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95)
- [ ] PWA installable and works offline for cached pages
- [ ] Security spot checks all pass

---

## Project complete 🎉

After this gate passes:
1. Tag the release in git: `git tag v1.0.0`
2. Document any known issues found during QA in `KNOWN_ISSUES.md`
3. Schedule a content seeding session with the SSF Poonoor team to add real content
4. Hand over admin credentials to the Super Admin user
