import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'insert-production-data.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing production data insertion SQL...');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    
    console.log('Production data inserted successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Production data inserted successfully!',
      data
    });
    
  } catch (error: any) {
    console.error('Error in insert-production-data:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to insert production data' },
      { status: 500 }
    );
  }
}
