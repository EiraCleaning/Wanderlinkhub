import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/check-supporter - Check if user is a supporter
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
    
    // Create admin client and verify the token
    const supabase = createAdminClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user is a supporter
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_supporter')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error checking supporter status:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to check supporter status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isSupporter: profile?.is_supporter || false
    }, {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0"
      }
    });

  } catch (error) {
    console.error('Error in check-supporter:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
