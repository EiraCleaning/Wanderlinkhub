import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
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

    if (!process.env.STRIPE_PRICE_ID || process.env.STRIPE_PRICE_ID === 'price_your_founding_supporter_price_id_here') {
      console.error('Stripe price ID not configured:', process.env.STRIPE_PRICE_ID);
      return NextResponse.json(
        { success: false, message: 'Stripe price ID not configured. Please contact support.' },
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

    // Check if user is already a supporter
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_supporter')
      .eq('id', user.id)
      .single();

    if (profile?.is_supporter) {
      return NextResponse.json(
        { success: false, message: 'You are already a Founding Supporter!' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    console.log('Creating checkout session with price ID:', process.env.STRIPE_PRICE_ID);
    
    // Always use the correct domain for redirects
    const siteUrl = 'https://wanderlinkhub.com';
    console.log('Using site URL:', siteUrl);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/profile?success=subscription_created`,
      cancel_url: `${siteUrl}/profile?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    console.log('Checkout session created successfully:', session.id);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
