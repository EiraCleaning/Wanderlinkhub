'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { ListingType } from '@/lib/validation';

interface ListingFiltersProps {
  filters: {
    ltype?: ListingType;
    from?: string;
    to?: string;
    verified: 'all' | 'verified' | 'pending';
  };
  onFiltersChange: (filters: any) => void;
  className?: string;
}

export default function ListingFilters({ filters, onFiltersChange, className = '' }: ListingFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      ltype: undefined,
      from: undefined,
      to: undefined,
      verified: 'all'
    });
  };

  const hasActiveFilters = filters.ltype || filters.from || filters.to || filters.verified !== 'all';

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-[var(--wl-border)] rounded-lg hover:bg-[var(--wl-beige)] transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-[var(--wl-sky)] rounded-full"></span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-[var(--wl-ink)]">Filter Listings</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--wl-slate)] hover:text-[var(--wl-forest)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--wl-slate)] mb-2">
                Type
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('ltype', undefined)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    !filters.ltype
                      ? 'bg-[var(--wl-sky)]/20 text-[var(--wl-sky)]'
                      : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10 hover:text-[var(--wl-sky)]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('ltype', 'event')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.ltype === 'event'
                      ? 'bg-[var(--wl-sky)]/20 text-[var(--wl-sky)]'
                      : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10 hover:text-[var(--wl-sky)]'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => handleFilterChange('ltype', 'hub')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.ltype === 'hub'
                      ? 'bg-[var(--wl-sky)]/20 text-[var(--wl-sky)]'
                      : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10 hover:text-[var(--wl-sky)]'
                  }`}
                >
                  Hubs
                </button>
              </div>
            </div>

            {/* Date Range Filter */}
                          <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[var(--wl-slate)] mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.from || ''}
                    onChange={(e) => handleFilterChange('from', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-[var(--wl-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--wl-slate)] mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.to || ''}
                    onChange={(e) => handleFilterChange('to', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-[var(--wl-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)]"
                  />
                </div>
              </div>

            {/* Verification Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--wl-slate)] mb-2">
                Verification Status
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('verified', 'all')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.verified === 'all'
                      ? 'bg-[var(--wl-sky)]/20 text-[var(--wl-sky)]'
                      : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10 hover:text-[var(--wl-sky)]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange('verified', 'verified')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.verified === 'verified'
                      ? 'bg-[var(--wl-sky)]/20 text-[var(--wl-sky)]'
                      : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10 hover:text-[var(--wl-sky)]'
                  }`}
                >
                  Verified
                </button>
                <button
                  onClick={() => handleFilterChange('verified', 'pending')}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filters.verified === 'pending'
                      ? 'bg-[var(--wl-sky)]/20 text-[var(--wl-sky)]'
                      : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10 hover:text-[var(--wl-sky)]'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 text-sm text-[var(--wl-white)] bg-[var(--wl-sand)] rounded-md hover:bg-[var(--wl-sand)]/90 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-sm text-white bg-[var(--wl-forest)] rounded-md hover:bg-[var(--wl-forest)]/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 