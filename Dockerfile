# Multi-stage production build optimization.
# Decouples large compilation cache nodes from the final lightweight execution container.

# ── Stage 1: Dependency Assembly & Asset Compilation
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# ── Stage 2: Minimal Web Server Environment
FROM nginx:alpine

# Remove default server boilerplate configurations
RUN rm -rf /etc/nginx/conf.d/*

# Inject custom, secure server configuration profile
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production compiled assets from the build workspace
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]