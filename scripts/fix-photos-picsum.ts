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

// Generate appropriate placeholder images using Picsum Photos
function generatePlaceholderImage(title: string, ltype: string, city: string, country: string): string {
  // Use Picsum Photos for reliable placeholder images
  const baseUrl = 'https://picsum.photos';
  
  // Create a consistent seed based on the title for consistent images
  const seed = title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
  
  // Different image IDs for different types of content
  const imageIds = {
    'hub': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Community/family images
    'event': [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // Event images
  };

  // Select image ID based on type and use seed for consistency
  const typeImages = imageIds[ltype] || imageIds.hub;
  const imageId = typeImages[seed.length % typeImages.length];
  
  return `${baseUrl}/800/600?random=${imageId}&seed=${seed}`;
}

async function fixAllPhotos() {
  console.log('🖼️  Fixing all photos with Picsum...');
  
  try {
    // Get all listings
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, title, ltype, city, country, photos');

    if (error) {
      console.error('❌ Error fetching listings:', error);
      return;
    }

    console.log(`📊 Found ${listings.length} listings to update`);

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

fixAllPhotos();
