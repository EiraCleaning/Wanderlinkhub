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
    // First, let's check the current structure
    console.log('📝 Checking current profiles table structure...');
    const { data: profiles, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking profiles table:', checkError);
      return;
    }

    console.log('✅ Current profiles structure:', profiles?.[0] ? Object.keys(profiles[0]) : 'No profiles found');

    // Try to update a profile with the new fields to see if they exist
    console.log('📝 Testing if new fields exist...');
    const { data: testProfile, error: testError } = await supabase
      .from('profiles')
      .select('id, display_name, bio, interests')
      .limit(1);

    if (testError) {
      console.log('❌ New fields do not exist yet:', testError.message);
      console.log('📝 You may need to add these columns manually in the Supabase dashboard:');
      console.log('   - display_name (TEXT)');
      console.log('   - bio (TEXT)');
      console.log('   - interests (TEXT[])');
      return;
    }

    console.log('✅ New fields already exist:', testProfile?.[0]);

    // If fields exist, update existing profiles with defaults
    console.log('📝 Updating existing profiles with defaults...');
    const { data: allProfiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, display_name, bio, interests');

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError);
      return;
    }

    console.log(`📊 Found ${allProfiles?.length || 0} profiles to update`);

    for (const profile of allProfiles || []) {
      const updates: any = {};
      
      if (!profile.display_name) {
        updates.display_name = profile.email?.split('@')[0] || 'User';
      }
      
      if (profile.bio === null) {
        updates.bio = '';
      }
      
      if (!profile.interests || profile.interests.length === 0) {
        updates.interests = [];
      }

      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', profile.id);

        if (updateError) {
          console.error(`❌ Error updating profile ${profile.id}:`, updateError);
        } else {
          console.log(`✅ Updated profile ${profile.id}`);
        }
      }
    }

    console.log('🎉 Profile schema update complete!');

  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateProfileSchema();
