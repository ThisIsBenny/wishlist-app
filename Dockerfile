# Stage 1: Build frontend and backend
FROM node:22-slim AS builder

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci

ENV NODE_ENV=production

COPY . /app/
RUN npm run build

# Stage 2: Runtime
FROM node:22-slim

LABEL maintainer="github.com/thisisbenny"

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./data/data.db"

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci --ignore-scripts && npm rebuild better-sqlite3

COPY --from=builder /app/dist /app

EXPOSE 5000

CMD ["node", "api/server.js"]