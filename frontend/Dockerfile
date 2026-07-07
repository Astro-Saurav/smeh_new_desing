# Multi-stage build for Next.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./


# Install dependencies
RUN npm ci


# Back to app root and copy remaining files
WORKDIR /app
COPY scripts ./scripts/
COPY . .

# Build Next.js app
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy only production dependencies needed by standalone
COPY --from=builder /app/node_modules /app/node_modules

# Copy the standalone output from builder
COPY --from=builder /app/.next/standalone /app

# Copy static files
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
