#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Loaded' : '❌ Missing');
console.log('Current working directory:', process.cwd());

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Set up admin role for a user
 */
async function setupAdminRole(userEmail: string) {
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
 * List all users with their roles
 */
async function listUsersWithRoles() {
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

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run setup-admin-direct <email>');
    console.log('Example: npm run setup-admin-direct marina.lyshova@gmail.com');
    console.log('');
    console.log('Or to list all users: npm run setup-admin-direct --list');
    return;
  }
  
  if (args[0] === '--list') {
    console.log('Listing all users and their roles...');
    await listUsersWithRoles();
    return;
  }
  
  const email = args[0];
  console.log(`Setting up admin role for: ${email}`);
  
  await setupAdminRole(email);
}

main().catch(console.error); 