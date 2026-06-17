# Phase 1 — Foundation, Auth, Soft Delete

**Tool:** Claude Code (Opus 4.7)
**Depends on:** phase-0-bootstrap
**Parallel with:** nothing
**Owns:** Next.js scaffold, lib/, models/plugins/, User/Role/SiteConfig/AuditLog models, NextAuth, middleware, seed script

---

## Prompt

```
Read PLAN.md and CONVENTIONS.md first. They are the source of truth.

PHASE 1 — Foundation. Owns ONLY these files:

  Setup:
    - package.json (init Next.js 14 App Router + JavaScript + Tailwind)
    - next.config.js (with @/ alias)
    - tailwind.config.js
    - postcss.config.js
    - app/layout.jsx (root layout with theme/font injectors as STUBS)
    - app/globals.css

  Library:
    - lib/db.js                       (mongoose connection w/ cache)
    - lib/auth.js                     (NextAuth config)
    - lib/permissions.js              (requirePermission, resolvePermissions)
    - lib/css-sanitizer.js            (STUB — returns input; replaced in Phase 3)
    - lib/seo.js                      (STUB — replaced in Phase 8)

  Mongoose plugins (models/plugins/):
    - soft-delete.js   (adds isDeleted, deletedAt, deletedBy, deleteReason
                        + auto-filter unless { withDeleted: true })
    - audit-schema.js  (adds createdBy, updatedBy, createdAt, updatedAt,
                        publishedAt, version with pre-save version bump)
    - seo-schema.js    (sub-schema: metaTitle, metaDescription, metaKeywords,
                        ogImage, canonicalUrl, noIndex, structuredData)
    - visibility-schema.js (isPublished, publishAt, unpublishAt, isPinned,
                            isFeatured)

  Models:
    - models/Role.js          (per PLAN §7.11)
    - models/User.js          (per PLAN §7.10, roleId ref, bcrypt pre-save)
    - models/SiteConfig.js    (per PLAN §9.2 — full structure as singleton)
    - models/AuditLog.js      (per PLAN §7.15)

  Auth:
    - app/api/auth/[...nextauth]/route.js
    - middleware.js  (protects /app/* except /app/login)
    - app/app/login/page.jsx  (minimal login form only)

  Seed:
    - scripts/seed.js
      Creates:
        - 7 default roles with permissions per PLAN §4.4
        - 1 Super Admin user (username/password from env)
        - 1 SiteConfig document with sensible defaults

  Package.json scripts:
    - dev, build, start, lint
    - seed: "node scripts/seed.js"

DO NOT create:
  - Any content models (News, Gallery, etc.) — later phases
  - Categories — Phase 2
  - Any admin UI pages beyond /app/login skeleton
  - Public pages

CONSTRAINTS:
  - JavaScript only, NO TypeScript
  - Use mongoose, next-auth@4, bcrypt, tailwindcss
  - All schema sub-documents come from plugins (DO NOT inline duplicate them)
  - permissions.js exports requirePermission(session, permString) used by
    later API routes — design signature now, document via JSDoc

VERIFICATION (run these and confirm output):
  npm install
  npm run lint                     # zero errors
  node -e "require('./lib/db.js')" # should not crash
  npm run seed                     # creates roles + admin user
  npm run dev                      # starts on :3000
  curl -I http://localhost:3000/app/dashboard
  # should return 307 redirect to /app/login
```

---

## Verification Gate

- [ ] `/app/dashboard` redirects to `/app/login`
- [ ] Seed script runs without error
- [ ] 1 Super Admin + 7 roles in DB
- [ ] `ls models/` shows only User, Role, SiteConfig, AuditLog + plugins/
- [ ] `npm run lint` zero warnings
- [ ] `npm run build` succeeds
