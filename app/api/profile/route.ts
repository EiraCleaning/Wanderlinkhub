import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";
export const revalidate = 0;

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    noStore();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createAdminClient();
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { display_name, bio, interests, profile_picture_url } = body;

    // Validate required fields
    if (!display_name || display_name.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Display name is required' },
        { status: 400 }
      );
    }

    // Ensure interests is an array
    const interestsArray = Array.isArray(interests) ? interests : (interests || []);

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: display_name.trim(),
        bio: bio?.trim() || '',
        interests: interestsArray,
        profile_picture_url: profile_picture_url?.trim() || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: data
    }, {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0"
      }
    });

  } catch (error) {
    console.error('Error in profile update:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    noStore();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createAdminClient();
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get profile
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, bio, interests, profile_picture_url, is_supporter, subscription_status, subscription_canceled_at, subscription_current_period_end')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // If profile doesn't exist, create it
    if (!data) {
      console.log('📝 Creating missing profile for user:', user.id);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          kids_ages: [],
          display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          bio: null,
          interests: [],
          profile_picture_url: null,
          is_supporter: false,
          stripe_customer_id: null,
          created_at: new Date().toISOString()
        })
        .select('display_name, bio, interests, profile_picture_url, is_supporter, subscription_status, subscription_canceled_at, subscription_current_period_end')
        .single();

      if (createError) {
        console.error('❌ Error creating profile:', createError);
        return NextResponse.json(
          { success: false, message: 'Failed to create profile', details: createError.message },
          { status: 500 }
        );
      }

      console.log('✅ Profile created successfully for user:', user.id);
      return NextResponse.json({
        success: true,
        profile: newProfile
      }, {
        headers: {
          "cache-control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    }

    return NextResponse.json({
      success: true,
      profile: data
    }, {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0"
      }
    });

  } catch (error) {
    console.error('Error in profile fetch:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
