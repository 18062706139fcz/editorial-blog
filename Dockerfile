# ── Dependencies ─────────────────────────────────────────────
FROM node:20-slim AS deps
# Prisma needs OpenSSL on slim images.
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# ── Build ────────────────────────────────────────────────────
FROM node:20-slim AS builder
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `build` runs `prisma generate && next build`.
RUN npm run build

# ── Runtime ──────────────────────────────────────────────────
FROM node:20-slim AS runner
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only what the production server needs.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
# Ensure the schema exists on the mounted volume, then serve the build.
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run start"]
