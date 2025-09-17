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

async function clearListings() {
  console.log('🗑️  Clearing all listings...');
  
  try {
    // Delete all reviews first (due to foreign key constraints)
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all reviews
    
    if (reviewsError) {
      console.error('❌ Error deleting reviews:', reviewsError);
      return;
    }
    
    console.log('✅ Deleted all reviews');
    
    // Delete all listings
    const { error: listingsError } = await supabase
      .from('listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all listings
    
    if (listingsError) {
      console.error('❌ Error deleting listings:', listingsError);
      return;
    }
    
    console.log('✅ Deleted all listings');
    console.log('🎉 Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

clearListings();
