import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

const productionData = [
  {
    "title": "Tokyo Worldschool Pop-Up Hub",
    "ltype": "event",
    "description": "This immersive week-long event brings nomadic families together in Tokyo, a bustling megalopolis of 37 million, to experience its unique blend of ancient traditions and futuristic innovation. Families will dive into local foods like ramen and sushi at bustling markets, join karaoke sessions in private booths, visit serene temples such as Senso-ji, explore vibrant street markets like Tsukiji Outer Market, tour interactive museums including the TeamLab Borderless digital art exhibit, and participate in hands-on activities like origami workshops or robot demonstrations. The pop-up promotes peer learning through unstructured play in parks, cultural exchanges with locals, and evening debriefs where kids share discoveries, all while navigating Tokyo's efficient public transport. It's an ideal setup for fostering adaptability, language exposure (basic Japanese phrases taught), and global citizenship in a safe, family-paced environment, with optional add-ons like a day trip to nearby Hakone for hot springs.",
    "city": "Tokyo",
    "country": "Japan",
    "lat": 35.6762,
    "lng": 139.6503,
    "organiser_name": "The Carlson Family",
    "contact_email": "contact@worldschoolpopuphub.com",
    "start_date": "2025-10-18",
    "end_date": "2025-10-24",
    "is_permanent": false,
    "price": 180.00,
    "website_url": "https://www.worldschoolpopuphub.com/events/tokyo-japan-october-2025",
    "region": "Kanto",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "photos": ["https://www.worldschoolpopuphub.com/wp-content/uploads/2024/08/Tokyo-Header-Image.png"],
    "social_links": {
      "website": "https://www.worldschoolpopuphub.com",
      "facebook": "https://www.facebook.com/worldschoolpopuphub",
      "instagram": "https://www.instagram.com/worldschoolpopuphub"
    },
    "event_image_url": "https://static.wixstatic.com/media/29d07d_1dce99adf84646678d3612d9b6a047a6~mv2.jpg/v1/fill/w_1958,h_1104,fp_0.50_0.50,q_90,usm_0.66_1.00_0.01,enc_auto/29d07d_1dce99adf84646678d3612d9b6a047a6~mv2.jpg"
  },
  {
    "title": "Oaxaca Culture Hub",
    "ltype": "hub",
    "description": "Explore and fall in love with brightly-painted, alluring Oaxaca in this 2-week drop-off program for ages 7-16, accentuating cultural immersion through expert-led workshops and visits to important local sites. Activities include tying on an apron to flatten tortillas or stir up agua del dia, exploring the ruins of the Zapotec Empire, learning about local conservation at Oaxaca's Jaguar Sanctuary, visiting a small village famous for its weaving and trying out a loom, wandering labyrinthine local markets and purchasing exotic fruits, trying out traditional printmaking and producing a souvenir, delving into Mayan cacao traditions while making tasty treats, tasting all seven Oaxacan moles, painting a spirit animal in the birthplace of alebrije art, and forging connections across cultures with local children and teens. Includes optional Family Field Trips, Parent-Only Activities, and Spanish lessons; all transportation, materials, snacks, and lunches provided 4 days/week with vetted English-speaking staff.",
    "city": "Oaxaca",
    "country": "Mexico",
    "lat": 17.0732,
    "lng": -96.7266,
    "organiser_name": "Deliberate Detour",
    "contact_email": "info@deliberatedetour.com",
    "start_date": "2025-10-12",
    "end_date": "2025-10-24",
    "is_permanent": false,
    "price": 800.00,
    "website_url": "https://deliberatedetour.com/oaxaca/",
    "region": "Oaxaca",
    "age_range": "7-16",
    "capacity": "Small (10-20)",
    "photos": ["https://deliberatedetour.com/images/oaxaca-culture-hub.jpg"],
    "social_links": {
      "website": "https://deliberatedetour.com",
      "facebook": "https://www.facebook.com/deliberatedetour",
      "instagram": "https://www.instagram.com/deliberatedetour"
    },
    "event_image_url": "https://i.postimg.cc/7Z8LtgLB/Screenshot-2025-09-23-at-4-47-48-pm.png"
  },
  {
    "title": "Boundless Life Andalusia",
    "ltype": "hub",
    "description": "Perched on sun-drenched beaches in Estepona, this permanent hub offers forward-thinking education with Montessori and project-based elements tied to UN Sustainable Development Goals, in furnished homes, education centers, and co-working spaces. Daily life includes beach clean-ups, flamenco workshops, olive grove explorations, and collaborative art projects on Mediterranean ecology, with multi-age groups fostering empathy through storytelling circles and market haggling. Concierge services handle visas/excursions, while weekly yoga and farm-to-table meals build community; flexible 3-month or 4-week stays emphasize well-being with mindfulness and nature therapy, up to 40% off-peak discounts for October starts.",
    "city": "Estepona",
    "country": "Spain",
    "lat": 36.4253,
    "lng": -5.1459,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2025-10-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/andalusia-spain",
    "region": "Andalusia",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://www.boundless.life/assets/images/andalusia-hub.jpg"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    },
    "event_image_url": "https://i.postimg.cc/7Z8LtgLB/Screenshot-2025-09-23-at-4-47-48-pm.png"
  },
  {
    "title": "Traveling Village 3",
    "ltype": "event",
    "description": "An exhilarating 4-month communal adventure for 20 families (~70 people), starting in Vietnam and journeying through Taiwan and South Korea (5 weeks each, with 10-day breaks). Centered on 'The Nest' hub (open 4 days/week) for kid-led activities, free play, adult connections, and events like cultural workshops, hikes, and skill-shares; managed by rotating Village Scouts emphasizing unschooling, transparency via weekly meetings, and equity through communal funds for meals/surprises. Families book lodging independently but immerse in pho-making, night markets, and hanok stays, building deep friendships and global awareness in a nomadic tribe.",
    "city": "Ho Chi Minh City",
    "country": "Vietnam",
    "lat": 10.8231,
    "lng": 106.6297,
    "organiser_name": "Traveling Village",
    "contact_email": "hi@travelingvillage.com",
    "start_date": "2026-01-01",
    "end_date": "2026-05-31",
    "is_permanent": false,
    "price": 3850.00,
    "website_url": "https://travelingvillage.com/village-3",
    "region": "Southern Vietnam (multi-country)",
    "age_range": "All ages",
    "capacity": "20 families",
    "photos": ["https://i.postimg.cc/3wGVSvdZ/Screenshot-2025-09-23-at-7-45-10-pm.png"],
    "social_links": {
      "website": "https://travelingvillage.com",
      "facebook": "https://www.facebook.com/travelingvillage",
      "instagram": "https://www.instagram.com/travelingvillage"
    },
    "event_image_url": "https://i.postimg.cc/3wGVSvdZ/Screenshot-2025-09-23-at-7-45-10-pm.png"
  },
  {
    "title": "Green School Bali",
    "ltype": "hub",
    "description": "In Ubud's lush jungle, this bamboo-campus haven offers short-term enrollments fusing academics with regenerative living; kids design vertical farms, compost systems, and debate renewables in multi-age cohorts, alongside gamelan music and river biodiversity surveys. Parents access co-working amid rice paddies, joining zero-waste workshops; scholarships promote diversity, cultivating empathetic leaders under the canopy.",
    "city": "Ubud",
    "country": "Indonesia",
    "lat": -8.5069,
    "lng": 115.2625,
    "organiser_name": "Green School",
    "contact_email": "info@greenschool.org",
    "start_date": "2025-10-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1000.00,
    "website_url": "https://www.greenschool.org/",
    "region": "Bali",
    "age_range": "3-18",
    "capacity": "Up to 50",
    "photos": ["https://i.postimg.cc/TPQgXkL2/Screenshot-2025-09-23-at-7-49-00-pm.png"],
    "social_links": {
      "website": "https://www.greenschool.org",
      "facebook": "https://www.facebook.com/greenschoolbali",
      "instagram": "https://www.instagram.com/greenschoolbali"
    },
    "event_image_url": "https://i.postimg.cc/TPQgXkL2/Screenshot-2025-09-23-at-7-49-00-pm.png"
  },
  {
    "title": "Ubuntu Worldschool Cantabria",
    "ltype": "hub",
    "description": "In northern Spain's coliving space at PAS Coliving, this hub collaborates for transformative experiences blending unschooling with social change; families engage in permaculture gardens, yoga/meditation, and community workshops on equity, with child-led sessions on local folklore and coastal hikes. Open to all, it fosters multilingual connections (English/Spanish) and guest-led events, emphasizing emotional growth through circle shares and sustainable feasts.",
    "city": "Cantabria",
    "country": "Spain",
    "lat": 43.3000,
    "lng": -4.0333,
    "organiser_name": "Espacio Ubuntu & The Social Circle",
    "contact_email": "info@espacioubuntu.org",
    "start_date": "2025-11-01",
    "end_date": "2025-12-15",
    "is_permanent": false,
    "price": 0,
    "website_url": "https://espacioubuntu.org/2024/12/20/ubuntuworldschool/",
    "region": "Cantabria",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "photos": ["https://espacioubuntu.org/wp-content/uploads/2025/08/img-20250405-wa0033.jpg"],
    "social_links": {
      "website": "https://espacioubuntu.org",
      "facebook": "https://www.facebook.com/espacioubuntu"
    },
    "event_image_url": "https://espacioubuntu.org/wp-content/uploads/2025/08/img-20250405-wa0033.jpg"
  },
  {
    "title": "Boundless Life Kotor",
    "ltype": "hub",
    "description": "In Montenegro's Venetian bay town, this permanent hub features project-based learning on maritime history and ecology, with kids exploring fortresses, sailing workshops, and olive presses in multi-age groups. Villas, learning pavilions, and co-working overlook the Adriatic; community includes potlucks, e-bike tours, and astronomy nights, with flexible stays promoting resilience via nature therapy.",
    "city": "Kotor",
    "country": "Montenegro",
    "lat": 42.4247,
    "lng": 18.7712,
    "organiser_name": "Boundless Life",
    "contact_email": "hello@boundless.life",
    "start_date": "2025-10-01",
    "end_date": "2026-12-31",
    "is_permanent": true,
    "price": 1500.00,
    "website_url": "https://www.boundless.life/kotor-montenegro",
    "region": "Bay of Kotor",
    "age_range": "1.5-14",
    "capacity": "Up to 40",
    "photos": ["https://i.postimg.cc/tJdV22jH/Screenshot-2025-09-23-at-7-53-05-pm.png"],
    "social_links": {
      "website": "https://www.boundless.life",
      "facebook": "https://www.facebook.com/boundlesslife",
      "instagram": "https://www.instagram.com/boundlesslife"
    },
    "event_image_url": "https://i.postimg.cc/tJdV22jH/Screenshot-2025-09-23-at-7-53-05-pm.png"
  },
  {
    "title": "Field School Hvar (Fall Session)",
    "ltype": "hub",
    "description": "On Croatia's Adriatic isle, this seasonal hub turns lavender fields and coves into classrooms for self-paced projects on sustainable fishing and folklore; fall sessions include olive harvests, snorkel safaris, and stone-carving, with Waldorf rhythms and STEM labs. Parents join unschooling seminars; vegan meals and Pakleni excursions build bonds in small groups.",
    "city": "Hvar",
    "country": "Croatia",
    "lat": 43.1729,
    "lng": 16.4412,
    "organiser_name": "Field School of Hvar",
    "contact_email": "info@fieldschoolhvar.org",
    "start_date": "2025-10-01",
    "end_date": "2025-11-30",
    "is_permanent": false,
    "price": 0,
    "website_url": "https://www.fieldschoolhvar.org/",
    "region": "Split-Dalmatia",
    "age_range": "1-17",
    "capacity": "Small (10-20)",
    "photos": ["https://images.squarespace-cdn.com/content/v1/653b86966ae72b72ac438ccf/11cb1f64-1ffa-4844-8b2d-b0c6f3243aab/09-July-2024+Vrisnik-24.jpg?format=2500w"],
    "social_links": {
      "website": "https://www.fieldschoolhvar.org",
      "facebook": "https://www.facebook.com/fieldschoolhvar"
    },
    "event_image_url": "https://images.squarespace-cdn.com/content/v1/653b86966ae72b72ac438ccf/11cb1f64-1ffa-4844-8b2d-b0c6f3243aab/09-July-2024+Vrisnik-24.jpg?format=2500w"
  },
  {
    "title": "Worldschooling Hub Goa (October Session)",
    "ltype": "hub",
    "description": "In South Goa's beaches, this permanent hub offers 30-day cultural immersion with unschooling and self-directed gardening; families engage in rice field treks, spice market tours, and teen-led yoga, with English instruction and excursions to temples. Focus on community via shared meals and skill-shares, fostering curiosity in a vibrant, affordable setting.",
    "city": "Goa",
    "country": "India",
    "lat": 15.2993,
    "lng": 74.1240,
    "organiser_name": "Worldschooling Hub Goa",
    "contact_email": "info@worldschoolinghubgoa.com",
    "start_date": "2025-10-01",
    "end_date": "2025-10-30",
    "is_permanent": true,
    "price": 0,
    "website_url": "https://www.worldschoolinghubgoa.com/",
    "region": "South Goa",
    "age_range": "5-18",
    "capacity": "Up to 30",
    "photos": ["https://i.postimg.cc/DzYDwPRF/Screenshot-2025-09-23-at-7-59-32-pm.png"],
    "social_links": {
      "website": "https://www.worldschoolinghubgoa.com",
      "facebook": "https://www.facebook.com/worldschoolinghubgoa"
    },
    "event_image_url": "https://i.postimg.cc/DzYDwPRF/Screenshot-2025-09-23-at-7-59-32-pm.png"
  },
  {
    "title": "Forever Wild Pods Da Nang (Fall Extension)",
    "ltype": "hub",
    "description": "Along Da Nang's beaches, this 4-week pod extends into fall for unscripted play and sustainability; mornings feature mangrove kayaking and marine dives, afternoons creative beach art, evenings bonfires for shares. Kids lead councils, building resilience via surfing and conflict games in eco-tents, amid street food and Cham ruins.",
    "city": "Da Nang",
    "country": "Vietnam",
    "lat": 16.0544,
    "lng": 108.2022,
    "organiser_name": "Forever Wild Children's Garden",
    "contact_email": "foreverwildchildrensgarden@gmail.com",
    "start_date": "2025-10-01",
    "end_date": "2025-10-28",
    "is_permanent": false,
    "price": 400.00,
    "website_url": "https://www.foreverwildlt.com/_files/ugd/59084b_81b106665e4a48868147d442196bbbd0.pdf",
    "region": "Central Coast",
    "age_range": "All ages",
    "capacity": "Up to 30",
    "photos": ["https://i.postimg.cc/SR7bRzWr/Screenshot-2025-09-23-at-8-06-48-pm.png"],
    "social_links": {
      "website": "https://www.foreverwildlt.com",
      "instagram": "https://www.instagram.com/foreverwildlt"
    },
    "event_image_url": "https://i.postimg.cc/SR7bRzWr/Screenshot-2025-09-23-at-8-06-48-pm.png"
  }
];

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    console.log(`Starting upload of ${productionData.length} production listings...`);
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const listing of productionData) {
      try {
        // Transform the data to match the database schema
        const listingData = {
          title: listing.title,
          description: listing.description,
          city: listing.city,
          country: listing.country,
          lat: listing.lat,
          lng: listing.lng,
          organiser_name: listing.organiser_name,
          contact_email: listing.contact_email,
          start_date: listing.start_date,
          end_date: listing.end_date,
          is_permanent: listing.is_permanent,
          price: listing.price,
          website_url: listing.website_url,
          region: listing.region,
          age_range: listing.age_range,
          capacity: listing.capacity,
          photos: listing.photos,
          social_links: listing.social_links,
          event_image_url: listing.event_image_url,
          ltype: listing.ltype,
          verify: 'verified', // Auto-verify production data
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('listings')
          .insert([listingData])
          .select();
        
        if (error) {
          console.error(`Error inserting ${listing.title}:`, error);
          results.push({ title: listing.title, status: 'error', error: error.message });
          errorCount++;
        } else {
          console.log(`✅ Successfully uploaded: ${listing.title}`);
          results.push({ title: listing.title, status: 'success', id: data[0]?.id });
          successCount++;
        }
      } catch (error: any) {
        console.error(`Error processing ${listing.title}:`, error);
        results.push({ title: listing.title, status: 'error', error: error.message });
        errorCount++;
      }
    }
    
    console.log(`Upload complete: ${successCount} successful, ${errorCount} errors`);
    
    return NextResponse.json({
      success: true,
      message: `Uploaded ${successCount} out of ${productionData.length} listings`,
      results,
      summary: {
        total: productionData.length,
        successful: successCount,
        errors: errorCount
      }
    });
    
  } catch (error: any) {
    console.error('Error in upload-production-data:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to upload production data' },
      { status: 500 }
    );
  }
}
