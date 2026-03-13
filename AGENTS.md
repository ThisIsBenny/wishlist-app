# AGENTS.md - Developer Guide for Wishlist App

This document provides essential information for agents working on the Wishlist App codebase.

## Project Overview

- **Type**: Full-stack Vue 3 + NestJS application
- **Frontend**: Vue 3 with Composition API, Vue Router, Vue I18n
- **Backend**: NestJS (Node.js) with Drizzle ORM
- **Database**: SQLite (via Drizzle)
- **Testing**: Vitest + Playwright
- **Node.js**: >= 22.22.1

## Build, Lint, and Test Commands

### Development

```bash
npm run dev           # Run frontend + backend concurrently
npm run dev:frontend # Run Vite dev server only
npm run dev:backend  # Run nodemon for backend (watch mode)
```

### Building

```bash
npm run build         # Build both frontend + backend
npm run build:frontend  # Vite build to dist/static
npm run build:backend   # Drizzle generate + tsc to dist/
npm run preview       # Preview production build on port 5050
npm run demo          # Build + reset DB + start server
```

### Testing

```bash
npm run test:unit           # Run unit tests (single run)
npm run test:unit:watch     # Run unit tests (watch mode)
npm run test:api            # Run API tests (NestJS handler tests)
npm run test:e2e            # Run Playwright E2E tests
npm run test:e2e:ui         # Run E2E tests with UI
npm run coverage             # Run tests with coverage report
```

#### Running a Single Test

```bash
# Singlepx vitest run test file
n src/composables/__tests__/useModal.test.ts

# Single test by name
npx vitest run -t "useModal"

# Single E2E test
npx playwright test e2e/auth.spec.ts --grep "login"
```

### Linting and Type Checking

```bash
npm run lint        # ESLint with auto-fix
npm run typecheck   # vue-tsc type checking
```

Run both before committing:

```bash
npm run lint && npm run typecheck
```

## Code Style Guidelines

### Formatting

- **2 spaces** for indentation (enforced by .editorconfig)
- **Single quotes** for strings (no semicolons)
- **Trailing commas** in ES5 contexts
- Use **Prettier** for all formatting (configured in .prettierrc)

### TypeScript

- Strict mode enabled in tsconfig.json
- Always use explicit types for function parameters and return values
- Use `interface` for object shapes, `type` for unions/aliases

### Vue Components

- Use **Composition API** with `<script setup lang="ts">`
- Define props with `defineProps<{...}>()` and typed refs
- Use auto-imported components from `unplugin-vue-components`

### Imports

- Use path alias `@/` for src-relative imports (e.g., `@/composables/useAuth`)
- Group imports: external libraries -> internal modules -> local components
- Use named exports for composables (e.g., `export const useAuth = ...`)

### Naming Conventions

- **Components**: PascalCase (e.g., `WishlistItem.vue`, `CreateWishlistTile.vue`)
- **Composables**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useWishlistsStore.ts`)
- **Types/Interfaces**: PascalCase (e.g., `Wishlist`, `WishlistItem`)
- **Files**: kebab-case (e.g., `wishlist-request.schema.ts`)

### Error Handling

- Use NestJS exception filters and pipes for validation
- Return appropriate HTTP status codes (201 for created, 404 for not found)
- Use try/catch for async operations in route handlers

### API Routes

- Define routes in `src/api/wishlist/` (controller pattern)
- Use DTOs with class-validator and Zod for validation
- Use NestJS guards for protected routes (ApiKeyGuard)
- Use repository pattern in `src/api/wishlist/` for database operations

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow Tailwind's default class ordering (component internal first)
- Use `dark:` modifier for dark mode variants
- Avoid custom CSS; prefer utility classes

### Testing

- Place tests in `__tests__/` directories alongside source files
- API handler tests in `src/api/__tests__/`
- Use `describe`, `it`, `expect` from Vitest
- Use `@vue/test-utils` with `shallowMount` for components
- Follow naming: `ComponentName.test.ts` or `composableName.test.ts`

### Git/Hooks

- Husky pre-commit and pre-push hooks are configured
- Run `npm run lint` and `npm run typecheck` before committing
- Use conventional commit messages (recommended)

## Project Structure

```
src/
├── api/               # NestJS backend
│   ├── auth/         # Authentication (ApiKeyGuard)
│   ├── config/       # App configuration
│   ├── database.module.ts  # Database module with Drizzle
│   ├── health/       # Health check endpoints
│   ├── main.ts       # NestJS entry point
│   ├── utils/        # Utility services (fetchmetadata)
│   └── wishlist/     # Wishlist controller, service, repository, DTOs
├── components/         # Vue components
│   └── icons/         # Icon components
├── composables/       # Vue composables (hooks)
├── config/            # App configuration (i18n)
├── router/            # Vue Router config
├── db/               # Drizzle database schema
│   └── schema/       # Table definitions
├── types.ts           # Shared TypeScript types
├── views/             # Page-level Vue components
├── App.vue            # Root component
└── main.ts           # Vue entry point
```

## Environment

- Node.js version specified in `.nvmrc` (currently v22.22.1)
- Copy `.env.template` to `.env` for local development
- Database schema managed via Drizzle in `src/db/schema/`
- Database tables are created automatically on app start via `migrate()` (works with Docker Volumes)
- For manual DB setup: run `npx drizzle-kit push` to create tables

### Important: Use nvm for Node.js

Always use the correct Node.js version from `.nvmrc`. The easiest way is to add this alias to your shell config (`~/.zshrc` or `~/.bashrc`):

```bash
# Add to ~/.zshrc or ~/.bashrc
alias node22='export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use'
```

Then before any npm commands:

```bash
# Source nvm and switch to correct Node version
node22

# Now run npm commands
npm install
npm run dev
```

Or chain it directly:

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use && npm install
```

**Note**: Always run `nvm use` before npm commands to ensure the correct Node version is active. Drizzle and better-sqlite3 require Node.js >= 22.22.1.

## Important Notes

### CORS

- CORS is configured to allow `localhost` origins only
- Use `http://localhost:5000` (not `127.0.0.1:5000`) in development

### Dependencies

- Some packages require specific overrides in package.json:
  - `cheerio`: 1.0.0-rc.12
  - `undici`: 6.14.1
  - `@vueuse/core`: 10.x (not 12.x)

### API Key

- Set via `API_KEY` environment variable
- Required for protected routes (create, update, delete)
- Default from `.env.template`: `TOP_SECRET`

## Active Technologies

- Node.js v22.22.1, TypeScript ~5.7.3 + NestJS 11.x (@nestjs/core, @nestjs/common, @nestjs/platform-express, @nestjs/testing, @nestjs/config, @nestjs/throttler, @nestjs/swagger) replacing Fastify packages (004-nestjs-migration)
- SQLite with Drizzle ORM + drizzle-kit für Migrationen (004-nestjs-migration)
- Database wird beim Start erstellt (migrate()) - funktioniert mit Docker Volumes (004-nestjs-migration)

- YAML (GitHub Actions syntax) + GitHub Actions, Docker Buildx, GitHub Container Registry (ghcr.io) (003-deploy-release-workflow)

- Node.js v22.22.1 + Drizzle ORM (latest), drizzle-kit (latest), better-sqlite3 (002-prisma-to-drizzle)
- SQLite (existing database at data/data.db) (002-prisma-to-drizzle)

- Node.js 22.x (upgrading from v22.22.1) + npm packages (same as current, no changes) (001-nodejs-22-upgrade)
- N/A (configuration-only change) (001-nodejs-22-upgrade)

## Recent Changes

- 004-nestjs-migration: Fastify → NestJS Migration mit Drizzle ORM, migrate() für DB-Setup
- 001-nodejs-22-upgrade: Added Node.js 22.x (upgrading from v22.22.1) + npm packages (same as current, no changes)

## Release Process

### Versioning

This project uses Semantic Versioning:

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (x.y.0): New features, backward compatible
- **PATCH** (x.y.z): Bug fixes

### Tag-Based Releases

Release workflow triggers on:

- Push to `release/*` branches
- Push of `v*` tags (e.g., `v1.6.0`)

### Release Steps

1. Ensure on main:

   ```bash
   git checkout main && git pull
   ```

2. Bump version in `package.json` (e.g., 1.5.1 → 1.6.0)

3. Commit and tag:
   ```bash
   git add package.json && git commit -m "release: v1.6.0"
   git tag v1.6.0 && git push origin v1.6.0
   ```

### Docker Tags Created

- `latest` - latest release
- `v1.6.0` - specific version

## GitHub Actions Workflows

This project uses GitHub Actions for CI/CD automation:

### CI Workflow (ci.yml)

Runs on every push to main branch and all feature branches, plus pull requests:

- **lint**: Runs `npm run lint` and `npm run typecheck`
- **test**: Runs `npm run test:unit` and `npm run test:api`
- **build-test**: Builds Docker image and verifies it starts successfully (without pushing)

### Release Workflow (release.yml)

Runs when a new GitHub Release is published:

- **lint-test**: Runs lint, typecheck, and unit tests
- **docker**: Builds multi-platform images (amd64, arm64), pushes to ghcr.io

**Triggering a Release:**

1. Update version in `package.json` (e.g., `1.2.0` or `1.0.0-beta.1`)
2. Create a release via GitHub UI or CLI:

   ```bash
   gh release create 1.2.0 --title "Version 1.2.0" --notes "Release notes"
   ```

**Image Tags:**

| Release Type              | Tags Applied                    |
| ------------------------- | ------------------------------- |
| Stable (1.2.0)            | `1.2.0`, `v1.2.0`, `latest`     |
| Prerelease (1.0.0-beta.1) | `1.0.0-beta.1`, `v1.0.0-beta.1` |

**Registry**: Images are pushed to GitHub Container Registry (ghcr.io)
