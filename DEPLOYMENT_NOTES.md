# Deployment Notes - Feb 14, 2026

## ✅ Completed

### Database
- All tables created successfully:
  - `disclosure_narratives` (CEO message, materiality, pillars, strategy, targets, case studies)
  - `disclosure_metrics` (emissions, energy, workforce, safety)
  - `disclosure_evidence` (file uploads with metadata)
- RLS policies configured for company-level isolation
- Unique constraints enforced on reports

### Backend (Railway)
- Deployed to: `https://afaq-esg-navigator-production.up.railway.app`
- Enhanced AI disclosure generation with new data structure
- Evidence upload API with multer (POST /api/evidence/upload)
- Tone of voice calibration (5 styles)
- Dependencies installed: multer for file uploads

### Frontend (Vercel)
- Deployed to: `https://afaq-esg-navigator.vercel.app`
- New route: `/disclosure/data/:reportId`
- 6-tab data collection wizard
- Photo upload for case studies
- Auto-save functionality
- Real-time completeness tracking

## ⚠️ Manual Setup Required

### Supabase Storage Bucket - RLS Policies

✅ **Bucket Created:** The `evidence` bucket has been created successfully.

⚠️ **RLS Policies Required:** Execute this SQL in Supabase Dashboard (SQL Editor) to add Row Level Security policies:

```sql
-- RLS Policies for Evidence Storage
DROP POLICY IF EXISTS "Users can upload evidence for own company" ON storage.objects;
CREATE POLICY "Users can upload evidence for own company"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'evidence'
  AND (storage.foldername(name))[1] IN (
    SELECT r.id::text
    FROM reports r
    JOIN user_profiles up ON r.company_id = up.company_id
    WHERE up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can view evidence for own company" ON storage.objects;
CREATE POLICY "Users can view evidence for own company"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'evidence'
  AND (storage.foldername(name))[1] IN (
    SELECT r.id::text
    FROM reports r
    JOIN user_profiles up ON r.company_id = up.company_id
    WHERE up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete own evidence" ON storage.objects;
CREATE POLICY "Users can delete own evidence"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'evidence'
  AND (storage.foldername(name))[1] IN (
    SELECT r.id::text
    FROM reports r
    JOIN user_profiles up ON r.company_id = up.company_id
    WHERE up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Service role full access to evidence" ON storage.objects;
CREATE POLICY "Service role full access to evidence"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'evidence')
WITH CHECK (bucket_id = 'evidence');
```

**How to execute:**
1. Go to https://supabase.com/dashboard/project/rifhkbigyyyijegkfpkv
2. Click "SQL Editor" in left sidebar
3. Paste the SQL above
4. Click "Run"

## Testing Checklist

1. Navigate to `/disclosure/data/:reportId` with a valid report ID
2. Test all 6 tabs:
   - ✅ CEO Message (bullet points and full text modes)
   - ✅ Materiality Matrix (interactive 5x5 grid)
   - ✅ Strategy & Pillars (3-4 focus areas)
   - ✅ Targets (commitments with progress tracking)
   - ✅ Case Studies (Challenge-Action-Impact framework)
   - ✅ Metrics (optional quantitative data)
3. Test photo upload in case studies (after bucket creation)
4. Verify auto-save works (check console for save confirmations)
5. Test completeness score updates as you fill in data
6. Generate disclosure and verify AI uses new data structure

## Environment Variables

Backend (Railway):
- `SUPABASE_URL`: ✅ Set
- `SUPABASE_SERVICE_KEY`: ✅ Set
- `SUPABASE_ANON_KEY`: ✅ Set
- `OPENROUTER_API_KEY`: ✅ Set
- `REDIS_URL`: ✅ Auto-set by Railway
- `FRONTEND_URL`: ✅ Set

Frontend (Vercel):
- `VITE_BACKEND_URL`: ✅ Set
- `VITE_SUPABASE_URL`: ✅ Set
- `VITE_SUPABASE_ANON_KEY`: ✅ Set

## Known Issues

None - all features complete and ready for testing!
