import { NextRequest, NextResponse } from 'next/server';
import { ReviewSchema } from '@/lib/validation';
import { createReview, getReviewsForListing } from '@/lib/db';
import { createClient } from '@/lib/supabaseClient';

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
    
    const reviews = await getReviewsForListing(listingId);
    
    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const supabase = createClient();
    
    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    let validatedData;
    try {
      validatedData = ReviewSchema.parse(body);
    } catch (validationError: any) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          details: validationError.errors 
        },
        { status: 400 }
      );
    }
    
    // Get user profile for author name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, full_name')
      .eq('id', user.id)
      .single();
    
    const authorName = profile?.display_name || profile?.full_name || 'Anonymous User';
    
    const review = await createReview({
      ...validatedData,
      author_id: user.id,
      author_name: authorName
    }, user.id);
    
    return NextResponse.json({
      success: true,
      review,
      message: 'Review submitted successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create review' },
      { status: 400 }
    );
  }
} 