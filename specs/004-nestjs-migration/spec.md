# Feature Specification: Migrate from Fastify to NestJS

**Feature Branch**: `004-nestjs-migration`  
**Created**: 2026-03-13  
**Status**: Draft  
**Input**: User description: "Migrate from Fastify to NestJS."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Core Backend Migration (Priority: P1)

As a developer, I want the backend framework to be migrated from Fastify to NestJS so that the application follows NestJS best practices while maintaining all existing functionality.

**Why this priority**: This is the foundational change that enables all other requirements. Without this, nothing else can proceed.

**Independent Test**: Can be tested by verifying all API endpoints return the same responses as the Fastify version.

**Acceptance Scenarios**:

1. **Given** the Fastify server is replaced with NestJS, **When** a GET request is made to `/api/wishlist`, **Then** all public wishlists are returned in the same JSON format as before.
2. **Given** the NestJS server is running, **When** a GET request is made to `/api/wishlist/:slugText`, **Then** the specific wishlist is returned or 404 is shown.
3. **Given** the NestJS server is running, **When** static files are requested, **Then** they are served correctly (frontend works).

---

### User Story 2 - Protected Routes (Priority: P1)

As an authenticated user, I want to access protected API endpoints through NestJS so that I can create, update, and delete wishlists.

**Why this priority**: Protected routes handle core CRUD functionality that users depend on.

**Independent Test**: Can be tested by making authenticated requests with API key header and verifying CRUD operations work.

**Acceptance Scenarios**:

1. **Given** a valid API key is provided, **When** a POST request is made to `/api/wishlist`, **Then** a new wishlist is created and returned.
2. **Given** a valid API key is provided, **When** a PATCH request is made to `/api/wishlist/:slugText`, **Then** the wishlist is updated.
3. **Given** a valid API key is provided, **When** a DELETE request is made to `/api/wishlist/:slugText`, **Then** the wishlist is deleted.

---

### User Story 3 - Test Migration (Priority: P2)

As a developer, I want all Fastify-specific tests to be migrated to NestJS testing utilities so that the test suite continues to validate the application.

**Why this priority**: Tests ensure the migrated application maintains correct behavior.

**Independent Test**: Can be tested by running the test suite and verifying all tests pass.

**Acceptance Scenarios**:

1. **Given** the Fastify handler tests exist, **When** migration is complete, **Then** equivalent NestJS controller/service tests exist and pass.
2. **Given** non-Fastify specific tests (e.g., Drizzle tests), **When** migration is complete, **Then** they continue to pass without modification.

---

### User Story 4 - Frontend Integration (Priority: P2)

As a user, I want the frontend to continue working seamlessly after the backend migration so that I am unaware of the framework change.

**Why this priority**: User experience must remain unchanged.

**Independent Test**: Can be tested by loading the frontend and verifying all features work.

**Acceptance Scenarios**:

1. **Given** the application is served from NestJS, **When** a user visits the root URL, **Then** the frontend loads and functions correctly.

---

### User Story 5 - Documentation (Priority: P3)

As a developer, I want documentation explaining the new NestJS structure so that I can understand and maintain the codebase.

**Why this priority**: Enables future development and onboarding.

**Independent Test**: Can be verified by reviewing the documentation file.

**Acceptance Scenarios**:

1. **Given** migration is complete, **When** a developer reads the documentation, **Then** they can understand the NestJS architecture and module structure.

---

### Edge Cases

- What happens when the database is unavailable? → NestJS should handle database errors gracefully with appropriate HTTP status codes.
- What happens when an invalid API key is provided? → Return 401 Unauthorized.
- What happens with malformed request bodies? → Return 400 Bad Request with validation errors.
- What happens when the requested wishlist doesn't exist? → Return 404 Not Found.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST serve all existing API endpoints at `/api/wishlist/*` with the same request/response format.
- **FR-002**: System MUST serve static frontend files from the same location as Fastify.
- **FR-003**: System MUST implement NestJS module structure following best practices (Modules -> Controllers -> Services -> Repositories).
- **FR-004**: System MUST support API key authentication for protected routes.
- **FR-005**: System MUST handle CORS correctly for localhost in development.
- **FR-006**: System MUST return appropriate HTTP status codes (200, 201, 400, 401, 404).
- **FR-007**: System MUST include a health check endpoint at `/healthz`.
- **FR-008**: System MUST support request compression and security headers.
- **FR-009**: All Fastify-specific unit tests MUST be migrated to NestJS testing patterns.
- **FR-010**: Non-Fastify specific tests MUST continue to pass without modification.
- **FR-011**: E2E tests MUST pass without modification.
- **FR-012**: System MUST use NestJS version 11.x (latest stable).

### Key Entities

- **Wishlist**: Contains wishlist data (id, title, slugText, items, createdAt, public)
- **WishlistItem**: Contains item data (id, title, link, bought, wishlistId)
- **API Key**: Authentication token for protected routes

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All API endpoints return identical responses to the Fastify version (verified via E2E tests passing).
- **SC-002**: Frontend loads and functions correctly when served from NestJS.
- **SC-003**: All unit tests pass after migration.
- **SC-004**: All E2E tests pass without modification.
- **SC-005**: Build completes successfully with `npm run build`.
- **SC-006**: Type checking passes with `npm run typecheck`.
- **SC-007**: Code linting passes with `npm run lint`.
- **SC-008**: Docker image builds successfully.
- **SC-009**: Container starts and application functions correctly.

---

_End of specification_
