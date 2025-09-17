import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(request: NextRequest) {
  console.log('=== WEBHOOK TEST ENDPOINT ===');
  
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    console.log('Body length:', body.length);
    console.log('Signature present:', !!signature);
    console.log('Webhook secret configured:', webhookSecret !== 'whsec_placeholder');
    
    if (!signature) {
      console.log('ERROR: No signature header');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }
    
    if (webhookSecret === 'whsec_placeholder') {
      console.log('ERROR: Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified successfully');
      console.log('Event type:', event.type);
      console.log('Event ID:', event.id);
    } catch (err) {
      console.log('❌ Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    
    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true, eventType: event.type });
    
  } catch (error) {
    console.log('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
