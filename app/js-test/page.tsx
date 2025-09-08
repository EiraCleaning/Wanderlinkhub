'use client';

import { useState, useEffect } from 'react';

export default function JSTestPage() {
  const [counter, setCounter] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(`JSTestPage: ${message}`);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Component mounted');
    setMounted(true);
    
    // Test basic JavaScript functionality
    addLog('Testing basic JavaScript...');
    
    // Test array methods
    const testArray = [1, 2, 3, 4, 5];
    const doubled = testArray.map(x => x * 2);
    addLog(`Array map test: ${testArray} -> ${doubled}`);
    
    // Test string methods
    const testString = 'Hello World';
    const reversed = testString.split('').reverse().join('');
    addLog(`String reverse test: ${testString} -> ${reversed}`);
    
    // Test Math functions
    const randomNum = Math.random();
    addLog(`Math.random(): ${randomNum}`);
    
    // Test Date
    const now = new Date();
    addLog(`Current time: ${now.toISOString()}`);
    
    addLog('Basic JavaScript tests completed');
  }, []);

  const handleClick = () => {
    addLog('Button clicked');
    setCounter(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">JavaScript Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">JavaScript Functionality Test</h2>
          <p className="text-gray-700 mb-4">This page tests basic JavaScript functionality without any API calls.</p>
          
          <div className="space-y-4">
            <div>
              <p><strong>Component Mounted:</strong> {mounted ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Counter:</strong> {counter}</p>
            </div>
            
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Click Me (Counter: {counter})
            </button>
          </div>
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

        <div className="mt-6 text-center space-x-4">
          <a 
            href="/static-test" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Test Static Page
          </a>
          <a 
            href="/debug-test" 
            className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
          >
            Test Fetch API
          </a>
          <a 
            href="/xhr-test" 
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Test XHR API
          </a>
        </div>
      </div>
    </div>
  );
} 