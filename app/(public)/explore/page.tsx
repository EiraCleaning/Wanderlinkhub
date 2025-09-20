'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import HeroExplore from '@/components/HeroExplore';
import StickyFilters from '@/components/StickyFilters';
import MapView from '@/components/MapView';
import MapPinPopup from '@/components/MapPinPopup';
import { useStickyOnScroll } from '@/components/hooks/useStickyOnScroll';
import { ListingCard, ListingCardSkeleton } from '@/components/listing';
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
  const [shouldScrollToMap, setShouldScrollToMap] = useState(false);
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

  // Handle scroll to map after data loads
  useEffect(() => {
    if (shouldScrollToMap && !isLoading && typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const mapSection = document.querySelector('section:first-of-type');
        if (mapSection) {
          mapSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
        setShouldScrollToMap(false); // Reset the flag
      }, 300); // Small delay to ensure map is rendered
    }
  }, [isLoading, shouldScrollToMap]);

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
    
    // Geo filters - only for city-level searches (multi-part location strings)
    const isCitySearch = filters.location && filters.location.split(',').length > 1;
    const hasValidCoords = filters.coordinates && 
      filters.coordinates.lat != null && 
      filters.coordinates.lng != null &&
      filters.coordinates.lat !== 0 && 
      filters.coordinates.lng !== 0;
    
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
      
      // Debug logging
      console.debug('[SEARCH] request params', JSON.stringify({
        location: filters.location,
        coordinates: filters.coordinates,
        type: filters.type,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        verifiedOnly: filters.verifiedOnly,
        builtParams: params
      }, null, 2));
      console.debug('[SEARCH] URL', url);
      
      const response = await fetch(url);
      
      // Check if this is still the latest request
      if (requestId !== requestIdRef.current) {
        console.debug('[SEARCH] Stale response ignored, requestId:', requestId);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings || []);
      } else {
        console.error('Explore: API response not ok:', response.status);
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

  const handleFiltersApply = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Set flag to scroll to map after data loads
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShouldScrollToMap(true);
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
  const mapListingToCardProps = (listing: ListingResponse & { distance?: number }) => ({
    id: listing.id,
    type: listing.ltype,
    title: listing.title,
    city: listing.city || undefined,
    country: listing.country || undefined,
    startDate: listing.start_date || undefined,
    endDate: listing.end_date || undefined,
    price: listing.price ? formatPrice(listing.price) : undefined,
    status: listing.verify === 'rejected' ? 'pending' : listing.verify,
    imageUrl: listing.photos && listing.photos.length > 0 ? listing.photos[0] : undefined,
    href: `/listing/${listing.id}`,
    distance: listing.distance,
  });

  return (
    <AppShell>
      <div ref={sentinelRef}>
        <HeroExplore onFiltersApply={handleFiltersApply} />
      </div>
      
      <StickyFilters visible={stuck} onFiltersApply={handleFiltersApply} />
      
      {/* Map Section */}
      <section className="min-h-[70vh] p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4">
            <h2 className="text-xl font-semibold text-[var(--wl-ink)] mb-4 brand-heading">
              Explore Listings
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 text-[var(--wl-slate)]">
                <p className="text-lg">No listings found</p>
                <p className="text-sm">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <MapView 
                listings={listings} 
                onPinClick={handlePinClick}
                className="h-96 md:h-[600px]"
                center={filters.coordinates}
              />
            )}
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4">
            <h2 className="text-xl font-semibold text-[var(--wl-ink)] mb-4 brand-heading">
              All Listings ({listings.length})
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 text-[var(--wl-slate)]">
                <p className="text-lg">No listings found</p>
                <p className="text-sm">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {listings.map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    {...mapListingToCardProps(listing)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Pin Popup */}
      {selectedListing && (
        <MapPinPopup
          listing={selectedListing}
          onClose={handleClosePopup}
          onViewDetails={handleViewDetails}
        />
      )}
    </AppShell>
  );
} 