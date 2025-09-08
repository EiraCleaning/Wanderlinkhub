'use client';
import Image from 'next/image';
import { AuthCard } from '@/components/auth/AuthCard';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Remove the automatic session check that was causing immediate redirects
  // The server-side sign-out should handle session clearing properly

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      console.log('Starting Google sign-in...');
      console.log('Current session before Google sign-in:');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        setMessage(`Error: ${error.message}`);
      } else {
        console.log('Google OAuth initiated successfully');
      }
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      setMessage('An error occurred with Google sign-in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile`
          }
        });
        if (error) throw error;
        setMessage('Check your email for a confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        router.push('/profile');
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-wl-beige grid place-items-center px-4">
      <AuthCard>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="WanderLink Hub Logo" width={160} height={160} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-wl-ink text-center">Welcome</h1>
        <p className="text-center text-wl-slate mt-2">
          Sign in to submit listings, write reviews, and save your favourites.
        </p>

        {/* Google */}
        <div className="mt-6">
          <GoogleButton onClick={handleGoogleSignIn}>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </GoogleButton>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-wl-border flex-1" />
          <span className="text-sm text-wl-slate">or continue with email</span>
          <div className="h-px bg-wl-border flex-1" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-wl-ink mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-wl-border rounded-lg focus:outline-none focus:ring-2 focus:ring-wl-sky focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-wl-ink mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-wl-border rounded-lg focus:outline-none focus:ring-2 focus:ring-wl-sky focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-lg ${
              message.includes('Error') || message.includes('error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center rounded-2xl bg-wl-forest text-white px-4 py-3 text-center hover:opacity-95 focus-visible:ring-2 focus-visible:ring-wl-sky transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
          </button>
        </form>

        {/* Toggle Sign In/Sign Up */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-wl-slate hover:text-wl-ink underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Trust note */}
        <p className="text-xs text-wl-slate mt-6 text-center">
          By continuing you agree to our{' '}
          <a href="/terms" className="underline hover:text-wl-ink focus-visible:ring-2 focus-visible:ring-wl-sky rounded">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-wl-ink focus-visible:ring-2 focus-visible:ring-wl-sky rounded">
            Privacy Policy
          </a>
          .
        </p>
      </AuthCard>
    </main>
  );
}
