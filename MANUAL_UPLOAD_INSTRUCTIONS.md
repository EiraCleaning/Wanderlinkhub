# Manual Production Data Upload Instructions

## Option 1: Direct SQL in Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Navigate to your WanderLink Hub project
   - Go to the SQL Editor

2. **Run this SQL script** (copy and paste the entire script below):

```sql
-- Clear existing data first (optional)
DELETE FROM listings;

-- Insert production data
INSERT INTO listings (
  id,
  title,
  description,
  city,
  country,
  lat,
  lng,
  organiser_name,
  contact_email,
  start_date,
  end_date,
  is_permanent,
  price,
  website_url,
  region,
  age_range,
  capacity,
  photos,
  social_links,
  ltype,
  verify,
  verified_intent,
  created_at
) VALUES 
(
  gen_random_uuid(),
  'Tokyo Worldschool Pop-Up Hub',
  'This immersive week-long event brings nomadic families together in Tokyo, a bustling megalopolis of 37 million, to experience its unique blend of ancient traditions and futuristic innovation. Families will dive into local foods like ramen and sushi at bustling markets, join karaoke sessions in private booths, visit serene temples such as Senso-ji, explore vibrant street markets like Tsukiji Outer Market, tour interactive museums including the TeamLab Borderless digital art exhibit, and participate in hands-on activities like origami workshops or robot demonstrations. The pop-up promotes peer learning through unstructured play in parks, cultural exchanges with locals, and evening debriefs where kids share discoveries, all while navigating Tokyo''s efficient public transport. It''s an ideal setup for fostering adaptability, language exposure (basic Japanese phrases taught), and global citizenship in a safe, family-paced environment, with optional add-ons like a day trip to nearby Hakone for hot springs.',
  'Tokyo',
  'Japan',
  35.6762,
  139.6503,
  'The Carlson Family',
  'contact@worldschoolpopuphub.com',
  '2025-10-18',
  '2025-10-24',
  false,
  180.00,
  'https://www.worldschoolpopuphub.com/events/tokyo-japan-october-2025',
  'Kanto',
  'All ages',
  'Up to 30',
  ARRAY['https://static.wixstatic.com/media/29d07d_1dce99adf84646678d3612d9b6a047a6~mv2.jpg/v1/fill/w_1958,h_1104,fp_0.50_0.50,q_90,usm_0.66_1.00_0.01,enc_auto/29d07d_1dce99adf84646678d3612d9b6a047a6~mv2.jpg', 'https://www.worldschoolpopuphub.com/wp-content/uploads/2024/08/Tokyo-Header-Image.png'],
  '{"website": "https://www.worldschoolpopuphub.com", "facebook": "https://www.facebook.com/worldschoolpopuphub", "instagram": "https://www.instagram.com/worldschoolpopuphub"}',
  'event',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Oaxaca Culture Hub',
  'Explore and fall in love with brightly-painted, alluring Oaxaca in this 2-week drop-off program for ages 7-16, accentuating cultural immersion through expert-led workshops and visits to important local sites. Activities include tying on an apron to flatten tortillas or stir up agua del dia, exploring the ruins of the Zapotec Empire, learning about local conservation at Oaxaca''s Jaguar Sanctuary, visiting a small village famous for its weaving and trying out a loom, wandering labyrinthine local markets and purchasing exotic fruits, trying out traditional printmaking and producing a souvenir, delving into Mayan cacao traditions while making tasty treats, tasting all seven Oaxacan moles, painting a spirit animal in the birthplace of alebrije art, and forging connections across cultures with local children and teens. Includes optional Family Field Trips, Parent-Only Activities, and Spanish lessons; all transportation, materials, snacks, and lunches provided 4 days/week with vetted English-speaking staff.',
  'Oaxaca',
  'Mexico',
  17.0732,
  -96.7266,
  'Deliberate Detour',
  'info@deliberatedetour.com',
  '2025-10-12',
  '2025-10-24',
  false,
  800.00,
  'https://deliberatedetour.com/oaxaca/',
  'Oaxaca',
  '7-16',
  'Small (10-20)',
  ARRAY['https://i.postimg.cc/7Z8LtgLB/Screenshot-2025-09-23-at-4-47-48-pm.png', 'https://deliberatedetour.com/images/oaxaca-culture-hub.jpg'],
  '{"website": "https://deliberatedetour.com", "facebook": "https://www.facebook.com/deliberatedetour", "instagram": "https://www.instagram.com/deliberatedetour"}',
  'hub',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Boundless Life Andalusia',
  'Perched on sun-drenched beaches in Estepona, this permanent hub offers forward-thinking education with Montessori and project-based elements tied to UN Sustainable Development Goals, in furnished homes, education centers, and co-working spaces. Daily life includes beach clean-ups, flamenco workshops, olive grove explorations, and collaborative art projects on Mediterranean ecology, with multi-age groups fostering empathy through storytelling circles and market haggling. Concierge services handle visas/excursions, while weekly yoga and farm-to-table meals build community; flexible 3-month or 4-week stays emphasize well-being with mindfulness and nature therapy, up to 40% off-peak discounts for October starts.',
  'Estepona',
  'Spain',
  36.4253,
  -5.1459,
  'Boundless Life',
  'hello@boundless.life',
  '2025-10-01',
  '2026-12-31',
  true,
  1500.00,
  'https://www.boundless.life/andalusia-spain',
  'Andalusia',
  '1.5-14',
  'Up to 40',
  ARRAY['https://i.postimg.cc/7Z8LtgLB/Screenshot-2025-09-23-at-4-47-48-pm.png', 'https://www.boundless.life/assets/images/andalusia-hub.jpg'],
  '{"website": "https://www.boundless.life", "facebook": "https://www.facebook.com/boundlesslife", "instagram": "https://www.instagram.com/boundlesslife"}',
  'hub',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Traveling Village 3',
  'An exhilarating 4-month communal adventure for 20 families (~70 people), starting in Vietnam and journeying through Taiwan and South Korea (5 weeks each, with 10-day breaks). Centered on ''The Nest'' hub (open 4 days/week) for kid-led activities, free play, adult connections, and events like cultural workshops, hikes, and skill-shares; managed by rotating Village Scouts emphasizing unschooling, transparency via weekly meetings, and equity through communal funds for meals/surprises. Families book lodging independently but immerse in pho-making, night markets, and hanok stays, building deep friendships and global awareness in a nomadic tribe.',
  'Ho Chi Minh City',
  'Vietnam',
  10.8231,
  106.6297,
  'Traveling Village',
  'hi@travelingvillage.com',
  '2026-01-01',
  '2026-05-31',
  false,
  3850.00,
  'https://travelingvillage.com/village-3',
  'Southern Vietnam (multi-country)',
  'All ages',
  '20 families',
  ARRAY['https://i.postimg.cc/3wGVSvdZ/Screenshot-2025-09-23-at-7-45-10-pm.png'],
  '{"website": "https://travelingvillage.com", "facebook": "https://www.facebook.com/travelingvillage", "instagram": "https://www.instagram.com/travelingvillage"}',
  'event',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Green School Bali',
  'In Ubud''s lush jungle, this bamboo-campus haven offers short-term enrollments fusing academics with regenerative living; kids design vertical farms, compost systems, and debate renewables in multi-age cohorts, alongside gamelan music and river biodiversity surveys. Parents access co-working amid rice paddies, joining zero-waste workshops; scholarships promote diversity, cultivating empathetic leaders under the canopy.',
  'Ubud',
  'Indonesia',
  -8.5069,
  115.2625,
  'Green School',
  'info@greenschool.org',
  '2025-10-01',
  '2026-12-31',
  true,
  1000.00,
  'https://www.greenschool.org/',
  'Bali',
  '3-18',
  'Up to 50',
  ARRAY['https://i.postimg.cc/TPQgXkL2/Screenshot-2025-09-23-at-7-49-00-pm.png'],
  '{"website": "https://www.greenschool.org", "facebook": "https://www.facebook.com/greenschoolbali", "instagram": "https://www.instagram.com/greenschoolbali"}',
  'hub',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Ubuntu Worldschool Cantabria',
  'In northern Spain''s coliving space at PAS Coliving, this hub collaborates for transformative experiences blending unschooling with social change; families engage in permaculture gardens, yoga/meditation, and community workshops on equity, with child-led sessions on local folklore and coastal hikes. Open to all, it fosters multilingual connections (English/Spanish) and guest-led events, emphasizing emotional growth through circle shares and sustainable feasts.',
  'Cantabria',
  'Spain',
  43.3000,
  -4.0333,
  'Espacio Ubuntu & The Social Circle',
  'info@espacioubuntu.org',
  '2025-11-01',
  '2025-12-15',
  false,
  0,
  'https://espacioubuntu.org/2024/12/20/ubuntuworldschool/',
  'Cantabria',
  'All ages',
  'Up to 30',
  ARRAY['https://espacioubuntu.org/wp-content/uploads/2025/08/img-20250405-wa0033.jpg'],
  '{"website": "https://espacioubuntu.org", "facebook": "https://www.facebook.com/espacioubuntu"}',
  'hub',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Boundless Life Kotor',
  'In Montenegro''s Venetian bay town, this permanent hub features project-based learning on maritime history and ecology, with kids exploring fortresses, sailing workshops, and olive presses in multi-age groups. Villas, learning pavilions, and co-working overlook the Adriatic; community includes potlucks, e-bike tours, and astronomy nights, with flexible stays promoting resilience via nature therapy.',
  'Kotor',
  'Montenegro',
  42.4247,
  18.7712,
  'Boundless Life',
  'hello@boundless.life',
  '2025-10-01',
  '2026-12-31',
  true,
  1500.00,
  'https://www.boundless.life/kotor-montenegro',
  'Bay of Kotor',
  '1.5-14',
  'Up to 40',
  ARRAY['https://i.postimg.cc/tJdV22jH/Screenshot-2025-09-23-at-7-53-05-pm.png'],
  '{"website": "https://www.boundless.life", "facebook": "https://www.facebook.com/boundlesslife", "instagram": "https://www.instagram.com/boundlesslife"}',
  'hub',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Field School Hvar (Fall Session)',
  'On Croatia''s Adriatic isle, this seasonal hub turns lavender fields and coves into classrooms for self-paced projects on sustainable fishing and folklore; fall sessions include olive harvests, snorkel safaris, and stone-carving, with Waldorf rhythms and STEM labs. Parents join unschooling seminars; vegan meals and Pakleni excursions build bonds in small groups.',
  'Hvar',
  'Croatia',
  43.1729,
  16.4412,
  'Field School of Hvar',
  'info@fieldschoolhvar.org',
  '2025-10-01',
  '2025-11-30',
  false,
  0,
  'https://www.fieldschoolhvar.org/',
  'Split-Dalmatia',
  '1-17',
  'Small (10-20)',
  ARRAY['https://images.squarespace-cdn.com/content/v1/653b86966ae72b72ac438ccf/11cb1f64-1ffa-4844-8b2d-b0c6f3243aab/09-July-2024+Vrisnik-24.jpg?format=2500w'],
  '{"website": "https://www.fieldschoolhvar.org", "facebook": "https://www.facebook.com/fieldschoolhvar"}',
  'hub',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Worldschooling Hub Goa (October Session)',
  'In South Goa''s beaches, this permanent hub offers 30-day cultural immersion with unschooling and self-directed gardening; families engage in rice field treks, spice market tours, and teen-led yoga, with English instruction and excursions to temples. Focus on community via shared meals and skill-shares, fostering curiosity in a vibrant, affordable setting.',
  'Goa',
  'India',
  15.2993,
  74.1240,
  'Worldschooling Hub Goa',
  'info@worldschoolinghubgoa.com',
  '2025-10-01',
  '2025-10-30',
  true,
  0,
  'https://www.worldschoolinghubgoa.com/',
  'South Goa',
  '5-18',
  'Up to 30',
  ARRAY['https://i.postimg.cc/DzYDwPRF/Screenshot-2025-09-23-at-7-59-32-pm.png'],
  '{"website": "https://www.worldschoolinghubgoa.com", "facebook": "https://www.facebook.com/worldschoolinghubgoa"}',
  'hub',
  'verified',
  true,
  NOW()
),
(
  gen_random_uuid(),
  'Forever Wild Pods Da Nang (Fall Extension)',
  'Along Da Nang''s beaches, this 4-week pod extends into fall for unscripted play and sustainability; mornings feature mangrove kayaking and marine dives, afternoons creative beach art, evenings bonfires for shares. Kids lead councils, building resilience via surfing and conflict games in eco-tents, amid street food and Cham ruins.',
  'Da Nang',
  'Vietnam',
  16.0544,
  108.2022,
  'Forever Wild Children''s Garden',
  'foreverwildchildrensgarden@gmail.com',
  '2025-10-01',
  '2025-10-28',
  false,
  400.00,
  'https://www.foreverwildlt.com/_files/ugd/59084b_81b106665e4a48868147d442196bbbd0.pdf',
  'Central Coast',
  'All ages',
  'Up to 30',
  ARRAY['https://i.postimg.cc/SR7bRzWr/Screenshot-2025-09-23-at-8-06-48-pm.png'],
  '{"website": "https://www.foreverwildlt.com", "instagram": "https://www.instagram.com/foreverwildlt"}',
  'hub',
  'verified',
  true,
  NOW()
);
```

3. **Click "Run"** to execute the script

4. **Verify the data** by checking the listings table

## What this will add:

✅ **10 Real Events & Hubs:**
- Tokyo Worldschool Pop-Up Hub (Event)
- Oaxaca Culture Hub (Hub)
- Boundless Life Andalusia (Hub)
- Traveling Village 3 (Event)
- Green School Bali (Hub)
- Ubuntu Worldschool Cantabria (Hub)
- Boundless Life Kotor (Hub)
- Field School Hvar (Fall Session) (Hub)
- Worldschooling Hub Goa (October Session) (Hub)
- Forever Wild Pods Da Nang (Fall Extension) (Hub)

✅ **All listings are pre-verified** and ready for production

✅ **Complete data** including descriptions, locations, pricing, contact info, and images

## After Upload:

1. **Check your website** - the events should appear on the map and in listings
2. **Test search functionality** - try searching for different locations
3. **Verify mobile responsiveness** - check on your phone
4. **Test the map** - make sure pins appear correctly

## Next Steps:

Once the data is uploaded, you'll be ready to:
- Switch Stripe to live mode
- Launch your website! 🚀
