'use client';

import { useState, useEffect, useRef } from 'react';

export const dynamic = 'force-dynamic';
import AppShell from '@/components/AppShell';
import HeroExplore from '@/components/HeroExplore';
import StickyFilters from '@/components/StickyFilters';
import MapPinPopup from '@/components/MapPinPopup';
import { useStickyOnScroll } from '@/components/hooks/useStickyOnScroll';
import { ListingCard, ListingCardSkeleton } from '@/components/listing';
import ListingsSection from '@/components/explore/ListingsSection';
import type { ListingResponse } from '@/lib/validation';
import { formatPrice } from '@/lib/map';

type FilterState = {
  location: string;
  type: 'all' | 'event' | 'hub';
  fromDate: string;
  toDate: string;
  verifiedOnly: boolean;
  coordinates?: { lat: number; lng: number };
};

export default function ExplorePage() {
  const { stuck, sentinelRef } = useStickyOnScroll();
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<ListingResponse | null>(null);
  const [shouldScrollAfterApply, setShouldScrollAfterApply] = useState(false);
  const requestIdRef = useRef(0);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    type: 'all',
    fromDate: '',
    toDate: '',
    verifiedOnly: false,
    coordinates: undefined
  });

  useEffect(() => {
    fetchListings();
  }, []); // Fetch on mount

  useEffect(() => {
    fetchListings();
  }, [filters]); // Refetch when filters change

  // Bullet-proof query builder
  const buildQuery = (filters: FilterState) => {
    const params: Record<string, string> = {};
    
    // Text search
    if (filters.location?.trim()) {
      params.location = filters.location.trim();
    }
    
    // Type filter
    if (filters.type !== 'all') {
      params.ltype = filters.type;
    }
    
    // Date filters
    if (filters.fromDate) {
      params.from = filters.fromDate;
    }
    if (filters.toDate) {
      params.to = filters.toDate;
    }
    
    // Geo filters - only send coordinates for city searches (multi-part location strings)
    // For country searches, rely on text filtering only to avoid coordinate processing issues
    const isCitySearch = filters.location && filters.location.split(',').length > 1;
    const hasValidCoords = filters.coordinates && 
      filters.coordinates.lat != null && 
      filters.coordinates.lng != null &&
      filters.coordinates.lat !== 0 && 
      filters.coordinates.lng !== 0;
    
    // Only use coordinates for city searches to avoid backend coordinate processing issues
    if (isCitySearch && hasValidCoords) {
      params.near = `${filters.coordinates.lng},${filters.coordinates.lat}`;
      params.radiusKm = '50'; // 50km radius for cities
    }
    
    return params;
  };

  const fetchListings = async () => {
    const requestId = ++requestIdRef.current;
    
    try {
      const params = buildQuery(filters);
      const url = `/api/listings?${new URLSearchParams(params).toString()}`;
      
      const response = await fetch(url, { 
        method: 'GET',
        cache: 'no-store'
      });
      
      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings || []);
      } else {
        console.error('Error fetching listings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      // Only update loading state if this is still the latest request
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleFiltersApply = (newFilters: FilterState, opts?: { scrollAfter?: boolean }) => {
    setFilters(newFilters);
    if (opts?.scrollAfter) {
      setShouldScrollAfterApply(true);
      // Reset the flag after a delay to allow for repeated scrolls
      setTimeout(() => setShouldScrollAfterApply(false), 1500);
    }
  };

  const handlePinClick = (listing: ListingResponse) => {
    // Show popup with listing details
    setSelectedListing(listing);
  };

  const handleViewDetails = (listing: ListingResponse) => {
    // Navigate to listing detail page
    window.location.href = `/listing/${listing.id}`;
  };

  const handleClosePopup = () => {
    setSelectedListing(null);
  };

  // Helper function to map ListingResponse to ListingCard props
  const mapListingToCardProps = (listing: ListingResponse & { distance?: number }) => {
    const imageUrl = listing.photos && listing.photos.length > 0 ? listing.photos[0] : undefined;
    return {
      id: listing.id,
      type: listing.ltype,
      title: listing.title,
      city: listing.city || undefined,
      country: listing.country || undefined,
      startDate: listing.start_date || undefined,
      endDate: listing.end_date || undefined,
      price: listing.price ? formatPrice(listing.price) : undefined,
      status: listing.verify === 'rejected' ? 'pending' : listing.verify,
      imageUrl,
      href: `/listing/${listing.id}`,
      distance: listing.distance,
    };
  };

  return (
    <AppShell>
      <div ref={sentinelRef}>
        <HeroExplore onFiltersApply={handleFiltersApply} />
      </div>
      
      <StickyFilters visible={stuck} onFiltersApply={handleFiltersApply} />
      
      <ListingsSection
        isLoading={isLoading}
        items={listings}
        shouldScrollAfterApply={shouldScrollAfterApply}
        onPinClick={handlePinClick}
        center={filters.coordinates || undefined}
      />

      {/* Map Pin Popup */}
      {selectedListing && (
        <MapPinPopup
          listing={selectedListing}
          onViewDetails={handleViewDetails}
          onClose={handleClosePopup}
        />
      )}
    </AppShell>
  );
}