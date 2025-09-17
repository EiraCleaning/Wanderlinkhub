'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OAuthDebugContent() {
  const searchParams = useSearchParams();
  
  const allParams = Object.fromEntries(searchParams.entries());
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">OAuth Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Current URL:</h2>
        <p className="text-sm break-all">{typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Search Parameters:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(allParams, null, 2)}
        </pre>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Expected Parameters:</h2>
        <ul className="text-sm">
          <li><strong>code:</strong> {allParams.code ? '✅ Present' : '❌ Missing'}</li>
          <li><strong>error:</strong> {allParams.error || 'None'}</li>
          <li><strong>error_description:</strong> {allParams.error_description || 'None'}</li>
          <li><strong>state:</strong> {allParams.state || 'None'}</li>
        </ul>
      </div>
    </div>
  );
}

export default function OAuthDebug() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthDebugContent />
    </Suspense>
  );
}
