---
description: 'Task list for migrating from Prisma to Drizzle ORM'
---

# Tasks: Migrate from Prisma to Drizzle

**Input**: Design documents from `/specs/002-prisma-to-drizzle/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup & Dependencies

**Purpose**: Install Drizzle dependencies and create configuration

### Dependency Installation

- [x] T001 [P] Install drizzle-orm v0.45.1, drizzle-kit v0.31.9, better-sqlite3 v12.6.2
- [x] T002 [P] Remove Prisma dependencies from package.json (@prisma/client, prisma)

### Configuration

- [x] T003 Create drizzle.config.ts with SQLite configuration
- [x] T004 Create src/db/index.ts for Drizzle client initialization

---

## Phase 2: Schema Definition

**Purpose**: Define Drizzle schema matching existing Prisma schema

### Schema Files

- [x] T005 [P] [US1] Create src/db/schema/wishlists.ts with Wishlist table schema
- [x] T006 [P] [US1] Create src/db/schema/items.ts with Item table schema
- [x] T007 [P] [US1] Create src/db/schema/index.ts to export all schemas

---

## Phase 3: Data Layer Migration

**Purpose**: Replace Prisma queries with Drizzle queries in services

### Wishlist Service

- [x] T008 [US1] Update src/api/models/wishlist.ts to use Drizzle queries
- [x] T009 [US1] Create src/db/queries/wishlists.ts with Drizzle query builders

### Item Service

- [x] T010 [US2] Update src/api/models/item.ts to use Drizzle queries
- [x] T011 [US2] Create src/db/queries/items.ts with Drizzle query builders

### Server Update

- [x] T012 [US1] Update src/api/server.ts to initialize Drizzle client instead of Prisma

---

## Phase 4: Testing & Verification

**Purpose**: Ensure all tests pass with new Drizzle setup

### Test Execution

- [x] T013 [US4] Run unit tests with npm run test:unit:ci
- [x] T014 [US4] Run E2E tests with npm run test:e2e

### Verification

- [x] T015 [US3] Verify existing database data is accessible with Drizzle
- [x] T016 [US3] Verify all CRUD operations work correctly

---

## Phase 5: Cleanup

**Purpose**: Remove Prisma artifacts and finalize migration

### Cleanup Tasks

- [x] T017 Remove prisma/ directory (schema.prisma, migrations)
- [x] T018 Update AGENTS.md to reflect Drizzle instead of Prisma
- [x] T019 Update constitution.md Technology Standards section

---

## Phase 6: Polish & Final Verification

**Purpose**: Final checks and documentation

### Final Tasks

- [x] T020 Verify application starts without errors
- [x] T021 Verify all unit tests pass
- [x] T022 Verify all E2E tests pass
- [ ] T023 Commit all changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Must complete before Phase 2
- **Phase 2 (Schema)**: Must complete before Phase 3
- **Phase 3 (Data Layer)**: Must complete before Phase 4
- **Phase 4 (Testing)**: Can run in parallel after Phase 3
- **Phase 5 (Cleanup)**: Depends on Phase 4 success
- **Phase 6 (Polish)**: Depends on Phase 5

### User Story Dependencies

- **User Story 1 (Data Layer)**: T001-T004, T005-T009, T012 - Core migration
- **User Story 2 (Query Compatibility)**: T010-T011 - CRUD operations
- **User Story 3 (Migration)**: T015-T016 - Data verification
- **User Story 4 (Tests)**: T013-T014 - Test validation

### Parallel Opportunities

- Phase 1: T001 and T002 can run in parallel (different package changes)
- Phase 2: T005, T006, T007 can run in parallel (different schema files)

---

## Implementation Strategy

### Recommended Order

1. **Start with Phase 1** - Install Drizzle, remove Prisma
2. **Then Phase 2** - Create schema files
3. **Then Phase 3** - Update services to use Drizzle
4. **Then Phase 4** - Run tests
5. **Then Phase 5** - Cleanup
6. **Finally Phase 6** - Final verification

### MVP Scope

MVP is User Story 1: Data Layer Migration. This means:

- Phase 1 complete (dependencies)
- Phase 2 complete (schema)
- Phase 3 partially complete (at least Wishlist queries work)
- T012 (server update) is critical for MVP

### Incremental Delivery

1. Install dependencies (T001-T004)
2. Create schema (T005-T007)
3. Update wishlist model (T008-T009)
4. Update server (T012)
5. Test: Application starts and basic queries work
6. Update item model (T010-T011)
7. Run full test suite (T013-T014)
8. Cleanup (T017-T019)
9. Final verification (T020-T023)

---

## Summary

- **Total Tasks**: 23
- **User Story 1 (Data Layer)**: 9 tasks (T001-T004, T005-T007, T008-T009, T012)
- **User Story 2 (Query Compatibility)**: 2 tasks (T010-T011)
- **User Story 3 (Migration)**: 2 tasks (T015-T016)
- **User Story 4 (Tests)**: 2 tasks (T013-T014)
- **Cleanup**: 3 tasks (T017-T019)
- **Verification**: 5 tasks (T020-T023)
- **Parallel Opportunities**: 5 tasks marked [P]
- **Independent Test Criteria**: Each user story is independently verifiable
  - US1: App starts, connects to DB with Drizzle
  - US2: All CRUD operations work
  - US3: Existing data accessible
  - US4: All tests pass
