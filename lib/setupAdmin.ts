import { createAdminClient } from './supabaseClient';

/**
 * Set up admin role for a user
 * Run this script to grant admin privileges to a specific user
 */
export async function setupAdminRole(userEmail: string) {
  const supabase = createAdminClient();
  
  try {
    // First, find the user by email
    const { data: { users }, error: findError } = await supabase.auth.admin.listUsers();
    
    if (findError) {
      console.error('Error listing users:', findError);
      return;
    }
    
    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      return;
    }
    
    console.log('Found user:', user.id, user.email);
    
    // Update the user's app_metadata to include admin role
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: {
        ...user.app_metadata,
        role: 'admin'
      }
    });
    
    if (error) {
      console.error('Error updating user role:', error);
      return;
    }
    
    console.log('✅ Admin role granted to:', user.email);
    console.log('User metadata:', data.user?.app_metadata);
    
  } catch (error) {
    console.error('Error setting up admin role:', error);
  }
}

/**
 * Check if a user has admin role
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  const supabase = createAdminClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error || !user) {
      return false;
    }
    
    return user.app_metadata?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

/**
 * List all users with their roles
 */
export async function listUsersWithRoles() {
  const supabase = createAdminClient();
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('Error listing users:', error);
      return;
    }
    
    console.log('Users and their roles:');
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.app_metadata?.role || 'no role'}`);
    });
    
  } catch (error) {
    console.error('Error listing users:', error);
  }
} 