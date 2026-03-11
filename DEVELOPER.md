# Developer Guide

## Table of Contents

1. [Overview](#overview)
2. [Development Environment](#development-environment)
3. [Commands](#commands)
4. [Architecture](#architecture)
5. [Testing](#testing)
6. [Production](#production)
7. [Troubleshooting](#troubleshooting)

---

## Overview

The Wishlist App is a full-stack application:

| Component | Technology              |
| --------- | ----------------------- |
| Frontend  | Vue 3 + Composition API |
| Backend   | Fastify (Node.js)       |
| Database  | SQLite (via Prisma)     |
| Styling   | Tailwind CSS            |
| Testing   | Vitest + Playwright     |

### System Requirements

- Node.js >= 22.22.1
- npm >= 9.x

---

## Development Environment

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.template .env
```

The `.env` file should contain:

```env
NODE_ENV=development
VITE_API_BASEURL=http://localhost:5000/api
DATABASE_URL="file:../data/data.db"
API_KEY=YOUR_SECRET_API_KEY
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Start Development Server

```bash
npm run dev
```

This starts:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Commands

### Development

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Frontend + Backend simultaneously |
| `npm run dev:frontend` | Vite Dev Server only              |
| `npm run dev:backend`  | Backend only with Hot-Reload      |

### Build

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `npm run build`          | Build Frontend + Backend             |
| `npm run build:frontend` | Build Frontend only                  |
| `npm run build:backend`  | Build Backend only                   |
| `npm run preview`        | Preview production build (Port 5050) |

### Testing

| Command                | Description               |
| ---------------------- | ------------------------- |
| `npm run test:unit`    | Unit Tests (Watch Mode)   |
| `npm run test:unit:ci` | Unit Tests (single run)   |
| `npm run test:api`     | API Tests                 |
| `npm run test:e2e`     | E2E Tests with Playwright |
| `npm run test:e2e:ui`  | E2E Tests with UI         |
| `npm run coverage`     | Coverage Report           |

### Quality Assurance

| Command             | Description          |
| ------------------- | -------------------- |
| `npm run lint`      | ESLint with Auto-Fix |
| `npm run typecheck` | TypeScript Check     |

---

## Architecture

### Project Structure

```
src/
├── api/                    # Fastify Backend
│   ├── config/            # Configuration
│   │   ├── auth.ts       # Authentication
│   │   ├── errors.ts     # Error Handling
│   │   ├── fastify.ts    # Fastify Config
│   │   ├── initApp.ts   # App Initialization
│   │   └── schemas.ts   # JSON Schemas
│   ├── models/           # Prisma Models
│   ├── routes/           # API Endpoints
│   │   ├── index.ts     # Route Registration
│   │   ├── utils/       # Utility Routes
│   │   └── wishlist/   # Wishlist CRUD
│   └── services/        # Business Logic
│       └── prisma/      # Prisma Client
├── components/            # Vue Components
│   ├── icons/           # Icon Components
│   └── *.vue           # UI Components
├── composables/          # Vue Composables
├── config/              # App Configuration
│   ├── i18n.ts        # Internationalization
│   └── index.ts        # Config Export
├── router/              # Vue Router
├── views/               # Page Components
├── App.vue             # Root Component
└── main.ts            # Entry Point
```

### API Routes

| Method | Endpoint                                | Description      | Auth |
| ------ | --------------------------------------- | ---------------- | ---- |
| GET    | `/api/wishlist`                         | All Wishlists    | No   |
| GET    | `/api/wishlist/:slug`                   | Wishlist by Slug | No   |
| POST   | `/api/wishlist`                         | New Wishlist     | Yes  |
| PUT    | `/api/wishlist/:id`                     | Update Wishlist  | Yes  |
| DELETE | `/api/wishlist/:id`                     | Delete Wishlist  | Yes  |
| POST   | `/api/wishlist/:id/item`                | Add Item         | Yes  |
| PUT    | `/api/wishlist/:id/item/:itemId`        | Update Item      | Yes  |
| DELETE | `/api/wishlist/:id/item/:itemId`        | Delete Item      | Yes  |
| POST   | `/api/wishlist/:id/item/:itemId/bought` | Mark as Bought   | No   |

### Database Schema

See `prisma/schema.prisma` for the complete schema.

---

## Testing

### Unit Tests

Tests for Composables and Components:

```bash
npm run test:unit
```

### API Tests

Tests for Backend Handlers:

```bash
npm run test:api
```

### E2E Tests

Playwright Tests for Complete Flows:

```bash
npm run test:e2e
```

### Coverage

Generate Coverage Report:

```bash
npm run coverage
```

---

## Production

### Build

```bash
npm run build
```

### Demo Mode

Starts Build, Database Reset and Server:

```bash
npm run demo
```

### Docker

```yaml
version: '3.7'

services:
  wishlist:
    image: thisisbenny/wishlist-app:latest
    environment:
      - API_KEY=YOUR_API_KEY
    ports:
      - '5000:5000'
    volumes:
      - ./data:/app/data
```

---

## Troubleshooting

### Port Already in Use

```bash
# Free port 5000
lsof -ti:5000 | xargs kill -9
```

### Node Version

Make sure Node.js v22.22.1 is being used:

```bash
nvm use
node --version
```

### Reset Database

```bash
npx prisma migrate reset
```

### Clear Cache

```bash
rm -rf node_modules/.vite
npm run build
```

### Logs

For backend issues:

```bash
# Development Mode with more logs
NODE_ENV=development npm run dev:backend
```

---

## Release Process

### Versioning

This project uses [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (x.y.0): New features, backward compatible
- **PATCH** (x.y.z): Bug fixes

### Tag-Based Releases

The release workflow triggers on:

- Push to `release/*` branches
- Push of `v*` tags (e.g., `v1.6.0`)

### Release Steps

1. **Ensure you're on main** and have the latest:

   ```bash
   git checkout main
   git pull
   ```

2. **Bump version** in `package.json`:
   - Minor: `1.5.1` → `1.6.0`
   - Patch: `1.6.0` → `1.6.1`

3. **Commit the version bump**:

   ```bash
   git add package.json
   git commit -m "release: v1.6.0"
   ```

4. **Create and push the tag**:

   ```bash
   git tag v1.6.0
   git push origin v1.6.0
   ```

5. **GitHub Actions** will:
   - Run lint, typecheck, and tests
   - Build and push Docker image to `thisisbenny/wishlist-app:latest` and version tags

### Docker Tags Created

- `latest` - always points to latest release
- `v1.6.0` - specific version tag
- `main` - bleeding edge from main branch (optional)
