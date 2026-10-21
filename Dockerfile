# Multi-stage production container build for SPPLPF Next.js application
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Install dependencies based on pinned package-lock.json
FROM base AS deps
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Stage 2: Build application and generate Prisma client
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 3: Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root system user and groups (UID 1001, GID 1001)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    addgroup --system --gid 1051 spplpf-db-secrets && \
    addgroup --system --gid 1052 spplpf-redis-secrets && \
    addgroup --system --gid 1053 spplpf-session-secrets && \
    addgroup nextjs spplpf-db-secrets && \
    addgroup nextjs spplpf-redis-secrets && \
    addgroup nextjs spplpf-session-secrets

COPY --from=builder /app/public ./public 2>/dev/null || true
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

USER nextjs:nodejs

EXPOSE 3000

CMD ["npm", "start"]
