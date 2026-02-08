-- =============================================================================
-- T-006: Enforce One Report per Company per Year
-- Risk: 02_RISKS.md §3.3 — No Uniqueness on Report Per Company/Year
-- 
-- This migration adds a unique constraint to the reports table to ensure a
-- company cannot have multiple reports for the same year.
-- =============================================================================

-- 1. Identify any existing duplicates (just in case)
-- In a brownfield, we should check if this constraint will fail immediately.
-- If duplicates exist, we should ideally handle them or the migration will fail.

-- 2. Add the unique constraint
ALTER TABLE public.reports 
ADD CONSTRAINT unique_company_report_year 
UNIQUE (company_id, reporting_year);

-- 3. Comments
COMMENT ON CONSTRAINT unique_company_report_year ON public.reports 
IS 'T-006: Enforce that each company has only one report per reporting year.';
