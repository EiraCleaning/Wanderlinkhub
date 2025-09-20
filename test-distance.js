// Test the distance calculation manually
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

// Test distance from Mexico City to Oaxaca
const mexicoCity = { lat: 19.4326, lng: -99.1332 };
const oaxaca = { lat: 17.0732, lng: -96.7266 };

const distance = calculateDistance(mexicoCity.lat, mexicoCity.lng, oaxaca.lat, oaxaca.lng);
console.log('Distance from Mexico City to Oaxaca:', distance, 'km');
console.log('Within 2000km radius:', distance <= 2000);
