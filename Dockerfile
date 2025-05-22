FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

FROM node:18-alpine

LABEL org.opencontainers.image.authors="Igor Pąśko"
LABEL org.opencontainers.image.title="Weather App"
LABEL org.opencontainers.image.version="1.0.0"

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js    ./server.js
COPY --from=builder /app/public       ./public

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --quiet --spider http://localhost:8000/ || exit 1

CMD ["node", "server.js"]
