# ==============================================================================
# Multi-stage Dockerfile for React.js (Vite) Frontend
# ==============================================================================

# Stage 1: Build the React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests first for optimal caching
COPY package*.json ./

RUN npm install

# Copy application source
COPY . .

# Build argument for API URL (defaults to localhost:5000/api)
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

# Build the production bundle into /app/dist
RUN npm run build

# Stage 2: Serve using production-grade lightweight Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for React Router SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
