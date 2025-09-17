import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const supabase = createAdminClient();
    
    console.log('🔄 Testing auth signup only for:', email);
    
    // Try just the auth signup without any additional options
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (signupError) {
      console.error('❌ Auth signup error:', signupError);
      return NextResponse.json({
        success: false,
        message: 'Auth signup failed',
        error: signupError.message,
        code: signupError.status,
        details: signupError
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Auth signup successful',
      data: {
        user: signupData.user ? {
          id: signupData.user.id,
          email: signupData.user.email,
          created_at: signupData.user.created_at
        } : null,
        session: signupData.session ? 'Session created' : 'No session'
      }
    });
    
  } catch (error) {
    console.error('❌ Auth test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Auth test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
