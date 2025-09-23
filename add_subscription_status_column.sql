-- Add subscription status fields to profiles table
ALTER TABLE profiles 
ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN subscription_canceled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_current_period_end TIMESTAMP WITH TIME ZONE;

-- Add comments
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status: active, canceled, inactive';
COMMENT ON COLUMN profiles.subscription_canceled_at IS 'When the subscription was canceled';
COMMENT ON COLUMN profiles.subscription_current_period_end IS 'When the current subscription period ends';
