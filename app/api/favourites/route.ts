import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabaseClient';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/favourites - Get user's favourites
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
    const supabase = createAdminClient();
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Get user's favourites with listing details
    const { data: favourites, error } = await supabase
      .from('favourites')
      .select(`
        id,
        created_at,
        listings (
          id,
          title,
          ltype,
          description,
          city,
          country,
          start_date,
          end_date,
          price,
          photos,
          verify
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favourites:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch favourites' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      favourites: favourites || [],
      count: favourites?.length || 0
    }, {
      headers: {
        "cache-control": "no-store, no-cache, must-revalidate, max-age=0"
      }
    });

  } catch (error) {
    console.error('Error in favourites GET:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/favourites - Add a favourite
export async function POST(request: NextRequest) {
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
    const supabase = createAdminClient();
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listing_id } = body;

    if (!listing_id) {
      return NextResponse.json(
        { success: false, message: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Check if already favourited
    const { data: existing, error: checkError } = await supabase
      .from('favourites')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', listing_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing favourite:', checkError);
      return NextResponse.json(
        { success: false, message: 'Failed to check existing favourite' },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Listing already favourited' },
        { status: 409 }
      );
    }

    // Add favourite
    const { data: favourite, error } = await supabase
      .from('favourites')
      .insert({
        user_id: user.id,
        listing_id: listing_id
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding favourite:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to add favourite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      favourite,
      message: 'Favourite added successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in favourites POST:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/favourites - Remove a favourite
export async function DELETE(request: NextRequest) {
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
    const supabase = createAdminClient();
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listing_id = searchParams.get('listing_id');

    if (!listing_id) {
      return NextResponse.json(
        { success: false, message: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Remove favourite
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listing_id);

    if (error) {
      console.error('Error removing favourite:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to remove favourite' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Favourite removed successfully'
    });

  } catch (error) {
    console.error('Error in favourites DELETE:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
