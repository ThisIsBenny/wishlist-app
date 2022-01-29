# wishlist

The wish list webapp is a simple webapp for publishing wish lists. It allows to share wishlists for different people or occasions with friends and family. If something was bought from the wishlist, it can be removed from the list to prevent duplicate purchases.

The app can be easily self-hosted via Docker (see docker-compose example below).


## Docker Setup

```yaml
version: '3.7'

services:
  wishlist:
    image: thisisbenny/wishlist-webapp:latest
    ports:
      - '5000:5000'
    volumes:
      - ./data:/app/data
```


## Development Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
