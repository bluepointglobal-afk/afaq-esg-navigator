-- Allow null generated_by for testing (no auth user)
ALTER TABLE disclosure_outputs 
  ALTER COLUMN generated_by DROP NOT NULL;

-- Drop the foreign key constraint temporarily for testing
ALTER TABLE disclosure_outputs
  DROP CONSTRAINT IF EXISTS disclosure_outputs_generated_by_fkey;
