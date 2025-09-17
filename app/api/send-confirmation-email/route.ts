import { NextRequest, NextResponse } from 'next/server';

// MailerLite API configuration
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationUrl, userName } = await request.json();
    
    if (!email || !confirmationUrl) {
      return NextResponse.json({
        success: false,
        message: 'Email and confirmation URL are required'
      });
    }
    
    if (!MAILERLITE_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'MailerLite API key not configured'
      });
    }
    
    // Send confirmation email via MailerLite API
    const mailerliteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email: email,
        groups: [MAILERLITE_GROUP_ID],
        status: 'unconfirmed', // Set as unconfirmed until they click the link
        fields: {
          name: userName || '',
          confirmation_url: confirmationUrl,
          signup_source: 'email_signup',
          signup_date: new Date().toISOString()
        }
      })
    });
    
    if (!mailerliteResponse.ok) {
      const errorText = await mailerliteResponse.text();
      console.error('MailerLite API error:', errorText);
      return NextResponse.json({
        success: false,
        message: 'Failed to send confirmation email',
        error: errorText
      });
    }
    
    const result = await mailerliteResponse.json();
    console.log('✅ Confirmation email sent via MailerLite:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send confirmation email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
