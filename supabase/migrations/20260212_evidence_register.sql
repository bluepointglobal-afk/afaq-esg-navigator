-- Evidence Register Table
-- Stores uploaded evidence documents linked to questionnaire responses

CREATE TABLE IF NOT EXISTS evidence_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT, -- 'pdf', 'image', 'excel', 'document'
  file_size INTEGER, -- bytes
  uploaded_by UUID REFERENCES auth.users(id),
  verification_status TEXT DEFAULT 'preliminary' CHECK (verification_status IN ('preliminary', 'verified', 'audited')),
  tags TEXT[], -- ['policy', 'certificate', 'calculation', 'report']
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_evidence_report_id ON evidence_register(report_id);
CREATE INDEX IF NOT EXISTS idx_evidence_question_id ON evidence_register(question_id);
CREATE INDEX IF NOT EXISTS idx_evidence_uploaded_by ON evidence_register(uploaded_by);

-- RLS Policies
ALTER TABLE evidence_register ENABLE ROW LEVEL SECURITY;

-- Users can only see evidence for their company's reports
CREATE POLICY "Users can view own company evidence"
  ON evidence_register FOR SELECT
  USING (
    report_id IN (
      SELECT r.id FROM reports r
      INNER JOIN user_profiles up ON r.company_id = up.company_id
      WHERE up.id = auth.uid()
    )
  );

-- Users can insert evidence for their company's reports
CREATE POLICY "Users can upload evidence for own reports"
  ON evidence_register FOR INSERT
  WITH CHECK (
    report_id IN (
      SELECT r.id FROM reports r
      INNER JOIN user_profiles up ON r.company_id = up.company_id
      WHERE up.id = auth.uid()
    )
  );

-- Users can update their own evidence
CREATE POLICY "Users can update own evidence"
  ON evidence_register FOR UPDATE
  USING (uploaded_by = auth.uid());

-- Users can delete their own evidence
CREATE POLICY "Users can delete own evidence"
  ON evidence_register FOR DELETE
  USING (uploaded_by = auth.uid());

-- Audit Trail Table
CREATE TABLE IF NOT EXISTS evidence_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID REFERENCES evidence_register(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'verified', 'downloaded')),
  performed_by UUID REFERENCES auth.users(id),
  changes JSONB, -- Store old/new values
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index for audit log
CREATE INDEX IF NOT EXISTS idx_audit_evidence_id ON evidence_audit_log(evidence_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON evidence_audit_log(timestamp DESC);

-- RLS for audit log
ALTER TABLE evidence_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit log for own evidence"
  ON evidence_audit_log FOR SELECT
  USING (
    evidence_id IN (
      SELECT er.id FROM evidence_register er
      INNER JOIN reports r ON er.report_id = r.id
      INNER JOIN user_profiles up ON r.company_id = up.company_id
      WHERE up.id = auth.uid()
    )
  );

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_evidence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evidence_updated_at
  BEFORE UPDATE ON evidence_register
  FOR EACH ROW
  EXECUTE FUNCTION update_evidence_updated_at();

-- Trigger to log evidence changes
CREATE OR REPLACE FUNCTION log_evidence_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO evidence_audit_log (evidence_id, action, performed_by, changes)
    VALUES (NEW.id, 'created', auth.uid(), to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO evidence_audit_log (evidence_id, action, performed_by, changes)
    VALUES (NEW.id, 'updated', auth.uid(), jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO evidence_audit_log (evidence_id, action, performed_by, changes)
    VALUES (OLD.id, 'deleted', auth.uid(), to_jsonb(OLD));
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evidence_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON evidence_register
  FOR EACH ROW
  EXECUTE FUNCTION log_evidence_changes();
