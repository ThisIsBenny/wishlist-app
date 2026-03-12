# Research: Migrate from Prisma to Drizzle

## Decision: Use Drizzle ORM

**Rationale**: Drizzle is a lightweight, type-safe ORM that is significantly lighter than Prisma. It provides:

- Better performance (smaller bundle, faster cold starts)
- Full TypeScript support with type inference
- SQL-like query syntax (familiar to developers)
- SQLite support via better-sqlite3 or libSQL

**Alternatives considered**:

- Staying with Prisma (rejected - want lighter alternative)
- Using raw SQL (rejected - loses type safety and developer experience)

## Drizzle Version

**Decision**: Use Drizzle ORM v0.45.1 (latest as of 2026-03-11)

**Rationale**: Drizzle is actively maintained. Latest stable version provides best performance and bug fixes. Check npm for newer versions before implementation.

## SQLite Driver

**Decision**: Use `better-sqlite3`

**Rationale**:

- Synchronous driver, very fast
- Works well with Drizzle
- No WASM dependency (simpler deployment)

**Alternatives considered**:

- libSQL (Turso) - Good but requires extra setup
- sql.js - In-browser only, not suitable for this use case

## Schema Translation

The Prisma schema maps directly to Drizzle:

```typescript
// Drizzle schema (equivalent to Prisma)

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const wishlists = sqliteTable('wishlists', {
  id: text('id').primaryKey(),
  public: integer('public', { mode: 'boolean' }).default(true),
  title: text('title').notNull(),
  imageSrc: text('image_src').default(''),
  slugUrlText: text('slug_url_text').unique().notNull(),
  description: text('description').default(''),
})

export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  url: text('url').default(''),
  imageSrc: text('image_src').default(''),
  description: text('description').notNull(),
  bought: integer('bought', { mode: 'boolean' }).default(false),
  wishlistId: text('wishlist_id').references(() => wishlists.id, {
    onDelete: 'cascade',
  }),
})
```

### Key Differences

| Prisma              | Drizzle                        |
| ------------------- | ------------------------------ |
| `String`            | `text()`                       |
| `Boolean`           | `integer({ mode: 'boolean' })` |
| `Int`               | `integer()`                    |
| `@default(uuid())`  | Handled in application code    |
| `@relation`         | Foreign key references         |
| `onDelete: Cascade` | `{ onDelete: 'cascade' }`      |

## Query Migration

Prisma queries translate to Drizzle as follows:

```typescript
// Prisma
const wishlists = await prisma.wishlist.findMany()

// Drizzle
const wishlists = await db.select().from(wishlistsTable)
```

```typescript
// Prisma
const wishlist = await prisma.wishlist.create({
  data: { title: 'My List', ... }
});

// Drizzle
const wishlist = await db.insert(wishlistsTable).values({ title: 'My List', ... });
```

## Migration Strategy

1. Install Drizzle dependencies alongside Prisma initially
2. Create Drizzle schema and client
3. Update service layer to use Drizzle queries
4. Remove Prisma dependencies after verification
5. Run all tests to ensure compatibility

## Backward Compatibility

Existing SQLite databases will work with Drizzle because:

- Same SQLite file format
- Same schema structure (tables and columns)
- Drizzle can connect to existing database without migration

**Decision**: No data migration script needed - Drizzle connects directly to existing SQLite files.
