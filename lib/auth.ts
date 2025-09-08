import { createServerClient, createAdminClient } from './supabaseClient';
import { cookies } from 'next/headers';

export async function getUser() {
  const cookieStore = cookies();
  const supabase = createServerClient();
  
  // Get the session from cookies
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session?.user) {
    return null;
  }
  
  return session.user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  
  // Check if user has admin role in app_metadata
  // This would be set via Supabase dashboard or custom function
  const { data: { user: userWithMetadata } } = await createAdminClient().auth.admin.getUserById(user.id);
  
  return userWithMetadata?.app_metadata?.role === 'admin' || false;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Admin access required');
  }
  
  return user;
} 