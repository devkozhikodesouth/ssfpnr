# Phase 9a — Hardening & Final Validation

**Tool:** Claude Code (Opus 4.7) — Session A
**Depends on:** phase-8-seo
**Parallel with:** ✅ **phase-9b-deploy-prep** (run in separate session)
**Owns:** error boundaries, loading skeletons, zod schemas, security audit, Mongoose indexes, demo seed

---

## Prompt

```
Read PLAN.md §22 (NFRs). Phases 1–8 complete.

⚠️ This phase runs in PARALLEL with Phase 9b in a separate session.
Phase 9b owns vercel.json + DEPLOY.md + .env.production.example only.

PHASE 9a — Hardening. Owns ONLY:

  Polish:
    - app/not-found.jsx       (custom 404 with search + popular content)
    - app/error.jsx           (global error boundary)
    - components/public/Loading.jsx + skeleton loaders for each list page
      One generic Skeleton component, parameterized by card type. NO
      per-page skeleton files.
    - All forms: zod schemas + react-hook-form validation
      Extract to lib/validation/ — one schema file per model
      (news.schema.js, blog.schema.js, etc.)
      Update existing form components to import and use these schemas.

  Security audit (report findings, then fix):
    - Run grep on `export async function POST|PUT|DELETE` in app/api/**.
      Every match must call requirePermission() OR have a documented reason
      (e.g., view counter is intentionally public).
    - Verify upload route validates mime types strictly (allowlist, not
      blocklist).
    - Add tests/css-sanitizer.test.js with payloads:
        - @import → rejected
        - expression() → rejected
        - position:fixed on body → rejected
        - javascript: URL → rejected
        - Normal CSS → passes
    - Verify no env vars leaked to client (grep for process.env usage in
      client components — only NEXT_PUBLIC_* allowed).
    - Add basic rate limiting to /api/upload, /api/auth, view endpoints
      (in-memory token bucket, document limits).

  Mongoose indexes (add to existing models, DO NOT redefine schemas):
    - All slug fields: unique index
    - Composite indexes:
        news:        { isPublished: 1, isDeleted: 1, publishedAt: -1 }
        news:        { categoryId: 1, isPublished: 1 }
        (repeat for blogs, video, gallery, events, campaigns, downloads)
    - users:         { username: 1 } unique
    - categories:    { slug: 1 } unique, { isStandalone: 1, isFeatured: 1 }

  Demo seed:
    - scripts/seed-demo.js  (NEW, do not modify existing seed scripts)
      Creates under "Sahityotsav 26" category:
        - 3 news items
        - 2 blogs
        - 2 videos
        - 1 gallery album (5 images)
        - 1 campaign
        - 1 event
        - 1 download
      Add package.json script: "seed:demo"

DO NOT:
  - Add new features
  - Touch Phase 9b files (vercel.json, DEPLOY.md, .env.production.example)
  - Modify business logic — only add validation, indexes, polish

VERIFICATION:
  npm run lint                                # zero warnings
  npm run build                               # zero errors, no bundle warnings
  npm test                                    # css-sanitizer tests pass
  npm run seed:demo                           # creates demo data

  Lighthouse on /, /news, /news/[slug]:
    Performance > 90 (mobile)
    Accessibility > 95
    Best Practices > 95
    SEO > 95

  Manual check: visit /news/[demo-slug], view source, confirm:
    - JSON-LD Article present
    - Open Graph tags present
    - Custom CSS scoped (no leak to other elements)
```

---

## Verification Gate

- [ ] Lighthouse all categories ≥ 90 on critical pages
- [ ] Zero lint warnings
- [ ] Production build succeeds
- [ ] CSS sanitizer test suite passes
- [ ] All API mutation routes have permission checks
- [ ] Demo data seeded successfully
- [ ] Phase 9b files NOT touched (confirm via git diff after merge)
