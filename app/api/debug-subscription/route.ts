import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Check if stripe_customer_id column exists by trying to select it
    const { data: schemaTest, error: schemaError } = await supabase
      .from('profiles')
      .select('id, is_supporter, stripe_customer_id')
      .limit(1);
    
    if (schemaError) {
      return NextResponse.json({
        success: false,
        error: 'Schema error',
        details: schemaError.message,
        hasStripeCustomerIdColumn: false
      });
    }
    
    // Check supporters
    const { data: supporters, error: supporterError } = await supabase
      .from('profiles')
      .select('id, is_supporter, stripe_customer_id')
      .eq('is_supporter', true);
    
    return NextResponse.json({
      success: true,
      hasStripeCustomerIdColumn: true,
      schemaTest: schemaTest,
      supporters: supporters,
      supporterError: supporterError?.message
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Script error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
