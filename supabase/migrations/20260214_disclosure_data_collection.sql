-- Migration: ESG Disclosure Data Collection Tables
-- Created: 2026-02-14
-- Purpose: Support enhanced disclosure generation with narratives, metrics, and materiality

-- Table 1: Report Narratives (CEO message, pillars, strategy, case studies)
CREATE TABLE IF NOT EXISTS report_narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,

  -- CEO/Leadership Message
  ceo_message_format TEXT CHECK (ceo_message_format IN ('full_text', 'bullet_points')),
  ceo_message_content TEXT,
  tone_of_voice TEXT DEFAULT 'authentic' CHECK (
    tone_of_voice IN ('professional', 'pragmatic', 'authentic', 'technical', 'visionary')
  ),

  -- Materiality Assessment
  materiality_ratings JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{topic: string, business_impact: 1-5, societal_impact: 1-5, custom: boolean}]

  materiality_analysis TEXT, -- AI-generated analysis

  -- ESG Pillars/Focus Areas
  esg_pillars JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{name: string, rationale: string, actions: string[], target: string}]

  esg_strategy_oneliner TEXT,

  -- Targets & Commitments
  targets JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{what: string, by_when: string, baseline: string, progress: string, status: string}]

  has_formal_targets BOOLEAN DEFAULT FALSE,

  -- Case Studies
  case_studies JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{title: string, format: 'bullets'|'story', challenge: string, action: string, impact: string, photo_url: string}]

  -- Governance
  esg_oversight TEXT,
  risk_management TEXT,
  policies JSONB DEFAULT '[]'::jsonb, -- Array of policy names

  -- Phase 2 (optional detailed narratives)
  climate_strategy JSONB,
  stakeholder_engagement TEXT,

  -- Metadata
  completeness_score INTEGER DEFAULT 0 CHECK (completeness_score >= 0 AND completeness_score <= 100),
  phase_completed INTEGER DEFAULT 1 CHECK (phase_completed IN (1, 2)),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one narratives record per report
  UNIQUE(report_id)
);

-- Table 2: Report Metrics (quantitative data)
CREATE TABLE IF NOT EXISTS report_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,

  -- Emissions (nullable - OK if not available)
  scope1_tonnes_co2e NUMERIC(10, 2),
  scope2_tonnes_co2e NUMERIC(10, 2),
  scope3_calculated BOOLEAN DEFAULT FALSE,
  scope3_tonnes_co2e NUMERIC(10, 2),

  -- Energy
  total_energy_kwh NUMERIC(12, 2),
  renewable_energy_percent NUMERIC(5, 2) CHECK (renewable_energy_percent >= 0 AND renewable_energy_percent <= 100),

  -- Water (optional)
  water_consumption_m3 NUMERIC(10, 2),

  -- Waste (optional)
  total_waste_tonnes NUMERIC(10, 2),
  waste_recycled_percent NUMERIC(5, 2),

  -- Workforce
  total_employees INTEGER,
  percent_women NUMERIC(5, 2) CHECK (percent_women >= 0 AND percent_women <= 100),
  percent_women_leadership NUMERIC(5, 2) CHECK (percent_women_leadership >= 0 AND percent_women_leadership <= 100),
  employee_turnover_percent NUMERIC(5, 2),
  training_hours_per_employee NUMERIC(6, 2),

  -- Health & Safety
  lost_time_injuries INTEGER DEFAULT 0,
  safety_training_hours NUMERIC(8, 2),
  fatalities INTEGER DEFAULT 0,

  -- Supply Chain (optional)
  suppliers_assessed_esg INTEGER,
  local_suppliers_percent NUMERIC(5, 2),

  -- Data Quality Metadata
  data_quality TEXT DEFAULT 'estimated' CHECK (
    data_quality IN ('estimated', 'measured', 'verified', 'audited')
  ),
  baseline_year INTEGER,
  reporting_period_start DATE,
  reporting_period_end DATE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one metrics record per report
  UNIQUE(report_id)
);

-- Table 3: Report Evidence (uploaded documents and photos)
CREATE TABLE IF NOT EXISTS report_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,

  file_name TEXT NOT NULL,
  file_type TEXT, -- 'image', 'pdf', 'spreadsheet', 'document'
  storage_path TEXT NOT NULL, -- Supabase Storage path
  file_size_bytes INTEGER,
  mime_type TEXT,

  evidence_type TEXT CHECK (
    evidence_type IN ('initiative_photo', 'utility_bill', 'policy_doc', 'certification', 'other')
  ),
  description TEXT,

  -- AI-extracted data (if applicable)
  extracted_data JSONB,
  extraction_status TEXT CHECK (
    extraction_status IN ('pending', 'processing', 'completed', 'failed', 'not_applicable')
  ) DEFAULT 'not_applicable',

  -- Link to specific case study or metric
  linked_case_study_index INTEGER, -- Index in case_studies array
  linked_metric_type TEXT, -- e.g., 'energy', 'emissions', 'safety'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_report_narratives_report_id ON report_narratives(report_id);
CREATE INDEX IF NOT EXISTS idx_report_metrics_report_id ON report_metrics(report_id);
CREATE INDEX IF NOT EXISTS idx_report_evidence_report_id ON report_evidence(report_id);
CREATE INDEX IF NOT EXISTS idx_report_evidence_type ON report_evidence(evidence_type);

-- Updated_at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_report_narratives_updated_at ON report_narratives;
CREATE TRIGGER update_report_narratives_updated_at
  BEFORE UPDATE ON report_narratives
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_report_metrics_updated_at ON report_metrics;
CREATE TRIGGER update_report_metrics_updated_at
  BEFORE UPDATE ON report_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (users can only access their company's reports)

-- report_narratives RLS
ALTER TABLE report_narratives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's narratives"
  ON report_narratives FOR SELECT
  USING (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company's narratives"
  ON report_narratives FOR INSERT
  WITH CHECK (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's narratives"
  ON report_narratives FOR UPDATE
  USING (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

-- report_metrics RLS
ALTER TABLE report_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's metrics"
  ON report_metrics FOR SELECT
  USING (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company's metrics"
  ON report_metrics FOR INSERT
  WITH CHECK (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

CREATE POLICY "Users can update their company's metrics"
  ON report_metrics FOR UPDATE
  USING (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

-- report_evidence RLS
ALTER TABLE report_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their company's evidence"
  ON report_evidence FOR SELECT
  USING (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their company's evidence"
  ON report_evidence FOR INSERT
  WITH CHECK (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their company's evidence"
  ON report_evidence FOR DELETE
  USING (
    report_id IN (
      SELECT r.id FROM reports r
      JOIN user_profiles up ON up.company_id = r.company_id
      WHERE up.id = auth.uid()
    )
  );

-- Grant service role full access (for backend worker)
GRANT ALL ON report_narratives TO service_role;
GRANT ALL ON report_metrics TO service_role;
GRANT ALL ON report_evidence TO service_role;

-- Comments for documentation
COMMENT ON TABLE report_narratives IS 'Qualitative ESG narratives: CEO message, strategy, pillars, case studies';
COMMENT ON TABLE report_metrics IS 'Quantitative ESG metrics: emissions, energy, workforce, safety';
COMMENT ON TABLE report_evidence IS 'Uploaded evidence files: photos, bills, documents';
COMMENT ON COLUMN report_narratives.tone_of_voice IS 'Controls AI narrative style: professional, pragmatic, authentic, technical, visionary';
COMMENT ON COLUMN report_narratives.materiality_ratings IS 'Double materiality assessment results';
COMMENT ON COLUMN report_metrics.data_quality IS 'Indicates reliability: estimated, measured, verified, audited';
