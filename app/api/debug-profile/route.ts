import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Get the specific user's profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'cf43a654-9350-41e3-8f1a-a8503bbf60b7') // Your user ID
      .single();
    
    console.log('Debug: Profile data:', profile);
    console.log('Debug: Profile error:', error);
    
    return NextResponse.json({
      success: true,
      profile,
      error
    });
  } catch (error) {
    console.error('Debug: Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile', error: error.message },
      { status: 500 }
    );
  }
}
