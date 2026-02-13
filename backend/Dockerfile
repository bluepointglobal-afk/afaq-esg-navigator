# Production Dockerfile for AFAQ ESG Backend
# Optimized for Railway deployment without puppeteer dependencies

FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install production dependencies only
# Using npm ci for reproducible builds
RUN npm ci --only=production && npm cache clean --force

# Copy TypeScript source and build config
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to JavaScript
RUN npm run build

# Remove source files to reduce image size
RUN rm -rf src tsconfig.json

# Expose port (Railway will override with PORT env var)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "dist/server.js"]
