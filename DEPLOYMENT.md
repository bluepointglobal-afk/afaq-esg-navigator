# AFAQ ESG Platform - Deployment Guide

## Prerequisites

- Supabase CLI installed (`npm install -g supabase`)
- OpenRouter API key (from https://openrouter.ai)
- Supabase project created

---

## 1. Configure Environment Variables

### Set OpenRouter API Key in Supabase

```bash
# Connect to your Supabase project
supabase link --project-ref <your-project-ref>

# Set the OpenRouter API key as a secret
supabase secrets set OPENROUTER_API_KEY=<your-openrouter-api-key>

# Verify secrets are set
supabase secrets list
```

### Model Configuration

The Edge Function uses **Claude 3 Haiku via OpenRouter** for cost-effective AI generation:

- **Model**: `anthropic/claude-3-haiku`
- **Cost**: ~$0.25/1M input tokens, ~$1.25/1M output tokens
- **Performance**: Fast, good quality for structured output
- **Alternative**: For better quality, change model to `anthropic/claude-3.5-sonnet` (more expensive)

To change the model, edit line 135 in `supabase/functions/generate_disclosure/index.ts`:

```typescript
const model = 'anthropic/claude-3-haiku'; // Change to 'anthropic/claude-3.5-sonnet' for better quality
```

---

## 2. Deploy Database Migrations

```bash
# Apply all migrations to your Supabase project
supabase db push

# Verify migrations applied successfully
supabase db diff
```

**Migrations applied**:
- `20250120000001_create_questionnaire_templates.sql`
- `20250120000002_create_questionnaire_responses.sql`
- `20250120000003_create_assessment_results.sql`
- `20250120000004_create_disclosure_outputs.sql`
- `20250121000001_add_disclosure_fields.sql`

---

## 3. Deploy Edge Function

```bash
# Deploy the disclosure generation function
supabase functions deploy generate_disclosure

# Verify deployment
supabase functions list
```

**Expected output**:
```
generate_disclosure (deployed)
```

---

## 4. Test Edge Function

### Test Locally (Optional)

```bash
# Start local Supabase
supabase start

# Set local secret
supabase secrets set OPENROUTER_API_KEY=<your-key> --local

# Serve function locally
supabase functions serve generate_disclosure

# Test with curl (in another terminal)
curl -i --location --request POST \
  'http://localhost:54321/functions/v1/generate_disclosure' \
  --header 'Authorization: Bearer <anon-key>' \
  --header 'Content-Type: application/json' \
  --data '{
    "reportId": "test-123",
    "templateId": "UAE_LISTED_V1",
    "companyProfile": {
      "companyName": "Test Company",
      "jurisdiction": "UAE",
      "listingStatus": "listed",
      "stockExchange": "ADX",
      "sector": "Technology",
      "employeeCountBand": "51-250",
      "operationalYears": 5,
      "reportingYear": 2024,
      "hasInternationalOps": false,
      "hasCriticalInfrastructure": false
    },
    "assessmentResult": {
      "overallScore": 75,
      "pillarScores": [
        {"pillar": "governance", "score": 80},
        {"pillar": "esg", "score": 70},
        {"pillar": "risk_controls", "score": 75},
        {"pillar": "transparency", "score": 75}
      ],
      "gaps": [],
      "recommendations": []
    },
    "questionnaireAnswersSummary": []
  }'
```

### Test Production

```bash
curl -i --location --request POST \
  'https://<project-ref>.supabase.co/functions/v1/generate_disclosure' \
  --header 'Authorization: Bearer <anon-key>' \
  --header 'Content-Type: application/json' \
  --data '{ ... }'
```

---

## 5. Configure User Tiers

### Update User Profiles for Testing

```sql
-- Set a user to Pro tier for testing
UPDATE user_profiles
SET tier = 'pro'
WHERE id = '<user-id>';

-- Check current tier
SELECT id, email, tier FROM user_profiles;
```

### Default User Tier

By default, new users are created with `tier = 'free'`. To test the paid disclosure feature:

1. Create a user account
2. Update their tier to 'pro' or 'enterprise' in the database
3. Navigate to `/compliance/disclosure/:reportId`
4. Click "Generate Disclosure"

---

## 6. Deploy Frontend

### Build and Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to your hosting platform (Vercel, Netlify, etc.)
# Example for Vercel:
vercel --prod

# Example for Netlify:
netlify deploy --prod
```

### Environment Variables (Frontend)

Create a `.env.production` file:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 7. Verify Full Flow

1. **Sign Up / Sign In**: Create or log in to a user account
2. **Set Tier**: Update user tier to 'pro' (for testing)
3. **Complete Questionnaire**: Navigate to `/compliance/questionnaire`
4. **View Results**: Click "View Results" (appears when completion ≥ 50%)
5. **Generate Disclosure**:
   - From results page, see "Generate Disclosure Report" section
   - Free tier: Shows upgrade prompt
   - Paid tier: Shows "Generate" button
6. **View Disclosure**: Navigate to `/compliance/disclosure/:reportId`
   - Click "Generate Disclosure"
   - Wait for AI generation (~10-20 seconds)
   - View bilingual narratives with EN/AR toggle
   - Download JSON

---

## 8. Monitor & Troubleshoot

### View Edge Function Logs

```bash
# View real-time logs
supabase functions logs generate_disclosure --tail

# View recent logs
supabase functions logs generate_disclosure --limit 100
```

### Common Issues

**Issue**: `OPENROUTER_API_KEY not configured`
- **Solution**: Run `supabase secrets set OPENROUTER_API_KEY=<your-key>`

**Issue**: `Disclosure generation requires Pro or Enterprise tier`
- **Solution**: Update user tier in database: `UPDATE user_profiles SET tier = 'pro' WHERE id = '<user-id>'`

**Issue**: `OpenRouter API error: 401`
- **Solution**: Check your OpenRouter API key is valid and has credits

**Issue**: Edge Function timeout
- **Solution**: OpenRouter's Haiku model is fast. If timeouts occur, check network or OpenRouter status

---

## 9. Cost Optimization

### Model Selection

**Current**: `anthropic/claude-3-haiku`
- **Cost**: ~$0.50 per disclosure (4 sections × ~500 tokens input + 400 tokens output each)
- **Quality**: Good for structured output
- **Speed**: Fast (~5 seconds per section)

**Alternative**: `anthropic/claude-3.5-sonnet`
- **Cost**: ~$3.00 per disclosure (higher quality)
- **Quality**: Best available
- **Speed**: Moderate (~8 seconds per section)

**Recommendation**: Start with Haiku. Upgrade to Sonnet if narrative quality needs improvement.

### Rate Limiting

Current implementation has no rate limiting. Recommended to add:

```typescript
// In Edge Function, before AI generation
const rateLimitKey = `disclosure:${user.id}`;
const rateLimitWindow = 3600; // 1 hour
const rateLimitMax = 5; // Max 5 generations per hour

// Check Redis/KV store for rate limit
// Increment counter
// Return 429 if exceeded
```

---

## 10. Production Checklist

- [ ] OpenRouter API key configured in Supabase secrets
- [ ] All database migrations applied
- [ ] Edge Function deployed and tested
- [ ] Frontend environment variables set
- [ ] Frontend built and deployed
- [ ] User tier system configured
- [ ] RLS policies verified
- [ ] Edge Function logs monitored
- [ ] Rate limiting implemented (optional but recommended)
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Backup strategy in place

---

## 11. Scaling Considerations

### Performance

- **Edge Function**: Runs globally on Deno Deploy (low latency)
- **Database**: Supabase PostgreSQL (auto-scaling)
- **AI Generation**: OpenRouter handles scaling

### Cost Projections

**Assumptions**:
- 100 paid users
- 2 disclosures per user per month
- Claude 3 Haiku model

**Monthly Cost**:
- AI Generation: 200 disclosures × $0.50 = **$100/month**
- Supabase: Free tier (up to 500K requests/month)
- **Total**: ~$100/month for AI

**At Scale** (1000 paid users):
- 2000 disclosures/month × $0.50 = **$1000/month** for AI
- Supabase Pro: $25/month
- **Total**: ~$1025/month

---

## 12. Support & Maintenance

### Monitoring

- **Edge Function Logs**: `supabase functions logs generate_disclosure --tail`
- **Database Metrics**: Supabase Dashboard → Database
- **Error Tracking**: Integrate Sentry or similar

### Updates

- **Model Updates**: Change `model` variable in Edge Function
- **Template Updates**: Edit templates in `src/templates/disclosure/`
- **Prompt Updates**: Modify systemPrompt in Edge Function

### Support Channels

- OpenRouter: https://openrouter.ai/docs
- Supabase: https://supabase.com/docs
- AFAQ Team: [Add internal support contact]

---

**Deployment Guide Version**: 1.0
**Last Updated**: December 21, 2024
