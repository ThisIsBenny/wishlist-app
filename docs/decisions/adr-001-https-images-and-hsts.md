# ADR-001: Enforce HTTPS for Images and Add HSTS Header

## Status
Accepted

## Date
2026-05-29

## Context

A security audit revealed two related weaknesses in transport security:

1. **`imageSrc` fields accepted any scheme** (including `http://`). This could cause mixed-content warnings in browsers and expose users to MITM attacks on image resources.

2. **No HSTS header** was set, meaning browsers were not instructed to always use HTTPS for this domain. A first-visit user could be served over HTTP before being redirected, opening a window for SSL stripping attacks.

## Decision

1. **Enforce HTTPS-only on `imageSrc` fields** via Zod schema validation — both `WishlistItemSchema` and `WishlistSchema`. Empty strings (no image) are still permitted for backward compatibility.

2. **Add `Strict-Transport-Security` header** with `max-age=31536000; includeSubDomains` alongside existing security headers in `main.ts`.

## Alternatives Considered

### Block all non-HTTPS image URLs
- Pros: Maximum security
- Cons: Breaks existing wishlists that have HTTP image URLs; metadata extraction from some sources occasionally returns HTTP URLs
- Rejected: Too aggressive for current deployment stage

### Allow HTTP images but emit CSP report-only
- Pros: No breaking change, gains observability
- Cons: CSP reporting infrastructure not set up; adds complexity without enforcement
- Rejected: Right fix is enforcement, not reporting

### Skip HSTS for now
- Pros: No risk of misconfiguration
- Cons: Leaves SSL stripping vector open
- Rejected: HSTS is industry-standard best practice with negligible risk of misconfiguration

## Consequences

- **Positive**: Eliminates mixed-content warnings; browsers auto-upgrade to HTTPS after first visit
- **Negative**: Any existing wishlist with an HTTP image URL will fail validation on update. The user must update to an HTTPS URL. Since metadata extraction returns HTTPS URLs from most sources, migration impact is expected to be minimal.
- **Note**: HSTS `max-age` of 1 year means users visiting today will have HTTPS forced until May 2027. If HTTPS is ever disabled, users on this header will be unable to access the site.
