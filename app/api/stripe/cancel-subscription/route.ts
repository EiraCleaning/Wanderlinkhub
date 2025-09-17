import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      console.error('Stripe secret key not configured');
      return NextResponse.json(
        { success: false, message: 'Stripe is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createAdminClient();
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user's profile to check if they're a supporter
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_supporter, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.is_supporter) {
      return NextResponse.json(
        { success: false, message: 'You are not currently a supporter.' },
        { status: 400 }
      );
    }

    if (!profile.stripe_customer_id) {
      return NextResponse.json(
        { success: false, message: 'No subscription found. Please contact support.' },
        { status: 400 }
      );
    }

    // Get the customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No active subscription found.' },
        { status: 400 }
      );
    }

    const subscription = subscriptions.data[0];

    // Cancel the subscription at the end of the current period
    const canceledSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    console.log('Subscription canceled at period end:', canceledSubscription.id);

    return NextResponse.json({
      success: true,
      message: 'Your subscription will be canceled at the end of the current billing period.',
      cancelAt: canceledSubscription.cancel_at,
      currentPeriodEnd: canceledSubscription.current_period_end,
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel subscription. Please contact support.' },
      { status: 500 }
    );
  }
}
