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

async function testAPI() {
  console.log('🧪 Testing API directly...');
  
  try {
    // Test the same query that the app uses
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .in('verify', ['verified', 'pending'])
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching listings:', error);
      return;
    }
    
    console.log(`📊 API returned ${listings?.length || 0} listings:`);
    console.log('');
    
    // Show first 10 listings
    listings?.slice(0, 10).forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title}`);
      console.log(`   Type: ${listing.ltype}`);
      console.log(`   Location: ${listing.city}, ${listing.country}`);
      console.log(`   Status: ${listing.verify}`);
      console.log('');
    });
    
    if (listings && listings.length > 10) {
      console.log(`... and ${listings.length - 10} more listings`);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testAPI();
