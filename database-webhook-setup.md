# Database Webhook Setup Instructions

## Step 1: Run the SQL Migration

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `fix-trigger-final.sql`
3. Click **Run** to execute the migration

This will:
- ✅ Drop the old trigger that makes HTTP calls
- ✅ Create a minimal trigger that only inserts into profiles
- ✅ Set up proper RLS policies
- ✅ Add necessary grants

## Step 2: Set up Database Webhook

1. Go to **Database** → **Webhooks** in your Supabase Dashboard
2. Click **Create a new webhook**
3. Configure the webhook:

### Webhook Configuration:
- **Name**: `user-signup-webhook`
- **Table**: `public.profiles`
- **Events**: `INSERT`
- **Type**: `HTTP Request`
- **URL**: `https://wanderlink-l2blz2jgo-marinas-projects-c9f4356d.vercel.app/api/webhooks/user-signup`
- **HTTP Method**: `POST`
- **HTTP Headers**: 
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_SUPABASE_ANON_KEY
  ```
- **HTTP Body**: 
  ```json
  {
    "type": "INSERT",
    "record": {
      "id": "{{record.id}}",
      "full_name": "{{record.full_name}}",
      "display_name": "{{record.display_name}}",
      "profile_picture_url": "{{record.profile_picture_url}}",
      "created_at": "{{record.created_at}}"
    }
  }
  ```

## Step 3: Test the Setup

1. Try creating a new account on your website
2. Check if signup works without the 500 error
3. Verify the profile is created in the database
4. Check if the webhook is called (check Vercel logs)

## Why This Works

- **Minimal Trigger**: Only inserts into profiles table (no HTTP calls)
- **Database Webhook**: Handles HTTP calls after the transaction commits
- **No Transaction Rollback**: HTTP failures don't affect user creation
- **Idempotent Webhook**: Can be called multiple times safely
- **Proper Error Handling**: Webhook never fails the signup process

## Expected Flow

1. User signs up → `auth.users` row created
2. Trigger fires → `public.profiles` row created (in same transaction)
3. Transaction commits successfully
4. Database webhook fires → calls your API endpoint
5. API endpoint processes MailerLite, etc. (best effort)

The signup will succeed even if step 4 or 5 fails!
