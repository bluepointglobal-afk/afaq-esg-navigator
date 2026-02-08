-- TESTING ONLY: Allow anonymous access to all tables
-- REMOVE THIS IN PRODUCTION

-- Companies
DROP POLICY IF EXISTS "Authenticated users can do everything with companies" ON companies;
DROP POLICY IF EXISTS "Allow anon access for testing" ON companies;
CREATE POLICY "Allow anon access for testing"
  ON companies
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Reports
DROP POLICY IF EXISTS "Authenticated users can do everything with reports" ON reports;
DROP POLICY IF EXISTS "Allow anon access for testing" ON reports;
CREATE POLICY "Allow anon access for testing"
  ON reports
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Questionnaire Templates
DROP POLICY IF EXISTS "Authenticated users can read templates" ON questionnaire_templates;
DROP POLICY IF EXISTS "Authenticated users can create templates" ON questionnaire_templates;
DROP POLICY IF EXISTS "Allow anon access for testing" ON questionnaire_templates;
CREATE POLICY "Allow anon access for testing"
  ON questionnaire_templates
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Questionnaire Responses
DROP POLICY IF EXISTS "Authenticated users can do everything with responses" ON questionnaire_responses;
DROP POLICY IF EXISTS "Allow anon access for testing" ON questionnaire_responses;
CREATE POLICY "Allow anon access for testing"
  ON questionnaire_responses
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Assessment Results
DROP POLICY IF EXISTS "Authenticated users can do everything with assessments" ON assessment_results;
DROP POLICY IF EXISTS "Allow anon access for testing" ON assessment_results;
CREATE POLICY "Allow anon access for testing"
  ON assessment_results
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Disclosure Outputs
DROP POLICY IF EXISTS "Authenticated users can do everything with disclosures" ON disclosure_outputs;
DROP POLICY IF EXISTS "Allow anon access for testing" ON disclosure_outputs;
CREATE POLICY "Allow anon access for testing"
  ON disclosure_outputs
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- User Profiles (for edge function)
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow anon access for testing" ON user_profiles;
CREATE POLICY "Allow anon access for testing"
  ON user_profiles
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
