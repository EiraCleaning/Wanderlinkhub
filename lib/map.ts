import type { ListingResponse } from './validation';

export interface MapPin {
  id: string;
  title: string;
  ltype: 'event' | 'hub';
  lat: number;
  lng: number;
  price: number | null;
  city: string;
  country: string;
  verify: 'pending' | 'verified' | 'rejected';
}

export function listingsToMapPins(listings: ListingResponse[]): MapPin[] {
  return listings.map(listing => ({
    id: listing.id,
    title: listing.title,
    ltype: listing.ltype,
    lat: listing.lat,
    lng: listing.lng,
    price: listing.price,
    city: listing.city,
    country: listing.country,
    verify: listing.verify,
  }));
}

export function getMapCenter(pins: MapPin[]): [number, number] {
  if (pins.length === 0) {
    return [0, 0]; // Default center
  }
  
  const totalLat = pins.reduce((sum, pin) => sum + pin.lat, 0);
  const totalLng = pins.reduce((sum, pin) => sum + pin.lng, 0);
  
  return [totalLng / pins.length, totalLat / pins.length];
}

export function getMapBounds(pins: MapPin[]): [[number, number], [number, number]] | null {
  if (pins.length === 0) return null;
  
  const lats = pins.map(pin => pin.lat);
  const lngs = pins.map(pin => pin.lng);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  // Add some padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;
  
  return [
    [minLng - lngPadding, minLat - latPadding],
    [maxLng + lngPadding, maxLat + latPadding]
  ];
}

export function formatPrice(price: number | null): string {
  if (price === null || price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function getListingTypeColor(ltype: 'event' | 'hub'): string {
  return ltype === 'event' ? '#3B82F6' : '#10B981';
}

export function getListingTypeIcon(ltype: 'event' | 'hub'): string {
  return ltype === 'event' ? '🎉' : '🏠';
}

export function getVerificationColor(verify: 'pending' | 'verified' | 'rejected'): string {
  switch (verify) {
    case 'verified':
      return '#10B981'; // Green
    case 'pending':
      return '#F59E0B'; // Yellow/Orange
    case 'rejected':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
} 