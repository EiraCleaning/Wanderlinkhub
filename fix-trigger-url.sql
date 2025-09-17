-- Update the trigger to use the correct Vercel URL
-- This should be run in Supabase SQL Editor

-- First, let's check what the current trigger looks like
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Update the trigger to use the correct URL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table with all required fields
  INSERT INTO public.profiles (
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
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    '[]'::jsonb,
    NEW.raw_user_meta_data->>'full_name',
    NULL,
    '[]'::jsonb,
    NULL,
    false,
    NULL,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
