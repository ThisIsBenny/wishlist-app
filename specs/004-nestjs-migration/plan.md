# Implementation Plan: Migrate from Fastify to NestJS

**Branch**: `004-nestjs-migration` | **Date**: 2026-03-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-nestjs-migration/spec.md`

## Summary

Migrate the backend from Fastify to NestJS while maintaining identical API interface and frontend serving capabilities. Follow NestJS module pattern (Modules → Controllers → Services → Repositories). Migrate Fastify-specific tests to NestJS testing utilities. Non-Fastify tests remain unchanged.

## Technical Context

**Language/Version**: Node.js v22.22.1, TypeScript ~5.7.3  
**Primary Dependencies**: NestJS 11.x (@nestjs/core, @nestjs/common, @nestjs/platform-express, @nestjs/testing, @nestjs/config, @nestjs/throttler, @nestjs/swagger) replacing Fastify packages  
**Storage**: SQLite with Drizzle ORM (existing, unchanged)  
**Testing**: Vitest (unit), Playwright (E2E) - existing, NestJS testing patterns  
**Target Platform**: Linux server  
**Project Type**: Full-stack web service (backend framework migration)  
**Performance Goals**: Maintain current response times (API < 200ms)  
**Constraints**: API interface unchanged, frontend served via backend, single container  
**Scale/Scope**: Single application, no user scaling changes

## Constitution Check

| Gate                   | Status      | Notes                                                                          |
| ---------------------- | ----------- | ------------------------------------------------------------------------------ |
| Test-First Development | ⚠ Justified | Existing tests will be migrated to NestJS patterns; E2E tests remain unchanged |
| Strict TypeScript      | ✓ Pass      | NestJS with TypeScript strict mode maintained                                  |
| Component Composition  | ✓ Pass      | Vue frontend unchanged                                                         |
| API-First Design       | ✓ Pass      | RESTful endpoints preserved with same contracts                                |
| i18n                   | ✓ Pass      | Unchanged                                                                      |
| Quality Gates          | ✓ Pass      | lint/typecheck/tests must pass post-migration                                  |

## Project Structure

### Documentation (this feature)

```text
specs/004-nestjs-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts preserved)
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/                 # [TO BE REPLACED] Fastify backend
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── __tests__/
│   ├── app.ts
│   └── server.ts
├── db/                  # [UNCHANGED] Database schema
│   └── schema/
├── components/          # [UNCHANGED] Vue components
├── composables/         # [UNCHANGED] Vue composables
├── config/             # [UNCHANGED] App config
├── router/             # [UNCHANGED] Vue Router
├── views/              # [UNCHANGED] Page components
├── static/             # [UNCHANGED] Built frontend assets
├── App.vue
└── main.ts
```

**Structure Decision**: Replace `src/api/` contents with NestJS structure while keeping same relative paths for imports. Database, frontend, and all other directories remain unchanged.

### New NestJS Structure (src/api/)

```text
src/api/
├── main.ts              # NestJS bootstrap
├── app.module.ts        # Root module
├── wishlist/            # Wishlist feature module
│   ├── wishlist.module.ts
│   ├── wishlist.controller.ts
│   ├── wishlist.service.ts
│   └── wishlist.repository.ts
├── config/              # App configuration
│   ├── app.config.ts
│   └── cors.config.ts
├── auth/                # Authentication
│   └── auth.guard.ts
├── common/              # Shared utilities
│   ├── dto/
│   └── decorators/
└── __tests__/           # NestJS tests
    ├── wishlist.controller.spec.ts
    └── wishlist.service.spec.ts
```

## Complexity Tracking

| Violation          | Why Needed                                 | Simpler Alternative Rejected Because                    |
| ------------------ | ------------------------------------------ | ------------------------------------------------------- |
| Repository pattern | NestJS best practice for data access layer | Direct service-to-Drizzle coupling not idiomatic NestJS |

---

## Phase 0: Research (skipped - no NEEDS CLARIFICATION)

No unresolved technical questions. Migration approach is well-defined.

## Phase 1: Design & Contracts

### Data Model

Existing data model unchanged (Drizzle ORM schema in `src/db/schema/`):

- `wishlists` table
- `wishlist_items` table

### API Contracts

Existing API interface preserved:

| Method | Endpoint                                    | Auth     | Description              |
| ------ | ------------------------------------------- | -------- | ------------------------ |
| GET    | /api/wishlist                               | Optional | Get all public wishlists |
| GET    | /api/wishlist/:slugText                     | Optional | Get wishlist by slug     |
| POST   | /api/wishlist                               | Required | Create wishlist          |
| POST   | /api/wishlist/:slugText/item                | Required | Add item to wishlist     |
| PATCH  | /api/wishlist/:slugText                     | Required | Update wishlist          |
| PATCH  | /api/wishlist/:slugText/item/:itemId        | Required | Update item              |
| PATCH  | /api/wishlist/:slugText/item/:itemId/bought | Required | Mark item as bought      |
| DELETE | /api/wishlist/:slugText                     | Required | Delete wishlist          |
| DELETE | /api/wishlist/:slugText/item/:itemId        | Required | Delete item              |
| GET    | /utils/fetchmetadata                        | Required | Fetch OpenGraph metadata |
| GET    | /healthz                                    | No       | Health check             |
| GET    | /\*                                         | No       | Serve frontend           |

### Quickstart

1. Install NestJS dependencies
2. Create NestJS module structure
3. Migrate routes to controllers
4. Migrate services to NestJS services
5. Migrate Fastify tests to NestJS tests
6. Update server entry point
7. Run tests and verify

---

_Plan complete. Proceed to `/speckit.tasks` for task breakdown._
