-- ===========================================================================
-- FIX: RELAX RLS ON report_narratives
-- ===========================================================================
-- Reason: The strict RLS requires matching company_id in user_profiles,
-- which may not be set up correctly in all development environments or for
-- early users. This migration aligns report_narratives with the permissive
-- policies of other tables (reports, companies) for the MVP.

-- Drop conflicting strict polices
DROP POLICY IF EXISTS "Users can view narratives of their own company" ON public.report_narratives;
DROP POLICY IF EXISTS "Users can insert narratives for their own company" ON public.report_narratives;
DROP POLICY IF EXISTS "Users can update narratives of their own company" ON public.report_narratives;
DROP POLICY IF EXISTS "Users can delete narratives of their own company" ON public.report_narratives;

-- Create permissive policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can do everything with narratives" ON public.report_narratives;
CREATE POLICY "Authenticated users can do everything with narratives"
  ON public.report_narratives
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
