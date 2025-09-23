import { NextRequest, NextResponse } from 'next/server';
import { getReviewsForListing } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');
    
    if (!listingId) {
      return NextResponse.json(
        { success: false, message: 'Listing ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Debug: Fetching reviews for listing:', listingId);
    const reviews = await getReviewsForListing(listingId);
    console.log('Debug: Found reviews:', reviews.length);
    console.log('Debug: First review structure:', reviews[0]);
    
    // Let's also test the profile query directly
    const { createAdminClient } = await import('@/lib/supabaseClient');
    const supabase = createAdminClient();
    
    if (reviews[0]) {
      const authorId = reviews[0].author_id;
      console.log('Debug: Testing profile query for author_id:', authorId);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, full_name, profile_picture, is_supporter')
        .eq('id', authorId)
        .single();
      
      console.log('Debug: Profile query result:', profile);
      console.log('Debug: Profile query error:', profileError);
    }
    
    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
      debug: {
        firstReview: reviews[0],
        hasProfiles: reviews[0]?.profiles ? 'YES' : 'NO',
        profileData: reviews[0]?.profiles
      }
    });
  } catch (error) {
    console.error('Debug: Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews', error: error.message },
      { status: 500 }
    );
  }
}
