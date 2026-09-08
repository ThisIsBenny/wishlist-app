# ADR-002: Migrate from Shared API Key to User-Based JWT + OIDC Authentication

## Status
Accepted

## Date
2026-05-29

## Context

The application previously used a single shared API key (`API_KEY` env var) for all authentication. Every request that required authorization sent `Authorization: API-Key <token>` in headers. This had several critical limitations:

- **No user identity**: All authenticated requests were anonymous — impossible to associate wishlists with specific users, enforce ownership, or support per-user features.
- **No session management**: The API key was a static secret with no expiry, rotation, or revocation mechanism.
- **Single factor**: No way to add multiple authentication methods or providers.
- **No multi-user support**: The API key was shared across all users, meaning any person with the key could modify any wishlist.

The app needed a proper multi-user authentication system to support per-user wishlists, ownership checks, and future features like sharing and collaboration.

## Decision

Replace the shared API key with a **JWT-based session authentication system** supporting two login methods:

1. **Email + Password** — Traditional login with bcrypt-hashed passwords (12 salt rounds), toggleable via `AUTH_EMAIL_LOGIN_ENABLED` / `AUTH_EMAIL_REGISTER_ENABLED` env vars.

2. **OpenID Connect (OIDC)** — Support for arbitrary OIDC providers (e.g., PocketID, Google, GitHub) configured via `OIDC_<ID>_*` env vars and auto-discovered on startup.

### Architecture

```
Client → JWT cookie (httpOnly) → JwtAuthGuard (global APP_GUARD)
                                    │
                                    ├── Validates JWT signature
                                    ├── Checks sessions table (revocation support)
                                    └── Attaches JwtUser to request
```

**Key design decisions:**

| Decision | Rationale |
|----------|-----------|
| JWT in httpOnly cookies (not Authorization header) | Prevents XSS-based token theft; SameSite=Strict blocks CSRF |
| `sessions` table for JWT tracking | Enables server-side revocation (logout, admin actions) |
| `JwtAuthGuard` as global `APP_GUARD` | Every route authenticated by default; opt-out via `@Public()` |
| `@CurrentUser()` decorator | Clean extraction of JWT payload without boilerplate |
| Rate-limited auth endpoints | 3 req/min register, 5 req/min login — prevents brute force |
| bcrypt with 12 salt rounds | Industry standard; balances security with registration UX |
| OIDC provider auto-discovery | Zero-config addition of new providers via env vars |
| Multi-device sessions (no login wipe) | Login creates a session; it never revokes other devices. Logout revokes only the caller's session (by `tokenJti`). Expired sessions are cleaned up lazily on the user's next login. |
| OIDC identity = (issuer, subject) | Users are matched by the cryptographically verified pair. Email matching only links accounts when `email_verified: true` — unverified emails always create a NEW user (prevents account takeover). |
| openid-client v6 functional API | `discovery`/`buildAuthorizationUrl`/`authorizationCodeGrant` with `expectedState`/`expectedNonce` checks; state/nonce stored server-side with a 10-minute TTL enforced at callback time. |
| `PUBLIC_URL` env (optional) | Base URL for OIDC `redirect_uri` construction; falls back to `http://localhost:${PORT}` in dev. |

### Database Schema

New tables added to Drizzle schema:

```
users
├── id (UUID, PK)
├── email (unique, not null)
├── passwordHash (nullable — null for OIDC-only users)
├── oidcIssuer (nullable)
├── oidcSubject (nullable)
├── createdAt, updatedAt
└── unique index on (oidcIssuer, oidcSubject)

sessions
├── id (PK)
├── userId (FK → users.id)
├── tokenJti (UUID, JWT ID for revocation)
├── expiresAt
└── createdAt
```

Wishlists now have a `userId` foreign key to `users.id`, enabling per-user ownership.

### Migration on existing databases

SQLite cannot `ALTER TABLE ADD COLUMN ... NOT NULL` without a DEFAULT on
tables that already contain rows, so migration `0001` rebuilds `Wishlist`
and `items` (temp backup → drop → create → reinsert, per
[sqlite.org/lang_altertable.html](https://sqlite.org/lang_altertable.html)).
All pre-existing wishlists are adopted by a bootstrap owner
(`migrated@localhost`, id `00000000-0000-4000-8000-000000000000`). This is
a **documented fresh-start compromise**: after their first login, operators
reassign adopted wishlists with a single UPDATE:

```sql
UPDATE Wishlist SET userId = '<new-user-id>'
WHERE userId = '00000000-0000-4000-8000-000000000000';
```

An automatic adoption hook (first login claims the ghost account's
wishlists) was deliberately rejected: the first person to register any
account could claim someone else's wishlists.

## Alternatives Considered

### Keep API key + add user concept separately
- Pros: Minimal code change
- Cons: Authentication and authorization remain separate; API key still shared secret with no session management
- Rejected: Would create a half-measure that still needs migration later

### Session-based auth with server-side session store (no JWT)
- Pros: Simpler token invalidation
- Cons: Requires session store (Redis/DB) on every request; doesn't scale horizontally without shared state
- Rejected: JWT with sessions table gives the best of both — stateless validation + server-side revocation

### Passport.js for auth
- Pros: Mature ecosystem, many strategies
- Cons: Adds dependency; NestJS JwtModule + custom OIDC service is simpler and sufficient
- Rejected: NestJS built-in tools meet all requirements without the abstraction overhead

### Store sessions as JWT claims only (no DB tracking)
- Pros: Fully stateless
- Cons: No server-side revocation — "logout" can't invalidate tokens without a blocklist
- Rejected: Revocation is a hard requirement for logout and security incident response

## Consequences

### Positive
- **User identity** — Each wishlist is now owned by a specific user; ownership checks prevent unauthorized modifications
- **Session revocation** — Logout and admin actions immediately invalidate tokens via `sessions` table
- **Multi-auth support** — Users can log in via email or any configured OIDC provider
- **Audit trail** — All mutations are now attributable to a specific user
- **Future-ready** — Architecture supports sharing, collaboration, and role-based access

### Negative
- **Breaking change** — All existing clients must migrate from API key to JWT cookies. The API key is no longer supported.
- **Increased complexity** — Three new tables (users, sessions), OIDC flow, JWT configuration
- **Deployment requirement** — `JWT_SECRET` (32+ chars) must be set in production
