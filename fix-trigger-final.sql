-- 1) Clean up any old trigger/function on auth.users
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();  -- old version that did HTTP

-- 2) Ensure profiles table has ON DELETE CASCADE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  kids_ages jsonb default '[]'::jsonb,
  display_name text,
  bio text,
  interests jsonb default '[]'::jsonb,
  profile_picture_url text,
  is_supporter boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- 3) Minimal trigger function (no HTTP; only inserts)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, display_name, profile_picture_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'fullName'),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'displayName'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'avatarUrl')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 4) Recreate the trigger (AFTER INSERT on auth.users)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) RLS (so clients can read/update their own profile but not others)
alter table public.profiles enable row level security;

-- read own + public reads (if you want global read, relax this accordingly)
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile"
on public.profiles for select
using (auth.uid() = id);

-- allow user to update their own row
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- inserts are done by the trigger (SECURITY DEFINER), not by clients.

-- 6) Grants (utility; not strictly required for the trigger to run)
grant usage on schema public to anon, authenticated, service_role;
grant select, update on public.profiles to authenticated;
