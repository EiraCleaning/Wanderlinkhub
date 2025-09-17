import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from the production Vercel env file
dotenv.config({ path: '.env.vercel.prod' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

console.log('🔍 Using Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Your real events data
const eventsData = [
  {
    "title": "Tanzania Hub",
    "ltype": "hub",
    "description": "Community gathering for worldschooling families with cultural immersion, play-based learning, and workshops exploring Tanzanian traditions and wildlife.",
    "city": "Arusha",
    "country": "Tanzania",
    "lat": -3.3869,
    "lng": 36.6830,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "The Hub Project Egypt",
    "ltype": "hub",
    "description": "Pop-up hub focused on historical exploration of ancient Egyptian sites, with family activities and educational immersions.",
    "city": "Luxor",
    "country": "Egypt",
    "lat": 25.6872,
    "lng": 32.6396,
    "organiser_name": "The Hub Project",
    "contact_email": "info@passportexplorers.com",
    "is_permanent": false,
    "website_url": "https://passportexplorers.com/worldschooling-communities/",
    "age_range": "5-18",
    "capacity": "Small (10-20)",
    "social_links": {
      "website": "https://passportexplorers.com"
    }
  },
  {
    "title": "Agadir Worldschool Hub",
    "ltype": "hub",
    "description": "Fun-filled community gathering in a vibrant cultural center with excursions, arts, and family networking.",
    "city": "Agadir",
    "country": "Morocco",
    "lat": 30.4278,
    "lng": -9.5981,
    "organiser_name": "Worldschool Pop-Up Hub",
    "contact_email": "contact@worldschoolpopuphub.com",
    "start_date": "2026-01-11",
    "end_date": "2026-01-17",
    "is_permanent": false,
    "website_url": "https://www.worldschoolpopuphub.com/events/agadir-morocco-january-2026",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "photos": ["https://www.worldschoolpopuphub.com/wp-content/uploads/2024/08/Agadir-Header-Image.png"],
    "social_links": {
      "website": "https://www.worldschoolpopuphub.com",
      "facebook": "https://www.facebook.com/worldschoolpopuphub",
      "instagram": "https://www.instagram.com/worldschoolpopuphub"
    }
  },
  {
    "title": "Cairo + Luxor Hub",
    "ltype": "hub",
    "description": "Pop-up exploring ancient Egyptian sites and modern Cairo, with family-friendly educational activities.",
    "city": "Cairo",
    "country": "Egypt",
    "lat": 30.0444,
    "lng": 31.2357,
    "organiser_name": "Worldschool Pop-Up Hub",
    "contact_email": "contact@worldschoolpopuphub.com",
    "start_date": "2026-03-21",
    "end_date": "2026-03-27",
    "is_permanent": false,
    "website_url": "https://www.worldschoolpopuphub.com/",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "social_links": {
      "website": "https://www.worldschoolpopuphub.com",
      "facebook": "https://www.facebook.com/worldschoolpopuphub",
      "instagram": "https://www.instagram.com/worldschoolpopuphub"
    }
  },
  {
    "title": "Da Nang Hub",
    "ltype": "hub",
    "description": "Beachside community hub with daily family activities, cultural workshops, and WhatsApp-connected networking.",
    "city": "Da Nang",
    "country": "Vietnam",
    "lat": 16.0544,
    "lng": 108.2022,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "Parklife Family Hub",
    "ltype": "hub",
    "description": "Permanent hub with a community café, play spaces for young children, and creative workshops for families.",
    "city": "Canggu",
    "country": "Indonesia",
    "lat": -8.6478,
    "lng": 115.1385,
    "organiser_name": "Parklife Bali",
    "contact_email": "info@parklifebali.com",
    "is_permanent": true,
    "website_url": "https://familytravelhive.com/location-experiences/details/170",
    "age_range": "1-12",
    "capacity": "Up to 20",
    "photos": ["https://familytravelhive.com/images/parklife-bali.jpg"],
    "social_links": {
      "website": "https://parklifebali.com",
      "facebook": "https://www.facebook.com/parklifebali",
      "instagram": "https://www.instagram.com/parklifebali"
    }
  },
  {
    "title": "Boundless Life Bali",
    "ltype": "hub",
    "description": "Permanent hub offering Montessori and project-based learning, furnished homes, and co-working spaces; €600 off with code.",
    "city": "Sanur",
    "country": "Indonesia",
    "lat": -8.6769,
    "lng": 115.2364,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/9-month-boundless-experience",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/bali-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "Worldschooling Hub Goa",
    "ltype": "hub",
    "description": "Seasonal hub with nature-based learning, cultural immersion, and teen programs; includes excursions and workshops.",
    "city": "Goa",
    "country": "India",
    "lat": 15.2993,
    "lng": 74.1240,
    "organiser_name": "Worldschooling Hub Goa",
    "contact_email": "info@worldschoolinghubgoa.com",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": false,
    "website_url": "https://www.worldschoolinghubgoa.com/hub-program",
    "region": "Goa",
    "age_range": "5-18",
    "capacity": "Up to 30",
    "social_links": {
      "website": "https://www.worldschoolinghubgoa.com"
    }
  },
  {
    "title": "Syros Hub",
    "ltype": "hub",
    "description": "Permanent Boundless Life hub on a Greek island with educational programs, cultural immersion, and family activities.",
    "city": "Ermoupoli",
    "country": "Greece",
    "lat": 37.4447,
    "lng": 24.9430,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/syros-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "Lake Garda Hub",
    "ltype": "hub",
    "description": "Pop-up hub with lakeside activities, family networking, and cultural explorations in northern Italy.",
    "city": "Sirmione",
    "country": "Italy",
    "lat": 45.4975,
    "lng": 10.6053,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "region": "Lombardy",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  }
];

async function fixProductionDatabase() {
  console.log('🔧 Fixing production database...');
  
  try {
    // First, clear all existing data
    console.log('🗑️  Clearing existing data...');
    
    // Delete all reviews first (due to foreign key constraints)
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (reviewsError) {
      console.error('❌ Error deleting reviews:', reviewsError);
      return;
    }
    
    console.log('✅ Deleted all reviews');
    
    // Delete all listings
    const { error: listingsError } = await supabase
      .from('listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (listingsError) {
      console.error('❌ Error deleting listings:', listingsError);
      return;
    }
    
    console.log('✅ Deleted all listings');
    
    // Now add the real events
    console.log('🌍 Adding real worldschooling events...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const event of eventsData) {
      try {
        const listingData = {
          title: event.title,
          ltype: event.ltype,
          description: event.description,
          city: event.city,
          country: event.country,
          lat: event.lat,
          lng: event.lng,
          organiser_name: event.organiser_name,
          contact_email: event.contact_email,
          start_date: event.start_date || null,
          end_date: event.end_date || null,
          is_permanent: event.is_permanent || false,
          price: event.price || null,
          website_url: event.website_url || null,
          region: event.region || null,
          age_range: event.age_range || null,
          capacity: event.capacity || null,
          photos: event.photos || null,
          social_links: event.social_links || null,
          verify: 'verified' as const,
          created_by: null
        };
        
        const { error } = await supabase
          .from('listings')
          .insert([listingData]);
        
        if (error) {
          console.error(`❌ Error importing "${event.title}":`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Imported: ${event.title}`);
          successCount++;
        }
        
      } catch (error) {
        console.error(`❌ Unexpected error importing "${event.title}":`, error);
        errorCount++;
      }
    }
    
    console.log('\n🎉 Production database fixed!');
    console.log(`✅ Successfully imported: ${successCount} events`);
    console.log(`❌ Failed to import: ${errorCount} events`);
    
  } catch (error) {
    console.error('❌ Error fixing production database:', error);
  }
}

fixProductionDatabase();
