'use client';

import { useEffect, useState, Suspense } from 'react';
import { User, LogIn, LogOut, CheckCircle, XCircle, Settings, Tag } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/validation';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { signOutAction } from '@/app/actions/signout';
import FavouritesList from '@/components/FavouritesList';
import FeedbackButton from '@/components/FeedbackButton';

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for OAuth callback messages
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const canceled = searchParams.get('canceled');
    
    if (success === 'google_signin') {
      setMessage({ type: 'success', text: 'Successfully signed in with Google!' });
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } else if (success === 'subscription_created') {
      setMessage({ type: 'success', text: '🎉 Welcome to the Founding Supporter community! Thank you for your support!' });
      // Auto-dismiss success message after 8 seconds
      setTimeout(() => setMessage(null), 8000);
      // Refresh profile data to show supporter status
      if (user) {
        fetchProfileData(user.id);
      }
    } else if (canceled === 'true') {
      setMessage({ type: 'error', text: 'Checkout was canceled. You can try again anytime!' });
      // Auto-dismiss message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } else if (error) {
      const errorMessages: { [key: string]: string } = {
        'oauth_denied': 'Google sign-in was cancelled',
        'no_code': 'Google sign-in failed - no authorization code received',
        'auth_failed': 'Google authentication failed',
        'no_session': 'No session created after Google sign-in',
        'unexpected': 'An unexpected error occurred during Google sign-in'
      };
      setMessage({ type: 'error', text: errorMessages[error] || `Sign-in error: ${error}` });
      // Auto-dismiss error message after 8 seconds
      setTimeout(() => setMessage(null), 8000);
    }
  }, [searchParams, user]);

  // Handle authentication state
  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        // fetchProfileData will be called by checkUser, no need to call it here
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setSession(session);
      if (session?.user) {
        // Only fetch profile data once - fetchProfileData includes all profile info
        await fetchProfileData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchProfileData = async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No access token available');
        return;
      }

      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile API response:', data);
        if (data.success && data.profile) {
          console.log('Setting profile data:', data.profile);
          console.log('Is supporter?', data.profile.is_supporter);
          setProfileData(data.profile);
        }
      } else {
        console.error('Failed to fetch profile data:', response.status);
        // Set defaults
        setProfileData({
          display_name: user?.email?.split('@')[0] || 'User',
          bio: '',
          interests: []
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Set defaults
      setProfileData({
        display_name: user?.email?.split('@')[0] || 'User',
        bio: '',
        interests: []
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleBecomeSupporter = async () => {
    if (!user) return;

    try {
      console.log('Starting checkout process...');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No access token available');
        alert('Please sign in to become a supporter');
        return;
      }

      console.log('Making checkout API request...');
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        console.log('Checkout successful, redirecting to:', data.url);
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('Checkout failed:', data.message);
        alert(data.message || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !profileData?.is_supporter) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? You will continue to have supporter access until the end of your current billing period.'
    );

    if (!confirmed) return;

    setIsCanceling(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('Please sign in to cancel your subscription');
        return;
      }

      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Your subscription has been canceled. You will continue to have supporter access until the end of your current billing period.' 
        });
        // Refresh profile data to update the UI
        await fetchProfileData(user.id);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Failed to cancel subscription' 
        });
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setMessage({ 
        type: 'error', 
        text: 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4" aria-label="Main" aria-current="page">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-8 h-8 text-[var(--wl-sky)]" />
          <h1 className="text-2xl font-bold text-[var(--wl-ink)] brand-heading">Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* OAuth Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="ml-auto text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {user ? (
          /* User Profile */
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                    {profileData?.profile_picture_url ? (
                      <Image
                        src={profileData.profile_picture_url}
                        alt="Profile picture"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[var(--wl-sky)]/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-[var(--wl-sky)]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-[var(--wl-ink)]">
                        {profileData?.display_name || profile?.full_name || 'User'}
                      </h2>
                      {profileData?.is_supporter && (
                        <span className="px-3 py-1 bg-[#E06C65] text-white rounded-full text-sm font-medium">
                          🌍 Founding Supporter
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--wl-slate)]">{user.email}</p>
                  </div>
                </div>
                <a
                  href="/profile/settings"
                  className="flex items-center space-x-2 px-4 py-2 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Member since</span>
                  <span className="text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                {profile?.kids_ages && profile.kids_ages.length > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Kids ages</span>
                    <span className="text-gray-900">
                      {profile.kids_ages.join(', ')} years old
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* About Me Section */}
            {profileLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ) : (profileData?.bio || (profileData?.interests && profileData.interests.length > 0)) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
                
                {profileData?.bio && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
                  </div>
                )}
                
                {profileData?.interests && profileData.interests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.interests.map((interest: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[var(--wl-forest)]/10 text-[var(--wl-forest)] rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Support WanderLink Hub */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support WanderLink Hub</h3>
              
              {profileLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                </div>
              ) : (() => {
                console.log('Profile data for supporter check:', profileData);
                return profileData?.is_supporter;
              })() ? (
                <div className="text-center">
                  {profileData?.subscription_status === 'canceled' ? (
                    // Cancelled but still active
                    <>
                      <div className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium mb-4">
                        ⚠️ Subscription Cancelled
                      </div>
                      <p className="text-gray-600 mb-4">
                        Your subscription has been cancelled, but you still have supporter access until{' '}
                        <strong>
                          {profileData?.subscription_current_period_end 
                            ? new Date(profileData.subscription_current_period_end).toLocaleDateString()
                            : 'the end of your billing period'
                          }
                        </strong>.
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        You can resubscribe anytime to continue supporting the community.
                      </p>
                      <button
                        onClick={handleBecomeSupporter}
                        className="inline-flex items-center px-4 py-2 bg-[#2E5D50] text-white rounded-lg hover:bg-[#5BA4CF] transition-colors font-medium"
                      >
                        Resubscribe - $6.57/month
                      </button>
                    </>
                  ) : (
                    // Active subscription
                    <>
                      <div className="inline-flex items-center px-4 py-2 bg-[#E06C65] text-white rounded-full text-sm font-medium mb-4">
                        🌍 Thank you for being a Founding Supporter!
                      </div>
                      <p className="text-gray-600 mb-4">
                        Your support helps us build amazing features for the worldschooling community.
                      </p>
                      
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isCanceling}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        You'll keep supporter access until the end of your billing period
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Help us grow and build amazing features for the worldschooling community.
                  </p>
                  <button
                    onClick={handleBecomeSupporter}
                    className="inline-flex items-center px-6 py-3 bg-[#2E5D50] text-white rounded-lg hover:bg-[#5BA4CF] transition-colors font-medium"
                  >
                    Become a Founding Supporter - $6.57/month
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Cancel anytime • Support the community
                  </p>
                </div>
              )}
            </div>

            {/* My Favourites */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <Suspense fallback={
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <FavouritesList user={user} />
              </Suspense>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <p className="text-gray-500 text-sm">More features coming soon!</p>
              </div>
            </div>

            {/* Sign Out */}
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mb-3"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </form>

          </div>
        ) : (
          /* Sign In/Up Form */
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="w-56 h-56 mx-auto mb-4">
                <Image 
                  src="/logo.png" 
                  alt="WanderLink Hub Logo" 
                  width={224} 
                  height={224} 
                  className="w-56 h-56"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome
              </h2>
              <p className="text-gray-600 mb-6">
                Sign in to submit listings, write reviews, and save your favorites.
              </p>
              
              {/* Sign-In Link */}
              <a
                href="/signin"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-wl-forest text-white rounded-2xl hover:opacity-95 transition-opacity mb-4"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In to WanderLink Hub</span>
              </a>
              
              <p className="text-sm text-gray-500">
                Create an account or sign in to access all features
              </p>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        <div className="mt-8 p-6 bg-white border border-[var(--wl-border)] rounded-2xl shadow-card">
          <h3 className="text-lg font-semibold text-[var(--wl-ink)] mb-4">Help Us Improve</h3>
          <p className="text-[var(--wl-slate)] mb-4">
            Found a bug or have a feature idea? We'd love to hear from you!
          </p>
          <FeedbackButton />
        </div>
      </div>
    </AppShell>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <AppShell>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AppShell>
    }>
      <ProfileContent />
    </Suspense>
  );
} 