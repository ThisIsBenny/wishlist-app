<p align="center">
<img src="https://raw.githubusercontent.com/ThisIsBenny/wishlist-app/main/public/logo-256.png" height="200">
</p>

<h1 align="center">
Wishlist App
</h1>
<p align="center">
  <img src="https://img.shields.io/github/package-json/v/thisisbenny/wishlist-app" />
  <img src="https://img.shields.io/github/workflow/status/thisisbenny/wishlist-app/CI" />
  <a href="https://hub.docker.com/r/thisisbenny/wishlist-app"><img src="https://img.shields.io/docker/pulls/thisisbenny/wishlist-app" /></a>
  <img src="https://img.shields.io/github/license/thisisbenny/wishlist-app" />
</p>

A simple webapp to manage your wishlists. Share them with friends and family, and let them mark items as purchased.

## Features

- **User Accounts**: Register and log in with email/password or OpenID Connect
- **Multiple Wishlists**: Create and manage unlimited wishlists
- **Open Graph Metadata**: Automatically fetch title, description and images from product URLs
- **Public/Private Lists**: Control which lists appear on the homepage
- **Item Tracking**: Mark items as purchased to prevent duplicate gifts
- **Dark Mode**: Built-in dark theme support
- **i18n**: Available in English and German

## Screenshots

![Overview Image](.github/assets/overview.jpg)
![Detail Image](.github/assets/details.jpg)

## Quick Start

### Docker (Recommended)

```yaml
version: '3.7'

services:
  wishlist:
    image: thisisbenny/wishlist-app:latest
    environment:
      - JWT_SECRET=your-secure-random-secret-at-least-32-chars
      - AUTH_EMAIL_LOGIN_ENABLED=true
      - AUTH_EMAIL_REGISTER_ENABLED=true
    ports:
      - '5000:5000'
    volumes:
      - ./data:/app/data
```

### OpenID Connect (OIDC) Setup

OIDC providers are configured via environment variables following this pattern:

| Variable | Description |
|----------|-------------|
| `OIDC_<ID>_NAME` | Display name shown on the login page |
| `OIDC_<ID>_CLIENT_ID` | OAuth2 client ID from the provider |
| `OIDC_<ID>_CLIENT_SECRET` | OAuth2 client secret |
| `OIDC_<ID>_ISSUER_URL` | OpenID Connect discovery URL |

Replace `<ID>` with a unique identifier for each provider (e.g., `GOOGLE`, `GITHUB`, `POCKETID`).

**Example with two providers:**

```yaml
environment:
  - OIDC_GOOGLE_NAME=Google
  - OIDC_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
  - OIDC_GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
  - OIDC_GOOGLE_ISSUER_URL=https://accounts.google.com

  - OIDC_POCKETID_NAME=PocketID
  - OIDC_POCKETID_CLIENT_ID=your-client-id
  - OIDC_POCKETID_CLIENT_SECRET=your-client-secret
  - OIDC_POCKETID_ISSUER_URL=https://pocketid.example.com
```

The OIDC callback URL is `http://localhost:5000/api/auth/oidc/<ID>/callback`. Configure this as an allowed redirect URI in your OIDC provider's settings. The app auto-discovers provider metadata (JWKS, endpoints) from the issuer URL on startup.

### Manual Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.template .env
# Edit .env and set JWT_SECRET to a secure random string

# Start development server
npm run dev
```

Visit http://localhost:5173

## Usage

### First Login

1. Click the login icon in the header (top-right)
2. Click "Not registered? Create an account" to register
3. Enter your email and a password (min 8 chars, uppercase, lowercase, digit, special character)
4. You'll be automatically logged in after registration

### Creating Wishlists

1. Activate edit mode (toggle in header)
2. Click the "+" tile to create a new wishlist
3. Fill in title, description, and choose public/private

### Adding Items

1. Open any wishlist
2. Activate edit mode
3. Add items manually or use the bookmarklet

### Bookmarklet

Create a bookmark with this JavaScript to quickly add items:

```javascript
javascript: window.location =
  'http://localhost:5000/add-wishlist-item?url=' + window.location
```

### Sharing

Share wishlists via their unique URLs. Friends and family can mark items as purchased without needing an account.

## Development

### Commands

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start frontend + backend |
| `npm run build`     | Build for production     |
| `npm run test:unit` | Run unit tests           |
| `npm run test:api`  | Run API handler tests    |
| `npm run test:e2e`  | Run E2E tests            |
| `npm run lint`      | Lint code                |
| `npm run typecheck` | Type check               |

See [DEVELOPER.md](DEVELOPER.md) for complete documentation.

## API

The app exposes a REST API. See [API.md](API.md) for complete API documentation.

### Example: Get Public Wishlists

```bash
curl http://localhost:5000/api/wishlist
```

### Example: Mark Item as Bought

```bash
curl -X POST http://localhost:5000/api/wishlist/{id}/item/{itemId}/bought
```

## Tech Stack

- **Frontend**: Vue 3, Vue Router, Vue I18n, Tailwind CSS
- **Backend**: NestJS, Drizzle ORM, SQLite
- **Authentication**: JWT (HTTP-only cookies), bcrypt, OpenID Connect
- **Testing**: Vitest, Playwright

## License

MIT
