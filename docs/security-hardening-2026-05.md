# Security Hardening — May 2026

Full report and fixes from the security audit conducted 2026-05-29, following the [security-and-hardening](https://github.com/ThisIsBenny/wishlist-app/blob/main/docs/security-hardening-2026-05.md) framework.

## Audit Summary

| Metric | Before | After |
|--------|--------|-------|
| npm audit (high) | 11 | 0 |
| npm audit (moderate) | 21 | 9 (all dev-only) |
| XSS vectors | 1 (unvalidated imageSrc) | 0 |
| ReDoS vectors | 1 (url regex) | 0 |
| Missing security headers | 1 (HSTS) | 0 |
| .gitignore gaps | 4 patterns missing | 0 |

---

## Fixes Applied

### 1. SQL Injection — drizzle-orm upgrade

- **File:** `package.json`
- **CVE:** [GHSA-gpj5-g38j-94v9](https://github.com/advisories/GHSA-gpj5-g38j-94v9)
- **Change:** `drizzle-orm: ^0.45.1` → `^0.45.2`
- **Risk:** Improperly escaped SQL identifiers could allow injection through crafted column names in dynamic queries. The app uses static table/column references exclusively, so exploitability was low, but the patch is a one-version bump with no breaking changes.
- **Note:** If using `drizzle-orm` SQL identifier templates or dynamic column selection in future features, this would have been critical.

### 2. Dependency vulnerability fixes — npm audit fix

- **Command:** `npm audit fix`
- **Fixable vulnerabilities resolved:**
  - `flatted` ≤3.4.1 — prototype pollution & DoS (HIGH)
  - `lodash` ≤4.17.23 — code injection via `_.template` (HIGH, transitive via `@nestjs/config`)
  - `js-cookie` ≤3.0.5 — cookie-attribute injection via prototype pollution (HIGH)
  - `axios` 1.0.0–1.15.2 — SSRF, prototype pollution, header injection (HIGH)
  - `fast-uri` ≤3.1.1 — path traversal (HIGH)
  - `picomatch` 4.0.0–4.0.3 — method injection & ReDoS (HIGH)
  - `path-to-regexp` 8.0.0–8.3.0 — DoS via regex (HIGH, transitive via `@nestjs/core`)
  - `@nestjs/core` ≤11.1.17 — injection (HIGH)
  - `ws` 8.0.0–8.20.0 — uninitialized memory disclosure (MODERATE)
  - `follow-redirects` ≤1.15.11 — auth header leak to cross-domain redirects (MODERATE)
  - `postcss` <8.5.10 — XSS in CSS stringify (MODERATE)
  - `qs` 6.11.1–6.15.1 — DoS via type confusion (MODERATE)
  - `file-type` 13.0.0–21.3.1 — DoS via malformed input (MODERATE)
  - `ajv` 7.0.0-α–8.17.1 — ReDoS via `$data` (MODERATE)

**Remaining (9 moderate, dev-only):** `esbuild`/`vite` (requires Vite 8 — breaking change), `brace-expansion` (requires upstream fix). These are dev-time tools not present in production images.

### 3. Unvalidated imageSrc — XSS prevention

- **Files:** `src/api/wishlist/dto/wishlist.dto.ts` (both `WishlistItemSchema` and `WishlistSchema`)
- **Change:** `imageSrc: z.string().default('')` → added `.refine()` requiring HTTPS scheme
- **Rationale:** See [ADR-001](decisions/adr-001-https-images-and-hsts.md)
- **Impact:** Any existing image URL not using HTTPS will fail validation on update. Metadata extraction already returns HTTPS URLs from most sources, so migration impact is expected to be minimal.

### 4. ReDoS vulnerability in URL validation regex

- **File:** `src/api/wishlist/dto/wishlist.dto.ts`
- **Change:** `([/\w .-]*)*\/?$` → `([/\w .-]*)?\/?$` (removed nested quantifier)
- **Risk:** The original regex contained `([/\w .-]*)*` — a classic ReDoS pattern where a crafted input could cause exponential backtracking. An attacker could submit a URL with thousands of space characters, causing the server to hang during validation.
- **Impact:** None — the fixed regex accepts the same set of valid URLs but without the backtracking vulnerability.

### 5. Missing HSTS header

- **File:** `src/api/main.ts`
- **Change:** Added `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- **Rationale:** See [ADR-001](decisions/adr-001-https-images-and-hsts.md)
- **Impact:** Browsers will now automatically upgrade HTTP → HTTPS for this domain for 1 year after the first visit.

### 6. .gitignore hardening

- **File:** `.gitignore`
- **Added patterns:**
  - `.env.local` — local env overrides
  - `.env.*.local` — any local env variant
  - `*.pem` — SSL/TLS certificate files
  - `*.key` — private key files
- **Rationale:** `.env` was already ignored, but `.env.local` variants (used by many tools including Vite and Docker Compose) could accidentally expose secrets. Certificate files are never intended for version control.

---

## What Was Already Good

The audit confirmed several strong security practices already in place:

- **Password hashing:** bcrypt with 12 salt rounds
- **Session cookies:** httpOnly, Secure, SameSite=Strict
- **JWT session management:** Tokens validated against `sessions` table (supports revocation)
- **SSRF protection:** Comprehensive URL validation blocking private IPs, localhost, internal subdomains (`src/api/utils/metadata-plugins/url-validator.ts`)
- **Input validation:** Zod schemas at every API boundary via global `ZodValidationPipe`
- **Parameterized queries:** Drizzle ORM used throughout — no raw SQL concatenation
- **Rate limiting:** Auth endpoints (3/min register, 5/min login) via `@nestjs/throttler`
- **Error handling:** Production mode hides 500+ error details (global exception filter)
- **No `v-html`/`innerHTML`:** Confirmed zero XSS injection points in Vue templates
- **Strong password policy:** 8+ chars, uppercase, lowercase, digit, special character
- **OIDC security:** state/nonce with 10-minute expiry, cleared after use

---

## Open Recommendations (Deferred)

These items were identified in the audit but deferred to a future release cycle:

| Item | Priority | Rationale |
|------|----------|-----------|
| CSRF token for mutation endpoints | Medium | SameSite=Strict covers most cases; add token for older browsers |
| Docker non-root user | Medium | `Dockerfile` currently runs as root; add `USER` directive |
| `markItemBought` targeted rate limit | Medium | Currently only protected by global 100 req/min throttle |
| OIDC state persistence | Low | In-memory Map loses state on restart; needs Redis/DB for multi-instance |
| Error exposure in non-production | Low | Consider whitelist approach (expose only in explicit `development`) |

---

## Verification

- ✅ `npm run typecheck` — passes
- ✅ `npx vitest run` — 183 tests pass (0 failures)
- ✅ `npm audit` — 0 high severity, 9 moderate (all dev-only)
- ✅ Prettier / ESLint formatting consistent
