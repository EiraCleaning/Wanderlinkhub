import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Get a few listings to check their data structure
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, title, photos, social_links')
      .limit(3);
    
    if (error) {
      console.error('Error fetching listings:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      listings: listings,
      count: listings?.length || 0
    });
    
  } catch (error: any) {
    console.error('Error in debug-listings:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
