import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    // Test if the columns exist by trying to select them
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_canceled_at, subscription_current_period_end')
      .limit(1);
    
    if (testError && testError.code === '42703') {
      // Columns don't exist, we need to add them
      return NextResponse.json({
        success: false,
        message: 'Subscription status columns do not exist. Please add them manually in Supabase dashboard.',
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to the Table Editor',
          '3. Select the "profiles" table',
          '4. Click "Add Column" for each of these:',
          '   - subscription_status (text, default: "inactive")',
          '   - subscription_canceled_at (timestamp with time zone, nullable)',
          '   - subscription_current_period_end (timestamp with time zone, nullable)',
          '5. Click "Save" for each column'
        ]
      });
    }
    
    // Columns exist, return success
    return NextResponse.json({
      success: true,
      message: 'Subscription status columns already exist',
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
