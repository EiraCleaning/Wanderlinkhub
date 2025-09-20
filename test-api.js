// Test the API with different parameters
const testCases = [
  { name: "Text only", url: "https://www.wanderlinkhub.com/api/listings?location=mexico" },
  { name: "With coordinates", url: "https://www.wanderlinkhub.com/api/listings?location=mexico&near=-99.1332,19.4326&radiusKm=2000" },
  { name: "Coordinates only", url: "https://www.wanderlinkhub.com/api/listings?near=-99.1332,19.4326&radiusKm=2000" }
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
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

testAPI();
