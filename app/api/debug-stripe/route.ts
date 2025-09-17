import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const config = {
      hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasPriceId: !!process.env.STRIPE_PRICE_ID,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      priceId: process.env.STRIPE_PRICE_ID,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10),
      publishableKeyPrefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10),
    };

    return NextResponse.json({
      success: true,
      config,
      message: 'Stripe configuration check'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
