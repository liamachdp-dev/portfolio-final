-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query)

create extension if not exists "uuid-ossp";

create table if not exists recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar_url text,
  message text not null check (char_length(message) between 1 and 800),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Prevent one Google account from spamming multiple submissions.
-- Remove this if you want to allow multiple recommendations per person.
create unique index if not exists recommendations_one_per_user
  on recommendations (user_id);

alter table recommendations enable row level security;

-- Anyone (even logged-out visitors) can read APPROVED recommendations.
-- This is what powers the public "Recommendations" section.
create policy "public can read approved recommendations"
  on recommendations for select
  using (status = 'approved');

-- A signed-in visitor can read their OWN submission regardless of
-- status, so they can see "pending review" on their own message.
create policy "users can read their own recommendation"
  on recommendations for select
  using (auth.uid() = user_id);

-- A signed-in visitor can insert exactly one row, for themselves,
-- always starting as 'pending'. They cannot set status directly.
create policy "users can insert their own recommendation"
  on recommendations for insert
  with check (auth.uid() = user_id and status = 'pending');

-- No update/delete policy is defined for regular users on purpose --
-- approve/reject is done server-side via the service role key in
-- app/api/recommendations/[id]/route.ts, gated by ADMIN_EMAIL.
