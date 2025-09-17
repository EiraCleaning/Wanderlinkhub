'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function TestLoginPage() {
  const [status, setStatus] = useState('');

  const testLogin = async () => {
    try {
      setStatus('Testing login...');
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/debug-auth`
        }
      });
      
      if (error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus('Redirecting to Google...');
      }
    } catch (err) {
      setStatus(`Exception: ${err}`);
    }
  };

  const testLogout = async () => {
    try {
      setStatus('Testing logout...');
      const supabase = createClient();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setStatus(`Logout error: ${error.message}`);
      } else {
        setStatus('Logged out successfully');
      }
    } catch (err) {
      setStatus(`Logout exception: ${err}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Login/Logout</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Google Login
        </button>
        
        <button 
          onClick={testLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Test Logout
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <strong>Status:</strong> {status}
      </div>
    </div>
  );
}
