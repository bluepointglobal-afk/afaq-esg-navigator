-- =============================================================================
-- T-006: Enforce One Report per Company per Year
-- Risk: 02_RISKS.md §3.3 — No Uniqueness on Report Per Company/Year
-- 
-- This migration adds a unique constraint to the reports table to ensure a
-- company cannot have multiple reports for the same year.
-- =============================================================================

-- 1. Remove any existing duplicates (keep most recent)
-- Delete older duplicate reports, keeping only the most recent one per company/year
DELETE FROM public.reports
WHERE id IN (
  SELECT r1.id
  FROM public.reports r1
  INNER JOIN (
    SELECT company_id, reporting_year, MAX(created_at) as max_created
    FROM public.reports
    GROUP BY company_id, reporting_year
    HAVING COUNT(*) > 1
  ) r2 ON r1.company_id = r2.company_id
      AND r1.reporting_year = r2.reporting_year
  WHERE r1.created_at < r2.max_created
);

-- 2. Add the unique constraint
ALTER TABLE public.reports 
ADD CONSTRAINT unique_company_report_year 
UNIQUE (company_id, reporting_year);

-- 3. Comments
COMMENT ON CONSTRAINT unique_company_report_year ON public.reports 
IS 'T-006: Enforce that each company has only one report per reporting year.';
