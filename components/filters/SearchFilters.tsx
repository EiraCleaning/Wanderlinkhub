'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, CheckCircle, X } from 'lucide-react';
import Geocoder from '@/components/Geocoder';
import type { ListingType } from '@/lib/validation';

interface SearchFiltersProps {
  variant?: 'hero' | 'sticky';
  onApply?: (filters: {
    location: string;
    type: ListingType | 'all';
    fromDate: string;
    toDate: string;
    verifiedOnly: boolean;
    coordinates?: {
      lat: number;
      lng: number;
    } | undefined;
  }) => void;
}

export default function SearchFilters({ variant = 'hero', onApply }: SearchFiltersProps) {
  console.log('🔧 SearchFilters component loaded, variant:', variant, 'onApply:', !!onApply);
  const [location, setLocation] = useState('');
  const [type, setType] = useState<ListingType | 'all'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  // Location state for Geocoder
  const [selectedLocation, setSelectedLocation] = useState<{
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
  } | null>(null);

  const isHero = variant === 'hero';
  const isSticky = variant === 'sticky';

  // Handle location selection from Geocoder
  const handleLocationSelect = (location: {
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
  }) => {
    setSelectedLocation(location);
    // Create a location string for the filter
    const locationString = [location.city, location.region, location.country]
      .filter(Boolean)
      .join(', ');
    setLocation(locationString);
  };

  const handleApply = () => {
    console.log('🔧 handleApply called!');
    const filters = {
      location,
      type,
      fromDate,
      toDate,
      verifiedOnly: false, // Always false since we removed verification
      coordinates: selectedLocation ? {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      } : undefined
    };
    console.log('🔧 Calling onApply with filters:', filters);
    onApply?.(filters);
  };

  const handleClear = () => {
    setLocation('');
    setSelectedLocation(null);
    setType('all');
    setFromDate('');
    setToDate('');
    onApply?.({
      location: '',
      type: 'all',
      fromDate: '',
      toDate: '',
      verifiedOnly: false
    });
  };


  return (
    <form 
      className="space-y-4" 
      role="search" 
      aria-label="Filter listings"
      suppressHydrationWarning
      onSubmit={(e) => {
        e.preventDefault();
        handleApply();
      }}
    >
      {/* Grid Layout */}
      <div className={`grid gap-3 ${
        isHero 
          ? 'sm:grid-cols-2 md:grid-cols-4' 
          : 'grid-cols-2 md:grid-cols-4'
      }`}>
        
        {/* Location Input */}
        <div className={isSticky ? 'md:col-span-2' : ''}>
          <label className={`block font-medium ${
            isHero ? 'text-[var(--wl-ink)] mb-2' : 'text-[var(--wl-ink)] text-sm mb-1'
          }`}>
            {isHero ? 'Location' : 'Location'}
          </label>
          <Geocoder
            onLocationSelect={handleLocationSelect}
            initialCity={selectedLocation?.city || ''}
            initialRegion={selectedLocation?.region || ''}
            initialCountry={selectedLocation?.country || ''}
          />
        </div>

        {/* Type Select */}
        <div>
          <label className={`block font-medium ${
            isHero ? 'text-[var(--wl-ink)] mb-2' : 'text-[var(--wl-ink)] text-sm mb-1'
          }`}>
            {isHero ? 'Type' : 'Type'}
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ListingType | 'all')}
            className={`w-full px-3 border border-[var(--wl-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:border-[var(--wl-sky)] ${
              isHero ? 'py-3' : 'py-2'
            }`}
          >
            <option value="all">All</option>
            <option value="event">Event</option>
            <option value="hub">Hub</option>
          </select>
        </div>

        {/* Date Range */}
        <div className={isSticky ? 'md:col-span-2' : ''}>
          <label className={`block font-medium ${
            isHero ? 'text-[var(--wl-ink)] mb-2' : 'text-[var(--wl-ink)] text-sm mb-1'
          }`}>
            {isHero ? 'Date range' : 'Dates'}
          </label>
          <div className={`grid gap-2 ${
            isSticky ? 'grid-cols-2' : 'grid-cols-2'
          }`}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              suppressHydrationWarning
              className={`w-full px-3 border border-[var(--wl-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:border-[var(--wl-sky)] ${
                isHero ? 'py-3' : 'py-2'
              }`}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              suppressHydrationWarning
              className={`w-full px-3 border border-[var(--wl-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:border-[var(--wl-sky)] ${
                isHero ? 'py-3' : 'py-2'
              }`}
            />
          </div>
        </div>

      </div>

      {/* Actions Row */}
      <div className={`flex gap-2 justify-end ${
        isHero ? 'mt-6' : 'mt-3'
      }`}>
        <button
          type="button"
          onClick={handleClear}
          className={`inline-flex items-center justify-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wl-sky)] ${
            isHero 
              ? 'px-3 py-2 text-[var(--wl-forest)] hover:text-[var(--wl-sky)]' 
              : 'px-2 py-1 text-sm text-[var(--wl-forest)]/80 hover:text-[var(--wl-sky)]'
          }`}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center justify-center rounded-2xl bg-[var(--wl-forest)] px-4 py-2 text-white font-medium shadow hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wl-sky)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
} 