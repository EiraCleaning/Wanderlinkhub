import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-08-27.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature header found');
    return NextResponse.json({ error: 'No signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('✅ Webhook signature verified for event:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;

        console.log('🛒 Checkout session completed:', {
          sessionId: session.id,
          userId: userId,
          customerId: customerId,
          paymentStatus: session.payment_status
        });

        if (userId) {
          // First check if user exists in auth
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
          
          if (authError || !authUser.user) {
            console.error('❌ User does not exist in auth:', authError?.message);
            console.log('⚠️ Skipping profile update - user not found in auth system');
            break;
          }

          console.log('✅ User exists in auth:', authUser.user.email);

          // Check if user profile exists
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('❌ Error checking existing profile:', fetchError);
          }

          // If profile doesn't exist, create a basic one first
          if (!existingProfile) {
            console.log('📝 Creating new profile for user:', userId);
            const { error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                full_name: null,
                kids_ages: [],
                display_name: null,
                bio: null,
                interests: [],
                profile_picture_url: null,
                is_supporter: false, // Will be updated below
                stripe_customer_id: null,
              });

            if (createError) {
              console.error('❌ Failed to create user profile:', createError);
            } else {
              console.log('✅ Created new profile for user:', userId);
            }
          }

          // Now update the profile to mark as supporter
          const { data, error } = await supabase
            .from('profiles')
            .update({
              is_supporter: true,
              stripe_customer_id: customerId,
            })
            .eq('id', userId)
            .select();

          if (error) {
            console.error('❌ Failed to update user profile:', error);
          } else {
            console.log(`✅ User ${userId} became a Founding Supporter with customer ID ${customerId}`);
          }
        } else {
          console.error('❌ No userId found in checkout session metadata');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const isActive = subscription.status === 'active';
          const isCanceled = subscription.cancel_at_period_end;
          
          // Update supporter status based on subscription status
          await supabase
            .from('profiles')
            .update({ is_supporter: isActive && !isCanceled })
            .eq('id', profile.id);

          console.log(`Subscription updated for user ${profile.id}, active: ${isActive}, canceled: ${isCanceled}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by customer ID and remove supporter status
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ is_supporter: false })
            .eq('id', profile.id);

          console.log(`Subscription canceled for user ${profile.id}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        console.log(`Payment failed for customer ${customerId}`);
        // You might want to notify the user or handle failed payments
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
