ARG NEXT_PUBLIC_API_BASE_URL

FROM node:20-alpine AS base

WORKDIR /app
ENV PATH="/app/node_modules/.bin:$PATH"

RUN apk add --no-cache libc6-compat

# Install all dependencies (dev + prod) once for reuse in builder
FROM base AS deps
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Production-only dependencies
FROM base AS prod-deps
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

# Build stage
FROM base AS builder
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run postinstall && npm run build

# Development stage (used by docker-compose.dev.yml)
FROM base AS development
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts
COPY . .
RUN npm run postinstall
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production runtime image
FROM base AS production
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./next.config.ts
# Next.js expects TypeScript to be available when the project uses a TS config.
# Production deps omit dev packages, so copy just TypeScript from the full deps layer.
COPY --from=deps /app/node_modules/typescript ./node_modules/typescript
COPY --from=deps /app/node_modules/.bin/tsc ./node_modules/.bin/tsc

EXPOSE 3000
CMD ["npx", "next", "start", "-p", "3000"]


