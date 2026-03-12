# Feature Specification: Migrate from Prisma to Drizzle

**Feature Branch**: `002-prisma-to-drizzle`  
**Created**: 2026-03-11  
**Status**: Draft  
**Input**: User description: "migrate from Prisma to Drizzle. Ensure that exisiting databases are migrated if needed"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Data Layer Migration (Priority: P1)

As a developer, I want the application to use Drizzle ORM instead of Prisma, so that we have a lighter-weight database layer with better performance.

**Why this priority**: This is the core of the migration - without it, nothing else works.

**Independent Test**: Can be verified by checking that the application starts and connects to the database using Drizzle queries instead of Prisma client.

**Acceptance Scenarios**:

1. **Given** the application is built, **When** it starts, **Then** it connects to the SQLite database using Drizzle
2. **Given** existing data in the database, **When** the application runs queries, **Then** all data is accessible and returns correct results

---

### User Story 2 - Query Compatibility (Priority: P1)

As a developer, I want all existing database queries to work with Drizzle, so that the application functionality remains unchanged.

**Why this priority**: Ensures all features (wishlists, items, purchased tracking) continue to work.

**Independent Test**: Can be verified by running the application and testing all CRUD operations on wishlists and items.

**Acceptance Scenarios**:

1. **Given** a user creates a wishlist, **When** the data is saved, **Then** it can be retrieved correctly via Drizzle queries
2. **Given** wishlist items exist, **When** marking items as purchased, **Then** the status is persisted correctly

---

### User Story 3 - Migration Script for Existing Databases (Priority: P1)

As an operator, I want existing databases to work seamlessly with Drizzle, so that production data is preserved during the migration.

**Why this priority**: Critical for production deployments - no data loss.

**Independent Test**: Can be verified by backing up production database, running migration, and confirming all data is intact.

**Acceptance Scenarios**:

1. **Given** an existing SQLite database with Prisma schema, **When** the application starts with Drizzle, **Then** all existing data is accessible
2. **Given** a fresh database, **When** Drizzle migrations run, **Then** the schema is created correctly

---

### User Story 4 - Test Suite Compatibility (Priority: P2)

As a developer, I want all tests to pass with the new Drizzle setup, so that we can verify the migration didn't break functionality.

**Why this priority**: Ensures quality and prevents regressions.

**Independent Test**: Can be verified by running unit tests and E2E tests.

**Acceptance Scenarios**:

1. **Given** the test suite, **When** running unit tests, **Then** all tests pass
2. **Given** the test suite, **When** running E2E tests, **Then** all tests pass

---

### Edge Cases

- What happens if the database schema has custom indexes that need to be preserved?
- How does the migration handle database files in different locations?
- What if there are breaking changes between Prisma and Drizzle query syntax?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST use Drizzle ORM for all database operations
- **FR-002**: All existing Prisma client queries MUST be replaced with equivalent Drizzle queries
- **FR-003**: Existing databases MUST work without manual data migration (schema compatibility)
- **FR-004**: All CRUD operations on wishlists and items MUST function identically to before
- **FR-005**: Unit tests MUST pass with the new Drizzle setup
- **FR-006**: E2E tests MUST pass with the new Drizzle setup
- **FR-007**: Application MUST start and connect to database successfully

### Key Entities _(include if feature involves data)_

- **Wishlist**: User's wishlist with title, description, public/private flag
- **WishlistItem**: Items within a wishlist with name, link, purchased status

### Dependencies

- **drizzle-orm**: v0.45.1 - Drizzle ORM package
- **drizzle-kit**: v0.31.9 - Migration tooling
- **better-sqlite3**: v12.6.2 - SQLite driver

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Application starts without errors and connects to database
- **SC-002**: All unit tests pass (npm run test:unit:ci)
- **SC-003**: All E2E tests pass (npm run test:e2e)
- **SC-004**: Existing data in database is accessible after migration
- **SC-005**: No functionality regressions compared to Prisma version

---

## Assumptions

- Drizzle supports SQLite with better-sqlite3 or libSQL driver
- Existing Prisma schema can be translated to Drizzle schema
- No breaking changes in Drizzle that prevent feature parity
- Database file location remains the same (data/data.db)
