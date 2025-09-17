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
    
    // Create user directly with admin API (bypasses email confirmation)
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Force confirm email
      user_metadata: {
        full_name: email.split('@')[0]
      }
    });
    
    if (userError) {
      console.error('❌ Admin user creation error:', userError);
      return NextResponse.json({
        success: false,
        message: 'Failed to create user',
        error: userError.message
      });
    }
    
    // Create profile for the user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userData.user.id,
        full_name: email.split('@')[0],
        kids_ages: [],
        display_name: email.split('@')[0],
        bio: null,
        interests: [],
        profile_picture_url: null,
        is_supporter: false,
        stripe_customer_id: null,
        created_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('❌ Profile creation error:', profileError);
      // Don't fail the signup, just log the error
    }
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: userData.user.id,
        email: userData.user.email
      }
    });
    
  } catch (error) {
    console.error('❌ Admin signup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Signup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
