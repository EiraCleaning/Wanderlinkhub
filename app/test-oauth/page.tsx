'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestOAuth() {
  const [status, setStatus] = useState('Ready to test');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGoogleOAuth = async () => {
    try {
      addLog('Starting Google OAuth test...');
      setStatus('Testing Google OAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/debug-oauth`
        }
      });

      if (error) {
        addLog(`Error: ${error.message}`);
        setStatus(`Error: ${error.message}`);
      } else {
        addLog('OAuth initiated successfully');
        setStatus('Redirecting to Google...');
      }
    } catch (err) {
      addLog(`Exception: ${err}`);
      setStatus(`Exception: ${err}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setStatus('Ready to test');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OAuth Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testGoogleOAuth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Google OAuth
        </button>
        
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Status:</h2>
        <p>{status}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Logs:</h2>
        <div className="text-sm space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="font-mono">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
