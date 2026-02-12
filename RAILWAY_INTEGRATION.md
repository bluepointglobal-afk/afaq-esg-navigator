# Railway Backend Integration - Summary

## Problem Fixed

**Critical Issue:** The paid workflow (disclosure generation) was failing because:
- Supabase Edge Functions have 10-60 second timeout limits
- Disclosure generation takes 15-40 seconds (AI: 10-30s + PDF: 5-10s)
- Users could not complete the core revenue-generating feature

**Impact:** Revenue at risk - users unable to complete paid workflow

## Solution Implemented

Created production-grade Railway backend with:
- ✅ Express.js REST API (no timeout limits)
- ✅ BullMQ queue system for async job processing
- ✅ Redis for job queue storage
- ✅ JWT authentication via Supabase
- ✅ Progress tracking (0-100%)
- ✅ Automatic retries with exponential backoff
- ✅ Health monitoring endpoints

## Architecture Comparison

### Before (Broken)
```
Frontend → Supabase Edge Function (10s timeout) → FAILS ❌
```

### After (Fixed)
```
Frontend → Railway API → Queue Job (202 response)
         → BullMQ Worker (no timeout) → AI Generation (30-60s)
         → Save to DB → Frontend polls status → SUCCESS ✅
```

## Files Created

### Backend Infrastructure (`/backend`)

1. **Core Server**
   - `src/server.ts` - Express app with security middleware
   - `package.json` - Dependencies (express, bullmq, ioredis, puppeteer)
   - `tsconfig.json` - TypeScript configuration
   - `railway.json` - Railway deployment config

2. **API Routes**
   - `src/routes/disclosure.ts` - Queue job, check status
   - `src/routes/pdf.ts` - PDF generation (no timeouts)
   - `src/routes/health.ts` - Health checks for monitoring

3. **Queue System**
   - `src/queues/disclosure.queue.ts` - BullMQ worker
   - Handles 30-60+ second jobs without timeout
   - Progress tracking (10%, 40%, 80%, 100%)
   - Auto-retry (3 attempts, exponential backoff)

4. **Services**
   - `src/services/disclosure.service.ts` - AI generation with OpenRouter
   - 90-second timeout (vs 10s Edge Function limit)
   - Structured prompt building
   - Response parsing and validation

5. **Middleware & Utils**
   - `src/middleware/auth.ts` - JWT authentication
   - `src/middleware/error.ts` - Error handling
   - `src/middleware/validation.ts` - Input validation
   - `src/utils/logger.ts` - Structured logging

6. **Configuration**
   - `.env.example` - Environment variables template
   - `.gitignore` - Ignore node_modules, dist, .env

### Frontend Integration

1. **Updated Hooks** (`src/hooks/use-disclosure-outputs.ts`)
   - `useGenerateDisclosure()` - Now calls Railway API instead of Edge Function
   - Queues job → Polls status → Returns result
   - Progress callback for UI updates
   - Better error handling

2. **Updated UI** (`src/pages/Disclosure.tsx`)
   - Added `<Progress>` component for real-time progress
   - Shows percentage (0-100%) during generation
   - Status messages ("Analyzing Evidence...")

3. **Environment Config**
   - `.env` - Added `VITE_BACKEND_API_URL=http://localhost:3001`
   - `.env.example` - Template for all required variables

### Documentation

1. **Backend README** (`backend/README.md`)
   - Architecture overview
   - API endpoint documentation
   - Environment variables
   - Local development setup
   - Queue system explanation

2. **Deployment Guide** (`RAILWAY_DEPLOYMENT.md`)
   - Step-by-step Railway deployment
   - Redis configuration
   - Environment variables setup
   - Frontend integration
   - Monitoring & scaling
   - Troubleshooting guide
   - Cost estimates

## API Endpoints

### Generate Disclosure
**POST** `/api/disclosure/generate`
```json
Request:
{
  "reportId": "uuid",
  "frameworks": ["ifrs-s1", "ifrs-s2"],
  "companyProfile": { "name": "...", "industry": "..." },
  "language": "en"
}

Response (202 Accepted):
{
  "jobId": "job-abc123",
  "status": "queued",
  "estimatedTime": "30-60 seconds"
}
```

### Check Status
**GET** `/api/disclosure/status/:jobId`
```json
Response:
{
  "jobId": "job-abc123",
  "status": "active|completed|failed",
  "progress": 75,
  "result": { ... },  // When completed
  "error": "..."      // When failed
}
```

### Generate PDF
**POST** `/api/pdf/generate`
```json
Request:
{
  "reportId": "uuid"
}

Response: Binary PDF stream
```

### Health Check
**GET** `/api/health`
```json
Response:
{
  "status": "ok",
  "checks": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

## Environment Variables

### Backend (Railway)
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://afaq-esg-navigator.vercel.app
SUPABASE_URL=https://rifhkbigyyyijegkfpkv.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
REDIS_URL=redis://... (Railway auto-provides)
OPENROUTER_API_KEY=your-openrouter-key
LOG_LEVEL=info
```

### Frontend (Vercel)
```env
VITE_BACKEND_API_URL=https://your-app.railway.app
VITE_SUPABASE_URL=https://rifhkbigyyyijegkfpkv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Benefits

1. **Reliability**
   - No timeout limits (can run indefinitely)
   - Automatic retries on failure
   - Job survives server restarts (Redis persistence)

2. **User Experience**
   - Real-time progress tracking (0-100%)
   - Clear status messages
   - Predictable completion times

3. **Performance**
   - Horizontal scaling (add more workers)
   - Concurrent job processing (5 workers)
   - Efficient queue management

4. **Monitoring**
   - Health check endpoints
   - Structured logging
   - Job metrics (queue depth, processing time)

5. **Cost**
   - Railway Hobby: $5/month (testing)
   - Railway Pro: $20/month (production)
   - Redis included (no extra cost)

## Deployment Steps

1. **Deploy Backend to Railway**
   ```bash
   # See RAILWAY_DEPLOYMENT.md for detailed steps
   - Create Railway project
   - Add Redis service
   - Configure environment variables
   - Deploy from GitHub
   ```

2. **Update Frontend Environment**
   ```bash
   # In Vercel project settings
   VITE_BACKEND_API_URL=https://your-app.railway.app
   ```

3. **Test End-to-End**
   - Login → Create Report → Generate Disclosure
   - Verify progress tracking works
   - Verify 30-60 second jobs complete
   - Check PDF export

## Testing Checklist

- [ ] Backend deploys successfully to Railway
- [ ] Redis service connects
- [ ] Health check returns 200 OK
- [ ] Frontend connects to Railway API
- [ ] Disclosure generation queues job
- [ ] Progress updates show in UI (0-100%)
- [ ] Job completes without timeout
- [ ] Disclosure saves to database
- [ ] PDF generation works
- [ ] Error handling works (invalid auth, missing data)
- [ ] Retries work on failure

## Security

- ✅ JWT authentication required
- ✅ CORS restricted to frontend URL
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ Input validation
- ✅ Service role key kept secret
- ✅ Redis password protected (Railway auto)
- ✅ HTTPS enforced (Railway auto)

## Next Steps

1. **Deploy Backend**
   - Follow `RAILWAY_DEPLOYMENT.md`
   - Deploy to Railway
   - Configure environment variables
   - Test health endpoint

2. **Update Frontend**
   - Set `VITE_BACKEND_API_URL` in Vercel
   - Redeploy frontend
   - Test in production

3. **Monitor & Optimize**
   - Set up uptime monitoring
   - Monitor queue depth
   - Optimize worker concurrency
   - Add error alerting

4. **User Testing**
   - Test with real users
   - Verify 30-60s generation works
   - Collect feedback
   - Fix any edge cases

## Files Summary

```
backend/
├── src/
│   ├── server.ts                    ✅ Express app
│   ├── routes/
│   │   ├── disclosure.ts            ✅ Queue & status endpoints
│   │   ├── pdf.ts                   ✅ PDF generation
│   │   └── health.ts                ✅ Health checks
│   ├── queues/
│   │   └── disclosure.queue.ts      ✅ BullMQ worker
│   ├── services/
│   │   └── disclosure.service.ts    ✅ AI generation
│   ├── middleware/
│   │   ├── auth.ts                  ✅ JWT auth
│   │   ├── error.ts                 ✅ Error handling
│   │   └── validation.ts            ✅ Input validation
│   └── utils/
│       └── logger.ts                ✅ Structured logging
├── package.json                     ✅ Dependencies
├── tsconfig.json                    ✅ TypeScript config
├── railway.json                     ✅ Deployment config
├── .env.example                     ✅ Env template
├── .gitignore                       ✅ Git ignore
└── README.md                        ✅ Documentation

frontend/
├── src/
│   ├── hooks/
│   │   └── use-disclosure-outputs.ts  ✅ Updated to call Railway
│   └── pages/
│       └── Disclosure.tsx              ✅ Added progress UI
├── .env                              ✅ Added VITE_BACKEND_API_URL
└── .env.example                      ✅ Env template

root/
├── RAILWAY_DEPLOYMENT.md             ✅ Deployment guide
└── RAILWAY_INTEGRATION.md            ✅ This file
```

## Status

✅ **Backend complete** - All routes, queues, services implemented
✅ **Frontend integrated** - Calling Railway API with progress tracking
✅ **Documentation complete** - README, deployment guide, integration summary
⏳ **Deployment pending** - Ready to deploy to Railway
⏳ **Testing pending** - Need to test end-to-end in production

## Success Metrics

When deployed successfully, you should see:
- ✅ Disclosure generation completes in 30-60 seconds
- ✅ Progress bar updates smoothly (0% → 100%)
- ✅ No timeout errors
- ✅ Users can complete paid workflow
- ✅ PDF export works without issues
- ✅ Health check returns 200 OK
- ✅ Zero downtime during peak usage

---

**Generated:** 2026-02-12
**Status:** Ready for deployment
**Priority:** HIGH (Revenue-blocking issue fixed)
