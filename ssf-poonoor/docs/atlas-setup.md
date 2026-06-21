# MongoDB Atlas — Connection Setup

## Cluster

| Property | Value |
| --- | --- |
| Project | musalla app |
| Cluster | Cluster0 (Free / M0) |
| Provider / Region | AWS — Mumbai (ap-south-1) |
| Host | `cluster0.l5rk9hz.mongodb.net` |
| DB user | `musalla_db` (role: `atlasAdmin`) |
| Database | `ssfpoonoor` |
| Network access | `0.0.0.0/0` (open — required for Vercel serverless) |

> The free M0 tier auto-pauses after prolonged inactivity. If a connection
> suddenly fails, check the Atlas dashboard and click **Resume**.

## Local development

`.env.local` (gitignored) is already configured with the working `MONGODB_URI`
and a generated `NEXTAUTH_SECRET`. To confirm the project connects:

```bash
npm run verify:db
```

Expected output ends with `✅ SUCCESS — connected in <n> ms`.

## Production (Vercel)

Add these in **Vercel → Project → Settings → Environment Variables**
(Production scope). Do **not** commit real secrets.

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | `mongodb+srv://musalla_db:<password>@cluster0.l5rk9hz.mongodb.net/ssfpoonoor?retryWrites=true&w=majority&appName=Cluster0` |
| `NEXTAUTH_SECRET` | generate a **separate** one: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | your deployed URL, e.g. `https://ssfpoonoor.com` (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | same as `NEXTAUTH_URL` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | from Cloudinary dashboard (if image upload is used) |
| `GA_TRACKING_ID` | optional, `G-XXXXXXXXXX` |
| `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` | initial super-admin (only needed when running the seed script) |
| `CRON_SECRET` | `openssl rand -base64 32` (for the trash-purge cron endpoint) |

Network access is already `0.0.0.0/0`, so Vercel's serverless functions can reach
the cluster without further IP allow-listing.

## Cloudinary (image / asset hosting)

| Property | Value |
| --- | --- |
| Cloud name | `dycmpssbb` |
| API Key | `475974889799797` |
| API Secret | stored in `.env.local` only — **never commit** |
| Root folder | `ssf-poonoor/` (set in `lib/cloudinary.js`) |

`.env.local` already has all three `CLOUDINARY_*` values. To confirm uploads work
through the project (uploads then deletes a 1×1 test image):

```bash
npm run verify:cloudinary
```

For **Vercel production**, add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
`CLOUDINARY_API_SECRET` in the Production environment variables (same values).

## Security notes

- The DB password lives only in `.env.local` (local) and Vercel env vars (prod).
- Use a **different** `NEXTAUTH_SECRET` for production than for local.
- Consider creating a least-privilege DB user (`readWrite` on `ssfpoonoor`) instead
  of `atlasAdmin` for production, once everything is verified.
