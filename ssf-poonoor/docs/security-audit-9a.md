# Phase 9a — Security Audit Findings

Audit of all API mutation routes, the upload pipeline, client env usage, and the
custom-CSS sanitizer. Performed as part of Phase 9a hardening.

## 1. API mutation routes (`POST` / `PUT` / `DELETE`)

Every mutation handler under `app/api/**` was enumerated and checked for an
authorization gate. Result: **all mutation routes are permission-gated**, either
directly via `requirePermission()` or through the shared `lib/content-api.js`
factories (`makeCreateHandler` / `makeUpdateHandler` / `makeDeleteHandler`), each
of which calls `requirePermission()` before any write.

| Route group | Gate |
|---|---|
| news, blogs, video, gallery, campaigns, events, downloads (create/update/delete) | `<module>.create` / `.update` / `.delete` via content-api factories |
| categories | `categories.manage` |
| users, users/[id] | `users.manage` |
| roles, roles/[id] | `roles.manage` |
| nav-paths, nav-paths/[id], nav-paths/reorder | `paths.manage` |
| fonts, fonts/[id], fonts/[id]/activate | `fonts.upload` |
| site-config (PUT) | `site.configure` |
| trash restore / purge | `trash.restore` / `trash.purge` |

### Documented public-by-design endpoints

- **View counters** (`/api/*/[id]/view`): intentionally public so anonymous
  visitors increment view/download counts. Abuse is bounded by a 30s per-IP +
  per-item cooldown in `lib/view-counter.js`. (No change.)
- **Upload** (`/api/upload`): authenticated-only rather than a single
  `requirePermission`, because it is a shared helper invoked by every content
  form — and each form is itself permission-gated on save. A comment documenting
  this was added to the route. (No change to the auth model.)
- **Publicly readable GETs** (site-config, nav-paths, fonts active list, content
  lists/detail): public by design; admin-only fields/states remain gated.

## 2. Upload mime validation — FIXED

**Finding:** `app/api/upload/route.js` validated image types against an
allowlist, but any *non-image* mime was accepted as a "raw" upload (effectively a
blocklist of nothing).

**Fix:** added a strict `RAW_TYPES` allowlist (PDF, Word, Excel, PowerPoint,
plain text, CSV, zip). Any type in neither `IMAGE_TYPES` nor `RAW_TYPES` is now
rejected with `415 Unsupported Media Type`.

## 3. Client env leakage — PASS

Grepped client components for `process.env.*` that is not `NEXT_PUBLIC_*`.
**No leaks found.** Server-only secrets (`MONGODB_URI`, `NEXTAUTH_SECRET`,
Cloudinary keys) are referenced only in server modules.

## 4. Custom CSS sanitizer — VERIFIED + TESTED

`lib/css-sanitizer.js` rejects `@import`, `expression()`, `behavior:`,
`javascript:` URLs, stray `<style>/<script>` tags, and `position: fixed` on
body-level selectors. Added `tests/css-sanitizer.test.js` (7 cases) covering the
required payloads plus the clean-CSS and scoped-`position:fixed` pass cases.
Run with `npm test`.

## 5. Rate limiting — ADDED

Added `lib/rate-limit.js` (in-memory token bucket). Documented limits:

| Surface | Limit |
|---|---|
| `/api/upload` | 20 / minute / IP (429 + `Retry-After`) |
| Auth (`authorize` in `lib/auth.js`) | 10 attempts / minute / IP |
| View endpoints | 30s per-IP+item cooldown (pre-existing, in `lib/view-counter.js`) |

Buckets are per serverless instance — adequate for soft abuse-prevention, not a
billing-grade limiter.
