# API Contracts

> Note: API contracts remain unchanged from Fastify implementation.

## Wishlist API

| Method | Endpoint                                    | Auth               | Request Body            | Response         |
| ------ | ------------------------------------------- | ------------------ | ----------------------- | ---------------- |
| GET    | /api/wishlist                               | Optional           | -                       | `Wishlist[]`     |
| GET    | /api/wishlist/:slugText                     | Optional           | -                       | `Wishlist`       |
| POST   | /api/wishlist                               | Required (API Key) | `CreateWishlistDto`     | `Wishlist`       |
| POST   | /api/wishlist/:slugText/item                | Required (API Key) | `CreateWishlistItemDto` | `WishlistItem`   |
| PATCH  | /api/wishlist/:slugText                     | Required (API Key) | `UpdateWishlistDto`     | `Wishlist`       |
| PATCH  | /api/wishlist/:slugText/item/:itemId        | Required (API Key) | `UpdateWishlistItemDto` | `WishlistItem`   |
| PATCH  | /api/wishlist/:slugText/item/:itemId/bought | Required (API Key) | `{ bought: boolean }`   | `WishlistItem`   |
| DELETE | /api/wishlist/:slugText                     | Required (API Key) | -                       | `204 No Content` |
| DELETE | /api/wishlist/:slugText/item/:itemId        | Required (API Key) | -                       | `204 No Content` |

## Utils API

| Method | Endpoint                     | Auth               | Request Body | Response   |
| ------ | ---------------------------- | ------------------ | ------------ | ---------- |
| GET    | /utils/fetchmetadata?url=... | Required (API Key) | -            | `Metadata` |

## Health Check

| Method | Endpoint | Auth | Response           |
| ------ | -------- | ---- | ------------------ |
| GET    | /healthz | No   | `{ status: 'ok' }` |

## Static Files

| Method | Endpoint | Auth | Response              |
| ------ | -------- | ---- | --------------------- |
| GET    | /\*      | No   | Frontend static files |

## Response Schemas

### Wishlist

```json
{
  "id": "string",
  "title": "string",
  "slugText": "string",
  "public": true,
  "items": [
    {
      "id": "string",
      "title": "string",
      "link": "string | null",
      "bought": false,
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "createdAt": "string",
  "updatedAt": "string"
}
```

### WishlistItem

```json
{
  "id": "string",
  "title": "string",
  "link": "string | null",
  "bought": false,
  "createdAt": "string",
  "updatedAt": "string"
}
```

### Metadata

```json
{
  "ogTitle": "string",
  "ogDescription": "string",
  "ogImage": "string"
}
```

---

_End of API contracts_
