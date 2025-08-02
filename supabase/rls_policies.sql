-- First, ensure RLS is enabled on the 'reports' table.
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- POLICY: Allow admins to update any report.
-- This policy checks for a custom JWT claim called 'user_role'.
-- You must ensure your Supabase JWT for admin users contains this claim.
CREATE POLICY "Allow admins to update reports"
ON public.reports
FOR UPDATE
TO authenticated
USING (
  (get_my_claim('user_role'))::text = 'admin'
)
WITH CHECK (
  (get_my_claim('user_role'))::text = 'admin'
);

-- Note: This is an example policy. You might also need policies for SELECT, INSERT, and DELETE.
-- For example, allowing any authenticated user to create a report:
/*
CREATE POLICY "Allow authenticated users to create reports"
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK (true);
*/

-- And allowing any authenticated user to view all reports:
/*
CREATE POLICY "Allow authenticated users to view all reports"
ON public.reports
FOR SELECT
TO authenticated
USING (true);
*/
