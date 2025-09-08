import { NextRequest, NextResponse } from 'next/server';
import { ReviewSchema } from '@/lib/validation';
import { createReview, getReviewsForListing } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

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
    // For testing purposes, bypass authentication
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
    
    // Use a mock user ID for testing
    const mockUserId = 'test-user-123';
    
    const review = await createReview({
      ...validatedData,
      author_id: mockUserId,
      author_name: validatedData.author_name || 'Anonymous User'
    }, mockUserId);
    
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