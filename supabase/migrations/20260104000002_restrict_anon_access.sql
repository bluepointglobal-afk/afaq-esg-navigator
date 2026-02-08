-- =============================================================================
-- T-004: Restrict Anonymous Access
-- Risk: 02_RISKS.md §2.5 — Anon Access Migration Exists
-- 
-- This migration removes anonymous access to company-scoped tables:
-- reports, metric_data, assessment_results, disclosure_outputs
-- 
-- Preserves: questionnaire_templates (read-only for onboarding detection)
-- Signup/login flows unchanged (handled by Supabase Auth, not RLS)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- REPORTS: Remove anon, keep only authenticated with company isolation
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON reports;
DROP POLICY IF EXISTS "Users can view own company reports" ON reports;
DROP POLICY IF EXISTS "Users can create own company reports" ON reports;
DROP POLICY IF EXISTS "Users can update own company reports" ON reports;
DROP POLICY IF EXISTS "Users can delete own company reports" ON reports;

-- Re-create company-isolated policies (authenticated only)
CREATE POLICY "Users can view own company reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (company_id = get_user_company_id());

CREATE POLICY "Users can create own company reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update own company reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (company_id = get_user_company_id())
  WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can delete own company reports"
  ON reports
  FOR DELETE
  TO authenticated
  USING (company_id = get_user_company_id());

-- -----------------------------------------------------------------------------
-- METRIC_DATA: Remove anon, restrict to authenticated + company chain
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON metric_data;
DROP POLICY IF EXISTS "Authenticated users can do everything with metric_data" ON metric_data;

CREATE POLICY "Users can view own company metrics"
  ON metric_data
  FOR SELECT
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can create own company metrics"
  ON metric_data
  FOR INSERT
  TO authenticated
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can update own company metrics"
  ON metric_data
  FOR UPDATE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  )
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can delete own company metrics"
  ON metric_data
  FOR DELETE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

-- -----------------------------------------------------------------------------
-- ASSESSMENT_RESULTS: Remove anon, apply company isolation
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON assessment_results;
DROP POLICY IF EXISTS "Users can view own company assessments" ON assessment_results;
DROP POLICY IF EXISTS "Users can create own company assessments" ON assessment_results;
DROP POLICY IF EXISTS "Users can update own company assessments" ON assessment_results;
DROP POLICY IF EXISTS "Users can delete own company assessments" ON assessment_results;

CREATE POLICY "Users can view own company assessments"
  ON assessment_results
  FOR SELECT
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can create own company assessments"
  ON assessment_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can update own company assessments"
  ON assessment_results
  FOR UPDATE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  )
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can delete own company assessments"
  ON assessment_results
  FOR DELETE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

-- -----------------------------------------------------------------------------
-- DISCLOSURE_OUTPUTS: Remove anon, apply company isolation
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON disclosure_outputs;
DROP POLICY IF EXISTS "Users can view own company disclosures" ON disclosure_outputs;
DROP POLICY IF EXISTS "Users can create own company disclosures" ON disclosure_outputs;
DROP POLICY IF EXISTS "Users can update own company disclosures" ON disclosure_outputs;
DROP POLICY IF EXISTS "Users can delete own company disclosures" ON disclosure_outputs;

CREATE POLICY "Users can view own company disclosures"
  ON disclosure_outputs
  FOR SELECT
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can create own company disclosures"
  ON disclosure_outputs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can update own company disclosures"
  ON disclosure_outputs
  FOR UPDATE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  )
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can delete own company disclosures"
  ON disclosure_outputs
  FOR DELETE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

-- -----------------------------------------------------------------------------
-- COMPANIES: Remove anon access, keep company isolation
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON companies;
DROP POLICY IF EXISTS "Users can view own company" ON companies;
DROP POLICY IF EXISTS "Users can update own company" ON companies;
DROP POLICY IF EXISTS "Users can create company" ON companies;

CREATE POLICY "Users can view own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (id = get_user_company_id());

CREATE POLICY "Users can update own company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (id = get_user_company_id())
  WITH CHECK (id = get_user_company_id());

CREATE POLICY "Users can create company"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- QUESTIONNAIRE_RESPONSES: Remove anon access, apply company isolation
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON questionnaire_responses;
DROP POLICY IF EXISTS "Users can view own company responses" ON questionnaire_responses;
DROP POLICY IF EXISTS "Users can create own company responses" ON questionnaire_responses;
DROP POLICY IF EXISTS "Users can update own company responses" ON questionnaire_responses;
DROP POLICY IF EXISTS "Users can delete own company responses" ON questionnaire_responses;

CREATE POLICY "Users can view own company responses"
  ON questionnaire_responses
  FOR SELECT
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can create own company responses"
  ON questionnaire_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can update own company responses"
  ON questionnaire_responses
  FOR UPDATE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  )
  WITH CHECK (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

CREATE POLICY "Users can delete own company responses"
  ON questionnaire_responses
  FOR DELETE
  TO authenticated
  USING (
    report_id IN (
      SELECT id FROM reports WHERE company_id = get_user_company_id()
    )
  );

-- -----------------------------------------------------------------------------
-- USER_PROFILES: Restore proper self-only access
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;

CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- -----------------------------------------------------------------------------
-- QUESTIONNAIRE_TEMPLATES: Keep authenticated read-only (no anon)
-- Templates are needed for framework detection but not sensitive
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon access for testing" ON questionnaire_templates;
DROP POLICY IF EXISTS "Authenticated users can read templates" ON questionnaire_templates;
DROP POLICY IF EXISTS "Authenticated users can create templates" ON questionnaire_templates;

CREATE POLICY "Authenticated users can read templates"
  ON questionnaire_templates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create templates"
  ON questionnaire_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- COMMENTS
-- -----------------------------------------------------------------------------
COMMENT ON POLICY "Users can view own company reports" ON reports IS 'T-004: Anon access removed, company isolation applied';
COMMENT ON POLICY "Users can view own company metrics" ON metric_data IS 'T-004: Anon access removed, company isolation applied';
COMMENT ON POLICY "Users can view own company assessments" ON assessment_results IS 'T-004: Anon access removed, company isolation applied';
COMMENT ON POLICY "Users can view own company disclosures" ON disclosure_outputs IS 'T-004: Anon access removed, company isolation applied';
