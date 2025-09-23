-- Clear all production data in preparation for real data
-- This will delete all events, hubs, reviews, and favorites

-- Delete all reviews first (due to foreign key constraints)
DELETE FROM reviews;

-- Delete all favorites
DELETE FROM favourites;

-- Delete all listings (events and hubs)
DELETE FROM listings;

-- Reset any sequences if they exist
-- (PostgreSQL will handle this automatically, but good to be explicit)
-- Note: This is safe to run multiple times

-- Show counts to verify deletion
SELECT 
  (SELECT COUNT(*) FROM listings) as listings_count,
  (SELECT COUNT(*) FROM reviews) as reviews_count,
  (SELECT COUNT(*) FROM favourites) as favourites_count;
