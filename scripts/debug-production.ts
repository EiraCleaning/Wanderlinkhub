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
console.log('🔑 Service key starts with:', supabaseServiceKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugProduction() {
  console.log('🧪 Debugging production database...');
  
  try {
    // Check all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Error fetching tables:', tablesError);
    } else {
      console.log('📋 Available tables:', tables?.map(t => t.table_name).join(', '));
    }
    
    // Check listings table specifically
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('❌ Error fetching listings:', error);
      return;
    }
    
    console.log(`📊 Found ${listings?.length || 0} listings in production database:`);
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
    console.error('❌ Error debugging production:', error);
  }
}

debugProduction();
