# Stage 1: Generate Prisma client for target platform
FROM node:lts AS prisma

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
COPY prisma /app/prisma
RUN npm ci --ignore-scripts && \
    npx prisma generate

# Stage 2: Build frontend and backend
FROM node:lts AS builder

RUN mkdir /app
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci

ENV NODE_ENV=production

COPY . /app/
RUN npm run build

# Stage 3: Runtime
FROM node:lts

LABEL maintainer="github.com/thisisbenny"

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:../data/data.db"

RUN mkdir /app
WORKDIR /app
RUN mkdir data

COPY package.json package-lock.json /app/
COPY ./prisma /app/prisma
RUN npm ci --ignore-scripts

COPY --from=prisma /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=prisma /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/dist /app

EXPOSE 5000

ENTRYPOINT npx prisma migrate deploy && node api/server.js