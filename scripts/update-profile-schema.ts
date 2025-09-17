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

async function updateProfileSchema() {
  console.log('🔧 Updating profiles table schema...');

  try {
    // Add new columns
    console.log('📝 Adding new columns to profiles table...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles 
        ADD COLUMN IF NOT EXISTS display_name TEXT,
        ADD COLUMN IF NOT EXISTS bio TEXT,
        ADD COLUMN IF NOT EXISTS interests TEXT[];
      `
    });

    if (alterError) {
      console.error('❌ Error adding columns:', alterError);
      return;
    }

    console.log('✅ Columns added successfully');

    // Create index
    console.log('📝 Creating index...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);'
    });

    if (indexError) {
      console.error('❌ Error creating index:', indexError);
    } else {
      console.log('✅ Index created');
    }

    // Update existing profiles with defaults
    console.log('📝 Updating existing profiles with defaults...');
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE profiles 
        SET 
          display_name = COALESCE(display_name, split_part(email, '@', 1)),
          bio = COALESCE(bio, ''),
          interests = COALESCE(interests, ARRAY[]::TEXT[])
        WHERE display_name IS NULL OR bio IS NULL OR interests IS NULL;
      `
    });

    if (updateError) {
      console.error('❌ Error updating profiles:', updateError);
    } else {
      console.log('✅ Profiles updated with defaults');
    }

    // Verify the changes
    console.log('📝 Verifying changes...');
    const { data: profiles, error: verifyError } = await supabase
      .from('profiles')
      .select('id, display_name, bio, interests')
      .limit(3);

    if (verifyError) {
      console.error('❌ Error verifying changes:', verifyError);
    } else {
      console.log('✅ Sample profiles after update:', profiles);
    }

    console.log('🎉 Profile schema update complete!');

  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateProfileSchema();
