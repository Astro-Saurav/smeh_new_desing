FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache python3 make g++

# ─── Dependencies stage ───────────────────────────
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --only=production --legacy-peer-deps

# ─── Development stage ───────────────────────────
FROM base AS development
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --legacy-peer-deps
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

# ─── Production stage ────────────────────────────
FROM base AS production
ENV NODE_ENV=production

# Copy production deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create required directories
RUN mkdir -p /var/www/mrt/uploads/news \
             /var/www/mrt/uploads/temp \
             /var/www/mrt/uploads/thumbnails \
             /var/www/mrt/uploads/category \
             /var/www/mrt/uploads/profile \
             /var/www/mrt/logs

# Entrypoint: run DB migrations + seed, then start server
RUN printf '#!/bin/sh\nset -e\necho "==> Running Prisma migrations..."\nnpx prisma migrate deploy\necho "==> Running DB seed..."\nnode prisma/seed.js || echo "(Seed already applied — skipping)"\necho "==> Starting MRT API..."\nexec node src/server.js\n' > /entrypoint.sh && chmod +x /entrypoint.sh

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /var/www/mrt && chown nodejs:nodejs /entrypoint.sh
USER nodejs

EXPOSE 8080
HEALTHCHECK --interval=20s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8080/api/live || exit 1

ENTRYPOINT ["/entrypoint.sh"]
