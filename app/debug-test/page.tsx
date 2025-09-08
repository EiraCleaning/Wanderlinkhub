'use client';

import { useState, useEffect } from 'react';

export default function DebugTestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(`DebugTestPage: ${message}`);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Component mounted');
    addLog('useEffect triggered');
    
    async function fetchData() {
      try {
        addLog('Starting fetch request');
        addLog(`Fetching from: ${window.location.origin}/api/listings`);
        
        const response = await fetch('/api/listings');
        addLog(`Response received: ${response.status} ${response.statusText}`);
        addLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
        
        if (response.ok) {
          addLog('Response is OK, parsing JSON');
          const result = await response.json();
          addLog(`JSON parsed successfully: ${JSON.stringify(result).substring(0, 200)}...`);
          setData(result);
        } else {
          addLog(`Response not OK: ${response.status}`);
          setError(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        addLog(`Fetch error caught: ${err}`);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        addLog('Fetch completed, setting loading to false');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Debug Test Page</h1>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Loading State</h2>
            <p className="text-yellow-700">Component is currently loading...</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Debug Logs:</h3>
            <div className="space-y-1 text-sm">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-xs bg-white p-2 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Debug Test Page</h1>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error State</h2>
            <p className="text-red-700">{error}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Debug Logs:</h3>
            <div className="space-y-1 text-sm">
              {logs.map((log, index) => (
                <div key={index} className="font-mono text-xs bg-white p-2 rounded">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Debug Test Page</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Success State</h2>
          <p className="text-green-700">Data fetched successfully!</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Response</h2>
          <p><strong>Success:</strong> {data?.success ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Listings Count:</strong> {data?.listings?.length || 0}</p>
          <p><strong>Events Count:</strong> {data?.listings?.filter((l: any) => l.ltype === 'event').length || 0}</p>
          <p><strong>Hubs Count:</strong> {data?.listings?.filter((l: any) => l.ltype === 'hub').length || 0}</p>
          <p><strong>Verified Count:</strong> {data?.listings?.filter((l: any) => l.verify === 'verified').length || 0}</p>
          <p><strong>Pending Count:</strong> {data?.listings?.filter((l: any) => l.verify === 'pending').length || 0}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Debug Logs:</h3>
          <div className="space-y-1 text-sm">
            {logs.map((log, index) => (
              <div key={index} className="font-mono text-xs bg-white p-2 rounded">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 