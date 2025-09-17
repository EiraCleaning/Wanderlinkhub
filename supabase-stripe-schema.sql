-- Add is_supporter field to profiles table
ALTER TABLE profiles 
ADD COLUMN is_supporter BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN profiles.is_supporter IS 'Whether the user is a Founding Supporter subscriber';

-- Create index for faster queries
CREATE INDEX idx_profiles_is_supporter ON profiles(is_supporter);
