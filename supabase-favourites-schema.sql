-- Create favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only favourite a listing once
  UNIQUE(user_id, listing_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_listing_id ON favourites(listing_id);

-- Enable Row Level Security
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own favourites
CREATE POLICY "Users can view their own favourites" ON favourites
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favourites
CREATE POLICY "Users can insert their own favourites" ON favourites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favourites
CREATE POLICY "Users can delete their own favourites" ON favourites
  FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON favourites TO authenticated;
GRANT ALL ON favourites TO service_role;
