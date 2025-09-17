-- Add new fields to profiles table for profile settings
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[];

-- Create index for better performance on display_name searches
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);

-- Update existing profiles with default values if they're empty
UPDATE profiles 
SET 
  display_name = COALESCE(display_name, split_part(email, '@', 1)),
  bio = COALESCE(bio, ''),
  interests = COALESCE(interests, ARRAY[]::TEXT[])
WHERE display_name IS NULL OR bio IS NULL OR interests IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN profiles.display_name IS 'User-chosen display name for public profile';
COMMENT ON COLUMN profiles.bio IS 'User bio/description text';
COMMENT ON COLUMN profiles.interests IS 'Array of user interests/tags';
