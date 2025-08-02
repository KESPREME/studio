-- Enable Row-Level Security (RLS) on the 'reports' table.
-- This is the first and most important step. Without this, no policies will be enforced.
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 1. Policy for SELECT (Read) operations
-- This policy allows any user who is authenticated (logged in) to view all reports.
-- This is necessary for both the reporter and admin dashboards to function correctly.
CREATE POLICY "Allow authenticated users to read all reports"
ON public.reports
FOR SELECT
TO authenticated
USING (true);

-- 2. Policy for INSERT (Create) operations
-- This policy allows any authenticated user to create a new report.
-- The `auth.uid()` function gets the unique ID of the currently logged-in user.
CREATE POLICY "Allow authenticated users to create reports"
ON public.reports
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Policy for UPDATE operations
-- This policy restricts updates to only be performed by admin users.
-- NOTE: This policy assumes you have a way to identify admins.
-- For this application, updates are done via a server action with the master key,
-- so this policy acts as a safeguard.
-- It checks a custom claim 'user_role' on the user object. You'd need to set up a trigger
-- in Supabase to add this claim to users upon sign-up or role change.
-- For simplicity, we will check against the user email for the demo admin.
CREATE POLICY "Allow admins to update reports"
ON public.reports
FOR UPDATE
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'responder@ndrf.gov.in')
WITH CHECK ((SELECT auth.jwt() ->> 'email') = 'responder@ndrf.gov.in');


-- 4. Policy for DELETE operations
-- This policy restricts deletions to only be performed by admin users.
-- This uses the same logic as the update policy to identify an admin.
CREATE POLICY "Allow admins to delete reports"
ON public.reports
FOR DELETE
TO authenticated
USING ((SELECT auth.jwt() ->> 'email') = 'responder@ndrf.gov.in');
