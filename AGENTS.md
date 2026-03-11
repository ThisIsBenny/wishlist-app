# AGENTS.md - Developer Guide for Wishlist App

This document provides essential information for agents working on the Wishlist App codebase.

## Project Overview

- **Type**: Full-stack Vue 3 + Fastify application
- **Frontend**: Vue 3 with Composition API, Vue Router, Vue I18n
- **Backend**: Fastify (Node.js) with Prisma ORM
- **Database**: SQLite (via Prisma)
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
npm run build:backend   # Prisma generate + tsc to dist/
npm run preview       # Preview production build on port 5050
npm run demo          # Build + reset DB + start server
```

### Testing

```bash
npm run test:unit           # Run unit tests (watch mode)
npm run test:unit:ci        # Run tests in CI mode (single run)
npm run test:api             # Run API handler tests
npm run test:e2e             # Run Playwright E2E tests
npm run test:e2e:ui          # Run E2E tests with UI
npm run coverage            # Run tests with coverage report
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

- Use Fastify's built-in error handling with schemas
- Validate request/response payloads with JSON schemas
- Return appropriate HTTP status codes (201 for created, 404 for not found)
- Use try/catch for async operations in route handlers

### API Routes

- Define routes in `src/api/routes/`
- Use route options object pattern with `method`, `url`, `schema`, `handler`
- Mark protected routes with `config: { protected: true }`
- Use Prisma models in `src/api/models/` for database operations

### CSS/Tailwind

- Use Tailwind CSS utility classes
- Follow Tailwind's default class ordering (component internal first)
- Use `dark:` modifier for dark mode variants
- Avoid custom CSS; prefer utility classes

### Testing

- Place tests in `__tests__/` directories alongside source files
- API handler tests in `src/api/__tests__/handlers/`
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
├── api/               # Fastify backend
│   ├── config/        # App config, schemas, errors
│   ├── models/        # Prisma models
│   ├── routes/        # API endpoints
│   │   ├── utils/     # Utility routes (fetchmetadata)
│   │   └── wishlist/  # Wishlist CRUD routes
│   └── services/       # Business logic (Prisma client)
├── components/         # Vue components
│   └── icons/         # Icon components
├── composables/       # Vue composables (hooks)
├── config/            # App configuration (i18n)
├── router/            # Vue Router config
├── types.ts           # Shared TypeScript types
├── views/             # Page-level Vue components
├── App.vue            # Root component
└── main.ts           # App entry point
```

## Environment

- Node.js version specified in `.nvmrc` (currently v22.22.1)
- Use `nvm use` to switch to the correct Node version
- Copy `.env.template` to `.env` for local development
- Database schema managed via Prisma in `prisma/schema.prisma`

### Important: Use nvm for Node.js

```bash
# Activate correct Node.js version
nvm use

# Or manually
nvm install 18
nvm use 18
```

Note: Tests and build require Node.js >= 18.18.0 (Prisma requirement)

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

- Node.js 22.x (upgrading from v22.22.1) + npm packages (same as current, no changes) (001-nodejs-22-upgrade)
- N/A (configuration-only change) (001-nodejs-22-upgrade)

## Recent Changes

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
