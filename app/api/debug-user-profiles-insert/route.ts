import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Try to insert a test record to see what error we get
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: 'test-user-123',
        email: 'test@example.com',
        display_name: 'Test User',
        notifications: true,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Insert failed',
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Insert successful',
      data: data
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Insert test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
