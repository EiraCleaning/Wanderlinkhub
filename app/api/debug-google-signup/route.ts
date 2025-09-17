import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Test if we can get the auth configuration
    const { data: authConfig, error: authError } = await supabase.auth.getSession();
    
    return NextResponse.json({
      success: true,
      message: 'Auth configuration check',
      hasSession: !!authConfig.session,
      error: authError?.message || null,
      // This will help us see if there are any auth configuration issues
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Auth configuration check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
