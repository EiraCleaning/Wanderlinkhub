// Test the API with detailed debugging
const testCases = [
  { name: "No params", url: "https://www.wanderlinkhub.com/api/listings" },
  { name: "Text only", url: "https://www.wanderlinkhub.com/api/listings?location=mexico" },
  { name: "Coordinates only", url: "https://www.wanderlinkhub.com/api/listings?near=0,0&radiusKm=50000" },
  { name: "Mexico coordinates", url: "https://www.wanderlinkhub.com/api/listings?near=-99.1332,19.4326&radiusKm=2000" }
];

async function testAPI() {
  for (const test of testCases) {
    console.log(`\n=== ${test.name} ===`);
    try {
      const response = await fetch(test.url);
      const data = await response.json();
      console.log(`Status: ${response.status}`);
      console.log(`Success: ${data.success}`);
      console.log(`Listings: ${data.listings?.length || 0}`);
      if (data.message) console.log(`Message: ${data.message}`);
      if (data.listings && data.listings.length > 0) {
        console.log(`First listing: ${data.listings[0].title}`);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

testAPI();
