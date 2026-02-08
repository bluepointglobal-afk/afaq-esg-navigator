-- =============================================================================
-- T-002: Fix RLS Policies for Company Isolation
-- Risk: 02_RISKS.md §2.2 — Permissive RLS Policies
-- 
-- This migration replaces permissive USING(true) policies with ownership-based
-- policies that check the user's company_id via the user_profiles table.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- HELPER FUNCTION: Get current user's company_id
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS uuid AS $$
  SELECT company_id FROM user_profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -----------------------------------------------------------------------------
-- COMPANIES: Users can only access their own company
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can do everything with companies" ON companies;

-- Users can SELECT their own company
CREATE POLICY "Users can view own company"
  ON companies
  FOR SELECT
  TO authenticated
  USING (id = get_user_company_id());

-- Users can UPDATE their own company
CREATE POLICY "Users can update own company"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (id = get_user_company_id())
  WITH CHECK (id = get_user_company_id());

-- Users can INSERT a new company (for onboarding - no company_id yet)
CREATE POLICY "Users can create company"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users cannot DELETE companies (soft delete pattern preferred)
-- No DELETE policy = no delete allowed

-- -----------------------------------------------------------------------------
-- REPORTS: Users can only access reports for their company
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can do everything with reports" ON reports;

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
-- QUESTIONNAIRE_RESPONSES: Via report → company chain
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can do everything with responses" ON questionnaire_responses;

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
-- ASSESSMENT_RESULTS: Via report → company chain
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can do everything with assessments" ON assessment_results;

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
-- DISCLOSURE_OUTPUTS: Via report → company chain
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can do everything with disclosures" ON disclosure_outputs;

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
-- COMMENTS
-- -----------------------------------------------------------------------------
COMMENT ON FUNCTION get_user_company_id() IS 'Returns the company_id for the current authenticated user';
