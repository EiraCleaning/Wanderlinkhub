-- Add profile_picture column to profiles table
ALTER TABLE profiles 
ADD COLUMN profile_picture TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN profiles.profile_picture IS 'URL to the user profile picture stored in Supabase Storage';
