'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for fragment-based OAuth response (Google OAuth)
        const hash = window.location.hash;
        const search = window.location.search;
        
        // Debug logging
        console.log('OAuth callback received:', {
          hash: hash ? 'present' : 'missing',
          search: search ? 'present' : 'missing',
          fullUrl: window.location.href,
          searchParams: Object.fromEntries(searchParams.entries())
        });

        // Handle fragment-based response (Google OAuth)
        if (hash) {
          console.log('Processing fragment-based OAuth response');
          setStatus('Processing Google OAuth response...');
          
          // Parse the fragment
          const fragmentParams = new URLSearchParams(hash.substring(1));
          const accessToken = fragmentParams.get('access_token');
          const refreshToken = fragmentParams.get('refresh_token');
          const error = fragmentParams.get('error');
          
          if (error) {
            console.error('OAuth error in fragment:', error);
            setStatus(`Authentication failed: ${error}`);
            setTimeout(() => {
              router.push('/signin?error=oauth_denied');
            }, 2000);
            return;
          }
          
          if (accessToken) {
            console.log('Access token received, setting session...');
            // Set the session directly
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (sessionError) {
              console.error('Session error:', sessionError);
              setStatus(`Session creation failed: ${sessionError.message}`);
              setTimeout(() => {
                router.push('/signin?error=auth_failed');
              }, 2000);
              return;
            }
            
            console.log('Session created successfully:', sessionData.user);
            setStatus('Authentication successful! Redirecting...');
            setTimeout(() => {
              router.push('/profile?success=google_signin');
            }, 1000);
            return;
          }
        }

        // Handle query parameter-based response (standard OAuth)
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus(`Authentication failed: ${errorDescription || error}`);
          setTimeout(() => {
            router.push('/signin?error=oauth_denied');
          }, 2000);
          return;
        }

        if (!code) {
          console.error('No authorization code or access token received');
          setStatus('No authorization code received - check OAuth configuration');
          setTimeout(() => {
            router.push('/signin?error=no_code');
          }, 3000);
          return;
        }

        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('Session exchange error:', exchangeError);
          setStatus(`Session creation failed: ${exchangeError.message}`);
          setTimeout(() => {
            router.push('/signin?error=auth_failed');
          }, 2000);
          return;
        }

        if (!data.session) {
          console.error('No session created');
          setStatus('No session created after authentication');
          setTimeout(() => {
            router.push('/signin?error=no_session');
          }, 2000);
          return;
        }

        console.log('Authentication successful:', data.user);
        setStatus('Authentication successful! Redirecting...');
        
        // Redirect to profile with success message
        setTimeout(() => {
          router.push('/profile?success=google_signin');
        }, 1000);

      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        setStatus('An unexpected error occurred');
        setTimeout(() => {
          router.push('/signin?error=unexpected');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-wl-beige flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-wl-forest"></div>
        </div>
        <h2 className="text-xl font-semibold text-wl-ink mb-2">
          Authenticating...
        </h2>
        <p className="text-wl-slate">
          {status}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-wl-beige flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-wl-forest"></div>
          </div>
          <h2 className="text-xl font-semibold text-wl-ink mb-2">
            Loading...
          </h2>
          <p className="text-wl-slate">
            Preparing authentication...
          </p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
