import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const supabase = createAdminClient();
    
    console.log('Testing profile creation for user:', userId);
    
    // Test profile creation with all fields
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: fullName || null,
        kids_ages: [],
        display_name: fullName || null,
        bio: null,
        interests: [],
        profile_picture_url: null,
        is_supporter: false,
        stripe_customer_id: null,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.error('Profile creation error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to create profile',
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      data: data
    });
    
  } catch (error) {
    console.error('Debug signup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Script error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
