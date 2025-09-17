'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function TestSignup() {
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');

  const testSignup = async () => {
    try {
      console.log('Testing signup...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      console.log('Signup result:', { data, error });
      setResult({ data, error });
      
      // Try to sign in immediately after signup
      if (data.user && !data.session) {
        console.log('Trying to sign in after signup...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        console.log('Sign in result:', { data: signInData, error: signInError });
        setResult(prev => ({ ...prev, signIn: { data: signInData, error: signInError } }));
      }
    } catch (err) {
      console.error('Signup error:', err);
      setResult({ error: err });
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Signup Flow</h1>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button
          onClick={testSignup}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Signup + Sign In
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
