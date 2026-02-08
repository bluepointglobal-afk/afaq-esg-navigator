-- ===========================================================================
-- METRIC_DATA TABLE
-- ===========================================================================

-- This table stores quantitative data points (KPIs) for the evidence layer.

CREATE TABLE IF NOT EXISTS public.metric_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  metric_code text NOT NULL, -- e.g., 'E1.1-GHG-Scope1'
  category text NOT NULL CHECK (category IN ('environmental', 'social', 'governance')),
  
  -- Flexible value storage
  value_numeric numeric,
  value_text text,
  value_boolean boolean,
  
  unit text,
  
  -- Data Quality Metadata
  data_tier integer CHECK (data_tier BETWEEN 1 AND 4), -- 1=High (Verified), 4=Low (Estimate)
  data_source text, -- e.g., 'invoice', 'meter', 'estimate'
  confidence_level text CHECK (confidence_level IN ('high', 'medium', 'low')),
  
  -- Audit Trail
  calculation_method text,
  calculation_inputs jsonb,
  emission_factor_used numeric,
  emission_factor_source text,
  
  notes text,
  supporting_doc_url text,
  
  entered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_metric_data_report_id ON public.metric_data(report_id);
CREATE INDEX IF NOT EXISTS idx_metric_data_metric_code ON public.metric_data(metric_code);

COMMENT ON TABLE public.metric_data IS 'Quantitative ESG metrics and KPIs with audit trail.';

-- Enable RLS
ALTER TABLE public.metric_data ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- RLS POLICIES
-- ===========================================================================

-- Policy: Users can only read/write if they belong to the same company as the report.

DROP POLICY IF EXISTS "Users can view metric_data of their own company" ON public.metric_data;
CREATE POLICY "Users can view metric_data of their own company"
ON public.metric_data
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = metric_data.report_id
    AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert metric_data for their own company" ON public.metric_data;
CREATE POLICY "Users can insert metric_data for their own company"
ON public.metric_data
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

DROP POLICY IF EXISTS "Users can update metric_data of their own company" ON public.metric_data;
CREATE POLICY "Users can update metric_data of their own company"
ON public.metric_data
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = metric_data.report_id
    AND up.id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = metric_data.report_id
    AND up.id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete metric_data of their own company" ON public.metric_data;
CREATE POLICY "Users can delete metric_data of their own company"
ON public.metric_data
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    JOIN public.user_profiles up ON r.company_id = up.company_id
    WHERE r.id = metric_data.report_id
    AND up.id = auth.uid()
  )
);

-- ===========================================================================
-- TRIGGER FOR updated_at
-- ===========================================================================

DROP TRIGGER IF EXISTS handle_updated_at_metric_data ON public.metric_data;
CREATE TRIGGER handle_updated_at_metric_data
  BEFORE UPDATE ON public.metric_data
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
