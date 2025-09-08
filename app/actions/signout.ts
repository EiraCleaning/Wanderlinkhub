'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function signOutAction() {
  console.log('=== SERVER SIGN OUT ACTION CALLED ===');
  
  try {
    const supabase = createSupabaseServerClient();
    console.log('Server Supabase client created');
    
    // Check current session before sign out
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session before server sign out:', !!session);
    
    // This clears the HTTP-only auth cookies
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Server sign out error:', error);
      throw error;
    }
    
    console.log('Server sign out successful');
    
    // Check session after sign out
    const { data: { session: afterSignOut } } = await supabase.auth.getSession();
    console.log('Session after server sign out:', !!afterSignOut);
    
    console.log('Redirecting to signin...');
    redirect('/signin'); // redirect to sign-in page after logout
  } catch (error) {
    console.error('Server sign out action error:', error);
    // Still redirect even if there's an error
    redirect('/signin');
  }
}
