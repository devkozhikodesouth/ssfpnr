# Phase 3 — Core Content (News, Blog, Video, Gallery)

**Tool:** Claude Code (Opus 4.7)
**Depends on:** phase-2-category
**Parallel with:** nothing
**Owns:** News/Blog/Video/Gallery models + APIs + admin pages, Cloudinary upload, rich editor, CSS editor, shared form components

---

## Prompt

```
Read PLAN.md §7.3–7.6, §11 (custom CSS), §18 (media). Phases 1 & 2 complete.

PHASE 3 — Core Content Modules. Owns ONLY:

  Models (use plugins, NO field duplication):
    - models/News.js     (per PLAN §7.3)
    - models/Blog.js     (per PLAN §7.6)
    - models/Video.js    (per PLAN §7.5)
    - models/Gallery.js  (per PLAN §7.4)
  Each MUST reference categoryId (ref: 'Category') and include
  customCss field (News, Blog, Video; not Gallery).

  Library:
    - lib/cloudinary.js  (uploadImage, uploadRaw, deleteAsset)
    - lib/slugify.js     (slug generator with uniqueness check)
    - REPLACE lib/css-sanitizer.js stub with real implementation:
        - strip @import, expression(), behavior:, javascript: URLs
        - reject position:fixed on body-level selectors
        - return { sanitized, errors }

  API:
    - app/api/news/route.js + [id]/route.js
      GET filters: category, q, sort, page, limit, featured, language
      POST/PUT/DELETE require respective permissions
    - app/api/blogs/route.js + [id]/route.js   (same pattern)
    - app/api/video/route.js + [id]/route.js   (same pattern)
    - app/api/gallery/route.js + [id]/route.js (same, handles image array)
    - app/api/upload/route.js
      POST multipart → Cloudinary; requires authenticated user.

  EXTEND Phase 2's /api/c/[slug]/route.js via a shared helper
  (THIS IS THE ONLY ALLOWED Phase 2 FILE MODIFICATION):
    - lib/category-aggregator.js
      Exports: aggregateForCategory(slug)
      Queries News, Blog, Video, Gallery by categoryId.
      Phase 4 will add Event + Campaign to the same helper.
    - Update app/api/c/[slug]/route.js to use this helper.

  Shared admin components (BUILD ONCE, REUSE — see anti-duplication):
    - components/admin/editor/RichTextEditor.jsx   (TipTap)
    - components/admin/editor/CssEditor.jsx        (CodeMirror, sanitizes
                                                     on save)
    - components/admin/forms/ImageUploader.jsx     (single + multi)
    - components/admin/forms/SeoFields.jsx         (seo sub-schema fields)
    - components/admin/forms/VisibilityFields.jsx  (publish + schedule +
                                                     featured + pinned)
    - components/admin/forms/CategorySelect.jsx    (async, filters by
                                                     appliesTo prop)
    - components/admin/tables/ContentTable.jsx     (generic table:
                                                     columns config, sort,
                                                     filter, bulk delete
                                                     — used by all 4 modules)

  Admin pages (each uses the shared components above):
    - app/app/news/page.jsx + new/page.jsx + [id]/page.jsx
    - app/app/blogs/...
    - app/app/video/...
    - app/app/gallery/...

DO NOT:
  - Build public detail pages (Phase 7)
  - Build Campaign/Event/Download (Phase 4)
  - Duplicate SEO, visibility, category-select form code per module

CRITICAL ANTI-DUPLICATION:
  - All 4 modules use the same ContentTable with column config props
  - All 4 modules use SeoFields + VisibilityFields identically
  - If you find yourself writing the same field set twice, STOP and extract

VERIFICATION:
  - Create 1 news item via /app/news/new with category = Sahityotsav 26
  - curl http://localhost:3000/api/c/sahityotsav-26
    → news array contains 1 item
  - Upload an image via the form (works via Cloudinary)
  - Set custom CSS on a news item — saved; sanitizer rejects:
    `<style>@import url(x);</style>`
  - DELETE news → isDeleted=true, hidden from /api/news, visible only via
    ?includeDeleted=true (admin only)
```

---

## Verification Gate

- [ ] 4 models registered, each with category linkage
- [ ] All shared form components exist and are reused across modules
- [ ] Image upload works
- [ ] CSS sanitizer rejects forbidden patterns
- [ ] Category aggregation endpoint returns linked content
- [ ] Manual grep: no duplicate `metaTitle`/`isPublished` field defs across modules
- [ ] Soft delete excludes from public list, visible with `includeDeleted=true`
