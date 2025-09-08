import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

console.log('🔗 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Service Role Key:', serviceRoleKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Test connection first
async function testConnection() {
  try {
    console.log('🧪 Testing database connection...');
    const { data, error } = await supabase.from('listings').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error);
      throw error;
    }
    
    console.log('✅ Connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

const sampleListings = [
  {
    title: 'Sydney Family Festival',
    ltype: 'event' as const,
    description: 'A wonderful family-friendly festival in the heart of Sydney with activities for all ages.',
    start_date: '2025-01-15',
    end_date: '2025-01-17',
    price: 25.00,
    website_url: 'https://example.com/sydney-festival',
    city: 'Sydney',
    region: 'New South Wales',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    verify: 'verified' as const
  },
  {
    title: 'Bali Kids Adventure Camp',
    ltype: 'hub' as const,
    description: 'Safe and exciting adventure activities for children in beautiful Bali.',
    start_date: '2025-01-20',
    end_date: '2025-01-27',
    price: 150.00,
    website_url: 'https://example.com/bali-camp',
    city: 'Ubud',
    region: 'Bali',
    country: 'Indonesia',
    lat: -8.5069,
    lng: 115.2625,
    verify: 'verified' as const
  },
  {
    title: 'Lisbon Family Walking Tour',
    ltype: 'event' as const,
    description: 'Explore the historic streets of Lisbon with your family on this guided walking tour.',
    start_date: '2025-01-10',
    end_date: '2025-01-10',
    price: 35.00,
    website_url: 'https://example.com/lisbon-tour',
    city: 'Lisbon',
    region: 'Lisboa',
    country: 'Portugal',
    lat: 38.7223,
    lng: -9.1393,
    verify: 'verified' as const
  },
  {
    title: 'Mexico City Cultural Center',
    ltype: 'hub' as const,
    description: 'A vibrant cultural center offering workshops and activities for families.',
    start_date: '2025-01-01',
    end_date: '2025-01-31',
    price: 0,
    website_url: 'https://example.com/mexico-cultural',
    city: 'Mexico City',
    region: 'CDMX',
    country: 'Mexico',
    lat: 19.4326,
    lng: -99.1332,
    verify: 'verified' as const
  },
  {
    title: 'Tbilisi Family Market',
    ltype: 'event' as const,
    description: 'Weekly family market with local crafts, food, and entertainment.',
    start_date: '2025-01-08',
    end_date: '2025-01-08',
    price: 5.00,
    website_url: 'https://example.com/tbilisi-market',
    city: 'Tbilisi',
    region: 'Tbilisi',
    country: 'Georgia',
    lat: 41.7151,
    lng: 44.8271,
    verify: 'verified' as const
  },
  {
    title: 'Tokyo Kids Tech Workshop',
    ltype: 'event' as const,
    description: 'Interactive technology workshop for children aged 8-12.',
    start_date: '2025-01-22',
    end_date: '2025-01-22',
    price: 45.00,
    website_url: 'https://example.com/tokyo-tech',
    city: 'Tokyo',
    region: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    verify: 'verified' as const
  },
  {
    title: 'Cape Town Family Beach Day',
    ltype: 'event' as const,
    description: 'Organized beach activities and safety for families.',
    start_date: '2025-01-14',
    end_date: '2025-01-14',
    price: 15.00,
    website_url: 'https://example.com/cape-town-beach',
    city: 'Cape Town',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    verify: 'verified' as const
  },
  {
    title: 'Melbourne Kids Art Workshop',
    ltype: 'event' as const,
    description: 'Creative art workshop for children aged 5-12 in Melbourne.',
    start_date: '2025-02-05',
    end_date: '2025-02-05',
    price: 30.00,
    website_url: 'https://example.com/melbourne-art',
    city: 'Melbourne',
    region: 'Victoria',
    country: 'Australia',
    lat: -37.8136,
    lng: 144.9631,
    verify: 'verified' as const
  },
  {
    title: 'Brisbane Family Science Fair',
    ltype: 'event' as const,
    description: 'Interactive science experiments and demonstrations for families.',
    start_date: '2025-02-15',
    end_date: '2025-02-16',
    price: 20.00,
    website_url: 'https://example.com/brisbane-science',
    city: 'Brisbane',
    region: 'Queensland',
    country: 'Australia',
    lat: -27.4698,
    lng: 153.0251,
    verify: 'verified' as const
  },
  {
    title: 'Perth Family Music Festival',
    ltype: 'event' as const,
    description: 'Family-friendly music festival with activities for all ages.',
    start_date: '2025-03-01',
    end_date: '2025-03-02',
    price: 40.00,
    website_url: 'https://example.com/perth-music',
    city: 'Perth',
    region: 'Western Australia',
    country: 'Australia',
    lat: -31.9505,
    lng: 115.8605,
    verify: 'verified' as const
  },
  {
    title: 'Cape Town Family Beach Day',
    ltype: 'event' as const,
    description: 'Organized beach activities and safety for families.',
    start_date: '2025-01-14',
    end_date: '2025-01-14',
    price: 15.00,
    website_url: 'https://example.com/cape-town-beach',
    city: 'Cape Town',
    region: 'Western Cape',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    verify: 'verified' as const
  },
  {
    title: 'Reykjavik Family Museum',
    ltype: 'hub' as const,
    description: 'Interactive museum perfect for families with children of all ages.',
    start_date: '2025-01-01',
    end_date: '2025-01-31',
    price: 20.00,
    website_url: 'https://example.com/reykjavik-museum',
    city: 'Reykjavik',
    region: 'Capital Region',
    country: 'Iceland',
    lat: 64.1466,
    lng: -21.9426,
    verify: 'verified' as const
  },
  {
    title: 'Pending: New York Family Event',
    ltype: 'event' as const,
    description: 'This is a pending event waiting for admin verification.',
    start_date: '2025-02-25',
    end_date: '2025-02-25',
    price: 30.00,
    website_url: 'https://example.com/ny-pending',
    city: 'New York',
    region: 'New York',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    verify: 'pending' as const
  },
  {
    title: 'Pending: London Kids Club',
    ltype: 'hub' as const,
    description: 'A new kids club in London awaiting verification.',
    start_date: '2025-02-01',
    end_date: '2025-02-28',
    price: 80.00,
    website_url: 'https://example.com/london-pending',
    city: 'London',
    region: 'England',
    country: 'UK',
    lat: 51.5074,
    lng: -0.1278,
    verify: 'pending' as const
  }
];

const sampleReviews = [
  {
    listing_id: '', // Will be set after listings are created
    author_id: '', // Will be set after listings are created
    rating: 5,
    comment: 'Amazing experience for the whole family! Highly recommend.'
  },
  {
    listing_id: '',
    author_id: '',
    rating: 4,
    comment: 'Great activities and very family-friendly environment.'
  },
  {
    listing_id: '',
    author_id: '',
    rating: 5,
    comment: 'Perfect for kids of all ages. Will definitely visit again!'
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('listings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert listings
    console.log('📝 Inserting sample listings...');
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .insert(sampleListings)
      .select('id, title, verify');

    if (listingsError) {
      throw listingsError;
    }

    console.log(`✅ Inserted ${listings.length} listings`);

    // Create a test user profile for reviews
    const testUserId = '00000000-0000-0000-0000-000000000000';
    await supabase.from('profiles').upsert({
      id: testUserId,
      full_name: 'Test User',
      kids_ages: [5, 8]
    });

    // Insert reviews for verified listings
    console.log('⭐ Inserting sample reviews...');
    const verifiedListings = listings.filter(l => l.verify === 'verified');
    
    for (const listing of verifiedListings.slice(0, 3)) {
      const review = {
        ...sampleReviews[0],
        listing_id: listing.id,
        author_id: testUserId
      };
      
      await supabase.from('reviews').insert(review);
    }

    console.log('✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${listings.length} listings created`);
    console.log(`- ${verifiedListings.length} verified listings`);
    console.log(`- ${listings.filter(l => l.verify === 'pending').length} pending listings`);
    console.log(`- 3 sample reviews created`);
    
    console.log('\n🔗 Test URLs:');
    verifiedListings.forEach(listing => {
      console.log(`- /listing/${listing.id} (${listing.title})`);
    });

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed(); 