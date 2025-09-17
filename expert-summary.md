# Expert Summary: Persistent "Database error saving new user" Issue

## Problem Description
User is getting a 500 Internal Server Error when trying to create new accounts:
```
POST https://wtjvfhdbrvtliyqihktw.supabase.co/auth/v1/signup?redirect_to=https%3A%2F%2Fwww.wanderlinkhub.com%2Fprofile 500 (Internal Server Error)
```

## Current Architecture
- **Next.js app** deployed on Vercel
- **Supabase** for authentication and database
- **Database trigger** `handle_new_user` on `auth.users` INSERT
- **Webhook endpoint** `/api/webhooks/user-signup` for additional processing

## What We've Tried

### 1. Profile Creation Fallbacks
- Added fallback profile creation in `/api/profile/route.ts`
- Updated webhook to create profiles with all required fields
- Added error handling to continue processing even if profile creation fails

### 2. Database Trigger Updates
- Attempted to update trigger to remove HTTP calls
- Created minimal trigger that only inserts into `public.profiles`
- Tried to use database webhooks instead of trigger-based HTTP calls

### 3. Webhook Debugging
- Verified webhook endpoint works when called directly
- Added comprehensive logging
- Removed auth verification that might cause issues during user creation

## Current Database Schema

### `profiles` table:
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  kids_ages JSONB DEFAULT '[]'::jsonb,
  display_name TEXT,
  bio TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  profile_picture_url TEXT,
  is_supporter BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Current Trigger (suspected issue):
The trigger is likely still calling an HTTP webhook, which can cause transaction rollback if the HTTP call fails.

## Key Questions for Expert

1. **Transaction Rollback**: Is the 500 error caused by the database trigger making HTTP calls that fail, causing the entire `auth.users` INSERT transaction to rollback?

2. **Trigger Best Practices**: What's the recommended pattern for handling user signup in Supabase? Should we:
   - Use database triggers with HTTP calls?
   - Use database webhooks instead?
   - Handle profile creation in the application layer?

3. **Foreign Key Constraints**: The `profiles.id` has a foreign key to `auth.users.id`. Could this be causing issues during the user creation process?

4. **Supabase Auth Limitations**: Are there known issues with database triggers on `auth.users` that make HTTP calls?

## Current Error Pattern
- User tries to sign up
- Supabase Auth attempts to create user
- Database trigger fires and makes HTTP call
- HTTP call fails or times out
- Entire transaction rolls back
- User gets 500 error

## Proposed Solution
We want to implement a pattern where:
1. User creation succeeds regardless of profile creation
2. Profile creation happens asynchronously after user creation
3. No HTTP calls in database triggers that could cause rollback

## Environment Details
- **Supabase Project**: `wtjvfhdbrvtliyqihktw`
- **Vercel Deployment**: `wanderlink-l2blz2jgo-marinas-projects-c9f4356d.vercel.app`
- **Custom Domain**: `wanderlinkhub.com`

## Files to Review
- `app/api/webhooks/user-signup/route.ts` - Webhook endpoint
- `fix-trigger.sql` - Proposed trigger update
- `app/api/profile/route.ts` - Profile fallback creation

## Immediate Need
We need to resolve this signup issue so users can create accounts. The current error prevents any new user registration.

## Expert Recommendations Needed
1. Best practice for user signup with profile creation in Supabase
2. How to avoid transaction rollback issues
3. Recommended architecture for this use case
4. Specific steps to fix the current implementation
