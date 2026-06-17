# Phase 9b — Deployment Preparation

**Tool:** Cowork
**Depends on:** phase-8-seo
**Parallel with:** ✅ **phase-9a-hardening** (run in separate session)
**Owns:** vercel.json, DEPLOY.md, .env.production.example

---

## Prompt

```
Prepare SSF Poonoor for Vercel deployment.

⚠️ This phase runs in PARALLEL with Phase 9a in a separate session.
Files owned by Phase 9a (error pages, loading, validation schemas, indexes,
demo seed, css-sanitizer tests) MUST NOT be touched here.

PHASE 9b — Deployment scaffolding. Owns ONLY:

1. Create vercel.json with:
   - buildCommand: npm run build
   - outputDirectory: .next
   - installCommand: npm install
   - Optional cron job stub for nightly trash auto-purge:
     /api/cron/purge-trash with header auth via CRON_SECRET env var
     (the actual cron endpoint can be added in a future iteration —
     just stub the vercel.json entry as commented-out config)

2. Create DEPLOY.md with these sections:

   ## Prerequisites
   - GitHub repo
   - Vercel account
   - MongoDB Atlas account
   - Cloudinary account

   ## 1. MongoDB Atlas
   - Create cluster (M0 free tier OK to start)
   - Create database user
   - Whitelist IPs: 0.0.0.0/0 (acceptable for start; tighten later)
   - Copy connection string

   ## 2. Cloudinary
   - Create account
   - Get cloud name, API key, API secret from dashboard
   - Create the folder structure noted in PLAN.md §18.2

   ## 3. Push to GitHub
   - git init, commit, push

   ## 4. Import to Vercel
   - Connect GitHub repo
   - Framework preset: Next.js
   - Add environment variables (one per row, list each from
     .env.production.example with notes on where to get the value)

   ## 5. Seed production
   - Option A: run scripts/seed.js + seed-categories.js locally pointing
     at production MONGODB_URI
   - Option B: use Vercel CLI: `vercel env pull` then `npm run seed`

   ## 6. Custom domain
   - Add domain in Vercel project settings
   - Update NEXTAUTH_URL env var to match
   - Update SiteConfig (via /app/site-setup) with final domain

   ## 7. Post-deploy
   - Test login as Super Admin
   - Test public site loads
   - Add Google Analytics ID via Site Setup
   - Submit sitemap to Google Search Console (/sitemap.xml)

3. Create .env.production.example with placeholders and notes for each:
   MONGODB_URI=                         # MongoDB Atlas connection string
   NEXTAUTH_SECRET=                     # generate via: openssl rand -base64 32
   NEXTAUTH_URL=                        # https://your-domain.com
   CLOUDINARY_CLOUD_NAME=               # from Cloudinary dashboard
   CLOUDINARY_API_KEY=                  # from Cloudinary dashboard
   CLOUDINARY_API_SECRET=               # from Cloudinary dashboard
   GA_TRACKING_ID=                      # optional, G-XXXXXXXXXX format
   SEED_ADMIN_USERNAME=                 # initial Super Admin username
   SEED_ADMIN_PASSWORD=                 # strong password
   CRON_SECRET=                         # for future cron job auth

DO NOT:
  - Touch any code files
  - Run any code commands
  - Modify .env.example (Phase 0 owns it)

VERIFICATION:
  ls vercel.json DEPLOY.md .env.production.example
  cat DEPLOY.md  # confirm all 7 sections present
```

---

## Verification Gate

- [ ] vercel.json exists and valid JSON
- [ ] DEPLOY.md has all 7 sections
- [ ] .env.production.example lists every required variable with notes
- [ ] Phase 9a files NOT touched

---

## After both 9a + 9b complete

Merge sessions, commit, push to GitHub, then proceed to phase-9c-live-qa.
