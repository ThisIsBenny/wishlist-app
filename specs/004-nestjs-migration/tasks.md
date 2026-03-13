# Tasks: Migrate from Fastify to NestJS

**Feature**: NestJS Migration  
**Branch**: `004-nestjs-migration`  
**Date**: 2026-03-13

## Phase 1: Setup

- [x] T001 Install NestJS core dependencies in package.json
- [x] T002 Update package.json scripts for NestJS build
- [x] T003 Add NestJS type definitions to devDependencies (included with NestJS packages)

## Phase 2: Foundational

- [x] T004 Create main NestJS bootstrap file at src/api/main.ts
- [x] T005 Create root AppModule at src/api/app.module.ts
- [x] T006 Configure CORS in NestJS app at src/api/main.ts
- [x] T007 Configure static file serving at src/api/app.module.ts
- [x] T008 Configure compression and security headers at src/api/main.ts
- [x] T009 Health check integrated in main.ts

## Phase 3: User Story 1 - Core Backend Migration (P1)

- [x] T010 Create WishlistModule at src/api/wishlist/wishlist.module.ts
- [x] T011 [P] Create WishlistController at src/api/wishlist/wishlist.controller.ts
- [x] T012 [P] Create WishlistService at src/api/wishlist/wishlist.service.ts
- [x] T013 [P] Create WishlistRepository at src/api/wishlist/wishlist.repository.ts
- [x] T014 Implement GET /api/wishlist endpoint in WishlistController
- [x] T015 Implement GET /api/wishlist/:slugText endpoint in WishlistController
- [x] T016 Connect WishlistController to existing Drizzle models
- [x] T017 Implement validation pipes in NestJS app

## Phase 4: User Story 2 - Protected Routes (P1)

- [x] T018 Create ApiKeyGuard at src/api/auth/api-key.guard.ts
- [x] T019 Apply ApiKeyGuard to POST /api/wishlist endpoint
- [x] T020 Apply ApiKeyGuard to PATCH /api/wishlist/:slugText endpoint
- [x] T021 Apply ApiKeyGuard to DELETE /api/wishlist/:slugText endpoint
- [x] T022 Apply ApiKeyGuard to item CRUD endpoints

## Phase 5: User Story 3 - Test Migration (P2)

- [x] T023 Replace create handler test with NestJS test (tests use API directly, unchanged)
- [x] T024 Replace read handler test with NestJS test (tests use API directly, unchanged)
- [x] T025 Replace update handler test with NestJS test (tests use API directly, unchanged)
- [x] T026 Replace delete handler test with NestJS test (tests use API directly, unchanged)
- [x] T027 Replace fetchmetadata handler test with NestJS test (tests use API directly, unchanged)
- [x] T028 Verify non-Fastify tests pass unchanged at src/api/**tests**/db/drizzle.test.ts
- [x] T029 Remove obsolete Fastify config tests at src/api/**tests**/config/fastify.test.ts

## Phase 6: User Story 4 - Frontend Integration (P2)

- [x] T030 Verify frontend static files serve correctly at root URL
- [x] T031 Verify SPA fallback works for Vue Router routes
- [x] T032 Run E2E tests to verify frontend integration (E2E tests use API endpoints, unchanged)

## Phase 7: User Story 5 - Documentation (P3)

- [x] T033 Update AGENTS.md with NestJS development commands

## Phase 8: Polish & Cross-Cutting

- [x] T034 Run npm run lint and fix any issues
- [x] T035 Run npm run typecheck and fix any type errors
- [x] T036 Run npm run test:unit:ci and verify all tests pass
- [x] T037 Run npm run test:e2e and verify E2E tests pass
- [x] T038 Run npm run build and verify build succeeds
- [x] T039 Clean up old Fastify files no longer needed
- [x] T040 Build Docker image and verify it builds successfully
- [x] T041 Verify container starts and app functions correctly

---

## Summary

| Metric                               | Value |
| ------------------------------------ | ----- |
| Total Tasks                          | 41    |
| Phase 1 (Setup)                      | 3     |
| Phase 2 (Foundational)               | 6     |
| Phase 3 (US1 - Core Migration)       | 7     |
| Phase 4 (US2 - Protected Routes)     | 5     |
| Phase 5 (US3 - Test Migration)       | 7     |
| Phase 6 (US4 - Frontend Integration) | 3     |
| Phase 7 (US5 - Documentation)        | 1     |
| Phase 8 (Polish)                     | 8     |

## Parallel Opportunities

- T011, T012, T013 can run in parallel (Wishlist module components)
- T014, T015 can run in parallel (GET endpoints)
- T019-T022 can run in parallel (apply guard to multiple endpoints)
- T023-T027 can run in parallel (test migration tasks)

## Independent Test Criteria

| User Story                 | Test Criteria                           |
| -------------------------- | --------------------------------------- |
| US1 - Core Migration       | API returns same JSON as Fastify        |
| US2 - Protected Routes     | CRUD operations work with valid API key |
| US3 - Test Migration       | All unit tests pass                     |
| US4 - Frontend Integration | Frontend loads and functions            |
| US5 - Documentation        | AGENTS.md updated                       |

## MVP Scope

Focus on Phase 1-4 (US1 + US2) - Core backend migration with authentication. This provides a working NestJS backend with identical API interface.

---

_End of tasks_
