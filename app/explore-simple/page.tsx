'use client';

import { useEffect, useState } from 'react';
import { MapPin, List, Map } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import ListingFilters from '@/components/ListingFilters';
import DetailSheet from '@/components/DetailSheet';
import BottomNav from '@/components/BottomNav';
import type { ListingResponse } from '@/lib/validation';

export default function ExploreSimplePage() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [selectedListing, setSelectedListing] = useState<ListingResponse | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [filters, setFilters] = useState({
    ltype: undefined as 'event' | 'hub' | undefined,
    from: undefined as string | undefined,
    to: undefined as string | undefined,
    verified: 'all' as 'all' | 'verified' | 'pending'
  });

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, filters]);

  const fetchListings = async () => {
    try {
      console.log('ExploreSimplePage: Fetching listings...');
      const response = await fetch('/api/listings');
      console.log('ExploreSimplePage: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('ExploreSimplePage: Data received:', data);
        setListings(data.listings || []);
      } else {
        console.error('ExploreSimplePage: Response not ok:', response.status);
      }
    } catch (error) {
      console.error('ExploreSimplePage: Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    // Apply verification filter
    if (filters.verified === 'verified') {
      filtered = filtered.filter(listing => listing.verify === 'verified');
    } else if (filters.verified === 'pending') {
      filtered = filtered.filter(listing => listing.verify === 'pending');
    }

    // Apply type filter
    if (filters.ltype) {
      filtered = filtered.filter(listing => listing.ltype === filters.ltype);
    }

    // Apply date filters
    if (filters.from) {
      filtered = filtered.filter(listing => 
        listing.start_date && listing.start_date >= filters.from!
      );
    }

    if (filters.to) {
      filtered = filtered.filter(listing => 
        listing.end_date && listing.end_date <= filters.to!
      );
    }

    setFilteredListings(filtered);
  };

  const handlePinClick = (listing: ListingResponse) => {
    setSelectedListing(listing);
    setIsDetailSheetOpen(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore</h1>
          <p className="text-gray-600">Discover family-friendly events and hubs</p>
        </div>

        {/* Filters */}
        <ListingFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          className="mb-6"
        />

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Map
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              filteredListings.map((listing) => (
                <div key={listing.id} onClick={() => handlePinClick(listing)}>
                  <ListingCard
                    listing={listing}
                    showStatus={true}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600">Map view is disabled in this simplified version.</p>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      {isDetailSheetOpen && selectedListing && (
        <DetailSheet
          listing={selectedListing}
          isOpen={isDetailSheetOpen}
          onClose={() => setIsDetailSheetOpen(false)}
        />
      )}

      <BottomNav />
    </div>
  );
} 