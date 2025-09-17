import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Try with a very simple email/password combination
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    console.log('🔄 Testing minimal signup with:', testEmail);
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        // Try without any additional options
        data: {
          // Minimal user metadata
        }
      }
    });
    
    if (signupError) {
      console.error('❌ Minimal signup error:', signupError);
      return NextResponse.json({
        success: false,
        message: 'Minimal signup failed',
        error: signupError.message,
        code: signupError.status,
        details: signupError
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Minimal signup successful',
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
    console.error('❌ Minimal signup test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Minimal signup test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
