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

async function createFavouritesTable() {
  console.log('📋 Creating favourites table...');
  
  try {
    // First, let's check if the table already exists
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'favourites');
    
    if (checkError) {
      console.error('❌ Error checking existing tables:', checkError);
      return;
    }
    
    if (existingTables && existingTables.length > 0) {
      console.log('✅ Favourites table already exists');
      return;
    }
    
    // Create the table using a direct SQL query
    const { data, error } = await supabase
      .rpc('exec', {
        sql: `
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
        `
      });
    
    if (error) {
      console.error('❌ Error creating favourites table:', error);
      console.log('💡 You may need to run this SQL manually in the Supabase dashboard:');
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
      return;
    }
    
    console.log('✅ Favourites table created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating favourites table:', error);
  }
}

createFavouritesTable();
