'use client';

import { useState, useEffect } from 'react';

export default function SimpleTestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('SimpleTestPage: Fetching data...');
        const response = await fetch('/api/listings');
        console.log('SimpleTestPage: Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('SimpleTestPage: Data received:', result);
          setData(result);
        } else {
          console.error('SimpleTestPage: Response not ok:', response.status);
          setError(`HTTP ${response.status}`);
        }
      } catch (err) {
        console.error('SimpleTestPage: Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">❌ Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Simple Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Response</h2>
          <p><strong>Success:</strong> {data?.success ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Listings Count:</strong> {data?.listings?.length || 0}</p>
          <p><strong>Events Count:</strong> {data?.listings?.filter((l: any) => l.ltype === 'event').length || 0}</p>
          <p><strong>Hubs Count:</strong> {data?.listings?.filter((l: any) => l.ltype === 'hub').length || 0}</p>
          <p><strong>Verified Count:</strong> {data?.listings?.filter((l: any) => l.verify === 'verified').length || 0}</p>
          <p><strong>Pending Count:</strong> {data?.listings?.filter((l: any) => l.verify === 'pending').length || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Listings</h2>
          {data?.listings?.slice(0, 3).map((listing: any, index: number) => (
            <div key={listing.id} className="border-b border-gray-200 pb-3 mb-3 last:border-b-0">
              <h3 className="font-semibold">{listing.title}</h3>
              <p className="text-sm text-gray-600">Type: {listing.ltype} | Status: {listing.verify}</p>
              <p className="text-sm text-gray-600">Location: {listing.city}, {listing.country}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 