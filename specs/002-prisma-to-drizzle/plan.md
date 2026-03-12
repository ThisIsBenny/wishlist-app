# Implementation Plan: Migrate from Prisma to Drizzle

**Branch**: `002-prisma-to-drizzle` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-prisma-to-drizzle/spec.md`

## Summary

Migrate the database layer from Prisma ORM to Drizzle ORM while maintaining full backward compatibility with existing SQLite databases. The application currently uses Prisma with SQLite - this will be replaced with Drizzle using better-sqlite3 driver. All CRUD operations must continue to work identically.

## Technical Context

**Language/Version**: Node.js v22.22.1  
**Primary Dependencies**: Drizzle ORM v0.45.1, drizzle-kit v0.31.9, better-sqlite3  
**Storage**: SQLite (existing database at data/data.db)  
**Testing**: Vitest (unit), Playwright (E2E)  
**Target Platform**: Linux server, Docker container  
**Project Type**: Full-stack web application (Vue 3 + Fastify)  
**Performance Goals**: Lighter-weight ORM with better performance than Prisma  
**Constraints**: Must maintain backward compatibility with existing database files  
**Scale/Scope**: Replace Prisma across all API routes and models

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                       | Status   | Notes                                                      |
| ------------------------------- | -------- | ---------------------------------------------------------- |
| I. Test-First Development       | PASS     | Migration must pass all existing tests                     |
| II. Strict TypeScript           | PASS     | Drizzle supports TypeScript                                |
| III. Component Composition      | N/A      | No frontend changes                                        |
| IV. API-First Design            | PASS     | API layer unchanged, only data access changes              |
| V. Internationalization First   | N/A      | No i18n changes                                            |
| Technology Standards - Database | CONFLICT | Constitution mentions Prisma - will update after migration |

**Gate Decision**: Tests must pass. The Constitution's Technology Standards section will need updating to reflect Drizzle instead of Prisma after successful migration.

## Project Structure

### Documentation (this feature)

```text
specs/002-prisma-to-drizzle/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

This is a data layer replacement. Key files to modify:

```text
src/api/
├── models/              # Replace Prisma models with Drizzle schemas
├── services/            # Update data access layer
└── server.ts            # Update Prisma client initialization

prisma/
└── schema.prisma       # To be replaced with Drizzle schema

package.json             # Replace Prisma dependencies with Drizzle
drizzle.config.ts        # New Drizzle configuration
```

**Structure Decision**: Replace Prisma models in src/api/models/ with Drizzle schema and queries. Remove prisma/ directory after migration.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity violations. This is a direct ORM replacement with same database backend (SQLite).

---

# Phase 0: Research

## Research Tasks

1. **Drizzle ORM version**: Determine latest stable Drizzle version
2. **Drizzle SQLite driver**: Compare better-sqlite3 vs libSQL for this use case
3. **Schema translation**: Map Prisma schema to Drizzle schema
4. **Query migration**: Identify patterns for Prisma → Drizzle query conversion
5. **Migration tooling**: Verify drizzle-kit can handle SQLite migrations

### Known Prisma Schema (to translate)

```prisma
model Wishlist {
  id            String    @id @default(uuid())
  public        Boolean   @default(true)
  title         String
  imageSrc      String
  slugUrlText   String    @unique
  description   String    @default("")
  items         Item[]
}

model Item {
  id          Int       @id @default(autoincrement())
  title       String
  url         String    @default("")
  imageSrc    String    @default("")
  description String
  bought      Boolean   @default(false)
  wishlist    Wishlist  @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  wishlistId  String
}
```

## Research Findings

[To be completed during Phase 0]

---

# Phase 1: Design & Contracts

## Data Model

[To be generated from research - will map Prisma models to Drizzle schemas]

### Wishlist Entity

| Field       | Type    | Constraints       |
| ----------- | ------- | ----------------- |
| id          | string  | uuid, primary key |
| public      | boolean | default true      |
| title       | string  | required          |
| imageSrc    | string  |                   |
| slugUrlText | string  | unique            |
| description | string  | default ""        |

### Item Entity

| Field       | Type    | Constraints                 |
| ----------- | ------- | --------------------------- |
| id          | integer | auto-increment, primary key |
| title       | string  | required                    |
| url         | string  | default ""                  |
| imageSrc    | string  | default ""                  |
| description | string  | required                    |
| bought      | boolean | default false               |
| wishlistId  | string  | foreign key → Wishlist.id   |

## Contracts

No external contracts. This is an internal data layer migration.

## Quickstart

After migration, development commands remain the same:

- `npm run dev` - Start development server
- `npm run test:unit:ci` - Run unit tests
- `npm run test:e2e` - Run E2E tests

---

## Phase 1 Complete

- research.md: To be generated
- data-model.md: To be generated
- Quickstart: No changes to developer workflow
- Agent context: Update after plan completion

**Constitution Check Re-evaluation**: After migration, Technology Standards section will be updated to reflect Drizzle instead of Prisma.
