# Data Model: NestJS Migration

**Feature**: Migrate from Fastify to NestJS  
**Date**: 2026-03-13

> Note: This migration does not change the data model. The database schema remains unchanged (Drizzle ORM schema in `src/db/schema/`).

## Existing Schema

### Wishlist

| Field     | Type          | Description             |
| --------- | ------------- | ----------------------- |
| id        | string (UUID) | Primary key             |
| title     | string        | Wishlist title          |
| slugText  | string        | URL-friendly identifier |
| public    | boolean       | Visibility flag         |
| createdAt | datetime      | Creation timestamp      |
| updatedAt | datetime      | Last update timestamp   |

### WishlistItem

| Field      | Type              | Description             |
| ---------- | ----------------- | ----------------------- |
| id         | string (UUID)     | Primary key             |
| wishlistId | string (UUID)     | Foreign key to wishlist |
| title      | string            | Item title              |
| link       | string (nullable) | External URL            |
| bought     | boolean           | Purchase status         |
| createdAt  | datetime          | Creation timestamp      |
| updatedAt  | datetime          | Last update timestamp   |

## NestJS DTOs

### CreateWishlistDto

```typescript
class CreateWishlistDto {
  title: string
  slugText: string
  public: boolean
}
```

### CreateWishlistItemDto

```typescript
class CreateWishlistItemDto {
  title: string
  link?: string
}
```

### UpdateWishlistDto

```typescript
class UpdateWishlistDto {
  title?: string
  public?: boolean
}
```

### UpdateWishlistItemDto

```typescript
class UpdateWishlistItemDto {
  title?: string
  link?: string
  bought?: boolean
}
```

---

_End of data model_
