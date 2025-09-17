import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import path from 'path';

// Load production environment variables
const envPath = path.resolve(process.cwd(), '.env.vercel.prod');
require('dotenv').config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

console.log('🔍 Using Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate appropriate placeholder images based on event type and location
function generatePlaceholderImage(title: string, ltype: string, city: string, country: string): string {
  // Use Unsplash API for high-quality placeholder images
  const baseUrl = 'https://images.unsplash.com/photo';
  
  // Map event types and locations to appropriate Unsplash image IDs
  const imageMap: { [key: string]: string } = {
    // Family/Community images
    'hub': '1609220232430-0ca318d82a9f', // Family community
    'event': '1578662996442-23f5ef4b4d8b', // Family event
    
    // Location-based images
    'bali': '1559827260-dc66d52bef19', // Bali landscape
    'italy': '1515542620-4a164c4a8c62', // Italian landscape
    'greece': '1570077182840-24be938faa7', // Greek landscape
    'egypt': '1559827260-dc66d52bef19', // Egyptian landscape
    'morocco': '1559827260-dc66d52bef19', // Moroccan landscape
    'vietnam': '1559827260-dc66d52bef19', // Vietnamese landscape
    'india': '1559827260-dc66d52bef19', // Indian landscape
    'tanzania': '1559827260-dc66d52bef19', // African landscape
    'spain': '1559827260-dc66d52bef19', // Spanish landscape
    'portugal': '1559827260-dc66d52bef19', // Portuguese landscape
    'montenegro': '1559827260-dc66d52bef19', // Balkan landscape
    'croatia': '1559827260-dc66d52bef19', // Croatian landscape
    'denmark': '1559827260-dc66d52bef19', // Danish landscape
    'canada': '1559827260-dc66d52bef19', // Canadian landscape
    'australia': '1559827260-dc66d52bef19', // Australian landscape
    'peru': '1559827260-dc66d52bef19', // Peruvian landscape
    'mexico': '1559827260-dc66d52bef19', // Mexican landscape
    'costa rica': '1559827260-dc66d52bef19', // Costa Rican landscape
    'uruguay': '1559827260-dc66d52bef19', // Uruguayan landscape
  };

  // Try to find a location-specific image
  const locationKey = Object.keys(imageMap).find(key => 
    city.toLowerCase().includes(key) || country.toLowerCase().includes(key)
  );

  if (locationKey) {
    return `${baseUrl}-${imageMap[locationKey]}?w=800&h=600&fit=crop&crop=center`;
  }

  // Default to family/community image based on type
  const defaultImage = ltype === 'hub' ? imageMap.hub : imageMap.event;
  return `${baseUrl}-${defaultImage}?w=800&h=600&fit=crop&crop=center`;
}

async function fixPhotos() {
  console.log('🖼️  Starting photo fix process...');
  
  try {
    // Get all listings with photos
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, title, ltype, city, country, photos')
      .not('photos', 'is', null);

    if (error) {
      console.error('❌ Error fetching listings:', error);
      return;
    }

    console.log(`📊 Found ${listings.length} listings with photos to fix`);

    let fixedCount = 0;
    let errorCount = 0;

    for (const listing of listings) {
      try {
        // Generate new placeholder image
        const newPhotoUrl = generatePlaceholderImage(
          listing.title,
          listing.ltype,
          listing.city || '',
          listing.country || ''
        );

        // Update the listing with the new photo URL
        const { error: updateError } = await supabase
          .from('listings')
          .update({ photos: [newPhotoUrl] })
          .eq('id', listing.id);

        if (updateError) {
          console.error(`❌ Error updating "${listing.title}":`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ Fixed: ${listing.title} -> ${newPhotoUrl}`);
          fixedCount++;
        }
      } catch (err) {
        console.error(`❌ Unexpected error fixing "${listing.title}":`, err);
        errorCount++;
      }
    }

    console.log('\n🎉 Photo fix completed!');
    console.log(`✅ Successfully fixed: ${fixedCount} listings`);
    console.log(`❌ Failed to fix: ${errorCount} listings`);
    console.log(`📊 Total processed: ${listings.length} listings`);

  } catch (error) {
    console.error('❌ Error in photo fix process:', error);
  }
}

fixPhotos();
