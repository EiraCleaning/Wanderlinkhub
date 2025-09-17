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

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFavouritesTable() {
  console.log('🧪 Testing favourites table...');
  
  try {
    // Try to query the favourites table
    const { data, error } = await supabase
      .from('favourites')
      .select('*')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST106' || error.message.includes('relation "favourites" does not exist')) {
        console.log('❌ Favourites table does not exist');
        console.log('💡 Please run this SQL in your Supabase dashboard:');
        console.log(`
CREATE TABLE IF NOT EXISTS favourites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON favourites(user_id);
CREATE INDEX IF NOT EXISTS idx_favourites_listing_id ON favourites(listing_id);

ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favourites" ON favourites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favourites" ON favourites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favourites" ON favourites
  FOR DELETE USING (auth.uid() = user_id);
        `);
      } else {
        console.error('❌ Error querying favourites table:', error);
      }
    } else {
      console.log('✅ Favourites table exists and is accessible');
      console.log(`📊 Found ${data?.length || 0} favourites in the table`);
    }
  } catch (error) {
    console.error('❌ Error testing favourites table:', error);
  }
}

testFavouritesTable();
