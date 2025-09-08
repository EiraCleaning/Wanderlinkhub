import { NextRequest, NextResponse } from 'next/server';
import { CreateListingSchema, ListingsQuerySchema } from '@/lib/validation';
import { getListings, createListing } from '@/lib/db';
import { createAdminClient } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const query = {
      ltype: searchParams.get('ltype') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      verified: searchParams.get('verified') === 'true' ? true : 
                searchParams.get('verified') === 'false' ? false : undefined, // Default to undefined (all)
      near: searchParams.get('near') ? searchParams.get('near')!.split(',').map(Number) : undefined,
      radiusKm: searchParams.get('radiusKm') ? parseFloat(searchParams.get('radiusKm')!) : undefined,
      location: searchParams.get('location') || undefined,
    };

    const validatedQuery = ListingsQuerySchema.parse(query);
    const listings = await getListings(validatedQuery);

    return NextResponse.json({
      success: true,
      listings,
      count: listings.length
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No authorization header found');
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token received:', token.substring(0, 20) + '...');
    
    // Create admin client and verify the token
    const supabase = createAdminClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Token validation error:', error);
      return NextResponse.json(
        { success: false, message: `Token validation failed: ${error.message}` },
        { status: 401 }
      );
    }
    
    if (!user) {
      console.error('No user found from token');
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    
    console.log('User authenticated:', user.id);
    
    const body = await request.json();
    console.log('Request body:', body);
    console.log('Is permanent:', body.is_permanent);
    console.log('Start date:', body.start_date, 'Type:', typeof body.start_date);
    console.log('End date:', body.end_date, 'Type:', typeof body.end_date);
    
    let validatedData;
    try {
      validatedData = CreateListingSchema.parse(body);
      console.log('Validated data:', validatedData);
    } catch (validationError: any) {
      console.error('Validation error details:', validationError);
      console.error('Validation error path:', validationError.path);
      console.error('Validation error message:', validationError.message);
      throw validationError;
    }
    
    const listing = await createListing(validatedData, user.id);
    
    return NextResponse.json({
      success: true,
      listing,
      message: 'Listing created successfully and is pending verification'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating listing:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create listing' },
      { status: 400 }
    );
  }
} 