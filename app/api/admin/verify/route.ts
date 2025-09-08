import { NextRequest, NextResponse } from 'next/server';
import { AdminVerifySchema } from '@/lib/validation';
import { updateListingVerification } from '@/lib/db';
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
    
    if (!userWithMetadata?.app_metadata?.role || userWithMetadata.app_metadata.role !== 'admin') {
      console.log('User attempted admin access without role:', user.id, userWithMetadata?.app_metadata);
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Admin user authenticated:', user.id, 'Role:', userWithMetadata.app_metadata.role);
    
    const body = await request.json();
    const validatedData = AdminVerifySchema.parse(body);
    
    const status = validatedData.action === 'verify' ? 'verified' : 'rejected';
    await updateListingVerification(validatedData.id, status);
    
    return NextResponse.json({
      success: true,
      message: `Listing ${validatedData.action}ed successfully`
    });
  } catch (error: any) {
    console.error('Error updating listing verification:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (error.message === 'Admin access required') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update listing verification' },
      { status: 400 }
    );
  }
} 