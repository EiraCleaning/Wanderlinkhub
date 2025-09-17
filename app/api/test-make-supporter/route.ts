import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Get the user ID from the request body
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Make the user a supporter
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        is_supporter: true,
        stripe_customer_id: 'test_customer_' + Date.now()
      })
      .eq('id', userId)
      .select();
    
    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'User made supporter successfully',
      data: data
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error making user supporter',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
