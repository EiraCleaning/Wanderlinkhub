import { createClient } from '@supabase/supabase-js';

async function setupProfilePicturesBucket() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log('Setting up profile-pictures storage bucket...');
    
    // Create the bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('profile-pictures', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('✅ Bucket "profile-pictures" already exists');
      } else {
        console.error('Error creating bucket:', bucketError);
        return;
      }
    } else {
      console.log('✅ Successfully created profile-pictures bucket');
    }

    // Set up RLS policies for the bucket
    console.log('Setting up RLS policies...');
    
    // Policy to allow authenticated users to upload their own profile pictures
    const { error: uploadPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can upload their own profile pictures" ON storage.objects
        FOR INSERT WITH CHECK (
          bucket_id = 'profile-pictures' AND
          auth.uid()::text = (storage.foldername(name))[1]
        );
      `
    });

    if (uploadPolicyError && !uploadPolicyError.message.includes('already exists')) {
      console.error('Error creating upload policy:', uploadPolicyError);
    } else {
      console.log('✅ Upload policy created');
    }

    // Policy to allow public read access to profile pictures
    const { error: readPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Profile pictures are publicly readable" ON storage.objects
        FOR SELECT USING (bucket_id = 'profile-pictures');
      `
    });

    if (readPolicyError && !readPolicyError.message.includes('already exists')) {
      console.error('Error creating read policy:', readPolicyError);
    } else {
      console.log('✅ Read policy created');
    }

    // Policy to allow users to update their own profile pictures
    const { error: updatePolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can update their own profile pictures" ON storage.objects
        FOR UPDATE USING (
          bucket_id = 'profile-pictures' AND
          auth.uid()::text = (storage.foldername(name))[1]
        );
      `
    });

    if (updatePolicyError && !updatePolicyError.message.includes('already exists')) {
      console.error('Error creating update policy:', updatePolicyError);
    } else {
      console.log('✅ Update policy created');
    }

    // Policy to allow users to delete their own profile pictures
    const { error: deletePolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Users can delete their own profile pictures" ON storage.objects
        FOR DELETE USING (
          bucket_id = 'profile-pictures' AND
          auth.uid()::text = (storage.foldername(name))[1]
        );
      `
    });

    if (deletePolicyError && !deletePolicyError.message.includes('already exists')) {
      console.error('Error creating delete policy:', deletePolicyError);
    } else {
      console.log('✅ Delete policy created');
    }

    console.log('🎉 Profile pictures storage setup complete!');
    console.log('You can now upload profile pictures in the app.');

  } catch (error) {
    console.error('Error setting up profile pictures bucket:', error);
  }
}

setupProfilePicturesBucket();
