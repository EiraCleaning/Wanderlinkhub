-- Add profile_picture_url field to profiles table
ALTER TABLE profiles 
ADD COLUMN profile_picture_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.profile_picture_url IS 'URL of the user profile picture';
