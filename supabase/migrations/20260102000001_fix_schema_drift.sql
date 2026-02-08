-- ===========================================================================
-- FIX: SCHEMA DRIFT FOR report_narratives
-- ===========================================================================
-- The database seems to have been initialized with an older version of the
-- migration that used 'governance_text' and a surrogate 'id' key.
-- The current codebase expects 'gov_text' and 'report_id' as the PRIMARY KEY.
-- This migration aligns the database with the codebase.

-- 1. Rename 'governance_text' to 'gov_text' if it exists in the old format
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'report_narratives' AND column_name = 'governance_text') THEN
    ALTER TABLE report_narratives RENAME COLUMN governance_text TO gov_text;
  END IF;
END $$;

-- 2. Drop surrogate 'id' column and set 'report_id' as Primary Key
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'report_narratives' AND column_name = 'id') THEN
    -- Drop old PK constraint
    ALTER TABLE report_narratives DROP CONSTRAINT IF EXISTS report_narratives_pkey;
    
    -- Drop the 'id' column
    ALTER TABLE report_narratives DROP COLUMN id;
    
    -- Set new PK
    ALTER TABLE report_narratives ADD PRIMARY KEY (report_id);
  END IF;
END $$;
