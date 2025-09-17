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

async function checkListings() {
  console.log('🔍 Checking current listings in database...');
  
  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching listings:', error);
      return;
    }
    
    console.log(`📊 Found ${listings?.length || 0} listings:`);
    console.log('');
    
    listings?.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title}`);
      console.log(`   Type: ${listing.ltype}`);
      console.log(`   Location: ${listing.city}, ${listing.country}`);
      console.log(`   Status: ${listing.verify}`);
      console.log(`   Created: ${listing.created_at}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error checking listings:', error);
  }
}

checkListings();
