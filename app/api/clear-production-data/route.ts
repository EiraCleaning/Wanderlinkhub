import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    console.log('🗑️ Starting production data cleanup...');
    
    // Delete all reviews first (due to foreign key constraints)
    const { error: reviewsError } = await supabase
      .from('reviews')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all reviews
    
    if (reviewsError) {
      console.error('Error deleting reviews:', reviewsError);
      return NextResponse.json(
        { success: false, message: 'Failed to delete reviews', error: reviewsError.message },
        { status: 500 }
      );
    }
    
    console.log('✅ Reviews deleted');
    
    // Delete all favorites
    const { error: favouritesError } = await supabase
      .from('favourites')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all favorites
    
    if (favouritesError) {
      console.error('Error deleting favourites:', favouritesError);
      return NextResponse.json(
        { success: false, message: 'Failed to delete favourites', error: favouritesError.message },
        { status: 500 }
      );
    }
    
    console.log('✅ Favourites deleted');
    
    // Delete all listings (events and hubs)
    const { error: listingsError } = await supabase
      .from('listings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all listings
    
    if (listingsError) {
      console.error('Error deleting listings:', listingsError);
      return NextResponse.json(
        { success: false, message: 'Failed to delete listings', error: listingsError.message },
        { status: 500 }
      );
    }
    
    console.log('✅ Listings deleted');
    
    // Get final counts to verify
    const { data: listingsCount } = await supabase
      .from('listings')
      .select('id', { count: 'exact', head: true });
    
    const { data: reviewsCount } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true });
    
    const { data: favouritesCount } = await supabase
      .from('favourites')
      .select('id', { count: 'exact', head: true });
    
    console.log('🎉 Production data cleanup completed!');
    console.log('Final counts:', {
      listings: listingsCount?.length || 0,
      reviews: reviewsCount?.length || 0,
      favourites: favouritesCount?.length || 0
    });
    
    return NextResponse.json({
      success: true,
      message: 'Production data cleared successfully',
      counts: {
        listings: listingsCount?.length || 0,
        reviews: reviewsCount?.length || 0,
        favourites: favouritesCount?.length || 0
      }
    });
    
  } catch (error) {
    console.error('Error clearing production data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear production data', error: error.message },
      { status: 500 }
    );
  }
}
