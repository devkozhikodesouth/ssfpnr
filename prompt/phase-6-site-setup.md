# Phase 6 — Site Setup & Configurability

**Tool:** Claude Code (Opus 4.7)
**Depends on:** phase-4-extended-modules AND phase-5-users-roles-fonts (both merged)
**Parallel with:** ✅ **phase-7-design** (visual mockup in Claude.ai web, optional)
**Owns:** NavPath model, Site Setup UI (9 tabs), Path Manage UI, real ThemeInjector, module guard helper

---

## Prompt

```
Read PLAN.md §9 (site setup), §3 (NavPath location), §11.1 (config layers).
Phases 1–5 complete.

PHASE 6 — Configurability. Owns ONLY:

  Model:
    - models/NavPath.js  (per PLAN §7.14)

  API:
    - app/api/site-config/route.js
      GET (public): returns SiteConfig singleton
      PUT (requires site.configure): updates singleton (deep merge)
    - app/api/nav-paths/route.js + [id]/route.js  (requires paths.manage)
      Supports reorder: PUT /api/nav-paths/reorder
        body: { order: [id1, id2, ...] }

  Library:
    - lib/module-guard.js
      Export: ensureModuleEnabled(moduleName)
      Reads SiteConfig.modules[name].enabled.
      Calls notFound() from next/navigation if disabled.
      Phase 7 will call this at the top of each public route.

  Admin pages:
    - app/app/site-setup/page.jsx
      Tabbed layout with 9 tabs per PLAN §9.3:
        Branding | Theme | Fonts | Homepage | Modules |
        Navigation | SEO | Social & Contact | Performance
      Right side: live preview iframe of public homepage
        - Reloads via key bump on save
        - Device width toggle: mobile (375) / tablet (768) / desktop (1280)
    - app/app/path-manage/page.jsx
      Three sections (top-nav, bottom-nav, footer)
      Drag-to-reorder within each (using @dnd-kit/sortable)
      Add/edit form: label, labelMl, path, isExternal, icon, location

  Tab components:
    - components/admin/site-setup/BrandingTab.jsx
    - components/admin/site-setup/ThemeTab.jsx       (color pickers, layout
                                                       style, radius)
    - components/admin/site-setup/FontsTab.jsx
      REUSES Phase 5's FontUploader. NO DUPLICATION.
    - components/admin/site-setup/HomepageTab.jsx    (drag-reorder
                                                       homepage.sections)
    - components/admin/site-setup/ModulesTab.jsx     (per-module config:
                                                       enabled, label,
                                                       perPage, defaultSort,
                                                       cardStyle, etc.
                                                       for 7 modules)
    - components/admin/site-setup/NavigationTab.jsx  (link to
                                                       /app/path-manage +
                                                       footer text)
    - components/admin/site-setup/SeoTab.jsx
    - components/admin/site-setup/SocialContactTab.jsx
    - components/admin/site-setup/PerformanceTab.jsx

  Real ThemeInjector (replace Phase 1 stub):
    - components/shared/ThemeInjector.jsx
      Reads SiteConfig server-side in app/layout.jsx
      Injects CSS variables per PLAN §9.5

DO NOT:
  - Build public pages (Phase 7)
  - Touch any Phase 3/4/5 admin files
  - Modify layout.jsx structure; only replace ThemeInjector stub

CRITICAL:
  - The Modules tab toggle (e.g., modules.news.enabled = false) MUST result in
    404 for /news after Phase 7 builds those routes. The lib/module-guard.js
    helper makes this trivial — Phase 7 will call ensureModuleEnabled() at
    the top of each public list/detail route.

VERIFICATION:
  - Change primary color in Theme tab → save → live preview reflects + admin
    UI reflects (CSS vars are global)
  - Drag a homepage section to reorder → save → /api/site-config returns
    new order
  - Reorder nav-paths via drag → /api/nav-paths returns new order
  - Toggle modules.news.enabled = false → save → confirm SiteConfig persists
    the change (Phase 7 will use this to 404)
  - Live preview iframe updates after save (device width toggle works)
```

---

## Verification Gate

- [ ] All 9 setup tabs functional
- [ ] Theme changes propagate via CSS variables site-wide
- [ ] Module guard utility ready for Phase 7
- [ ] Drag-reorder works for nav + homepage sections
- [ ] Live preview iframe shows current state
