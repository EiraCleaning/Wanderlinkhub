'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ListingResponse } from '@/lib/validation';
import type { MapPin } from '@/lib/map';
import { listingsToMapPins, getMapBounds } from '@/lib/map';

interface MapViewProps {
  listings: ListingResponse[];
  onPinClick: (listing: ListingResponse) => void;
  className?: string;
  center?: {
    lat: number;
    lng: number;
  };
}

export default function MapView({ listings, onPinClick, className = '', center }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken || mapboxToken === 'your_mapbox_token_here') {
      console.error('Mapbox token not found or invalid');
      setMapLoaded(true); // Set loaded to show placeholder
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center ? [center.lng, center.lat] : [-98.5795, 39.8283], // Use provided center or default to USA center
      zoom: center ? 10 : 4, // Zoom in more if center is provided
      attributionControl: false,
      trackResize: true
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Test: Add a simple marker to verify map is working
      const testMarker = new mapboxgl.Marker()
        .setLngLat([-74.006, 40.7128]) // New York coordinates
        .addTo(map.current!);
      
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) {
      return;
    }

    
    const pins = listingsToMapPins(listings);
    
    // Remove existing markers properly
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (pins.length === 0) return;

    // Fit map to bounds if we have pins
    const bounds = getMapBounds(pins);
    if (bounds) {
      map.current.fitBounds(bounds, { padding: 50 });
    } else {
    }

    // Add markers for each pin
    pins.forEach((pin) => {
      
      // Create Mapbox default marker with custom color
      const marker = new mapboxgl.Marker({
        color: pin.verify === 'verified' ? '#2E5D50' : '#E0A628' // Forest green for verified, Sand for pending
      })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map.current!);
      
      // Add click handler
      marker.getElement().addEventListener('click', () => {
        const listing = listings.find(l => l.id === pin.id);
        if (listing) {
          onPinClick(listing);
        }
      });

      // Add aria-label for accessibility
      marker.getElement().setAttribute('aria-label', `${pin.title} - ${pin.verify === 'verified' ? 'Verified' : 'Pending'} ${pin.ltype === 'event' ? 'Event' : 'Hub'}`);
      
      markersRef.current.push(marker);
      
    });
  }, [listings, mapLoaded, onPinClick]);

  // Update map center when center prop changes
  useEffect(() => {
    if (!map.current || !mapLoaded || !center) {
      return;
    }

    map.current.flyTo({
      center: [center.lng, center.lat],
      zoom: 10,
      duration: 1000
    });
  }, [center, mapLoaded]);

  const hasMapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN && 
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN !== 'your_mapbox_token_here';

  return (
    <div className={`relative ${className}`}>
      {hasMapboxToken ? (
        <>
          <div 
            ref={mapContainer} 
            className="w-full h-full min-h-[400px] rounded-lg overflow-hidden"
          />
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-500">Loading map...</div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full min-h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Map not available</div>
            <div className="text-sm text-gray-400">
              Mapbox token not configured
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 max-w-md">
              <div className="text-sm text-gray-600 mb-2">
                To enable the map, add your Mapbox token to <code className="bg-gray-100 px-1 rounded">.env.local</code>:
              </div>
              <code className="block bg-gray-100 p-2 rounded text-xs">
                NEXT_PUBLIC_MAPBOX_TOKEN=your_actual_token_here
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}