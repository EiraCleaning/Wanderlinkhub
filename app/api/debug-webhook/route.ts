import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Check recent webhook events by looking at recent profile updates
    const { data: recentProfiles, error } = await supabase
      .from('profiles')
      .select('id, is_supporter, stripe_customer_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: error.message
      });
    }
    
    // Check environment variables
    const hasStripeKey = !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder';
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET !== 'whsec_placeholder';
    
    return NextResponse.json({
      success: true,
      environment: {
        hasStripeKey,
        hasWebhookSecret,
        stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'missing',
        webhookSecretPrefix: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 10) || 'missing'
      },
      recentProfiles: recentProfiles,
      webhookUrl: 'https://wanderlinkhub.com/api/stripe/webhook'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Script error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
