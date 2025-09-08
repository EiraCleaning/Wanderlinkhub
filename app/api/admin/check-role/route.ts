import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create admin client and verify the token
    const supabase = createAdminClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const { data: { user: userWithMetadata } } = await supabase.auth.admin.getUserById(user.id);
    
    const isAdmin = userWithMetadata?.app_metadata?.role === 'admin';
    
    return NextResponse.json({
      success: true,
      isAdmin,
      user: {
        id: user.id,
        email: user.email,
        role: userWithMetadata?.app_metadata?.role || 'no role'
      }
    });
  } catch (error: any) {
    console.error('Error checking admin role:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to check admin role' },
      { status: 500 }
    );
  }
} 