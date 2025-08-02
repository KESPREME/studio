-- Create a table for public user profiles
create table users (
  id uuid not null references auth.users on delete cascade,
  email text unique,
  password text,
  phone text,
  role text,
  primary key (id)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table users
  enable row level security;

create policy "Public users are viewable by everyone." on users
  for select using (true);

-- cannot update users from client
-- create policy "Users can insert their own profile." on users
--   for insert with check (auth.uid() = id);

-- create policy "Users can update own profile." on users
--   for update using (auth.uid() = id);


-- Seed a default admin user
-- The password is 'password123' hashed with bcrypt
INSERT INTO users (id, email, password, role)
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'responder@ndrf.gov.in', '$2a$10$9.p2h7z8.3b5j6d7f8g9hOeK5o4c3b2a1Y0Z/X.W.v.s.u.i.O.e.W', 'admin');
