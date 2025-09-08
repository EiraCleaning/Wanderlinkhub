import { createAdminClient, createServerClient } from './supabaseClient';
import type { 
  ListingResponse, 
  ReviewResponse, 
  Profile, 
  CreateListing, 
  UpdateListing,
  ListingsQuery 
} from './validation';

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

export async function getListings(query: ListingsQuery = { verified: true }): Promise<ListingResponse[]> {
  // Temporary mock data for testing filters
  const mockListings: ListingResponse[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'London Kids Playgroup',
      ltype: 'hub',
      description: 'Weekly playgroup for kids aged 2-5',
      start_date: null,
      end_date: null,
      is_permanent: true,
      price: 5,
      website_url: 'https://example.com',
      city: 'London',
      region: 'Greater London',
      country: 'United Kingdom',
      lat: 51.5074,
      lng: -0.1278,
      verify: 'verified',
      created_by: 'user1',
      created_at: '2024-01-15T10:00:00Z',
      contact_email: 'contact@example.com',
      contact_phone: '+44 20 1234 5678',
      organiser_name: 'Sarah Johnson',
      organiser_about: 'Experienced early years educator',
      age_range: '2-5 years',
      capacity: 'Up to 15 children',
      photos: ['https://picsum.photos/400/300?random=1'],
      verified_intent: true,
      social_links: {
        website: 'https://example.com',
        facebook: 'https://facebook.com/example'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Summer Art Workshop',
      ltype: 'event',
      description: 'Creative art workshop for children',
      start_date: '2024-07-15',
      end_date: '2024-07-15',
      is_permanent: false,
      price: 25,
      website_url: 'https://artworkshop.com',
      city: 'Manchester',
      region: 'Greater Manchester',
      country: 'United Kingdom',
      lat: 53.4808,
      lng: -2.2426,
      verify: 'verified',
      created_by: 'user2',
      created_at: '2024-01-20T14:30:00Z',
      contact_email: 'info@artworkshop.com',
      contact_phone: '+44 161 123 4567',
      organiser_name: 'Mike Chen',
      organiser_about: 'Professional artist and art teacher',
      age_range: '6-12 years',
      capacity: 'Up to 20 children',
      photos: ['https://picsum.photos/400/300?random=2'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/artworkshop'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'New York Family Hub',
      ltype: 'hub',
      description: 'Community center for families',
      start_date: null,
      end_date: null,
      is_permanent: true,
      price: 0,
      website_url: 'https://familyhub.nyc',
      city: 'New York',
      region: 'New York',
      country: 'United States',
      lat: 40.7128,
      lng: -74.0060,
      verify: 'verified',
      created_by: 'user3',
      created_at: '2024-01-25T09:15:00Z',
      contact_email: 'hello@familyhub.nyc',
      contact_phone: '+1 212 555 0123',
      organiser_name: 'Lisa Rodriguez',
      organiser_about: 'Community organizer and parent',
      age_range: 'All ages',
      capacity: 'Up to 50 families',
      photos: ['https://picsum.photos/400/300?random=3'],
      verified_intent: true,
      social_links: {
        website: 'https://familyhub.nyc',
        facebook: 'https://facebook.com/familyhubnyc'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Paris Cooking Class',
      ltype: 'event',
      description: 'Learn to cook French pastries',
      start_date: '2024-08-10',
      end_date: '2024-08-10',
      is_permanent: false,
      price: 35,
      website_url: 'https://cookingparis.com',
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      lat: 48.8566,
      lng: 2.3522,
      verify: 'verified',
      created_by: 'user4',
      created_at: '2024-01-30T16:45:00Z',
      contact_email: 'chef@cookingparis.com',
      contact_phone: '+33 1 23 45 67 89',
      organiser_name: 'Pierre Dubois',
      organiser_about: 'Professional pastry chef',
      age_range: '8-16 years',
      capacity: 'Up to 12 children',
      photos: ['https://picsum.photos/400/300?random=4'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/cookingparis'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      title: 'Zulu Popuphub',
      ltype: 'hub',
      description: 'kjhhkj',
      start_date: '2025-09-19',
      end_date: '2025-09-20',
      is_permanent: false,
      price: null,
      website_url: null,
      city: '15 South African Military base/15 SAI',
      region: null,
      country: 'South Africa',
      lat: -23.072859,
      lng: 30.394539,
      verify: 'verified',
      created_by: 'cf43a654-9350-41e3-8f1a-a8503bbf60b7',
      created_at: new Date().toISOString(),
      contact_email: 'marina.lyshova@gmail.com',
      contact_phone: '32424234',
      organiser_name: 'Marina',
      organiser_about: 'fsdfsdf',
      age_range: '0-4',
      capacity: 'small',
      photos: ['https://wtjvfhdbrvtliyqihktw.supabase.co/storage/v1/object/public/uploads/listings/1757154696555-5a4sali3np5.png'],
      verified_intent: true,
      social_links: {
        facebook: 'sdasddsa'
      }
    },
    // Additional New York area listings
    {
      id: '550e8400-e29b-41d4-a716-446655440006',
      title: 'Brooklyn Kids Club',
      ltype: 'hub',
      description: 'Community center for Brooklyn families',
      start_date: null,
      end_date: null,
      is_permanent: true,
      price: 10,
      website_url: 'https://brooklynkids.com',
      city: 'Brooklyn',
      region: 'New York',
      country: 'United States',
      lat: 40.6782,
      lng: -73.9442,
      verify: 'verified',
      created_by: 'user6',
      created_at: '2024-02-01T10:00:00Z',
      contact_email: 'info@brooklynkids.com',
      contact_phone: '+1 718 555 0123',
      organiser_name: 'Jennifer Martinez',
      organiser_about: 'Brooklyn community organizer',
      age_range: '3-10 years',
      capacity: 'Up to 25 children',
      photos: ['https://picsum.photos/400/300?random=6'],
      verified_intent: true,
      social_links: {
        facebook: 'https://facebook.com/brooklynkids'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440007',
      title: 'Queens Art Workshop',
      ltype: 'event',
      description: 'Creative art classes for children in Queens',
      start_date: '2024-03-15',
      end_date: '2024-03-15',
      is_permanent: false,
      price: 20,
      website_url: 'https://queensart.com',
      city: 'Queens',
      region: 'New York',
      country: 'United States',
      lat: 40.7282,
      lng: -73.7949,
      verify: 'verified',
      created_by: 'user7',
      created_at: '2024-02-05T14:30:00Z',
      contact_email: 'hello@queensart.com',
      contact_phone: '+1 718 555 0456',
      organiser_name: 'David Kim',
      organiser_about: 'Professional art instructor',
      age_range: '5-12 years',
      capacity: 'Up to 15 children',
      photos: ['https://picsum.photos/400/300?random=7'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/queensart'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440008',
      title: 'Manhattan Music School',
      ltype: 'hub',
      description: 'Music education for children in Manhattan',
      start_date: null,
      end_date: null,
      is_permanent: true,
      price: 50,
      website_url: 'https://manhattanmusic.com',
      city: 'Manhattan',
      region: 'New York',
      country: 'United States',
      lat: 40.7831,
      lng: -73.9712,
      verify: 'verified',
      created_by: 'user8',
      created_at: '2024-02-10T09:15:00Z',
      contact_email: 'contact@manhattanmusic.com',
      contact_phone: '+1 212 555 0789',
      organiser_name: 'Anna Thompson',
      organiser_about: 'Classical music educator',
      age_range: '4-16 years',
      capacity: 'Up to 20 students',
      photos: ['https://picsum.photos/400/300?random=8'],
      verified_intent: true,
      social_links: {
        website: 'https://manhattanmusic.com'
      }
    },
    // Additional Paris area listings
    {
      id: '550e8400-e29b-41d4-a716-446655440009',
      title: 'Versailles Family Center',
      ltype: 'hub',
      description: 'Family activities near Versailles',
      start_date: null,
      end_date: null,
      is_permanent: true,
      price: 15,
      website_url: 'https://versaillesfamily.com',
      city: 'Versailles',
      region: 'Île-de-France',
      country: 'France',
      lat: 48.8014,
      lng: 2.1301,
      verify: 'verified',
      created_by: 'user9',
      created_at: '2024-02-15T11:00:00Z',
      contact_email: 'info@versaillesfamily.com',
      contact_phone: '+33 1 30 84 74 00',
      organiser_name: 'Sophie Laurent',
      organiser_about: 'Family activity coordinator',
      age_range: '2-8 years',
      capacity: 'Up to 30 families',
      photos: ['https://picsum.photos/400/300?random=9'],
      verified_intent: true,
      social_links: {
        facebook: 'https://facebook.com/versaillesfamily'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440010',
      title: 'Montmartre Art Studio',
      ltype: 'event',
      description: 'Art classes in the heart of Montmartre',
      start_date: '2024-04-20',
      end_date: '2024-04-20',
      is_permanent: false,
      price: 40,
      website_url: 'https://montmartreart.com',
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      lat: 48.8867,
      lng: 2.3431,
      verify: 'verified',
      created_by: 'user10',
      created_at: '2024-02-20T16:45:00Z',
      contact_email: 'studio@montmartreart.com',
      contact_phone: '+33 1 42 23 45 67',
      organiser_name: 'Claude Monet',
      organiser_about: 'Art instructor and painter',
      age_range: '6-14 years',
      capacity: 'Up to 12 children',
      photos: ['https://picsum.photos/400/300?random=10'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/montmartreart'
      }
    }
  ];

  console.log('getListings: Using mock data, Query received:', query);
  
  let filteredData = mockListings;

  // Apply filters to mock data
  if (query.verified !== null) {
    if (query.verified === true) {
      filteredData = filteredData.filter(listing => listing.verify === 'verified');
      console.log('getListings: Filtering for verified listings');
    } else if (query.verified === false) {
      filteredData = filteredData.filter(listing => listing.verify === 'pending');
      console.log('getListings: Filtering for pending listings');
    }
    // If query.verified is null, don't filter by verify status (show all)
  }
  
  if (query.ltype) {
    filteredData = filteredData.filter(listing => listing.ltype === query.ltype);
    console.log('getListings: Filtering by type:', query.ltype);
  }
  
  // Location filtering - use radius-based filtering if coordinates are provided
  if (query.location) {
    if (query.near && query.radiusKm) {
      // Use radius-based filtering with coordinates
      const [lng, lat] = query.near;
      const radiusKm = query.radiusKm;
      
      filteredData = filteredData.filter(listing => {
        if (!listing.lat || !listing.lng) return false;
        const distance = calculateDistance(lat, lng, listing.lat, listing.lng);
        return distance <= radiusKm;
      });
      console.log('getListings: Filtering by radius:', radiusKm, 'km from', lat, lng);
    } else {
      // Fall back to text-based filtering
      const locationTerm = query.location.toLowerCase();
      filteredData = filteredData.filter(listing => 
        listing.city?.toLowerCase().includes(locationTerm) ||
        listing.region?.toLowerCase().includes(locationTerm) ||
        listing.country?.toLowerCase().includes(locationTerm)
      );
      console.log('getListings: Filtering by location text:', query.location);
    }
  }

  // Apply date filters in JavaScript to handle permanent hubs properly
  if (query.from || query.to) {
    filteredData = filteredData.filter(listing => {
      // Permanent hubs are always included
      if (listing.is_permanent === true) {
        return true;
      }
      
      // For non-permanent listings, check date ranges
      if (query.from && listing.start_date) {
        const startDate = new Date(listing.start_date);
        const fromDate = new Date(query.from);
        if (startDate < fromDate) {
          return false;
        }
      }
      
      if (query.to && listing.end_date) {
        const endDate = new Date(listing.end_date);
        const toDate = new Date(query.to);
        if (endDate > toDate) {
          return false;
        }
      }
      
      return true;
    });
    
    console.log('getListings: Date filtering applied. Filtered count:', filteredData.length);
  }

  console.log('getListings: Returning', filteredData.length, 'listings');
  return filteredData;
}

export async function getListingById(id: string): Promise<ListingResponse | null> {
  // Use mock data for testing
  const mockListings: ListingResponse[] = [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'London Kids Playgroup',
      ltype: 'hub',
      description: 'Weekly playgroup for kids aged 2-5',
      start_date: null,
      end_date: null,
      is_permanent: true,
      price: 5,
      website_url: 'https://example.com',
      city: 'London',
      region: 'Greater London',
      country: 'United Kingdom',
      lat: 51.5074,
      lng: -0.1278,
      verify: 'verified',
      created_by: 'user1',
      created_at: '2024-01-15T10:00:00Z',
      contact_email: 'info@londonplaygroup.com',
      contact_phone: '+44 20 1234 5678',
      organiser_name: 'Sarah Johnson',
      organiser_about: 'Experienced early years educator',
      age_range: '2-5 years',
      capacity: 'Up to 15 children',
      photos: ['https://picsum.photos/400/300?random=1'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/londonplaygroup'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'New York Art Workshop',
      ltype: 'event',
      description: 'Creative art workshop for children',
      start_date: '2024-02-15',
      end_date: '2024-02-15',
      is_permanent: false,
      price: 25,
      website_url: 'https://artworkshop.com',
      city: 'New York',
      region: 'New York',
      country: 'United States',
      lat: 40.7128,
      lng: -74.0060,
      verify: 'verified',
      created_by: 'user2',
      created_at: '2024-01-20T14:30:00Z',
      contact_email: 'hello@artworkshop.com',
      contact_phone: '+1 555 123 4567',
      organiser_name: 'Mike Chen',
      organiser_about: 'Professional artist and educator',
      age_range: '6-12 years',
      capacity: 'Up to 20 children',
      photos: ['https://picsum.photos/400/300?random=2'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/artworkshop'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Paris Community Hub',
      ltype: 'hub',
      description: 'Community space for families',
      start_date: null,
      end_date: null,
      is_permanent: true,
      price: null,
      website_url: 'https://parishub.com',
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      lat: 48.8566,
      lng: 2.3522,
      verify: 'verified',
      created_by: 'user3',
      created_at: '2024-01-25T09:15:00Z',
      contact_email: 'contact@parishub.com',
      contact_phone: '+33 1 23 45 67 89',
      organiser_name: 'Marie Dubois',
      organiser_about: 'Community organizer',
      age_range: 'All ages',
      capacity: 'Up to 50 people',
      photos: ['https://picsum.photos/400/300?random=3'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/parishub'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Cooking Class for Kids',
      ltype: 'event',
      description: 'Learn to cook healthy meals',
      start_date: '2024-03-01',
      end_date: '2024-03-01',
      is_permanent: false,
      price: 30,
      website_url: 'https://cookingkids.com',
      city: 'Paris',
      region: 'Île-de-France',
      country: 'France',
      lat: 48.8566,
      lng: 2.3522,
      verify: 'verified',
      created_by: 'user4',
      created_at: '2024-01-30T16:45:00Z',
      contact_email: 'chef@cookingparis.com',
      contact_phone: '+33 1 23 45 67 89',
      organiser_name: 'Pierre Dubois',
      organiser_about: 'Professional pastry chef',
      age_range: '8-16 years',
      capacity: 'Up to 12 children',
      photos: ['https://picsum.photos/400/300?random=4'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/cookingparis'
      }
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      title: 'Zulu Popuphub',
      ltype: 'hub',
      description: 'kjhhkj',
      start_date: '2025-09-19',
      end_date: '2025-09-20',
      is_permanent: false,
      price: null,
      website_url: null,
      city: '15 South African Military base/15 SAI',
      region: null,
      country: 'South Africa',
      lat: -23.072859,
      lng: 30.394539,
      verify: 'verified',
      created_by: 'cf43a654-9350-41e3-8f1a-a8503bbf60b7',
      created_at: new Date().toISOString(),
      contact_email: 'marina.lyshova@gmail.com',
      contact_phone: '32424234',
      organiser_name: 'Marina',
      organiser_about: 'fsdfsdf',
      age_range: '0-4',
      capacity: 'Small',
      photos: ['https://picsum.photos/400/300?random=5'],
      verified_intent: true,
      social_links: {
        instagram: 'https://instagram.com/zulupopuphub'
      }
    }
  ];

  const listing = mockListings.find(l => l.id === id);
  return listing || null;
}

export async function createListing(listing: CreateListing, userId: string): Promise<ListingResponse> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...listing,
      created_by: userId,
      verify: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating listing:', error);
    throw new Error('Failed to create listing');
  }

  return data;
}

export async function updateListing(id: string, updates: UpdateListing, userId: string): Promise<ListingResponse> {
  const supabase = createAdminClient();
  
  // Verify ownership
  const existing = await getListingById(id);
  if (!existing || existing.created_by !== userId) {
    throw new Error('Unauthorized to update this listing');
  }

  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating listing:', error);
    throw new Error('Failed to update listing');
  }

  return data;
}

export async function updateListingVerification(id: string, status: 'verified' | 'rejected'): Promise<void> {
  const supabase = createAdminClient();
  
  const { error } = await supabase
    .from('listings')
    .update({ verify: status })
    .eq('id', id);

  if (error) {
    console.error('Error updating listing verification:', error);
    throw new Error('Failed to update listing verification');
  }
}

// Persistent mock reviews store
let mockReviews: ReviewResponse[] = [
  {
    id: 'review-1',
    listing_id: '550e8400-e29b-41d4-a716-446655440001',
    author_id: 'user-review-1',
    author_name: 'Sarah M.',
    rating: 5,
    comment: 'Amazing playgroup! My kids love it here.',
    created_at: '2024-01-20T10:30:00Z'
  },
  {
    id: 'review-2',
    listing_id: '550e8400-e29b-41d4-a716-446655440001',
    author_id: 'user-review-2',
    author_name: 'Mike D.',
    rating: 4,
    comment: 'Great activities and friendly staff.',
    created_at: '2024-01-18T14:15:00Z'
  },
  {
    id: 'review-3',
    listing_id: '550e8400-e29b-41d4-a716-446655440002',
    author_id: 'user-review-3',
    author_name: 'Emma L.',
    rating: 5,
    comment: 'Fantastic art workshop! Highly recommended.',
    created_at: '2024-01-22T09:45:00Z'
  },
  {
    id: 'review-4',
    listing_id: '550e8400-e29b-41d4-a716-446655440005',
    author_id: 'user-review-4',
    author_name: 'John K.',
    rating: 5,
    comment: 'Excellent popup hub! Great location and activities.',
    created_at: '2024-01-25T16:20:00Z'
  }
];

export async function getReviewsForListing(listingId: string): Promise<ReviewResponse[]> {
  // Filter reviews for the specific listing
  const reviews = mockReviews.filter(review => review.listing_id === listingId);
  return reviews;
}

export async function createReview(
  review: Omit<ReviewResponse, 'id' | 'created_at'>, 
  userId: string,
  supabaseClient?: any
): Promise<ReviewResponse> {
  // Use mock data for testing
  const newReview: ReviewResponse = {
    id: `review-${Date.now()}`,
    listing_id: review.listing_id,
    author_id: userId,
    author_name: review.author_name || 'Anonymous User',
    rating: review.rating,
    comment: review.comment,
    created_at: new Date().toISOString()
  };

  // Add the new review to the persistent mock data
  mockReviews.push(newReview);
  
  console.log('Mock review created and added to store:', newReview);
  return newReview;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }): Promise<Profile> {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) {
    console.error('Error upserting profile:', error);
    throw new Error('Failed to upsert profile');
  }

  return data;
}

export async function getPendingListings(): Promise<ListingResponse[]> {
  return getListings({ verified: false });
} 