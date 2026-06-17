# SSF Poonoor — Prompt Execution Orchestrator

## How to run

Each phase is a separate file in this folder. To execute:

1. Open the right tool (Claude Code / Cowork / Claude.ai web / Claude in Chrome)
2. Paste the contents of the phase file
3. Wait for the verification gate to pass
4. Move to the next phase

**Reference files** (must exist in project root before Phase 1):
- `PLAN.md` — the Master Project Plan
- `CONVENTIONS.md` — code conventions (in this folder, copy to project root)

---

## Execution Order & Parallelization

```
┌─────────────────────────────────────────────────────────────┐
│  SEQUENTIAL (must run in this order)                        │
└─────────────────────────────────────────────────────────────┘

  phase-0-bootstrap.md          [Cowork]           ← START HERE
            │
            ▼
  phase-1-foundation.md         [Claude Code]
            │
            ▼
  phase-2-category.md           [Claude Code]
            │
            ▼
  phase-3-content-core.md       [Claude Code]
            │
            ├──────────────────────────┐
            ▼                          ▼
  phase-4-extended-modules.md   phase-5-users-roles-fonts.md
       [Claude Code]               [Claude Code]
            │                          │
            └──────────┬───────────────┘
                       ▼
            phase-6-site-setup.md     [Claude Code]
                       │
            ┌──────────┤
            ▼          │
  phase-7-design.md    │      [Claude.ai web — OPTIONAL]
  (visual mockup,      │
   parallel)           │
            └──────────┤
                       ▼
            phase-7-public-portal.md  [Claude Code]
                       │
                       ▼
            phase-8-seo.md            [Claude Code]
                       │
            ├──────────────────────────┐
            ▼                          ▼
  phase-9a-hardening.md       phase-9b-deploy-prep.md
       [Claude Code]              [Cowork]
            │                          │
            └──────────┬───────────────┘
                       ▼
            phase-9c-live-qa.md       [Claude in Chrome]
                                          (after Vercel deploy)
```

---

## Parallel Execution Opportunities

These pairs can run **simultaneously in separate sessions** to save wall-clock time:

| Pair | Why safe |
|---|---|
| **Phase 4 + Phase 5** | Different file ownership. Phase 4 owns content models (Campaign/Event/Download/Trash). Phase 5 owns admin systems (Users/Roles/Fonts). Zero file overlap. |
| **Phase 6 + Phase 7-Design** | Phase 7-Design produces HTML mockups in Claude.ai web for visual reference only — touches no project files. Phase 6 builds Site Setup in Claude Code. |
| **Phase 9a + Phase 9b** | Phase 9a hardens code in Claude Code (lint, indexes, validation). Phase 9b prepares deployment docs (vercel.json, DEPLOY.md) in Cowork. Different files. |

**Important:** Run each pair in **separate Claude Code sessions** (or separate tools as noted) so they don't conflict. Merge changes via git after both complete.

---

## File Manifest

| File | Tool | Approx Duration | Depends On |
|---|---|---|---|
| `phase-0-bootstrap.md` | Cowork | 5 min | — |
| `phase-1-foundation.md` | Claude Code | 1–2 days | phase-0 |
| `phase-2-category.md` | Claude Code | 0.5 day | phase-1 |
| `phase-3-content-core.md` | Claude Code | 2 days | phase-2 |
| `phase-4-extended-modules.md` | Claude Code | 1 day | phase-3 |
| `phase-5-users-roles-fonts.md` | Claude Code | 1 day | phase-3 (parallel w/ 4) |
| `phase-6-site-setup.md` | Claude Code | 1 day | phase-4 + phase-5 |
| `phase-7-design.md` | Claude.ai web | 1 hour | none (parallel w/ 6) |
| `phase-7-public-portal.md` | Claude Code | 2 days | phase-6 |
| `phase-8-seo.md` | Claude Code | 0.5 day | phase-7 |
| `phase-9a-hardening.md` | Claude Code | 0.5 day | phase-8 |
| `phase-9b-deploy-prep.md` | Cowork | 1 hour | phase-8 (parallel w/ 9a) |
| `phase-9c-live-qa.md` | Claude in Chrome | 1 hour | phase-9b (after deploy) |

**Critical path:** 0 → 1 → 2 → 3 → max(4, 5) → 6 → 7 → 8 → max(9a, 9b) → 9c
**Total wall-clock with parallelization:** ~9–10 working days
**Total without parallelization:** ~11–12 working days

---

## Quality Discipline (applies to all phases)

1. **Each prompt declares file ownership.** Don't let later phases edit prior phase files (with explicit exceptions noted).
2. **Verification gate is non-negotiable.** Don't start the next phase until the current passes.
3. **Stubs get replaced, not duplicated.** Phase 1 stubs are replaced by later phases — verify each replacement.
4. **No leftover TODOs.** A passing gate means production-ready for that phase's scope.

If duplication is ever produced, use this fix-it prompt with Claude Code:
```
Two files contain duplicate logic: [path A], [path B].
Per CONVENTIONS.md, extract shared logic to lib/ or components/shared/
and refactor both files to import from there. Show diff before applying.
```

---

*Orchestrator v1.0 — companion to SSF_Poonoor_Master_Project_Plan.md*
