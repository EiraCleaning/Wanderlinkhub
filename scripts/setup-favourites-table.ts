import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.vercel.prod' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupFavouritesTable() {
  console.log('🔧 Setting up favourites table...');

  try {
    // Check if table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'favourites');

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError);
      return;
    }

    if (tables && tables.length > 0) {
      console.log('✅ Favourites table already exists');
    } else {
      console.log('📝 Creating favourites table...');
      
      // Create the table
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS favourites (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            
            -- Ensure a user can only favourite a listing once
            UNIQUE(user_id, listing_id)
          );
        `
      });

      if (createError) {
        console.error('❌ Error creating table:', createError);
        return;
      }

      console.log('✅ Favourites table created');
    }

    // Create indexes
    console.log('📝 Creating indexes...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_favourites_user_id ON favourites(user_id);
        CREATE INDEX IF NOT EXISTS idx_favourites_listing_id ON favourites(listing_id);
      `
    });

    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
    } else {
      console.log('✅ Indexes created');
    }

    // Enable RLS
    console.log('📝 Enabling RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;'
    });

    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
    } else {
      console.log('✅ RLS enabled');
    }

    // Create policies
    console.log('📝 Creating RLS policies...');
    const policies = [
      `CREATE POLICY "Users can view their own favourites" ON favourites
        FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own favourites" ON favourites
        FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own favourites" ON favourites
        FOR DELETE USING (auth.uid() = user_id);`
    ];

    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', {
        sql: policy
      });

      if (policyError) {
        console.error('❌ Error creating policy:', policyError);
      }
    }

    console.log('✅ RLS policies created');

    // Grant permissions
    console.log('📝 Granting permissions...');
    const { error: grantError } = await supabase.rpc('exec_sql', {
      sql: `
        GRANT ALL ON favourites TO authenticated;
        GRANT ALL ON favourites TO service_role;
      `
    });

    if (grantError) {
      console.error('❌ Error granting permissions:', grantError);
    } else {
      console.log('✅ Permissions granted');
    }

    console.log('🎉 Favourites table setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupFavouritesTable();