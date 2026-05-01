# ── Stage 1: Build the React frontend ────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source and build
COPY index.html vite.config.js eslint.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

# ── Stage 2: Production runtime ──────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Install server dependencies only
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

# Copy server source
COPY server/index.js ./index.js

# Copy built frontend from Stage 1
COPY --from=build /app/dist ./dist

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "index.js"]
