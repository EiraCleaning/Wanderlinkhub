-- Create a minimal, safe trigger that only creates the profile
-- This runs inside the Auth transaction but doesn't make HTTP calls

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    full_name, 
    kids_ages,
    display_name,
    bio,
    interests,
    profile_picture_url,
    is_supporter,
    stripe_customer_id,
    created_at
  )
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    '[]'::jsonb,
    new.raw_user_meta_data->>'full_name',
    null,
    '[]'::jsonb,
    null,
    false,
    null,
    now()
  )
  on conflict (id) do nothing;
  return new;
end; $$;

-- Drop the old trigger and create the new one
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
