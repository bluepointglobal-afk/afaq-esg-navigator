-- ===========================================================================
-- REPORT_NARRATIVES TABLE
-- ===========================================================================

-- This table stores company narratives and structured data per pillar
-- for generating ESG disclosures.

CREATE TABLE IF NOT EXISTS public.report_narratives (
  report_id uuid PRIMARY KEY REFERENCES public.reports(id) ON DELETE CASCADE,
  gov_text text,
  esg_text text,
  risk_text text,
  transparency_text text,
  
  -- Structured fields for detailed data per pillar (Agent 1 spec)
  gov_structured jsonb DEFAULT '[]'::jsonb,
  esg_structured jsonb DEFAULT '[]'::jsonb,
  risk_structured jsonb DEFAULT '[]'::jsonb,
  transparency_structured jsonb DEFAULT '[]'::jsonb,
  
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_report_narratives_created_by ON public.report_narratives(created_by);

COMMENT ON TABLE public.report_narratives IS 'Company-provided narratives and structured data for disclosure generation.';

-- Enable RLS
ALTER TABLE public.report_narratives ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- RLS POLICIES
-- ===========================================================================

-- Policy: Users can only read/write if they belong to the same company as the report.
-- Logic: reports.company_id vs user_profiles.company_id

DROP POLICY IF EXISTS "Users can view narratives of their own company" ON public.report_narratives;
CREATE POLICY "Users can view narratives of their own company"
ON public.report_narratives
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = report_narratives.report_id
    AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert narratives for their own company" ON public.report_narratives;
CREATE POLICY "Users can insert narratives for their own company"
ON public.report_narratives
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = report_id
    AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update narratives of their own company" ON public.report_narratives;
CREATE POLICY "Users can update narratives of their own company"
ON public.report_narratives
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = report_narratives.report_id
    AND up.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = report_narratives.report_id
    AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete narratives of their own company" ON public.report_narratives;
CREATE POLICY "Users can delete narratives of their own company"
ON public.report_narratives
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = report_narratives.report_id
    AND up.id = auth.uid()
  )
);

-- ===========================================================================
-- TRIGGER FOR updated_at
-- ===========================================================================

DROP TRIGGER IF EXISTS handle_updated_at_report_narratives ON public.report_narratives;
CREATE TRIGGER handle_updated_at_report_narratives
  BEFORE UPDATE ON public.report_narratives
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
