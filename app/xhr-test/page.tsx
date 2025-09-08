'use client';

import { useState, useEffect } from 'react';

export default function XHRTestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(`XHRTestPage: ${message}`);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Component mounted');
    addLog('useEffect triggered');
    
    // Use XMLHttpRequest instead of fetch
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function() {
      addLog(`XHR state changed: ${xhr.readyState} (${xhr.status})`);
      
      if (xhr.readyState === 4) {
        addLog('XHR completed');
        
        if (xhr.status === 200) {
          try {
            addLog('XHR successful, parsing response');
            const result = JSON.parse(xhr.responseText);
            addLog(`JSON parsed: ${JSON.stringify(result).substring(0, 200)}...`);
            setData(result);
          } catch (err) {
            addLog(`JSON parse error: ${err}`);
            setError(`JSON parse error: ${err}`);
          }
        } else {
          addLog(`XHR failed: ${xhr.status} ${xhr.statusText}`);
          setError(`HTTP ${xhr.status}: ${xhr.statusText}`);
        }
        
        setLoading(false);
      }
    };
    
    xhr.onerror = function() {
      addLog('XHR error event fired');
      setError('XHR network error');
      setLoading(false);
    };
    
    xhr.ontimeout = function() {
      addLog('XHR timeout');
      setError('XHR timeout');
      setLoading(false);
    };
    
    try {
      addLog('Starting XHR request');
      xhr.open('GET', '/api/listings', true);
      xhr.timeout = 10000; // 10 second timeout
      xhr.send();
      addLog('XHR request sent');
    } catch (err) {
      addLog(`XHR setup error: ${err}`);
      setError(`XHR setup error: ${err}`);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">XHR Test Page</h1>
          
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">XHR Test Page</h1>
          
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">XHR Test Page</h1>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Success State</h2>
          <p className="text-green-700">Data fetched successfully using XMLHttpRequest!</p>
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