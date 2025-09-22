import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

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
    
    const supabase = createAdminClient();
    
    // Get listing verification status
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, title, verify')
      .eq('id', listingId)
      .single();
    
    if (listingError) {
      return NextResponse.json({
        success: false,
        error: listingError.message,
        message: 'Failed to fetch listing'
      });
    }
    
    // Get reviews count (bypassing RLS with admin client)
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, rating, comment, created_at')
      .eq('listing_id', listingId);
    
    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        title: listing.title,
        verify: listing.verify
      },
      reviews: reviews || [],
      reviewsCount: reviews?.length || 0,
      reviewsError: reviewsError?.message || null
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      message: 'Unexpected error'
    }, { status: 500 });
  }
}
