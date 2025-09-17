import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function addProfilePictureField() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'supabase-profile-picture-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Adding profile_picture_url field to profiles table...');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error adding profile_picture_url field:', error);
      return;
    }

    console.log('✅ Successfully added profile_picture_url field to profiles table');
    console.log('You can now upload profile pictures!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addProfilePictureField();
