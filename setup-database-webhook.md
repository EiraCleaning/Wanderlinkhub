# Database Webhook Setup Instructions

## 1. Update the Database Trigger

Run the SQL in `fix-trigger-url.sql` in your Supabase SQL Editor. This will:
- Remove the HTTP call from the trigger
- Make the trigger only insert into the profiles table
- Use the correct URL for any future webhook calls

## 2. Set up Database Webhook

In your Supabase Dashboard:

1. Go to **Database** → **Webhooks**
2. Click **Create a new webhook**
3. Configure:
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
         "email": "{{record.email}}",
         "user_metadata": "{{record.user_metadata}}"
       }
     }
     ```

## 3. Test the Setup

After setting up both:
1. Try creating a new account
2. Check if the signup works without errors
3. Verify the profile is created
4. Check if the webhook is called

## Why This Works

- **Minimal Trigger**: Only inserts into profiles table (no HTTP calls)
- **Database Webhook**: Handles HTTP calls after the transaction commits
- **No Transaction Rollback**: HTTP failures don't affect user creation
- **Proper Error Handling**: Webhook can fail without breaking signup
