-- Add missing structured columns to report_narratives table
-- These were defined in 20260104000004 but not created because table already existed

DO $$
BEGIN
  -- Add gov_structured if missing
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'report_narratives' AND column_name = 'gov_structured') THEN
    ALTER TABLE public.report_narratives ADD COLUMN gov_structured jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add esg_structured if missing
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'report_narratives' AND column_name = 'esg_structured') THEN
    ALTER TABLE public.report_narratives ADD COLUMN esg_structured jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add risk_structured if missing
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'report_narratives' AND column_name = 'risk_structured') THEN
    ALTER TABLE public.report_narratives ADD COLUMN risk_structured jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add transparency_structured if missing
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'report_narratives' AND column_name = 'transparency_structured') THEN
    ALTER TABLE public.report_narratives ADD COLUMN transparency_structured jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add updated_by if missing
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'report_narratives' AND column_name = 'updated_by') THEN
    ALTER TABLE public.report_narratives ADD COLUMN updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;
