-- POLICY: Allow admins to update any report.
-- This policy checks for a claim called 'user_role' in the user's app_metadata.
-- You must ensure your Supabase JWT for admin users contains this claim.
CREATE POLICY "Allow admins to update reports"
ON public.reports
FOR UPDATE
TO authenticated
USING (((auth.jwt() -> 'app_metadata') ->> 'user_role') = 'admin')
WITH check (((auth.jwt() -> 'app_metadata') ->> 'user_role') = 'admin');

-- Note: For this policy to work, you need to set custom claims for your users.
-- When a user signs up or is created, you can set their role in the app_metadata.
-- For example, when creating a user on the server-side:
/*
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@example.com',
    password: 'some-password',
    app_metadata: {
      user_role: 'admin'
    }
  })
*/
