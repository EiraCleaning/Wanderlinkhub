import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('=== WEBHOOK TEST RECEIVED ===');
    console.log('Headers:', headers);
    console.log('Body:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Webhook test received',
      timestamp: new Date().toISOString(),
      headers: headers,
      bodyLength: body.length
    });
    
  } catch (error) {
    console.error('Webhook test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
