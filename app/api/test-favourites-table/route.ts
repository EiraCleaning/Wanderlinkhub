import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    noStore();
    const supabase = createAdminClient();
    
    // Try to query the favourites table
    const { data, error } = await supabase
      .from('favourites')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Favourites table exists and is accessible',
      count: data?.length || 0
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
