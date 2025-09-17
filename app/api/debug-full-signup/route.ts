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
    const results = [];
    
    console.log('🔄 Starting full signup debug for:', email);
    
    // Step 1: Try to sign up the user
    results.push('Step 1: Attempting user signup...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wanderlinkhub.com'}/profile`
      }
    });
    
    if (signupError) {
      results.push(`❌ Signup error: ${signupError.message}`);
      return NextResponse.json({
        success: false,
        message: 'Signup failed',
        error: signupError.message,
        results: results
      });
    }
    
    results.push(`✅ User signed up successfully: ${signupData.user?.id}`);
    
    if (!signupData.user) {
      results.push('❌ No user data returned from signup');
      return NextResponse.json({
        success: false,
        message: 'No user data returned',
        results: results
      });
    }
    
    // Step 2: Wait a moment for the user to be fully created
    results.push('Step 2: Waiting for user to be fully created...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Verify user exists in auth
    results.push('Step 3: Verifying user exists in auth...');
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(signupData.user.id);
    
    if (authError || !authUser.user) {
      results.push(`❌ User not found in auth: ${authError?.message}`);
      return NextResponse.json({
        success: false,
        message: 'User not found in auth system',
        error: authError?.message,
        results: results
      });
    }
    
    results.push(`✅ User exists in auth: ${authUser.user.email}`);
    
    // Step 4: Try to create profile
    results.push('Step 4: Attempting to create profile...');
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
      results.push(`❌ Profile creation error: ${profileError.message}`);
      results.push(`   Code: ${profileError.code}`);
      results.push(`   Details: ${profileError.details}`);
      results.push(`   Hint: ${profileError.hint}`);
      
      return NextResponse.json({
        success: false,
        message: 'Profile creation failed',
        error: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
        results: results
      });
    }
    
    results.push('✅ Profile created successfully');
    
    // Step 5: Try to create user_profiles entry
    results.push('Step 5: Attempting to create user_profiles entry...');
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('user_profiles')
      .insert({
        id: signupData.user.id,
        email: email,
        display_name: signupData.user.user_metadata?.full_name || null,
        notifications: true,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (userProfileError) {
      results.push(`❌ User profile creation error: ${userProfileError.message}`);
      results.push(`   Code: ${userProfileError.code}`);
      results.push(`   Details: ${userProfileError.details}`);
    } else {
      results.push('✅ User profile created successfully');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Full signup process completed',
      userId: signupData.user.id,
      profile: profileData,
      userProfile: userProfileData,
      results: results
    });
    
  } catch (error) {
    console.error('❌ Full signup debug error:', error);
    return NextResponse.json({
      success: false,
      message: 'Full signup debug failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
