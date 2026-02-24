# Railway Build Timeout - Systematic Fix

## Root Cause Analysis

Railway's Railpack builder uses **cached auto-detection** that runs BEFORE configuration files are read:

1. Service was created → Railpack scanned and detected puppeteer
2. Puppeteer removed from code → but Railpack cache persists
3. Custom build commands set → but Railpack detection runs FIRST
4. Build timeout: 37s (apt packages) + 9m57s (npm ci) = exceeds limit

## The Issue

- **Builder selection happens at SERVICE level**, not from railway.json
- railway.json "builder" field doesn't override service-level setting
- Railpack's cached detection installs 250+ system packages before custom commands run

## Systematic Solution

### Option A: Force Nixpacks Builder (RECOMMENDED)

Railway might not expose builder selection in UI. Try this approach:

1. **Delete current service** (afaq-esg-backend)
2. **Create NEW service from scratch**:
   - Select "Empty Service"
   - Connect GitHub repo
   - **Before first deployment**, configure:
     - Root Directory: `/backend`
     - Add all environment variables (from backend/.env.railway)
3. **Railway will auto-detect with fresh scan** (no puppeteer = no system packages)
4. **First deployment should succeed** in ~2-3 minutes

### Option B: Try Nixpacks Override (if Railway allows)

If Railway has a builder selector in Settings:

1. Go to Service Settings
2. Look for "Builder" section
3. If you see Railpack/Nixpacks options, select **Nixpacks**
4. Trigger new deployment

### Option C: Use Dockerfile (Nuclear Option)

If neither works, create a Dockerfile to have complete control:

```dockerfile
# backend/Dockerfile
FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
```

Then Railway will detect Dockerfile and use it instead of auto-detection.

## Current State

✅ puppeteer removed from backend/package.json
✅ backend/railway.json configured (NIXPACKS + npm ci)
✅ backend/nixpacks.toml configured
✅ Root Directory set to /backend
✅ All environment variables identified

❌ Railway service using Railpack with stale cache
❌ Builds timing out during system package installation

## Next Step

**Recommend Option A**: Delete service and create fresh one. This:
- Clears all cached detection
- Forces fresh scan without puppeteer
- Takes 5 minutes to set up
- Highest probability of success

Railway project (afaq-esg-backend) and Redis service can stay - just recreate the backend service.
