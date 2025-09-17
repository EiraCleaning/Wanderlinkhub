import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

// MailerLite API configuration
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔄 User signup webhook received:', body);

    // Handle both database webhook format and our custom format
    const record = body.record || body;
    const { id, email, user_metadata, full_name, display_name, profile_picture_url, created_at } = record;
    
    if (!id) {
      console.warn('⚠️ Invalid payload - no user ID provided');
      return NextResponse.json({ ok: true, ignored: true }, { status: 202 });
    }

    console.log('🔄 Processing profile creation webhook for:', id);

    // Create profile in your custom tables (idempotent)
    const supabase = createAdminClient();
    
    // Insert into profiles table with all required fields (idempotent)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id,
        full_name: full_name || user_metadata?.full_name || null,
        kids_ages: [],
        display_name: display_name || user_metadata?.full_name || null,
        bio: null,
        interests: [],
        profile_picture_url: profile_picture_url || null,
        is_supporter: false,
        stripe_customer_id: null,
        created_at: created_at || new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('❌ Error upserting profile:', profileError);
      // Don't fail the webhook - just log the error
    } else {
      console.log('✅ Profile upserted successfully for user:', id);
    }

    // Insert into user_profiles table (idempotent)
    const { error: userProfileError } = await supabase
      .from('user_profiles')
      .upsert({
        id,
        email: email || '',
        display_name: display_name || user_metadata?.full_name || null,
        notifications: true,
        created_at: created_at || new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (userProfileError) {
      console.error('❌ Error upserting user profile:', userProfileError);
      // Don't fail the webhook - just log the error
    } else {
      console.log('✅ User profile upserted successfully for user:', id);
    }

    // Send to MailerLite for welcome email automation (best effort, non-blocking)
    if (MAILERLITE_API_KEY && email) {
      try {
        const mailerliteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MAILERLITE_API_KEY}`
          },
          body: JSON.stringify({
            email: email,
            groups: [MAILERLITE_GROUP_ID],
            status: 'active',
            fields: {
              name: display_name || user_metadata?.full_name || '',
              signup_source: 'google_oauth',
              signup_date: new Date().toISOString()
            }
          })
        });

        if (!mailerliteResponse.ok) {
          console.error('MailerLite API error:', await mailerliteResponse.text());
        } else {
          console.log('✅ Welcome email queued for:', email);
        }
      } catch (error) {
        console.error('Error sending to MailerLite:', error);
        // Don't fail the webhook - just log the error
      }
    }

    // Always return success to prevent webhook retries
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    console.error('❌ User signup webhook error:', error);
    // Return 202 to prevent webhook retries even on errors
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
