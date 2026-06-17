# Phase 5 — Users, Roles, Fonts

**Tool:** Claude Code (Opus 4.7) — Session B
**Depends on:** phase-3-content-core
**Parallel with:** ✅ **phase-4-extended-modules** (run in separate session)
**Owns:** Font model, Users/Roles/Fonts APIs and admin UI, permission grid, FontInjector

---

## Prompt

```
Read PLAN.md §4 (roles), §10 (fonts). Phases 1–3 complete.

⚠️ This phase runs in PARALLEL with Phase 4 in a separate Claude Code session.
Files owned by Phase 4 (Campaign/Event/Download/Trash/lib/audit.js/
LinkedItemsPicker) MUST NOT be touched here.

PHASE 5 — Multi-role admin & fonts. Owns ONLY:

  Model:
    - models/Font.js  (per PLAN §7.12)

  API:
    - app/api/users/route.js + [id]/route.js  (requires users.manage)
      POST: validates role exists, hashes password
      PUT [id]: optional password reset, role change, permission override
    - app/api/roles/route.js + [id]/route.js  (requires roles.manage)
      System roles (isSystem: true) cannot be deleted
    - app/api/fonts/route.js + [id]/route.js  (requires fonts.upload)
      POST: multipart, accepts woff2 (required) + optional woff/ttf
            Uploads to Cloudinary as raw, saves Font document
            Generates @font-face string
    - app/api/fonts/[id]/activate/route.js  PUT
      Body: { assignedTo: ['heading' | 'body' | 'arabic'] }

  Admin pages:
    - app/app/users/page.jsx + new/ + [id]/
      Form: name, username, email, password (only on new/reset),
            role dropdown (from /api/roles), permission overrides
            (multi-select chips — empty means use role defaults)
      Permission resolver preview: shows final permission set live
    - app/app/roles/page.jsx + new/ + [id]/
      Visual permission grid:
        Rows = modules (News, Gallery, Video, Blog, Campaign, Event,
               Download, Category, User, Role, Site, Font, Path, Trash,
               Analytics)
        Columns = actions (create, read, update, delete, publish,
                   manage, configure — only valid combos)
        Click cell to toggle. System roles read-only.
    - app/app/fonts/page.jsx
      Drag-drop upload zone
      List uploaded fonts with live "Aa Bb Cc 1234 വാർത്തകൾ" preview
      Activate toggle + assignment dropdown (heading/body/arabic)
      Delete (warn if currently assigned)

  Shared components:
    - components/admin/PermissionGrid.jsx
      Reusable, used by Role page AND User permission override section
    - components/admin/forms/FontUploader.jsx
    - components/shared/FontInjector.jsx
      Reads active fonts from SiteConfig, injects @font-face declarations.
      REPLACES Phase 1's FontInjector stub in app/layout.jsx.
      Only modify the stub line — do not change layout structure.

DO NOT:
  - Build Site Setup UI (Phase 6) — but ensure font system is ready
  - Touch Phase 4 files (Campaign, Event, Download, Trash, audit, etc.)
  - Modify Phase 1 layout.jsx structure; only replace FontInjector stub

VERIFICATION:
  - Create a Content Manager user → can only access News + Blog admin
  - Create a custom role "Junior Editor" with only news.create + news.read
    → user with this role creates drafts but cannot publish
  - Upload a .woff2 font, assign as heading
    → inspect <head> for @font-face declaration
    → /app/dashboard heading uses uploaded font
  - Delete a font currently active → warning shown, then unassigns
    automatically before deleting
  - Try to delete a system role → 403
```

---

## Verification Gate

- [ ] Permission grid functional and reusable
- [ ] Custom roles can be created
- [ ] Font upload + assignment changes site appearance
- [ ] Permission inheritance + overrides resolve correctly
- [ ] Phase 4 files NOT touched (confirm via git diff after merge)
- [ ] System roles protected from deletion

---

## After Phase 4 + Phase 5 both complete

Merge both branches via git, run full test:
```bash
npm run lint
npm run build
npm run dev
# Smoke test: create a user with Content Manager role, log in,
# verify they can only see News/Blog menus.
```
