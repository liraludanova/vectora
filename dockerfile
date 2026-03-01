# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# ---- Dependencies ----
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# If you use Next.js standalone output, these are ideal.
# If you don't, this still works if .next is present.
COPY --from=builder /app/.next ./.next

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]