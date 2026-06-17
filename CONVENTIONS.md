# SSF Poonoor — Code Conventions

> Copy this file to your project root before Phase 1.
> Every phase prompt requires Claude Code to read this first.

## Naming
- Files: kebab-case (`news-card.jsx`)
- React components: PascalCase (`NewsCard`)
- DB collections: snake_case plural (`news`, `site_config`, `audit_logs`)
- API routes: kebab-case (`/api/nav-paths`)
- Env vars: SCREAMING_SNAKE_CASE
- Slugs: kebab-case, auto-generated from title

## Imports
- Absolute imports via `@/` alias (configured in `next.config.js`)
- Order: react → next → external → @/lib → @/components → @/models → relative

## Mongoose Models
- All models import plugins from `models/plugins/`
- Apply: `softDeletePlugin`, `auditSchema`, `seoSchema`, `visibilitySchema` where relevant
- No raw timestamps — use `auditSchema`
- All slug fields: indexed + unique

## API Routes
- Use route handlers (`app/api/.../route.js`)
- Every protected route: `requirePermission(req, 'module.action')`
- Return shape: `{ success, data, error?, meta? }`
- Pagination meta: `{ page, limit, total, totalPages }`

## Components
- Server components by default
- `'use client'` only when needed (forms, interactivity)
- One component per file
- Tailwind classes for styling, no separate CSS modules

## Forbidden
- NO duplicate utility functions — add to `lib/` once and reuse
- NO inline DB queries in components — go through `/api` or `lib/db` helpers
- NO hardcoded colors — use CSS variables from theme
- NO direct mongoose calls in client components
- NO `TODO` stubs left in committed code
- NO TypeScript — JavaScript only

## File Ownership Per Phase
Each phase declares which files it OWNS (creates/modifies).
Later phases READ prior phase files but only modify what they own.
If a later phase needs to extend a prior file, it adds a new file with composition,
not by editing the prior file (exception: explicitly noted extensions).

## Anti-Duplication Rule
If two files contain the same field set or component logic, extract to shared:
- Forms → `components/admin/forms/`
- Tables → `components/admin/tables/`
- Utilities → `lib/`
- Public components → `components/public/`
