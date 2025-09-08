export default function StaticTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Static Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Static Content</h2>
          <p className="text-gray-700 mb-4">This is a completely static page with no JavaScript or API calls.</p>
          <p className="text-gray-700 mb-4">If you can see this content, basic rendering is working.</p>
          <p className="text-gray-700">If you cannot see this content, there's a fundamental rendering issue.</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Test Results</h3>
          <ul className="space-y-2 text-blue-800">
            <li>✅ HTML rendering: Working</li>
            <li>✅ CSS styling: Working</li>
            <li>✅ Tailwind classes: Working</li>
            <li>❓ JavaScript: Unknown (no JS on this page)</li>
            <li>❓ API calls: Unknown (no API calls on this page)</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/explore-simple" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test JavaScript Page
          </a>
        </div>
      </div>
    </div>
  );
} 