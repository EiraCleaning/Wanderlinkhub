// Test coordinate parsing
const coords = "-99.1332,19.4326";
const parsed = coords.split(',').map(Number);
console.log('Original:', coords);
console.log('Parsed:', parsed);
console.log('Type of first:', typeof parsed[0]);
console.log('Type of second:', typeof parsed[1]);
console.log('Is array:', Array.isArray(parsed));
console.log('Length:', parsed.length);
