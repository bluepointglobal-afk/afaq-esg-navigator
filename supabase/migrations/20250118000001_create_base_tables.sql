-- Create base tables that are missing from the database
-- These tables are required for the compliance questionnaire flow

-- ===========================================================================
-- COMPANIES TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_arabic text,
  country text NOT NULL,
  industry text NOT NULL,
  industry_subsector text,
  employee_count integer,
  annual_revenue numeric,
  revenue_currency text NOT NULL DEFAULT 'AED',
  is_listed boolean NOT NULL DEFAULT false,
  stock_exchange text,
  fiscal_year_end integer NOT NULL DEFAULT 12,
  logo_url text,
  primary_color text DEFAULT '#0066CC',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything (simplified for MVP)
DROP POLICY IF EXISTS "Authenticated users can do everything with companies" ON companies;
CREATE POLICY "Authenticated users can do everything with companies"
  ON companies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===========================================================================
-- USER_PROFILES TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text NOT NULL,
  company_id uuid REFERENCES companies(id) ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'user',
  tier text NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own profile
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ===========================================================================
-- REPORTS TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  reporting_year integer NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  overall_completion_pct numeric(5,2) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything (simplified for MVP)
DROP POLICY IF EXISTS "Authenticated users can do everything with reports" ON reports;
CREATE POLICY "Authenticated users can do everything with reports"
  ON reports
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===========================================================================
-- QUESTIONNAIRE_TEMPLATES TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS questionnaire_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  jurisdiction text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE questionnaire_templates ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read templates
DROP POLICY IF EXISTS "Authenticated users can read templates" ON questionnaire_templates;
CREATE POLICY "Authenticated users can read templates"
  ON questionnaire_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to create templates (for auto-generation)
DROP POLICY IF EXISTS "Authenticated users can create templates" ON questionnaire_templates;
CREATE POLICY "Authenticated users can create templates"
  ON questionnaire_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ===========================================================================
-- QUESTIONNAIRE_RESPONSES TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES questionnaire_templates(id) ON DELETE RESTRICT,
  template_version text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything
DROP POLICY IF EXISTS "Authenticated users can do everything with responses" ON questionnaire_responses;
CREATE POLICY "Authenticated users can do everything with responses"
  ON questionnaire_responses
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===========================================================================
-- ASSESSMENT_RESULTS TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  questionnaire_response_id uuid NOT NULL REFERENCES questionnaire_responses(id) ON DELETE CASCADE,
  overall_score numeric(5,2) NOT NULL,
  pillar_scores jsonb NOT NULL DEFAULT '[]'::jsonb,
  gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
  gap_count integer NOT NULL DEFAULT 0,
  critical_gap_count integer NOT NULL DEFAULT 0,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  explanation jsonb NOT NULL DEFAULT '{}'::jsonb,
  assessed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything
DROP POLICY IF EXISTS "Authenticated users can do everything with assessments" ON assessment_results;
CREATE POLICY "Authenticated users can do everything with assessments"
  ON assessment_results
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===========================================================================
-- DISCLOSURE_OUTPUTS TABLE
-- ===========================================================================

CREATE TABLE IF NOT EXISTS disclosure_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessment_results(id) ON DELETE CASCADE,
  template_id text,
  version text NOT NULL,
  jurisdiction text NOT NULL,
  generated_for_company text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  evidence_appendix jsonb NOT NULL DEFAULT '[]'::jsonb,
  disclaimers jsonb NOT NULL DEFAULT '[]'::jsonb,
  quality_checklist jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'draft',
  generated_at timestamptz NOT NULL DEFAULT now(),
  generated_by uuid REFERENCES auth.users(id),
  format text NOT NULL DEFAULT 'json',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE disclosure_outputs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to do everything
DROP POLICY IF EXISTS "Authenticated users can do everything with disclosures" ON disclosure_outputs;
CREATE POLICY "Authenticated users can do everything with disclosures"
  ON disclosure_outputs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ===========================================================================
-- HELPER FUNCTION
-- ===========================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================================================
-- COMMENTS
-- ===========================================================================

COMMENT ON TABLE companies IS 'Company profiles for multi-tenant ESG platform';
COMMENT ON TABLE user_profiles IS 'Extended user profiles with company association and tier';
COMMENT ON TABLE reports IS 'ESG compliance reports per company per year';
COMMENT ON TABLE questionnaire_templates IS 'Questionnaire templates by jurisdiction';
COMMENT ON TABLE questionnaire_responses IS 'User responses to questionnaires';
COMMENT ON TABLE assessment_results IS 'Compliance assessment results';
COMMENT ON TABLE disclosure_outputs IS 'Generated disclosure documents';
