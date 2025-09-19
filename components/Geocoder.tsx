'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';

interface GeocoderProps {
  onLocationSelect: (location: {
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
  initialCity?: string;
  initialRegion?: string;
  initialCountry?: string;
}

interface GeocodingResult {
  place_name: string;
  center: [number, number];
  context: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

export default function Geocoder({ 
  onLocationSelect, 
  initialCity = '', 
  initialRegion = '', 
  initialCountry = '' 
}: GeocoderProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
  } | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with provided values
  useEffect(() => {
    if (initialCity || initialRegion || initialCountry) {
      setQuery([initialCity, initialRegion, initialCountry].filter(Boolean).join(', '));
    }
  }, [initialCity, initialRegion, initialCountry]);

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setResults([]);
      return;
    }

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!mapboxToken || mapboxToken === 'your_mapbox_token_here') {
      console.warn('Mapbox token not available for geocoding');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&types=country,place,locality,neighborhood&limit=8`
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.features || []);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowResults(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleResultSelect = (result: GeocodingResult) => {
    // Safety check for context array
    if (!result.context || !Array.isArray(result.context)) {
      console.warn('Invalid result context:', result);
      return;
    }
    
    // Parse location components
    const city = result.context.find(ctx => ctx.id.startsWith('place'))?.text || '';
    const region = result.context.find(ctx => ctx.id.startsWith('region'))?.text || '';
    const country = result.context.find(ctx => ctx.id.startsWith('country'))?.text || '';
    
    // Check if this is a country-level result
    const isCountry = result.place_name.includes('country') || 
                     (result.context.length === 1 && result.context[0].id.startsWith('country'));
    
    const location = {
      city: isCountry ? '' : (city || result.place_name.split(',')[0]),
      region: isCountry ? '' : (region || ''),
      country: country || (isCountry ? result.place_name : ''),
      lat: result.center[1],
      lng: result.center[0]
    };
    
    setSelectedLocation(location);
    setQuery(result.place_name);
    setShowResults(false);
    onLocationSelect(location);
  };

  const clearLocation = () => {
    setQuery('');
    setSelectedLocation(null);
    setResults([]);
    setShowResults(false);
    onLocationSelect({
      city: '',
      region: '',
      country: '',
      lat: 0,
      lng: 0
    });
  };

  const handleInputFocus = () => {
    if (query.length >= 3) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[var(--wl-slate)]" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search for a country, city, or location..."
          className="w-full pl-10 pr-10 py-2 border border-[var(--wl-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:border-[var(--wl-sky)]"
        />
        
        {query && (
          <button
            onClick={clearLocation}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-[var(--wl-slate)] hover:text-[var(--wl-ink)]" />
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (results.length > 0 || isSearching) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--wl-border)] rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-[var(--wl-slate)]">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--wl-sky)] mx-auto mb-2"></div>
              Searching...
            </div>
          ) : (
            <div className="py-1">
              {results.map((result, index) => {
                // Safety check for context array
                if (!result.context || !Array.isArray(result.context)) {
                  return null;
                }
                
                const isCountry = result.place_name.includes('country') || 
                                 (result.context.length === 1 && result.context[0].id.startsWith('country'));
                const country = result.context.find(ctx => ctx.id.startsWith('country'))?.text || '';
                
                return (
                  <button
                    key={index}
                    onClick={() => handleResultSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-[var(--wl-beige)] focus:bg-[var(--wl-beige)] focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:ring-inset"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-[var(--wl-slate)] mr-2 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-[var(--wl-ink)] truncate">
                          {result.place_name}
                        </div>
                        {isCountry && (
                          <div className="text-xs text-[var(--wl-slate)] mt-1">
                            🌍 Country
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="mt-3 p-3 bg-[var(--wl-beige)] rounded-md border border-[var(--wl-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-[var(--wl-forest)] mr-2" />
              <div>
                <div className="text-sm font-medium text-[var(--wl-ink)]">
                  {selectedLocation.city && selectedLocation.region && selectedLocation.country
                    ? `${selectedLocation.city}, ${selectedLocation.region}, ${selectedLocation.country}`
                    : selectedLocation.country
                    ? `🌍 ${selectedLocation.country}`
                    : `${selectedLocation.city}${selectedLocation.region ? `, ${selectedLocation.region}` : ''}${selectedLocation.country ? `, ${selectedLocation.country}` : ''}`
                  }
                </div>
                <div className="text-xs text-[var(--wl-slate)]">
                  {selectedLocation.city ? 'City/Region' : 'Country'} • Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </div>
              </div>
            </div>
            <button
              onClick={clearLocation}
              className="text-[var(--wl-slate)] hover:text-[var(--wl-ink)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 