# Phase 0 — Bootstrap

**Tool:** Cowork (or Claude Code as fallback)
**Depends on:** nothing
**Parallel with:** nothing
**Owns:** workspace folder + reference files

---

## Prompt

```
Create the SSF Poonoor project workspace.

1. Create folder `ssf-poonoor/` and inside it:
   - Save `PLAN.md` (I will paste the Master Project Plan next)
   - Save `CONVENTIONS.md` (I will paste this next)
   - Create empty `.env.example` with placeholder keys for:
     MONGODB_URI, NEXTAUTH_SECRET, NEXTAUTH_URL, CLOUDINARY_CLOUD_NAME,
     CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, GA_TRACKING_ID,
     SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD
   - Create `.gitignore` with: node_modules, .next, .env.local, .env, .DS_Store
   - Create `README.md` with project name + link to PLAN.md

2. Do NOT install packages or run npm yet.
3. Confirm folder structure with `ls -la`.

After confirming, I will paste the contents of PLAN.md and CONVENTIONS.md
for you to save into the respective files.
```

---

## After running

Paste:
1. The full contents of `SSF_Poonoor_Master_Project_Plan.md` → save as `PLAN.md`
2. The full contents of `CONVENTIONS.md` (in this prompts folder) → save as `CONVENTIONS.md`

## Verification Gate

```bash
cd ssf-poonoor
ls -la
# Expect: PLAN.md, CONVENTIONS.md, .env.example, .gitignore, README.md
```
