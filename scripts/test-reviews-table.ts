import { createAdminClient } from '../lib/supabaseClient';

async function testReviewsTable() {
  console.log('Testing reviews table...');
  
  const supabase = createAdminClient();
  
  try {
    // Try to select from reviews table
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Reviews table error:', error);
      if (error.code === 'PGRST116') {
        console.log('📝 Reviews table does not exist. Need to create it.');
      }
    } else {
      console.log('✅ Reviews table exists and is accessible');
      console.log('📊 Sample data:', data);
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testReviewsTable();
