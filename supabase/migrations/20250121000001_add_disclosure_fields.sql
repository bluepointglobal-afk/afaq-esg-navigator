-- Add missing fields to disclosure_outputs table for Step 4

-- Add template tracking fields
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS template_id text;
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS template_version text;
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS listing_status text CHECK (listing_status IN ('listed', 'non-listed'));

-- Add status tracking
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'exported'));

-- Add quality checklist and errors
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS quality_checklist jsonb DEFAULT '[]'::jsonb;
ALTER TABLE disclosure_outputs ADD COLUMN IF NOT EXISTS errors jsonb DEFAULT '[]'::jsonb;

-- Add constraints
ALTER TABLE disclosure_outputs ADD CONSTRAINT quality_checklist_is_array CHECK (jsonb_typeof(quality_checklist) = 'array');
ALTER TABLE disclosure_outputs ADD CONSTRAINT errors_is_array CHECK (jsonb_typeof(errors) = 'array');

-- Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_disclosure_outputs_template_id ON disclosure_outputs(template_id);
CREATE INDEX IF NOT EXISTS idx_disclosure_outputs_status ON disclosure_outputs(status);
CREATE INDEX IF NOT EXISTS idx_disclosure_outputs_listing_status ON disclosure_outputs(listing_status);

-- Add comments
COMMENT ON COLUMN disclosure_outputs.template_id IS 'Template ID used for generation (e.g., UAE_LISTED_V1)';
COMMENT ON COLUMN disclosure_outputs.status IS 'Disclosure status: draft, final, or exported';
COMMENT ON COLUMN disclosure_outputs.quality_checklist IS 'Array of quality check results';
COMMENT ON COLUMN disclosure_outputs.errors IS 'Array of errors encountered during generation';
