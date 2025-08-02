-- This policy allows users with the 'admin' role to update any report.
-- It relies on a custom JWT claim called 'user_role'.

-- 1. First, ensure RLS is enabled on the 'reports' table.
-- ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 2. Create the policy for UPDATE operations.
-- Use the expressions below in the Supabase UI.

-- Name:
--   Allow admins to update reports
--
-- Target roles:
--   authenticated
--
-- USING expression:
--   (get_my_claim('user_role'))::text = 'admin'
--
-- WITH CHECK expression:
--   (get_my_claim('user_role'))::text = 'admin'


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
