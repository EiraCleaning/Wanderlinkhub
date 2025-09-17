'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function DebugAuthPage() {
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const supabase = createClient();
      
      // Try multiple methods to get the session
      console.log('Trying getSession...');
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('getSession result:', { session: !!session, error: error?.message });
      
      if (!session) {
        console.log('Trying getUser...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('getUser result:', { user: !!user, error: userError?.message });
        
        if (user) {
          // If we have a user but no session, try to get a fresh session
          console.log('User found but no session, trying refresh...');
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          console.log('Refresh result:', { session: !!refreshedSession, error: refreshError?.message });
          
          if (refreshedSession) {
            setAuthState({
              session: {
                user: refreshedSession.user ? {
                  id: refreshedSession.user.id,
                  email: refreshedSession.user.email,
                  created_at: refreshedSession.user.created_at
                } : null,
                access_token: refreshedSession.access_token ? 'Present' : 'Missing',
                refresh_token: refreshedSession.refresh_token ? 'Present' : 'Missing',
                expires_at: refreshedSession.expires_at
              },
              error: null
            });
            return;
          }
        }
      }
      
      setAuthState({
        session: session ? {
          user: session.user ? {
            id: session.user.id,
            email: session.user.email,
            created_at: session.user.created_at
          } : null,
          access_token: session.access_token ? 'Present' : 'Missing',
          refresh_token: session.refresh_token ? 'Present' : 'Missing',
          expires_at: session.expires_at
        } : null,
        error: error?.message || null
      });
    } catch (err) {
      console.error('Debug Auth - Exception:', err);
      setAuthState({ error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testFavouriteAPI = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('Session in testFavouriteAPI:', session);
      
      if (!session?.access_token) {
        alert('No access token available. Session: ' + JSON.stringify(session));
        return;
      }

      console.log('Access token length:', session.access_token.length);

      const response = await fetch('/api/debug-auth', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      console.log('Debug Auth Response:', response.status, response.statusText);
      const data = await response.json();
      console.log('Debug Auth Data:', data);
      alert(`Debug Auth Response: ${response.status} - ${JSON.stringify(data)}`);
    } catch (err) {
      console.error('Debug Auth Test Error:', err);
      alert(`API Error: ${err}`);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Current Auth State:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(authState, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <button 
          onClick={checkAuth}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Auth State
        </button>
        
        <button 
          onClick={testFavouriteAPI}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Favourite API
        </button>
      </div>
    </div>
  );
}
