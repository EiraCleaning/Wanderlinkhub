import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Your events data
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
  },
  {
    "title": "Sardinia Hub",
    "ltype": "hub",
    "description": "Pop-up hub focused on coastal exploration, creative projects, and family connections in Sardinia.",
    "city": "Cagliari",
    "country": "Italy",
    "lat": 39.2238,
    "lng": 9.1217,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "region": "Sardinia",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "Muga Valley Hub",
    "ltype": "hub",
    "description": "Pop-up hub with rural adventures, unschooling activities, and family networking in northern Spain.",
    "city": "Empuriabrava",
    "country": "Spain",
    "lat": 42.2469,
    "lng": 3.1209,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "region": "Catalonia",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "Boundless Life Tuscany",
    "ltype": "hub",
    "description": "Permanent hub offering Italian cultural immersion, educational programs, and family excursions.",
    "city": "Pistoia",
    "country": "Italy",
    "lat": 43.9300,
    "lng": 10.9174,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/9-month-boundless-experience",
    "region": "Tuscany",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/tuscany-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "Boundless Life Sintra",
    "ltype": "hub",
    "description": "Permanent hub in magical forests and castles, with full educational and family programs; dynamic pricing.",
    "city": "Sintra",
    "country": "Portugal",
    "lat": 38.7973,
    "lng": -9.3905,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2026-01-08",
    "end_date": "2026-11-30",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/why-wait",
    "region": "Lisbon",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/sintra-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "Boundless Life Andalusia",
    "ltype": "hub",
    "description": "Permanent hub with beach and town vibes, offering educational programs; up to 40% off Jan-Mar.",
    "city": "Estepona",
    "country": "Spain",
    "lat": 36.4253,
    "lng": -5.1459,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/back-to-school",
    "region": "Andalusia",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/andalusia-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "Boundless Life Kotor",
    "ltype": "hub",
    "description": "Permanent hub with bay and Venetian charm, offering educational and cultural programs.",
    "city": "Kotor",
    "country": "Montenegro",
    "lat": 42.4247,
    "lng": 18.7712,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/9-month-boundless-experience",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/kotor-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "Field School of Hvar",
    "ltype": "hub",
    "description": "Seasonal summer camps with themed weeks focusing on experiential learning and cultural immersion.",
    "city": "Hvar",
    "country": "Croatia",
    "lat": 43.1729,
    "lng": 16.4412,
    "organiser_name": "Field School of Hvar",
    "contact_email": "info@passportexplorers.com",
    "start_date": "2025-06-01",
    "end_date": "2025-08-31",
    "is_permanent": false,
    "website_url": "https://passportexplorers.com/worldschooling-communities/",
    "age_range": "5-18",
    "capacity": "Small (10-20)",
    "social_links": {
      "website": "https://passportexplorers.com"
    }
  },
  {
    "title": "Oria Community",
    "ltype": "hub",
    "description": "Permanent worldschool community with workshops, cultural activities, and family networking in Andalucia.",
    "city": "Oria",
    "country": "Spain",
    "lat": 37.5139,
    "lng": -2.2948,
    "organiser_name": "WORLDSCHOOLING HUB",
    "contact_email": "admin@facebook.com",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "website_url": "https://www.facebook.com/groups/1348559292364294/posts/1820878181799067/",
    "region": "Andalusia",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "social_links": {
      "facebook": "https://www.facebook.com/groups/1348559292364294"
    }
  },
  {
    "title": "Bornholm Worldschool Hub",
    "ltype": "hub",
    "description": "Seasonal hub with family-centered learning, beach camping, and cultural exploration; pre-registration required.",
    "city": "Rønne",
    "country": "Denmark",
    "lat": 55.0991,
    "lng": 14.7066,
    "organiser_name": "Worldschooly",
    "contact_email": "support@worldschooly.com",
    "start_date": "2026-05-16",
    "end_date": "2026-06-13",
    "is_permanent": false,
    "website_url": "https://worldschooly.com/hub/bornholm-worldschool-hub/",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "photos": ["https://worldschooly.com/wp-content/uploads/2025/bornholm-hub.jpg"],
    "social_links": {
      "website": "https://worldschooly.com",
      "facebook": "https://www.facebook.com/worldschooly",
      "instagram": "https://www.instagram.com/worldschooly"
    }
  },
  {
    "title": "Seattle Hub",
    "ltype": "hub",
    "description": "Pop-up hub with urban family meet-ups, focusing on tech and cultural activities.",
    "city": "Seattle",
    "country": "United States",
    "lat": 47.6062,
    "lng": -122.3321,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "region": "Washington",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "Alberta Hub",
    "ltype": "hub",
    "description": "Pop-up hub with nature-based outdoor activities for families, focusing on experiential learning.",
    "city": "Banff",
    "country": "Canada",
    "lat": 51.1784,
    "lng": -115.5708,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-08-01",
    "end_date": "2025-08-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "region": "Alberta",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "Manitoulin Community",
    "ltype": "hub",
    "description": "Seasonal hub promoting nature harmony and outdoor sports; includes lodging for $400/month.",
    "city": "Manitoulin Island",
    "country": "Canada",
    "lat": 45.7167,
    "lng": -82.0000,
    "organiser_name": "Purely Pacha",
    "contact_email": "info@purelypacha.com",
    "start_date": "2025-06-01",
    "end_date": "2025-09-30",
    "is_permanent": false,
    "price": 400.00,
    "website_url": "https://purelypacha.com/a-directory-of-worldschool-hubs-for-nomad-families-and-life-long-learners/",
    "region": "Ontario",
    "age_range": "All ages",
    "capacity": "Up to 20",
    "social_links": {
      "website": "https://purelypacha.com"
    }
  },
  {
    "title": "Magnetic Island Hub",
    "ltype": "hub",
    "description": "Pop-up hub with island adventures and wildlife learning for families.",
    "city": "Magnetic Island",
    "country": "Australia",
    "lat": -19.1551,
    "lng": 146.8489,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "region": "Queensland",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "Cusco Hub (Deliberate Detour)",
    "ltype": "hub",
    "description": "Pop-up hub exploring Andean culture, Inca walls, and optional Machu Picchu add-ons; 2-week cultural immersions.",
    "city": "Cusco",
    "country": "Peru",
    "lat": -13.5320,
    "lng": -71.9675,
    "organiser_name": "Deliberate Detour",
    "contact_email": "info@deliberatedetour.com",
    "start_date": "2025-03-30",
    "end_date": "2025-04-11",
    "is_permanent": false,
    "price": 800.00,
    "website_url": "https://deliberatedetour.com/",
    "region": "Cusco",
    "age_range": "7-16",
    "capacity": "Small (10-20)",
    "photos": ["https://deliberatedetour.com/images/cusco-hub.jpg"],
    "social_links": {
      "website": "https://deliberatedetour.com",
      "facebook": "https://www.facebook.com/deliberatedetour",
      "instagram": "https://www.instagram.com/deliberatedetour"
    }
  },
  {
    "title": "Oaxaca Hub (Deliberate Detour)",
    "ltype": "hub",
    "description": "Pop-up hub with Zapotec ruins, weaving, and alebrije art; 2-week cultural deep dives.",
    "city": "Oaxaca",
    "country": "Mexico",
    "lat": 17.0732,
    "lng": -96.7266,
    "organiser_name": "Deliberate Detour",
    "contact_email": "info@deliberatedetour.com",
    "start_date": "2025-05-25",
    "end_date": "2025-06-06",
    "is_permanent": false,
    "price": 800.00,
    "website_url": "https://deliberatedetour.com/",
    "region": "Oaxaca",
    "age_range": "7-16",
    "capacity": "Small (10-20)",
    "photos": ["https://deliberatedetour.com/images/oaxaca-hub.jpg"],
    "social_links": {
      "website": "https://deliberatedetour.com",
      "facebook": "https://www.facebook.com/deliberatedetour",
      "instagram": "https://www.instagram.com/deliberatedetour"
    }
  },
  {
    "title": "Costa Rica Hub",
    "ltype": "hub",
    "description": "Pop-up hub with jungle and rainforest eco-learning activities for families.",
    "city": "La Fortuna",
    "country": "Costa Rica",
    "lat": 10.4718,
    "lng": -84.6420,
    "organiser_name": "Family Travel Hive",
    "contact_email": "hello@familytravelhive.com",
    "start_date": "2025-09-01",
    "end_date": "2025-09-07",
    "is_permanent": false,
    "website_url": "https://familytravelhive.com/hubs",
    "region": "Alajuela",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://familytravelhive.com",
      "facebook": "https://www.facebook.com/familytravelhive",
      "instagram": "https://www.instagram.com/familytravelhive"
    }
  },
  {
    "title": "Boundless Life La Barra",
    "ltype": "hub",
    "description": "Permanent hub with beach and arts programs, offering educational and cultural immersion.",
    "city": "La Barra",
    "country": "Uruguay",
    "lat": -34.9137,
    "lng": -54.8587,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/9-month-boundless-experience",
    "region": "Maldonado",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/la-barra-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "World Traveling School",
    "ltype": "hub",
    "description": "Seasonal Montessori-inspired travel education hub visiting three Latin American locations annually.",
    "city": "Antigua",
    "country": "Guatemala",
    "lat": 14.5586,
    "lng": -90.7298,
    "organiser_name": "World Traveling School",
    "contact_email": "info@passportexplorers.com",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "is_permanent": false,
    "website_url": "https://passportexplorers.com/worldschooling-communities/",
    "region": "Sacatepéquez",
    "age_range": "5-18",
    "capacity": "Small (10-20)",
    "social_links": {
      "website": "https://passportexplorers.com"
    }
  },
  {
    "title": "Deliberate Detour Culture Hubs",
    "ltype": "hub",
    "description": "Seasonal hubs focusing on immersive history and culture workshops, with optional Machu Picchu excursions.",
    "city": "Cusco",
    "country": "Peru",
    "lat": -13.5320,
    "lng": -71.9675,
    "organiser_name": "Deliberate Detour",
    "contact_email": "info@deliberatedetour.com",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": false,
    "price": 800.00,
    "website_url": "https://deliberatedetour.com/hub-types/",
    "region": "Cusco",
    "age_range": "7-16",
    "capacity": "Small (10-20)",
    "photos": ["https://deliberatedetour.com/images/cusco-culture-hub.jpg"],
    "social_links": {
      "website": "https://deliberatedetour.com",
      "facebook": "https://www.facebook.com/deliberatedetour",
      "instagram": "https://www.instagram.com/deliberatedetour"
    }
  },
  {
    "title": "Deliberate Detour Community Hubs",
    "ltype": "hub",
    "description": "Seasonal hubs with play-focused adventures and affordable neighborhood explorations.",
    "city": "Oaxaca",
    "country": "Mexico",
    "lat": 17.0732,
    "lng": -96.7266,
    "organiser_name": "Deliberate Detour",
    "contact_email": "info@deliberatedetour.com",
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "is_permanent": false,
    "price": 800.00,
    "website_url": "https://deliberatedetour.com/hub-types/",
    "region": "Oaxaca",
    "age_range": "7-16",
    "capacity": "Small (10-20)",
    "photos": ["https://deliberatedetour.com/images/oaxaca-community-hub.jpg"],
    "social_links": {
      "website": "https://deliberatedetour.com",
      "facebook": "https://www.facebook.com/deliberatedetour",
      "instagram": "https://www.instagram.com/deliberatedetour"
    }
  },
  {
    "title": "San Francisco-Hawaii Cruise",
    "ltype": "event",
    "description": "16-night educational cruise for worldschooling families, blending travel and learning from San Francisco to Hawaii.",
    "city": "San Francisco",
    "country": "United States",
    "lat": 37.7749,
    "lng": -122.4194,
    "organiser_name": "WORLDSCHOOLING HUB",
    "contact_email": "admin@facebook.com",
    "start_date": "2025-12-01",
    "end_date": "2025-12-17",
    "is_permanent": false,
    "website_url": "https://www.facebook.com/groups/1348559292364294/",
    "region": "California",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "facebook": "https://www.facebook.com/groups/1348559292364294"
    }
  },
  {
    "title": "Boundless Trailblazer Program",
    "ltype": "event",
    "description": "Traveling program for ages 10-14, focusing on curiosity-driven discovery across Europe and Asia.",
    "city": "Various",
    "country": "Various",
    "lat": 0.0000,
    "lng": 0.0000,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2025-01-01",
    "end_date": "2026-12-31",
    "is_permanent": false,
    "price": 2000.00,
    "website_url": "https://www.boundless.life/blog/introducing-the-2025-2026-trailblazer-program",
    "age_range": "10-14",
    "capacity": "Small (10-20)",
    "photos": ["https://www.boundless.life/assets/images/trailblazer-program.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    }
  },
  {
    "title": "Project World School",
    "ltype": "hub",
    "description": "Pop-up hubs for teens and young adults, offering immersive cultural and educational experiences worldwide.",
    "city": "Various",
    "country": "Various",
    "lat": 0.0000,
    "lng": 0.0000,
    "organiser_name": "Project World School",
    "contact_email": "info@projectworldschool.com",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "is_permanent": false,
    "website_url": "https://passportexplorers.com/worldschooling-communities/",
    "age_range": "13-18",
    "capacity": "Small (10-20)",
    "social_links": {
      "website": "https://projectworldschool.com",
      "facebook": "https://www.facebook.com/projectworldschool"
    }
  },
  {
    "title": "Traveling Village",
    "ltype": "event",
    "description": "Group nomadic experiences for families, offering 4-month travel programs with educational focus.",
    "city": "Various",
    "country": "Various",
    "lat": 0.0000,
    "lng": 0.0000,
    "organiser_name": "Traveling Village",
    "contact_email": "info@passportexplorers.com",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "is_permanent": false,
    "website_url": "https://passportexplorers.com/worldschooling-communities/",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "social_links": {
      "website": "https://passportexplorers.com"
    }
  },
  {
    "title": "Worldschool Pop-Ups",
    "ltype": "hub",
    "description": "Affordable short-term pop-up gatherings for worldschooling families, held in various global locations.",
    "city": "Various",
    "country": "Various",
    "lat": 0.0000,
    "lng": 0.0000,
    "organiser_name": "Worldschool Pop-Ups",
    "contact_email": "info@worldschoolingpopups.com",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "is_permanent": false,
    "website_url": "https://www.worldschoolingpopups.com/events",
    "age_range": "All ages",
    "capacity": "Up to 50",
    "social_links": {
      "website": "https://www.worldschoolingpopups.com",
      "facebook": "https://www.facebook.com/worldschoolingpopups",
      "instagram": "https://www.instagram.com/worldschoolingpopups"
    }
  },
  {
    "title": "Quartier Collective",
    "ltype": "event",
    "description": "Family caravans and gatherings for worldschoolers, offering group travel and learning experiences.",
    "city": "Various",
    "country": "Various",
    "lat": 0.0000,
    "lng": 0.0000,
    "organiser_name": "Quartier Collective",
    "contact_email": "info@passportexplorers.com",
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "is_permanent": false,
    "website_url": "https://passportexplorers.com/worldschooling-communities/",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "social_links": {
      "website": "https://passportexplorers.com"
    }
  }
];

async function importEvents() {
  console.log('🌍 Starting import of worldschooling events and hubs...');
  console.log(`📊 Found ${eventsData.length} events to import`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const event of eventsData) {
    try {
      // Prepare the data for insertion
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
        verify: 'verified' as const, // Mark all as verified since they're real events
        created_by: null // No specific user as creator
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
  
  console.log('\n🎉 Import completed!');
  console.log(`✅ Successfully imported: ${successCount} events`);
  console.log(`❌ Failed to import: ${errorCount} events`);
  console.log(`📊 Total processed: ${eventsData.length} events`);
}

importEvents();
