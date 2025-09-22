import { createAdminClient } from '../lib/supabaseClient';

async function fixReviewsRLS() {
  console.log('🔧 Fixing reviews RLS policy...');
  
  const supabase = createAdminClient();
  
  try {
    // Drop the existing policy
    console.log('📝 Dropping existing policy...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP POLICY IF EXISTS "Read reviews for verified and pending listings" ON reviews;'
    });
    
    if (dropError) {
      console.error('❌ Error dropping policy:', dropError);
    } else {
      console.log('✅ Existing policy dropped');
    }
    
    // Create a new policy that allows reading reviews for verified listings
    console.log('📝 Creating new policy for verified listings...');
    const { error: verifiedError } = await supabase.rpc('exec_sql', {
      sql: `CREATE POLICY "Read reviews for verified listings"
            ON reviews FOR SELECT
            USING (
              EXISTS (
                SELECT 1 FROM listings l 
                WHERE l.id = listing_id 
                AND l.verify = 'verified'
              )
            );`
    });
    
    if (verifiedError) {
      console.error('❌ Error creating verified policy:', verifiedError);
    } else {
      console.log('✅ Verified listings policy created');
    }
    
    // Also create a policy for pending listings
    console.log('📝 Creating new policy for pending listings...');
    const { error: pendingError } = await supabase.rpc('exec_sql', {
      sql: `CREATE POLICY "Read reviews for pending listings"
            ON reviews FOR SELECT
            USING (
              EXISTS (
                SELECT 1 FROM listings l 
                WHERE l.id = listing_id 
                AND l.verify = 'pending'
              )
            );`
    });
    
    if (pendingError) {
      console.error('❌ Error creating pending policy:', pendingError);
    } else {
      console.log('✅ Pending listings policy created');
    }
    
    console.log('🎉 RLS policy fix complete!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixReviewsRLS();
