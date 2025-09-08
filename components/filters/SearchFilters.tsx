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
  const [location, setLocation] = useState('');
  const [type, setType] = useState<ListingType | 'all'>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(true);
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
    const filters = {
      location,
      type,
      fromDate,
      toDate,
      verifiedOnly,
      coordinates: selectedLocation ? {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      } : undefined
    };
    onApply?.(filters);
  };

  const handleClear = () => {
    setLocation('');
    setSelectedLocation(null);
    setType('all');
    setFromDate('');
    setToDate('');
    setVerifiedOnly(true);
    onApply?.({
      location: '',
      type: 'all',
      fromDate: '',
      toDate: '',
      verifiedOnly: true
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

        {/* Verified Toggle */}
        <div className={isSticky ? 'md:col-span-1' : ''}>
          {isHero ? (
            <>
              <label className="block font-medium text-[var(--wl-ink)] mb-2">
                Verified only
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:ring-offset-2 ${
                    verifiedOnly ? 'bg-[var(--wl-forest)]' : 'bg-[var(--wl-slate)]'
                  }`}
                  role="switch"
                  aria-checked={verifiedOnly}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      verifiedOnly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="ml-2 text-sm text-[var(--wl-slate)]">
                  {verifiedOnly ? 'On' : 'Off'}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-[var(--wl-ink)] font-medium">
                Verified
              </label>
              <button
                type="button"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:ring-offset-1 ${
                  verifiedOnly ? 'bg-[var(--wl-forest)]' : 'bg-[var(--wl-slate)]'
                }`}
                role="switch"
                aria-checked={verifiedOnly}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    verifiedOnly ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}
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
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-[var(--wl-forest)] px-4 py-2 text-white font-medium shadow hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wl-sky)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Apply filters
        </button>
      </div>
    </form>
  );
} 