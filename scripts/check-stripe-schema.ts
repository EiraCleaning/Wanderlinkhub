import { createAdminClient } from '../lib/supabaseClient';

async function checkStripeSchema() {
  const supabase = createAdminClient();
  
  try {
    // Check if stripe_customer_id column exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id, is_supporter, stripe_customer_id')
      .limit(1);
    
    if (error) {
      console.error('Error checking schema:', error);
      return;
    }
    
    console.log('Schema check result:', data);
    console.log('Column exists:', data[0]?.hasOwnProperty('stripe_customer_id'));
    
    // Check if any users are supporters
    const { data: supporters, error: supporterError } = await supabase
      .from('profiles')
      .select('id, is_supporter, stripe_customer_id')
      .eq('is_supporter', true);
    
    if (supporterError) {
      console.error('Error checking supporters:', supporterError);
      return;
    }
    
    console.log('Supporters found:', supporters);
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

checkStripeSchema();
