# Railway Deployment Guide

Complete guide for deploying the AFAQ ESG Navigator backend to Railway.

## Why Railway Backend?

The paid workflow (disclosure generation) was failing due to **Supabase Edge Function timeout limits (10-60 seconds)**. Disclosure generation takes 15-40 seconds:

- AI generation: 10-30 seconds
- PDF processing: 5-10 seconds
- **Total: 15-40 seconds** → Exceeds Edge Function timeout

**Solution:** Railway backend with BullMQ queue system that has **NO timeout limits**.

## Architecture

```
Frontend (Vercel) → Railway API → BullMQ Queue → Worker (no timeout) → Success
```

Old broken flow:
```
Frontend → Edge Function (10s timeout) → FAILS ❌
```

New working flow:
```
Frontend → Railway API (queue job, 202 response) → Worker processes (30-60s, no timeout) → SUCCESS ✅
```

## Prerequisites

1. Railway account (https://railway.app)
2. GitHub repository connected
3. Supabase project (existing)
4. OpenRouter API key

## Step 1: Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select `bluepointglobal-afk/afaq-esg-navigator`
4. Click "Add variables" (we'll configure next)

## Step 2: Add Redis Service

1. In Railway project dashboard, click "New"
2. Select "Database" → "Add Redis"
3. Railway will automatically provide `REDIS_URL` environment variable
4. No additional configuration needed

## Step 3: Configure Environment Variables

In Railway project settings, add these variables:

### Required Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Production mode |
| `PORT` | `3001` | Server port |
| `FRONTEND_URL` | `https://afaq-esg-navigator.vercel.app` | CORS origin |
| `SUPABASE_URL` | `https://rifhkbigyyyijegkfpkv.supabase.co` | From Supabase dashboard |
| `SUPABASE_SERVICE_KEY` | `your-service-key` | From Supabase → Settings → API |
| `OPENROUTER_API_KEY` | `your-openrouter-key` | From OpenRouter dashboard |
| `LOG_LEVEL` | `info` | Logging level |

**Note:** `REDIS_URL` is automatically provided by Railway when you add Redis service.

### Get Supabase Service Key

1. Go to Supabase dashboard
2. Settings → API
3. Copy "service_role" key (NOT anon key)
4. Paste into Railway `SUPABASE_SERVICE_KEY`

### Get OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Create new API key
3. Copy key
4. Paste into Railway `OPENROUTER_API_KEY`

## Step 4: Configure Build Settings

Railway should auto-detect the backend using `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

If not auto-detected:

1. Settings → Build
2. Set Root Directory: `/backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`

## Step 5: Deploy

1. Click "Deploy" in Railway dashboard
2. Wait for build to complete (2-3 minutes)
3. Railway will provide a public URL: `https://your-app.railway.app`
4. Save this URL for frontend integration

## Step 6: Verify Deployment

Test health check:

```bash
curl https://your-app.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-12T...",
  "checks": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

## Step 7: Update Frontend

Update frontend environment variables (Vercel):

1. Go to Vercel project settings
2. Add environment variable:
   - Name: `VITE_BACKEND_API_URL`
   - Value: `https://your-app.railway.app`
3. Redeploy frontend

## Frontend Integration Code

The frontend needs to be updated to call Railway API instead of Supabase Edge Functions.

### Update `src/hooks/use-disclosure-outputs.ts`:

```typescript
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001';

// Generate disclosure (queue job)
const generateDisclosure = async (reportId: string) => {
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch(`${BACKEND_API_URL}/api/disclosure/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`
    },
    body: JSON.stringify({ reportId })
  });

  const { jobId } = await response.json();

  // Poll for status
  return pollJobStatus(jobId, session?.access_token);
};

// Poll job status
const pollJobStatus = async (jobId: string, token: string) => {
  const maxAttempts = 120; // 2 minutes max (1s intervals)
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await fetch(`${BACKEND_API_URL}/api/disclosure/status/${jobId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const { status, progress, result, error } = await response.json();

    if (status === 'completed') return result;
    if (status === 'failed') throw new Error(error);

    // Update progress UI (0-100%)
    updateProgress(progress);

    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error('Job timed out');
};
```

## Monitoring

### Railway Dashboard

Monitor your deployment:

1. Logs: Real-time application logs
2. Metrics: CPU, memory, network usage
3. Health: Service status
4. Redis: Queue depth, job processing time

### Health Check Endpoint

Set up uptime monitoring (e.g., UptimeRobot):

- URL: `https://your-app.railway.app/api/health`
- Interval: 5 minutes
- Alert on non-200 response

## Scaling

### Horizontal Scaling (More Workers)

To handle more concurrent jobs:

1. Railway dashboard → Settings
2. Increase replicas (e.g., 2-3 instances)
3. Workers automatically balance across instances

### Vertical Scaling (More Resources)

If jobs need more memory/CPU:

1. Railway dashboard → Settings
2. Upgrade plan (Hobby → Pro)
3. Increase resource limits

## Troubleshooting

### Build Fails

**Issue:** `Module not found` errors

**Fix:** Ensure `backend/package.json` has all dependencies:
```bash
cd backend
npm install
```

### Redis Connection Error

**Issue:** `ECONNREFUSED redis://...`

**Fix:** Verify Redis service is running:
1. Railway dashboard → Redis service
2. Check status is "Active"
3. Verify `REDIS_URL` environment variable exists

### Authentication Fails

**Issue:** `Invalid token` errors

**Fix:** Verify Supabase service key:
1. Supabase → Settings → API
2. Copy "service_role" key (NOT anon)
3. Update `SUPABASE_SERVICE_KEY` in Railway

### Jobs Stuck in Queue

**Issue:** Jobs show "queued" but never complete

**Fix:** Check worker logs:
```bash
# In Railway logs, search for:
Worker started successfully
```

If worker not starting:
1. Verify `REDIS_URL` is set
2. Check for Redis connection errors in logs
3. Restart deployment

### Timeout Still Happening

**Issue:** Jobs still timing out

**Fix:** Increase timeout in `disclosure.service.ts`:
```typescript
timeout: 120000 // 2 minutes instead of 90s
```

## Cost Estimate

**Railway Pricing:**

- Hobby Plan: $5/month
  - Includes: 512MB RAM, $5 usage credit
  - Suitable for: Testing, low traffic

- Pro Plan: $20/month
  - Includes: 8GB RAM, $20 usage credit
  - Suitable for: Production, moderate traffic

**Redis Pricing:**

- Included in Railway plans
- No additional cost for standard usage

**Estimated Monthly Cost:** $5-20 depending on traffic

## Security Checklist

- ✅ Environment variables set (not hardcoded)
- ✅ CORS restricted to frontend URL
- ✅ Rate limiting enabled
- ✅ JWT authentication required
- ✅ HTTPS enforced (Railway auto-provides)
- ✅ Service role key kept secret
- ✅ Redis password protected (Railway auto-configures)

## Rollback Plan

If deployment fails:

1. Railway dashboard → Deployments
2. Find previous successful deployment
3. Click "Redeploy"
4. System reverts to last working version

## Next Steps

1. Deploy backend to Railway (Steps 1-6)
2. Update frontend with Railway URL (Step 7)
3. Test complete paid workflow:
   - Login → Create Report → Generate Disclosure
   - Verify 30-60 second jobs complete successfully
   - Check PDF export works
4. Set up monitoring (health checks, alerts)
5. Test under load (multiple concurrent jobs)

## Support

- Railway Docs: https://docs.railway.app
- BullMQ Docs: https://docs.bullmq.io
- Issues: Create GitHub issue in repository
