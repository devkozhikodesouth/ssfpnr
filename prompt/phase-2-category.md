# Phase 2 — Category Backbone

**Tool:** Claude Code (Opus 4.7)
**Depends on:** phase-1-foundation
**Parallel with:** nothing
**Owns:** Category model, categories API, category admin UI, public `/c/[slug]` skeleton, category seed

---

## Prompt

```
Read PLAN.md §5 and CONVENTIONS.md. Phase 1 is complete.

PHASE 2 — Category Backbone. Owns ONLY:

  Model:
    - models/Category.js  (per PLAN §7.2, uses softDelete + audit + visibility
                           plugins, NO inline duplication)

  API:
    - app/api/categories/route.js
      GET  → list categories (filter: ?type=, ?appliesTo=news, ?featured=true,
                              ?standalone=true, pagination, sort)
      POST → create (requires 'categories.manage')
    - app/api/categories/[id]/route.js
      GET, PUT, DELETE (DELETE = soft delete)
    - app/api/c/[slug]/route.js
      GET → returns aggregated shape:
            { category, news: [], videos: [], gallery: [], blogs: [], events: [] }
      Placeholder empty arrays for now; Phase 3/4 will populate.
      Implementation MUST already query by categoryId so it "just works"
      once those models exist. Use Mongoose model registry check —
      if a model is not registered, return [] instead of crashing.

  Admin UI:
    - app/app/categories/page.jsx        (server component, lists categories)
    - app/app/categories/new/page.jsx    (create form)
    - app/app/categories/[id]/page.jsx   (edit form, client component)
    - components/admin/forms/CategoryForm.jsx
    - components/admin/tables/CategoryTable.jsx

  Public page (skeleton):
    - app/(public)/c/[slug]/page.jsx
      Renders category banner + tab structure
      (News | Videos | Gallery | Blogs | Events).
      Tabs only shown if linked array has items.

  Seed extension:
    - scripts/seed-categories.js  (NEW file, do NOT modify scripts/seed.js)
      Seeds categories from PLAN §5.3:
        Event-based: Sahityotsav 26, Sensorium 26, Vertex, Zest 2026,
                     Thartheel, Kuttithottam, Human Library
        Topical: General, Education, Environment, Cultural, Political,
                 Spiritual, Ahlussunna Talk, Risala Decode
        Permanent: Announcement, Press Meet, Circular, Report
      Add package.json script: "seed:categories"

DO NOT:
  - Create News/Gallery/Video/Blog/Event/Campaign models (Phase 3/4)
  - Modify Phase 1 files (User, Role, SiteConfig, AuditLog, plugins,
    middleware, auth) — if you need behavior from them, IMPORT, don't edit

VERIFICATION:
  npm run seed:categories
  curl http://localhost:3000/api/categories       # returns seeded list
  curl http://localhost:3000/api/c/sahityotsav-26 # returns category +
                                                  # empty linked arrays
  # In browser (after login):
  # /app/categories       → see list
  # /c/sahityotsav-26     → banner renders, no tabs (no linked content yet)
```

---

## Verification Gate

- [ ] Categories collection seeded with all categories from PLAN §5.3
- [ ] `/api/c/[slug]` returns valid JSON with empty linked arrays (does NOT crash)
- [ ] Admin can CRUD categories at `/app/categories`
- [ ] Public category page renders banner without crashing
- [ ] Soft delete works on categories (deleted ones excluded from public API)
