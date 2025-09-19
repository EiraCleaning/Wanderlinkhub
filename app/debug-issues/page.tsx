'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DebugIssues() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user || null);
      addResult(`Auth check: ${session ? 'Session found' : 'No session'}`);
      if (session?.user) {
        addResult(`User: ${session.user.email}`);
        addResult(`Access token: ${session.access_token ? 'Present' : 'Missing'}`);
      }
    } catch (error) {
      addResult(`Auth error: ${error}`);
    }
  };

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLogout = async () => {
    addResult('Testing logout...');
    try {
      await supabase.auth.signOut();
      addResult('Logout successful');
      setUser(null);
      setSession(null);
    } catch (error) {
      addResult(`Logout error: ${error}`);
    }
  };

  const testFavouritesAPI = async () => {
    if (!session?.access_token) {
      addResult('No access token available for API test');
      return;
    }

    addResult('Testing favourites API...');
    try {
      const response = await fetch('/api/favourites/check?listing_id=test-123', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      addResult(`API Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addResult(`API Response: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        addResult(`API Error: ${errorText}`);
      }
    } catch (error) {
      addResult(`API Test error: ${error}`);
    }
  };

  const testFavouritesPost = async () => {
    if (!session?.access_token) {
      addResult('No access token available for POST test');
      return;
    }

    addResult('Testing favourites POST...');
    try {
      const response = await fetch('/api/favourites', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listing_id: 'test-123' }),
      });

      addResult(`POST Response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        addResult(`POST Response: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        addResult(`POST Error: ${errorText}`);
      }
    } catch (error) {
      addResult(`POST Test error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Issues</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
            <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
            <p><strong>Access Token:</strong> {session?.access_token ? 'Present' : 'Missing'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-x-4">
            <button
              onClick={testLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Test Logout
            </button>
            <button
              onClick={testFavouritesAPI}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Test Favourites Check API
            </button>
            <button
              onClick={testFavouritesPost}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Test Favourites POST API
            </button>
            <button
              onClick={() => setTestResults([])}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Click a test button above.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono mb-1">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
