# wishlist

The wishlist app is a simple webapp for publishing wishlists. It allows to share wishlists for different people or occasions with friends and family. If something was bought from the wishlist, it can be removed from the list to prevent duplicate purchases.

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/wishlist-app-h0htfc)

The app can be easily self-hosted via Docker (see docker-compose example below).

## Screenshots

![Overview Image](.github/assets/overview.jpg)
![Detail Image](.github/assets/details.jpg)

## Features

- Support of multiple wishlists
- Items can be removed from the wishlist by users
- i18n support

## Feature Roadmap

- Administrate wishlists
- Grab title, description and image-url from url via open graph meta tags
- Login
- Image upload

## Docker Setup

```yaml
version: '3.7'

services:
  wishlist:
    image: thisisbenny/wishlist-app:latest
    environment:
      - API_KEY=TOP_SECRET
    ports:
      - '5000:5000'
    volumes:
      - ./data:/app/data
```

## Development Setup

```sh
npm install
npx prisma generate
npx prisma migrate deploy
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests

```sh
npm run test:unit
```

### Lint

```sh
npm run lint
```

### Typecheck

```sh
npm run typecheck
```

## Other stuff

[☕️ Buy me a coffee](https://www.buymeacoffee.com/hierlDev)
