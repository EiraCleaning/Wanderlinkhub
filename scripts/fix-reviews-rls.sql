-- Fix RLS policy for reviews to allow reading reviews for verified listings
-- Drop the existing policy
DROP POLICY IF EXISTS "Read reviews for verified and pending listings" ON reviews;

-- Create a new policy that allows reading reviews for verified listings
CREATE POLICY "Read reviews for verified listings"
ON reviews FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM listings l 
    WHERE l.id = listing_id 
    AND l.verify = 'verified'
  )
);

-- Also allow reading reviews for pending listings (in case we want to show them)
CREATE POLICY "Read reviews for pending listings"
ON reviews FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM listings l 
    WHERE l.id = listing_id 
    AND l.verify = 'pending'
  )
);
