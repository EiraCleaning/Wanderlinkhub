import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, display_name, full_name, profile_picture, is_supporter')
      .limit(10);
    
    console.log('Debug: All profiles:', profiles);
    console.log('Debug: Profile error:', error);
    
    return NextResponse.json({
      success: true,
      profiles,
      count: profiles?.length || 0,
      error
    });
  } catch (error) {
    console.error('Debug: Error fetching profiles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profiles', error: error.message },
      { status: 500 }
    );
  }
}
