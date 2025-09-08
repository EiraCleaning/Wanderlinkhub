'use client';

import { useEffect, useState, Suspense } from 'react';
import { User, LogIn, LogOut, CheckCircle, XCircle } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { supabase } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/validation';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { signOutAction } from '@/app/actions/signout';

function ProfileContent() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [session, setSession] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for OAuth callback messages
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success === 'google_signin') {
      setMessage({ type: 'success', text: 'Successfully signed in with Google!' });
      // Auto-dismiss success message after 5 seconds
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

    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      setUser(user);
      setSession(session);
      if (user) {
        await fetchProfile(user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-[var(--wl-sky)]/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-[var(--wl-sky)]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--wl-ink)]">
                    {profile?.full_name || 'User'}
                  </h2>
                  <p className="text-[var(--wl-slate)]">{user.email}</p>
                </div>
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