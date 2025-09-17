import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { userId, customerId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const supabase = createAdminClient();
    
    // First check if user profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    console.log('Existing profile check:', { existingProfile, fetchError });

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({
        success: false,
        message: 'Error checking existing profile',
        error: fetchError.message
      });
    }

    // If profile doesn't exist, create a basic one first
    if (!existingProfile) {
      console.log('Creating new profile for user:', userId);
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: null,
          kids_ages: [],
          display_name: null,
          bio: null,
          interests: [],
          profile_picture_url: null,
          is_supporter: false,
          stripe_customer_id: null,
        });

      if (createError) {
        return NextResponse.json({
          success: false,
          message: 'Failed to create user profile',
          error: createError.message
        });
      }
      
      console.log('✅ Created new profile for user:', userId);
    }

    // Now update the profile to mark as supporter
    const { data, error } = await supabase
      .from('profiles')
      .update({
        is_supporter: true,
        stripe_customer_id: customerId || `test_customer_${Date.now()}`,
      })
      .eq('id', userId)
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update user profile',
        error: error.message
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User profile processed successfully',
      data: data
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Script error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
