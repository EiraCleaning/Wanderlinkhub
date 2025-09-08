#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Loaded' : '❌ Missing');
console.log('Current working directory:', process.cwd());

import { setupAdminRole, listUsersWithRoles } from '../lib/setupAdmin';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run setup-admin <email>');
    console.log('Example: npm run setup-admin marina.lyshova@gmail.com');
    console.log('');
    console.log('Or to list all users: npm run setup-admin --list');
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