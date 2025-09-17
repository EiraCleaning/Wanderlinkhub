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
    
    console.log('🔄 Testing signup flow for:', email);
    
    // Step 1: Try to sign up the user
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlinkhub.com'}/profile`
      }
    });
    
    if (signupError) {
      console.error('❌ Signup error:', signupError);
      return NextResponse.json({
        success: false,
        message: 'Signup failed',
        error: signupError.message
      });
    }
    
    console.log('✅ User signed up successfully:', signupData.user?.id);
    
    // Step 2: Try to create profile
    if (signupData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: signupData.user.id,
          full_name: signupData.user.user_metadata?.full_name || null,
          kids_ages: [],
          display_name: signupData.user.user_metadata?.full_name || email.split('@')[0],
          bio: null,
          interests: [],
          profile_picture_url: null,
          is_supporter: false,
          stripe_customer_id: null,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ Profile creation error:', profileError);
        return NextResponse.json({
          success: false,
          message: 'Profile creation failed',
          error: profileError.message,
          code: profileError.code,
          details: profileError.details
        });
      }
      
      console.log('✅ Profile created successfully');
      return NextResponse.json({
        success: true,
        message: 'Signup and profile creation successful',
        userId: signupData.user.id,
        profile: profileData
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'No user data returned from signup'
    });
    
  } catch (error) {
    console.error('❌ Test signup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Test signup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
