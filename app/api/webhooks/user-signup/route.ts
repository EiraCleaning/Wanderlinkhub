import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

// MailerLite API configuration
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID; // Your welcome email group

export async function POST(request: NextRequest) {
  try {
    const { type, record, old_record } = await request.json();

    // Only process new user signups
    if (type !== 'INSERT' || !record) {
      return NextResponse.json({ message: 'Not a new user signup' });
    }

    const { id, email, user_metadata } = record;

    // Create profile in your custom tables
    const supabase = createAdminClient();
    
    // Insert into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id,
        full_name: user_metadata?.full_name || null,
        created_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }

    // Insert into user_profiles table
    const { error: userProfileError } = await supabase
      .from('user_profiles')
      .insert({
        id,
        email: email || '',
        display_name: user_metadata?.full_name || null,
        notifications: true,
        created_at: new Date().toISOString()
      });

    if (userProfileError) {
      console.error('Error creating user profile:', userProfileError);
    }

    // Send to MailerLite for welcome email automation
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
              name: user_metadata?.full_name || '',
              signup_source: 'google_oauth',
              signup_date: new Date().toISOString()
            }
          })
        });

        if (!mailerliteResponse.ok) {
          console.error('MailerLite API error:', await mailerliteResponse.text());
        }
      } catch (error) {
        console.error('Error sending to MailerLite:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User profile created and sent to MailerLite' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
