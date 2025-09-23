import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Try to add the column by attempting to select it first
    // If it fails, we know the column doesn't exist
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('profile_picture')
      .limit(1);
    
    if (testError && testError.code === '42703') {
      // Column doesn't exist, we need to add it
      // Since we can't execute DDL directly, we'll return instructions
      return NextResponse.json({
        success: false,
        message: 'Profile picture column does not exist. Please add it manually in Supabase dashboard.',
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to the Table Editor',
          '3. Select the "profiles" table',
          '4. Click "Add Column"',
          '5. Set column name: "profile_picture"',
          '6. Set column type: "text"',
          '7. Make it nullable: true',
          '8. Click "Save"'
        ]
      });
    }
    
    // Column exists, return success
    return NextResponse.json({
      success: true,
      message: 'Profile picture column already exists',
      data: testData
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, message: 'Migration failed', error: error.message },
      { status: 500 }
    );
  }
}
