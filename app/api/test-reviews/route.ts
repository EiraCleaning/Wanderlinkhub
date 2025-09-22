import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Try to select from reviews table
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        hint: error.hint,
        message: 'Reviews table error'
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Reviews table exists and is accessible',
      data: data || []
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      message: 'Unexpected error'
    }, { status: 500 });
  }
}
