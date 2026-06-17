# Phase 4 — Extended Modules + Trash

**Tool:** Claude Code (Opus 4.7) — Session A
**Depends on:** phase-3-content-core
**Parallel with:** ✅ **phase-5-users-roles-fonts** (run in separate session)
**Owns:** Campaign/Event/Download models + APIs + admin pages, Trash, linked items, audit logging helper

---

## Prompt

```
Read PLAN.md §7.7–7.9, §6 (soft delete trash). Phases 1–3 complete.

⚠️ This phase runs in PARALLEL with Phase 5 in a separate Claude Code session.
Files owned by Phase 5 (Users/Roles/Fonts) MUST NOT be touched here.

PHASE 4 — Extended Modules + Trash. Owns ONLY:

  Models:
    - models/Campaign.js   (PLAN §7.7, with linkedItems object)
    - models/Event.js      (PLAN §7.8, with linkedItems, auto-computed
                             status via virtual or pre-find hook)
    - models/Download.js   (PLAN §7.9)

  API:
    - app/api/campaigns/route.js + [id]/route.js
    - app/api/events/route.js + [id]/route.js
    - app/api/downloads/route.js + [id]/route.js
    - app/api/trash/route.js
      GET → list soft-deleted across all 7 modules
            (?module=news to filter)
            Returns: [{ module, id, title, deletedAt, deletedBy }]
    - app/api/trash/[module]/[id]/restore/route.js  POST → isDeleted=false
    - app/api/trash/[module]/[id]/purge/route.js    DELETE → permanent
      (also delete Cloudinary assets referenced by the item)

  EXTEND lib/category-aggregator.js (Phase 3's file):
    - Add Campaign + Event to aggregation output
    (This is the ONLY allowed Phase 3 file modification.)

  Admin pages (REUSE Phase 3's shared components — NO new generic form or
  table components):
    - app/app/campaigns/page.jsx + new/ + [id]/
    - app/app/events/page.jsx + new/ + [id]/
    - app/app/downloads/page.jsx + new/ + [id]/
    - app/app/trash/page.jsx
      Tabs per module, list items, restore + purge buttons, bulk select.
      Uses ContentTable with restore/purge action variant.

  NEW shared component (Phase 3 didn't need it):
    - components/admin/forms/LinkedItemsPicker.jsx
      Renders 4 multi-select async dropdowns: news, videos, gallery, blogs.
      Used by Campaign + Event forms.

  Audit logging helper (implement once, call from all mutation routes):
    - lib/audit.js
      Exports: logAction(req, { action, module, itemId, before, after })
    - Add logAction calls to ALL mutation endpoints from Phases 3 AND 4
      (news/blog/video/gallery/campaign/event/download POST/PUT/DELETE
       and trash restore/purge).
      DO NOT inline duplicate audit code per route.

DO NOT:
  - Duplicate Phase 3 form/table components
  - Build users/roles/fonts UI (Phase 5 owns those, running in parallel)
  - Build site setup (Phase 6)

VERIFICATION:
  - Create a Campaign linked to news from Phase 3
    → /api/campaigns/[id] returns linked news
  - Delete a news item → appears in /app/trash under News tab
  - Restore it → returns to /app/news
  - Permanently delete a campaign with banner image
    → Cloudinary asset removed
  - Check audit_logs collection has entries for each mutation
  - /api/c/sahityotsav-26 now returns events + campaigns in arrays
```

---

## Verification Gate

- [ ] Trash system works (restore + purge)
- [ ] Linked items picker connects content across modules
- [ ] Audit log captures every mutation with before/after diff
- [ ] Cloudinary cleanup on permanent delete
- [ ] Phase 5 files NOT touched (confirm via git diff after merge)
