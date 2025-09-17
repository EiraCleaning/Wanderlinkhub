import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    noStore();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: listings, error } = await supabase
      .from('listings')
      .select('title, city, country, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      return NextResponse.json({
        error: error.message,
        timestamp: new Date().toISOString()
      }, {
        headers: { "cache-control": "no-store, no-cache, must-revalidate, max-age=0" }
      });
    }
    
    return NextResponse.json({
      listings: listings || [],
      count: listings?.length || 0,
      timestamp: new Date().toISOString(),
      supabaseUrl: supabaseUrl.slice(0, 32) + "..."
    }, {
      headers: { "cache-control": "no-store, no-cache, must-revalidate, max-age=0" }
    });
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      headers: { "cache-control": "no-store, no-cache, must-revalidate, max-age=0" }
    });
  }
}
