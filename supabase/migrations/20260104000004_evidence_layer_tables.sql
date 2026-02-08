-- =============================================================================
-- T-011: Add DB tables report_narratives + metric_data (lean)
-- Evidence Layer + Framework Orchestrator v0
-- =============================================================================

-- 1. Ensure report_narratives table is correct
CREATE TABLE IF NOT EXISTS public.report_narratives (
  report_id uuid PRIMARY KEY REFERENCES public.reports(id) ON DELETE CASCADE,
  gov_text text,
  esg_text text,
  risk_text text,
  transparency_text text,
  
  -- Structured fields for detailed data per pillar
  gov_structured jsonb DEFAULT '[]'::jsonb,
  esg_structured jsonb DEFAULT '[]'::jsonb,
  risk_structured jsonb DEFAULT '[]'::jsonb,
  transparency_structured jsonb DEFAULT '[]'::jsonb,
  
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Ensure metric_data table is correct
CREATE TABLE IF NOT EXISTS public.metric_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  metric_code text NOT NULL, -- e.g., 'E1.1-GHG-Scope1'
  category text NOT NULL CHECK (category IN ('environmental', 'social', 'governance', 'economic')),
  
  -- Flexible value storage
  value_numeric numeric,
  value_text text,
  value_boolean boolean,
  
  unit text,
  
  -- Audit Trail
  notes text,
  supporting_doc_url text,
  
  entered_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.report_narratives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metric_data ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies using get_user_company_id() helper
-- (Helper function defined in T-002 migration)

-- --- REPORT_NARRATIVES ---
DROP POLICY IF EXISTS "Users can view narratives of their own company" ON public.report_narratives;
DROP POLICY IF EXISTS "Users can insert narratives for their own company" ON public.report_narratives;
DROP POLICY IF EXISTS "Users can update narratives of their own company" ON public.report_narratives;
DROP POLICY IF EXISTS "Users can delete narratives of their own company" ON public.report_narratives;

CREATE POLICY "Users can view narratives of their own company"
ON public.report_narratives FOR SELECT TO authenticated
USING (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

CREATE POLICY "Users can insert narratives of their own company"
ON public.report_narratives FOR INSERT TO authenticated
WITH CHECK (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

CREATE POLICY "Users can update narratives of their own company"
ON public.report_narratives FOR UPDATE TO authenticated
USING (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
)
WITH CHECK (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

CREATE POLICY "Users can delete narratives of their own company"
ON public.report_narratives FOR DELETE TO authenticated
USING (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

-- --- METRIC_DATA ---
DROP POLICY IF EXISTS "Users can view metric_data of their own company" ON public.metric_data;
DROP POLICY IF EXISTS "Users can insert metric_data for their own company" ON public.metric_data;
DROP POLICY IF EXISTS "Users can update metric_data of their own company" ON public.metric_data;
DROP POLICY IF EXISTS "Users can delete metric_data of their own company" ON public.metric_data;

CREATE POLICY "Users can view metrics of their own company"
ON public.metric_data FOR SELECT TO authenticated
USING (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

CREATE POLICY "Users can insert metrics of their own company"
ON public.metric_data FOR INSERT TO authenticated
WITH CHECK (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

CREATE POLICY "Users can update metrics of their own company"
ON public.metric_data FOR UPDATE TO authenticated
USING (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
)
WITH CHECK (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

CREATE POLICY "Users can delete metrics of their own company"
ON public.metric_data FOR DELETE TO authenticated
USING (
  report_id IN (SELECT id FROM public.reports WHERE company_id = get_user_company_id())
);

-- 5. Triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_report_narratives ON public.report_narratives;
CREATE TRIGGER handle_updated_at_report_narratives
  BEFORE UPDATE ON public.report_narratives
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS handle_updated_at_metric_data ON public.metric_data;
CREATE TRIGGER handle_updated_at_metric_data
  BEFORE UPDATE ON public.metric_data
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
