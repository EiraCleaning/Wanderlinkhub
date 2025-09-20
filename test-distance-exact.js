// Test the distance calculation with exact coordinates from the API
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in kilometers
}

// Test with the exact coordinates from the API
const searchCoords = { lat: 19.4326, lng: -99.1332 };
const oaxaca = { lat: 17.0732, lng: -96.7266 };

console.log('Search coordinates:', searchCoords);
console.log('Oaxaca coordinates:', oaxaca);

const distance = calculateDistance(searchCoords.lat, searchCoords.lng, oaxaca.lat, oaxaca.lng);
console.log('Distance:', distance, 'km');
console.log('Within 2000km:', distance <= 2000);

// Test with invalid coordinates
console.log('\nTesting with invalid coordinates:');
const invalidDistance = calculateDistance(19.4326, -99.1332, 0, 0);
console.log('Distance to (0,0):', invalidDistance, 'km');
