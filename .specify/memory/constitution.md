<!--
Sync Impact Report:
- Version change: N/A → 1.0.0 (initial version)
- Modified principles: None (all new)
- Added sections: Technology Standards, Development Workflow
- Removed sections: None
- Templates requiring updates: ⚠ pending review
  - .specify/templates/plan-template.md (Constitution Check section references constitution)
  - .specify/templates/spec-template.md (no direct references)
  - .specify/templates/tasks-template.md (no direct references)
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

RESTful endpoints with JSON schemas for request/response validation. Fastify built-in error handling with appropriate HTTP status codes (201 created, 404 not found). Protected routes require API key authentication. Contract tests verify API contracts.

### V. Internationalization First

All user-facing strings MUST use Vue I18n keys. Support English and German locales from the start. New features require i18n keys before implementation. No hardcoded strings in components.

## Technology Standards

**Stack**: Vue 3 + Fastify full-stack application with Drizzle ORM and SQLite. Frontend: Vue Router, Vue I18n, Tailwind CSS. Testing: Vitest (unit), Playwright (E2E).

**Code Style**: 2-space indentation, single quotes, trailing commas in ES5 contexts. Prettier formatting enforced. ESLint with auto-fix. Named exports for composables (use prefix). Path alias @/ for src-relative imports.

**CSS/Tailwind**: Use Tailwind CSS utility classes exclusively. Follow default class ordering. Dark mode support via dark: modifier. Avoid custom CSS; prefer utility classes.

**Database**: Drizzle ORM with SQLite for development. Schema defined in src/db/schema/. Models use existing database tables (PascalCase for backward compatibility with Prisma).

## Development Workflow

**Quality Gates**: All PRs must pass lint (`npm run lint`) and typecheck (`npm run typecheck`) before merge. Tests must pass (`npm run test:unit` and `npm run test:e2e`). Pre-commit hooks enforce these checks.

**Docker Testing (Required)**: Before merging any database-related changes, Docker tests MUST be executed:
1. Test with existing/old database (Prisma-migrated data)
2. Test with fresh/empty database
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

Release workflow triggers on `v*` tags. To release:
1. Update version in `package.json`
2. Commit with message "release: vX.Y.Z"
3. Tag and push: `git tag vX.Y.Z && git push origin vX.Y.Z`

All team members responsible for constitution compliance. Use this document for runtime development guidance. Reference AGENTS.md for detailed development commands.

**Version**: 1.0.0 | **Ratified**: 2026-03-11 | **Last Amended**: 2026-03-11
