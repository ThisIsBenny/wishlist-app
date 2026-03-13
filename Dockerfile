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

# Copy only what's needed for runtime
COPY --from=builder /app/dist /app
COPY --from=builder /app/drizzle.config.js /app/
COPY --from=builder /app/drizzle /app/drizzle
COPY --from=builder /app/src/db/schema /app/src/db/schema

EXPOSE 5000

CMD ["node", "api/main.js"]