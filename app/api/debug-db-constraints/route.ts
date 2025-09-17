import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Check if we can query the profiles table structure
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      return NextResponse.json({
        success: false,
        message: 'Error querying profiles table',
        error: profilesError.message,
        code: profilesError.code,
        details: profilesError.details
      });
    }
    
    // Check if we can query the auth.users table (this might fail due to RLS)
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id')
      .limit(1);
    
    return NextResponse.json({
      success: true,
      profilesTable: {
        accessible: true,
        sampleData: profiles[0] || null,
        columns: profiles.length > 0 ? Object.keys(profiles[0]) : []
      },
      authUsersTable: {
        accessible: !authError,
        error: authError?.message || null
      },
      message: 'Database constraints check completed'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
