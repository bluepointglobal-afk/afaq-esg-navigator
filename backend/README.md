# AFAQ ESG Navigator - Backend API

Production-grade Express.js backend for handling long-running ESG disclosure generation without timeout limits.

## Architecture

- **Express.js** - REST API server
- **BullMQ** - Queue system for async job processing
- **Redis** - Job queue storage
- **Supabase** - Database and authentication
- **OpenRouter** - AI-powered disclosure generation (Claude 3.5 Sonnet)
- **PDFKit** - PDF generation

## Key Features

- ✅ No timeout limits (handles 30-60+ second jobs)
- ✅ Progress tracking with job status polling
- ✅ Automatic retries with exponential backoff
- ✅ JWT authentication via Supabase
- ✅ Health check endpoints for monitoring
- ✅ Rate limiting and security middleware
- ✅ Structured logging

## API Endpoints

### Disclosure Generation

**POST /api/disclosure/generate**
```json
{
  "reportId": "uuid",
  "frameworks": ["ifrs-s1", "ifrs-s2"],
  "companyProfile": {
    "name": "Company Name",
    "industry": "Technology"
  }
}
```

Response (202 Accepted):
```json
{
  "jobId": "job-id",
  "status": "queued",
  "estimatedTime": "30-60 seconds"
}
```

**GET /api/disclosure/status/:jobId**

Returns job status (queued, active, completed, failed)

### PDF Generation

**POST /api/pdf/generate**
```json
{
  "reportId": "uuid"
}
```

Streams PDF file directly to response.

### Health Check

**GET /api/health**

Returns system health status (database, Redis).

## Environment Variables

See `.env.example` for required configuration:

- `NODE_ENV` - production/development
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - CORS origin
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `REDIS_URL` - Redis connection string (Railway auto-provides)
- `OPENROUTER_API_KEY` - OpenRouter API key
- `LOG_LEVEL` - Logging level (info/debug/error)

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

See `RAILWAY_DEPLOYMENT.md` in the root directory for complete Railway deployment instructions.

## Queue System

The backend uses BullMQ for reliable job processing:

1. API receives request → Job queued immediately (202 response)
2. Worker picks up job from queue
3. Worker processes disclosure generation (30-60s, no timeout)
4. Frontend polls `/status/:jobId` for progress
5. Job completes → Frontend fetches result

**Benefits:**
- No timeouts (can run indefinitely)
- Automatic retries on failure (3 attempts with exponential backoff)
- Progress tracking (0-100%)
- Survives server restarts (Redis persistence)
- Horizontal scaling (add more workers)

## Error Handling

- Failed jobs retry 3 times with exponential backoff (5s, 25s, 125s)
- All errors logged with structured metadata
- Client receives detailed error responses
- Health checks detect system issues

## Security

- Helmet.js security headers
- CORS restricted to frontend URL
- Rate limiting (100 requests per 15 minutes)
- JWT authentication required
- Row Level Security via Supabase
- Input validation on all endpoints

## Monitoring

- Health check endpoint for uptime monitoring
- Structured JSON logging
- Job metrics (queue depth, processing time)
- Redis connection monitoring

## Performance

- Concurrent job processing (5 workers)
- Redis connection pooling
- Efficient database queries
- Streaming PDF generation (low memory usage)
