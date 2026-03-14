<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: IV. API-First Design, V. Technology Standards
- Added sections: None
- Removed sections: None
- Templates requiring updates: None
- Follow-up TODOs: None
-->

# Wishlist App Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

TDD mandatory: Tests written → User approved → Tests fail → Then implement. Unit tests with Vitest for composables and utilities. E2E tests with Playwright for user journeys. Red-Green-Refactor cycle strictly enforced. No implementation without failing test first.

### II. Strict TypeScript

Strict mode enabled in tsconfig.json at all times. Explicit types required for function parameters and return values. Interface usage for object shapes, type for unions/aliases. No implicit any, no type assertions to bypass type checking.

### III. Component Composition

Vue Composition API with `<script setup lang="ts">` required for all components. Reusable composables for shared logic extraction. Props defined with `defineProps<{...}>()` with explicit typing. Single responsibility per component.

### IV. API-First Design

RESTful endpoints with Zod schemas for request/response validation. NestJS exception filters and pipes for validation. Protected routes require API key authentication via ApiKeyGuard. DTOs with class-validator. Repository pattern for database operations.

### V. Internationalization First

All user-facing strings MUST use Vue I18n keys. Support English and German locales from the start. New features require i18n keys before implementation. No hardcoded strings in components.

## Technology Standards

**Stack**: Vue 3 + NestJS full-stack application with Drizzle ORM and SQLite. Frontend: Vue Router, Vue I18n, Tailwind CSS. Backend: NestJS with DTOs, Guards, Services, Repository pattern. Testing: Vitest (unit + API), Playwright (E2E).

**Code Style**: 2-space indentation, single quotes, trailing commas in ES5 contexts. Prettier formatting enforced. ESLint with auto-fix. Named exports for composables (use prefix). Path alias @/ for src-relative imports.

**CSS/Tailwind**: Use Tailwind CSS utility classes exclusively. Follow default class ordering. Dark mode support via dark: modifier. Avoid custom CSS; prefer utility classes.

**Database**: Drizzle ORM with SQLite. Schema defined in src/db/schema/. Tables auto-created on app start via `migrate()` - works with Docker Volumes. Migration files in drizzle/ directory.

## Development Workflow

**Quality Gates**: All PRs must pass lint (`npm run lint`) and typecheck (`npm run typecheck`) before merge. Tests must pass (`npm run test:unit`, `npm run test:api` and `npm run test:e2e`). Pre-commit hooks enforce these checks.

**Docker Testing (Required)**: Before merging any database-related changes, Docker tests MUST be executed:

1. Test with existing/old database (migrated data)
2. Test with fresh/empty database (new volume)
   Both scenarios must work correctly to prevent production issues.

**Feature Process**: User stories defined in spec.md with priorities (P1, P2, P3). Each story independently testable and deployable. Tasks organized by user story in tasks.md. Tests written before implementation.

**Code Review**: All changes require review. Verify compliance with constitution principles. Complexity must be justified if violating constitutional constraints.

## Governance

Constitution supersedes all other practices. Amendments require: (1) documentation of change, (2) rationale for change, (3) update to version following semantic versioning. Major version: backward-incompatible changes. Minor version: new principles or expanded guidance. Patch version: clarifications and typo fixes.

### Release Process

This project uses Semantic Versioning and tag-based releases:

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (x.y.0): New features, backward compatible
- **PATCH** (x.y.z): Bug fixes

Release workflow triggers on GitHub Release (not on git tags directly). Version management via npm:

**Never edit package.json manually for releases.** Use npm scripts which handle both version bump AND git tag creation:

- `npm run release:patch` - Patch release (x.y.z → x.y.z+1)
- `npm run release:minor` - Minor release (x.y.z → x+1.y.0)
- `npm run release:major` - Major release (x.y.z → x+1.0.0)
- `npm run release:pre` - Prerelease (e.g., x.y.z → x.y.z-beta.1)

The npm version command automatically:

1. Updates version in package.json
2. Creates a git commit with message "x.y.z"
3. Creates a git tag (vX.Y.Z)

After running the npm script, create the GitHub Release using gh cli:

1. Create detailed release notes using `git diff vX.Y.Z...HEAD` to see what changed
2. Release notes MUST include:
   - What's new (new features)
   - Bug fixes
   - Breaking changes (if any)
   - Upgrade notes for users
3. Create release: `gh release create vX.Y.Z --title "Release vX.Y.Z" --notes "..."`

All team members responsible for constitution compliance. Use this document for runtime development guidance. Reference AGENTS.md for detailed development commands.

**Version**: 1.1.0 | **Ratified**: 2026-03-11 | **Last Amended**: 2026-03-13
