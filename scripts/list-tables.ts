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

async function listTables() {
  console.log('🔍 Listing all tables in your database...');

  try {
    // Get all tables from information_schema
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      console.error('❌ Error listing tables:', error);
      return;
    }

    console.log('📊 Tables in your database:');
    console.log('================================');
    
    if (tables && tables.length > 0) {
      tables.forEach(table => {
        console.log(`✅ ${table.table_name} (${table.table_schema})`);
      });
    } else {
      console.log('❌ No tables found in public schema');
    }

    // Also check if profiles table exists and show its structure
    console.log('\n🔍 Checking profiles table structure...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
    } else if (profiles && profiles.length > 0) {
      console.log('✅ Profiles table exists with columns:', Object.keys(profiles[0]));
    } else {
      console.log('✅ Profiles table exists but is empty');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listTables();
