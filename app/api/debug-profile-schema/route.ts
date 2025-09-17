import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Try to get the table structure by selecting all columns
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: error.message,
        code: error.code
      });
    }
    
    // Get column information
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    
    return NextResponse.json({
      success: true,
      columns: columns,
      sampleData: data[0] || null,
      message: 'Profile table structure retrieved'
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Script error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
