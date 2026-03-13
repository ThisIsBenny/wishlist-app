# Quickstart: NestJS Migration

**Feature**: Migrate from Fastify to NestJS  
**Date**: 2026-03-13

## Prerequisites

- Node.js v22.22.1 (via nvm)
- npm dependencies installed

## Migration Steps

### 1. Install NestJS Dependencies

```bash
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/config @nestjs/serve-static @nestjs/compress @nestjs/cors @nestjs/throttler @nestjs/swagger class-validator class-transformer
npm install -D @nestjs/cli @nestjs/testing
```

### 2. Create NestJS Structure

Replace `src/api/` with NestJS structure:

```
src/api/
├── main.ts
├── app.module.ts
├── wishlist/
│   ├── wishlist.module.ts
│   ├── wishlist.controller.ts
│   ├── wishlist.service.ts
│   └── wishlist.repository.ts
└── config/
    └── app.config.ts
```

### 3. Migrate Routes to Controllers

Map each Fastify route handler to a NestJS controller method:

| Fastify Route              | NestJS Controller    |
| -------------------------- | -------------------- |
| GET /wishlist              | @Get()               |
| GET /wishlist/:slugText    | @Get(':slugText')    |
| POST /wishlist             | @Post()              |
| PATCH /wishlist/:slugText  | @Patch(':slugText')  |
| DELETE /wishlist/:slugText | @Delete(':slugText') |

### 4. Migrate Services

- Wrap existing service logic in NestJS service classes
- Use `@Injectable()` decorator
- Preserve existing business logic (Drizzle queries, etc.)

### 5. Migrate Authentication

- Create `ApiKeyGuard` using NestJS `@Guard()` decorator
- Apply with `@UseGuards(ApiKeyGuard)` on protected routes

### 6. Migrate Tests

Convert Fastify handler tests to NestJS controller/service tests:

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { WishlistController } from './wishlist.controller'
import { WishlistService } from './wishlist.service'

describe('WishlistController', () => {
  let controller: WishlistController
  let service: WishlistService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [WishlistService],
    }).compile()

    controller = module.get<WishlistController>(WishlistController)
    service = module.get<WishlistService>(WishlistService)
  })
  // ... tests
})
```

### 7. Update Server Entry Point

Replace `src/api/server.ts` with NestJS bootstrap:

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // CORS, compression, static files configuration
  await app.listen(process.env.PORT || 5000)
}
bootstrap()
```

### 8. Verify

Run tests and verify everything works:

```bash
npm run lint
npm run typecheck
npm run test:unit:ci
npm run test:e2e
```

## Rollback Plan

If issues arise:

1. Keep Fastify code in separate branch
2. Revert `src/api/` changes
3. E2E tests should pass without modification

---

_End of quickstart_
