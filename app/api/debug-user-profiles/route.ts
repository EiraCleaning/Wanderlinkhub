import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Check if user_profiles table exists and is accessible
    const { data: userProfiles, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (userProfilesError) {
      return NextResponse.json({
        success: false,
        message: 'Error querying user_profiles table',
        error: userProfilesError.message,
        code: userProfilesError.code,
        details: userProfilesError.details,
        hint: userProfilesError.hint
      });
    }
    
    return NextResponse.json({
      success: true,
      userProfilesTable: {
        accessible: true,
        sampleData: userProfiles[0] || null,
        columns: userProfiles.length > 0 ? Object.keys(userProfiles[0]) : []
      },
      message: 'user_profiles table check completed'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'user_profiles table check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
