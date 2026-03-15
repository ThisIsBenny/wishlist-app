# Fastify to NestJS Migration - Fixes & Lessons Learned

This document captures all issues found and fixed during and after the Fastify to NestJS migration.

---

## Issues Fixed Since Migration (2026-03-13 to 2026-03-14)

### API Route Parameters & HTTP Methods

**Commit:** `bd02ad6`
**Issue:** Routes used `:slugText` instead of `:id`, and `@Patch` instead of `@Put`
**Root Cause:** Incorrect migration from Fastify routes
**Fix:** Changed all routes to use `:id` and `@Put`

### markItemBought - No Body Required

**Commits:** `848acd3`, `6dd8938`
**Issue:** POST `/item/:itemId/bought` required body, but Fastify had no body
**Error:** `Error: No values to set` from Drizzle
**Fix:** Removed body parameter, always sets `{ bought: true }`

### UpdateWishlistItemSchema - Extra Fields

**Commit:** `65905f0`
**Issue:** PUT to `/item/:itemId` returned 400: "Unrecognized keys: id, wishlistId"
**Fix:** Changed `.strict()` to `.strip()`

### PUT Requires Full Object

**Commit:** `757e034`
**Issue:** DTO allowed partial updates but PUT should require full object
**Fix:** Removed `.partial()`, using `.strip()` for items and `.strict()` for wishlists

### Auth Header Format

**Commit:** `bd02ad6` (part of route migration)
**Issue:** ApiKeyGuard expected `x-api-key`, frontend used `Authorization: API-Key`
**Fix:** Updated guard to use correct header format

### getById Duplication

**Commit:** `bd02ad6` (part of route migration)
**Issue:** Both Repository and Service had duplicate logic
**Fix:** Clean separation: Repository returns undefined, Service throws NotFoundException

### Playwright Tests - Empty Database

**Commit:** `3e63691`
**Issue:** Tests failed because database was empty
**Fix:** Added `playwright.global-setup.ts` that seeds test data

### Playwright - CI Timeout

**Commit:** `2e49f35`
**Issue:** webServer timeout in CI (server not starting)
**Fix:** Temporarily disabled in CI (still works locally)

### Playwright - Build Before Install

**Commit:** `9e56230`
**Issue:** Playwright install failed
**Fix:** Added `npm run build` before `playwright install` in CI

### Release Notes Language

**Commit:** `90e4b26`
**Issue:** Release notes in German
**Fix:** Added rule to constitution: release notes must be in English

---

## Pre-Migration Fixes (that carried over)

### Docker Tags Format

**Commit:** `55edf36`, `67069e1`
**Issue:** Duplicate "v" prefix in docker tags
**Fix:** Proper tag format

### CI Workflow - Release Tags

**Commits:** `1908599`, `2aad596`, `08eb755`
**Issue:** CI running on release commits unnecessarily
**Fix:** Skip CI for version bump and release commits

### Docker Build/Test/Publish

**Commits:** `ec3c0ab`, `636860c`, `5f4b067`, `b9fec45`
**Issue:** Single job for build, test, and publish
**Fix:** Separate jobs, run tests on every build

### Database Migration

**Commits:** `5da0ac3`, `f6433ba`
**Issue:** Migrations failing on existing DBs
**Fix:** Use `IF NOT EXISTS` and proper migration handling

### Test Mode Database

**Commit:** `eec6513`
**Issue:** Test mode using file DB instead of in-memory
**Fix:** Skip DB size check in test mode

---

## Test Coverage Gaps

The following were NOT caught by existing tests:

- markItemBought required no body (test sent partial)
- UpdateWishlistItemSchema rejected extra fields (test didn't send extras)
- PUT partial updates passed when they shouldn't (tests sent partial data)

---

## Lessons Learned

1. **Always compare with original Fastify implementation** before assuming migration was correct
2. **Test with real frontend requests** - unit tests don't catch all issues
3. **PUT vs PATCH semantics** - PUT requires full object, PATCH allows partial
4. **Zod strict vs strip** - use `.strip()` when frontend sends extra fields
5. **Playwright needs seed data** - add globalSetup for E2E tests
6. **Release notes in English** - added to constitution
7. **Skip CI for release commits** - prevents unnecessary builds
