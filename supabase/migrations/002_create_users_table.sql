-- supabase/migrations/002_create_users_table.sql

-- Create the users table to store authentication information
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password text not null,
  phone text,
  role text default 'reporter' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for the users table
alter table public.users enable row level security;

-- Policies for the 'users' table

-- 1. Allow service_role to perform any action (bypass RLS)
-- This is implicitly handled by using the admin client, but it's good practice to be explicit.
-- No policy needed as service_role bypasses RLS.

-- 2. Disallow public access to user data
-- We don't want to expose user emails, password hashes, or phone numbers publicly.
-- API calls will use the service_role key to interact with this table securely.
-- By default, with RLS enabled and no policies, no one can access the data.
-- This is a secure default. We will not add any `for all` or `for select` policies.
