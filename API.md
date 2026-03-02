# API Reference

## Base URL

```
http://localhost:5000/api
```

## Authentication

Protected routes require an API key passed in the `Authorization` header:

```
Authorization: api-key YOUR_API_KEY
```

The API key is configured via the `API_KEY` environment variable (default: `TOP_SECRET`).

---

## Endpoints

### Wishlists

#### Get All Wishlists

```http
GET /api/wishlist
```

**Authentication:** Not required (returns only public wishlists)

**Response:** `200 OK`

```json
[
  {
    "id": "uuid",
    "public": true,
    "title": "Birthday Wishes",
    "imageSrc": "https://example.com/image.jpg",
    "slugUrlText": "birthday-wishes",
    "description": "My birthday wishlist",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "items": []
  }
]
```

---

#### Get Wishlist by Slug

```http
GET /api/wishlist/:slugText
```

**Authentication:** Not required

**Response:** `200 OK` or `404 Not Found`

```json
{
  "id": "uuid",
  "public": true,
  "title": "Birthday Wishes",
  "imageSrc": "https://example.com/image.jpg",
  "slugUrlText": "birthday-wishes",
  "description": "My birthday wishlist",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "items": [
    {
      "id": 1,
      "title": "Gift Item",
      "link": "https://example.com/product",
      "imageSrc": "https://example.com/item.jpg",
      "description": "A great gift",
      "bought": false,
      "wishlistId": "uuid"
    }
  ]
}
```

---

#### Create Wishlist

```http
POST /api/wishlist
```

**Authentication:** Required

**Headers:**

```
Authorization: api-key YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**

```json
{
  "public": true,
  "title": "My Wishlist",
  "imageSrc": "https://example.com/image.jpg",
  "slugUrlText": "my-wishlist",
  "description": "Description of wishlist"
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "public": true,
  "title": "My Wishlist",
  "imageSrc": "https://example.com/image.jpg",
  "slugUrlText": "my-wishlist",
  "description": "Description of wishlist",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### Update Wishlist

```http
PUT /api/wishlist/:wishlistId
```

**Authentication:** Required

**Headers:**

```
Authorization: api-key YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**

```json
{
  "public": false,
  "title": "Updated Title",
  "imageSrc": "https://example.com/new-image.jpg",
  "slugUrlText": "updated-slug",
  "description": "Updated description"
}
```

**Response:** `201 Created`

---

#### Delete Wishlist

```http
DELETE /api/wishlist/:wishlistId
```

**Authentication:** Required

**Headers:**

```
Authorization: api-key YOUR_API_KEY
```

**Response:** `204 No Content`

---

### Items

#### Add Item to Wishlist

```http
POST /api/wishlist/:wishlistId/item
```

**Authentication:** Required

**Headers:**

```
Authorization: api-key YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "New Item",
  "link": "https://example.com/product",
  "imageSrc": "https://example.com/item.jpg",
  "description": "Item description",
  "bought": false
}
```

**Response:** `201 Created`

---

#### Update Item

```http
PUT /api/wishlist/:wishlistId/item/:itemId
```

**Authentication:** Required

**Request Body:**

```json
{
  "title": "Updated Item",
  "link": "https://example.com/new-product",
  "bought": true
}
```

**Response:** `200 OK`

---

#### Mark Item as Bought

```http
POST /api/wishlist/:wishlistId/item/:itemId/bought
```

**Authentication:** Not required

This endpoint allows anyone to mark an item as bought (no authentication required).

**Response:** `200 OK`

---

#### Delete Item

```http
DELETE /api/wishlist/:wishlistId/item/:itemId
```

**Authentication:** Required

**Response:** `204 No Content`

---

### Utilities

#### Fetch Metadata from URL

```http
GET /api/fetch-meta-data-from-url?url=https://example.com/product
```

**Authentication:** Not required

**Response:** `200 OK`

```json
{
  "title": "Product Title",
  "description": "Product description from OG tags",
  "imageSrc": "https://example.com/og-image.jpg"
}
```

---

### Health Check

```http
GET /healthz
```

**Response:** `200 OK`

```json
{
  "status": "ok"
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Missing or invalid API key"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Database connection error"
}
```

---

## Response Schemas

### Wishlist

| Field         | Type     | Description                |
| ------------- | -------- | -------------------------- |
| `id`          | UUID     | Unique identifier          |
| `public`      | Boolean  | Whether wishlist is public |
| `title`       | String   | Wishlist title             |
| `imageSrc`    | String   | Cover image URL            |
| `slugUrlText` | String   | URL-friendly slug (unique) |
| `description` | String   | Wishlist description       |
| `createdAt`   | DateTime | Creation timestamp         |
| `updatedAt`   | DateTime | Last update timestamp      |
| `items`       | Item[]   | List of items              |

### Item

| Field         | Type    | Description            |
| ------------- | ------- | ---------------------- |
| `id`          | Integer | Unique identifier      |
| `title`       | String  | Item title             |
| `link`        | String  | Product URL            |
| `imageSrc`    | String  | Item image URL         |
| `description` | String  | Item description       |
| `bought`      | Boolean | Whether item is bought |
| `wishlistId`  | UUID    | Parent wishlist ID     |
