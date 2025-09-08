import { NextRequest, NextResponse } from 'next/server';
import { UpdateListingSchema } from '@/lib/validation';
import { getListingById, updateListing } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await getListingById(id);
    
    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    
    const body = await request.json();
    const validatedData = UpdateListingSchema.parse(body);
    
    const listing = await updateListing(id, validatedData, user.id);
    
    return NextResponse.json({
      success: true,
      listing,
      message: 'Listing updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating listing:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (error.message === 'Unauthorized to update this listing') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to update this listing' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update listing' },
      { status: 400 }
    );
  }
} 