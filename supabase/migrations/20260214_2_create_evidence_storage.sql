-- Migration: Create storage bucket for evidence files
-- Purpose: Store uploaded photos, documents, and other evidence

-- Create evidence bucket (public readable for authenticated users)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for evidence bucket
-- Users can upload evidence for their own company's reports
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

-- Users can view evidence for their own company's reports
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

-- Users can delete their own uploaded evidence
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

-- Service role has full access
CREATE POLICY "Service role full access to evidence"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'evidence')
WITH CHECK (bucket_id = 'evidence');
