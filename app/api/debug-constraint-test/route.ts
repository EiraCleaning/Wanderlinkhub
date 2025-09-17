import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Try with a very simple email/password combination
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    console.log('🔄 Testing constraint with:', testEmail);
    
    // Try with minimal options to see if it's a constraint issue
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        // Try with absolutely minimal options
        data: {}
      }
    });
    
    if (signupError) {
      console.error('❌ Constraint test error:', signupError);
      return NextResponse.json({
        success: false,
        message: 'Constraint test failed',
        error: signupError.message,
        code: signupError.status,
        details: signupError,
        // This will help us see exactly what constraint is failing
        fullError: JSON.stringify(signupError, null, 2)
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Constraint test passed',
      data: {
        user: signupData.user ? {
          id: signupData.user.id,
          email: signupData.user.email,
          created_at: signupData.user.created_at
        } : null
      }
    });
    
  } catch (error) {
    console.error('❌ Constraint test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Constraint test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
