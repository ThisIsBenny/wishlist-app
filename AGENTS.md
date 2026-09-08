# AGENTS.md — Wishlist App

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Vue 3 (Composition API, `<script setup>`), Vue Router, Vue I18n, Tailwind CSS |
| **Backend** | NestJS 11, Drizzle ORM, SQLite (better-sqlite3) |
| **Auth** | JWT (HTTP-only cookies, SameSite=Strict, Secure), bcrypt (SALT_ROUNDS=12), OpenID Connect |
| **Testing** | Vitest (unit + API), Playwright (E2E) |
| **CI/CD** | GitHub Actions, Docker Buildx, ghcr.io |
| **Runtime** | Node.js >= 22.22.1 |

## Commands

```bash
npm run dev              # Frontend + backend concurrently
npm run dev:frontend     # Vite dev server only
npm run dev:backend      # Nodemon (backend watch mode)
npm run build            # Frontend + backend
npm run preview          # Production build on port 5050
npm run demo             # Build + reset DB + start server
npm run test:unit        # Unit tests
npm run test:api         # NestJS handler tests (NODE_ENV=test)
npm run test:e2e         # Playwright
npm run lint             # ESLint with auto-fix
npm run typecheck        # vue-tsc
npm run coverage         # Coverage report
```

**Single test:** `npx vitest run src/composables/__tests__/useModal.test.ts`

## Code Conventions

### Formatting
- 2-space indent, single quotes, no semicolons, trailing commas (ES5)
- Prettier configured in `.prettierrc` — run `npm run lint` before committing

### TypeScript
- Strict mode, explicit return types on functions
- `interface` for object shapes, `type` for unions/aliases
- Use `@/` path alias for src-relative imports (e.g. `@/composables/useAuth`)
- Import order: external → internal modules → local components

### Vue
- Composition API with `<script setup lang="ts">`
- `defineProps<{...}>()` for typed props
- Components auto-imported via `unplugin-vue-components`
- Tailwind utility classes only (no custom CSS)

### Naming
- **Components**: PascalCase (`WishlistItem.vue`)
- **Composables**: camelCase with `use` prefix (`useAuth.ts`)
- **Types/Interfaces**: PascalCase (`Wishlist`, `WishlistItem`)
- **Files**: kebab-case (`wishlist-request.schema.ts`)
- **Named exports** for composables (`export const useAuth = ...`)

### Backend Architecture
```
Controller → Service → Repository → Drizzle ORM → SQLite
```
- Controllers handle HTTP, validation, auth guards — no business logic
- Services handle business rules, ownership checks, authorization
- Repositories handle DB queries only — no business logic
- DTOs defined with `nestjs-zod` (`createZodDto`), validated by `ZodValidationPipe` (global)
- Protected routes use `@UseGuards(JwtAuthGuard)`, public routes use `@Public()`

### Authentication Model
- JWT sessions stored in `sessions` table (7-day expiry, revoked on logout)
- Cookies: `access_token` (httpOnly) + `session_expiry` (readable by frontend)
- `JwtAuthGuard` is a global `APP_GUARD` — every route requires auth unless marked `@Public()`
- `@CurrentUser()` decorator extracts JWT payload (`sub`, `email`, `jti`)
- OIDC providers configured via `OIDC_<ID>_*` env vars, auto-discovered on startup
- Rate-limited auth endpoints (3 req/min register, 5 req/min login)
- Email/password toggleable via `AUTH_EMAIL_LOGIN_ENABLED` / `AUTH_EMAIL_REGISTER_ENABLED`

### Testing
- Co-locate tests: `src/composables/useAuth.ts` → `src/composables/__tests__/useAuth.test.ts`
- API tests: `src/api/__tests__/wishlist.e2e.test.ts`
- Use `describe`/`it`/`expect` from Vitest
- Mock repos in service tests (`createMockRepo()` factory pattern in wishlist service tests)

## Boundaries

- **Never** read or expose `.env` files, `data/` directory, or secrets
- **Never** modify `package.json` version manually — use `npm run release:*` scripts
- **Never** add dependencies without checking: does existing stack solve this? Is it maintained? License compatible?
- **Never** modify database schema without `drizzle-kit` migrations
- **Ask** before changing Docker workflows, CI/CD config, or release process
- **Run** `npm run lint && npm run typecheck` before committing

## Patterns

### Controller (NestJS)
```typescript
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateWishlistDto,
    @CurrentUser('sub') userId: string
  ) {
    return await this.wishlistService.create(dto, userId)
  }
}
```

### Service with ownership check
```typescript
async updateItem(itemId: number, payload: Partial<WishlistItem>, userId?: string) {
  const item = await this.repository.findItemById(itemId)
  if (!item) throw new NotFoundException('Item not found')
  if (userId) {
    const wishlist = await this.repository.findById(item.wishlistId)
    if (wishlist && wishlist.userId !== userId) throw new ForbiddenException('Access denied')
  }
  return await this.repository.updateItem(itemId, payload)
}
```

### Repository
```typescript
async findById(id: string): Promise<Wishlist | undefined> {
  const result = await this.db.select().from(wishlists).where(eq(wishlists.id, id)).get()
  if (!result) return undefined
  return mapWishlist(result)
}
```

### Composable (Vue)
```typescript
import { ref } from 'vue'

const isAuthenticated = ref(false)

export const useAuth = () => {
  return { isAuthenticated, login, register, logout }
}
```

## Directory Map

```
src/
├── api/               # NestJS backend
│   ├── auth/          # JWT, OIDC, guards, decorators
│   ├── config/        # Zod-validated env config
│   ├── health/        # Health check endpoint
│   ├── migrations/    # Drizzle migration runner
│   ├── utils/         # Metadata extraction pipeline
│   ├── wishlist/      # Controller, service, repository, DTOs
│   ├── filters/       # Global exception filter
│   ├── database.module.ts
│   └── main.ts        # NestJS bootstrap
├── components/        # Vue components (auto-imported)
│   └── icons/         # SVG icon components
├── composables/       # Vue composables
├── config/            # i18n, api base URL
├── db/schema/         # Drizzle table definitions
├── router/            # Vue Router config
├── views/             # Page-level Vue components
├── types.ts           # Shared TS interfaces
├── App.vue            # Root component
└── main.ts            # Vue entry point
```

## Release

- **Never** edit `package.json` version manually — use `npm run release:patch|minor|major|pre`
- Tags are auto-created by npm version commands
- Create GitHub Release after tag: `gh release create vX.Y.Z --title "Release vX.Y.Z" --notes "..."`

## Environment

- Node.js: `.nvmrc` (v22.22.1) — ensure active before npm commands
- Copy `.env.template` → `.env` for local dev
- DB auto-created on app start via `migrate()`
- CORS: localhost only — use `http://localhost:5000` (not `127.0.0.1`)
- Overrides: `cheerio@1.0.0-rc.12`, `undici@6.14.1`, `@vueuse/core@^10`
