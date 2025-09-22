import { createAdminClient } from './supabaseClient';
import type { ListingsQuery, ListingResponse, CreateListing, UpdateListing } from './validation';

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

export async function getListings(query: ListingsQuery = { verified: true }): Promise<ListingResponse[]> {
  console.log('getListings: Querying database with:', query);
  
  const supabase = createAdminClient();
  
  try {
    // Build the Supabase query
    let supabaseQuery = supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000); // Set a high limit to get all listings

    // Apply verified filter
  if (query.verified !== null) {
    if (query.verified === true) {
        supabaseQuery = supabaseQuery.eq('verify', 'verified');
      console.log('getListings: Filtering for verified listings');
    } else if (query.verified === false) {
        supabaseQuery = supabaseQuery.eq('verify', 'pending');
      console.log('getListings: Filtering for pending listings');
    }
  }
  
    // Apply type filter
  if (query.ltype) {
      supabaseQuery = supabaseQuery.eq('ltype', query.ltype);
    console.log('getListings: Filtering by type:', query.ltype);
  }
  
    // Apply date filters
    if (query.from) {
      supabaseQuery = supabaseQuery.or(`is_permanent.eq.true,and(start_date.gte.${query.from})`);
      console.log('getListings: Filtering from date:', query.from);
    }

    if (query.to) {
      supabaseQuery = supabaseQuery.or(`is_permanent.eq.true,and(end_date.lte.${query.to})`);
      console.log('getListings: Filtering to date:', query.to);
    }

    // Execute the query
    console.log('getListings: Executing Supabase query...');
    const { data: listings, error } = await supabaseQuery;

    if (error) {
      console.error('getListings: Database error:', error);
      throw error;
    }

    console.log('getListings: Retrieved', listings?.length || 0, 'listings from database');
    console.log('getListings: First few listings:', listings?.slice(0, 3).map(l => ({ title: l.title, lat: l.lat, lng: l.lng })));

    // Apply location filtering and ranking in JavaScript
    let filteredData = listings || [];

  if (query.location) {
      // Always use text-based filtering first
      const locationTerm = query.location.toLowerCase();
      
      // Split the location into parts for more flexible matching
      const locationParts = locationTerm.split(',').map(part => part.trim());
      
      filteredData = filteredData.filter(listing => {
        // Check if any part of the search term matches any part of the listing
        return locationParts.some(part => 
          listing.city?.toLowerCase().includes(part) ||
          listing.region?.toLowerCase().includes(part) ||
          listing.country?.toLowerCase().includes(part)
        );
      });
      
      console.log('getListings: Filtering by location text:', query.location, 'Parts:', locationParts, 'Found', filteredData.length, 'matches');
    }

    // If we have coordinates, add distance ranking and radius filtering
    if (query.near) {
      const [lng, lat] = query.near;
      const radiusKm = query.radiusKm || 50; // Default to 50km if not specified
      
      console.log('getListings: Processing coordinates:', { lng, lat, radiusKm });
      console.log('getListings: Before coordinate filtering, have', filteredData.length, 'listings');
      
      // Add distance to each listing, filter by radius, and sort by distance
      filteredData = filteredData
        .map(listing => {
          const distance = listing.lat && listing.lng ? 
            calculateDistance(lat, lng, listing.lat, listing.lng) : 
            Infinity;
          console.log('getListings: Listing', listing.title, 'distance:', distance, 'radius:', radiusKm, 'within radius:', distance <= radiusKm);
          return {
            ...listing,
            distance
          };
        })
        .filter(listing => listing.distance <= radiusKm) // Filter by radius
        .sort((a, b) => a.distance - b.distance); // Sort by distance
      
      console.log('getListings: Filtered by radius', radiusKm, 'km and sorted by distance from', lat, lng, 'Found', filteredData.length, 'listings');
    }

    console.log('getListings: Returning', filteredData.length, 'filtered listings');
    return filteredData as ListingResponse[];

  } catch (error) {
    console.error('getListings: Error querying database:', error);
    // Return empty array on error rather than throwing
    return [];
  }
}

export async function getListingById(id: string): Promise<ListingResponse | null> {
  const supabase = createAdminClient();
  
  try {
    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('getListingById: Database error:', error);
      return null;
    }

    return listing as ListingResponse;
  } catch (error) {
    console.error('getListingById: Error:', error);
    return null;
  }
}

export async function createListing(listing: CreateListing, userId: string): Promise<ListingResponse> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('listings')
    .insert([{
      ...listing,
      created_by: userId,
      verify: 'pending'
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create listing: ${error.message}`);
  }

  return data as ListingResponse;
}

export async function updateListing(id: string, updates: UpdateListing, userId: string): Promise<ListingResponse> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .eq('created_by', userId) // Ensure user can only update their own listings
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update listing: ${error.message}`);
  }

  return data as ListingResponse;
}

// REVIEW FUNCTIONS
export async function createReview(review: {
  listing_id: string;
  author_id: string;
  author_name: string;
  rating: number;
  comment?: string;
}, userId: string): Promise<any> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      listing_id: review.listing_id,
      author_id: review.author_id,
      rating: review.rating,
      comment: review.comment || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }

  return data;
}

export async function getReviewsForListing(listingId: string): Promise<any[]> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:author_id (
        display_name,
        full_name
      )
    `)
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}
