'use client';

import { useState } from 'react';
import { Filter, X, Calendar, CheckCircle } from 'lucide-react';
import type { ListingType } from '@/lib/validation';

interface CompactFilterBarProps {
  filters: {
    ltype?: ListingType;
    from?: string;
    to?: string;
    verified: 'all' | 'verified' | 'pending';
  };
  onFiltersChange: (filters: any) => void;
}

export default function CompactFilterBar({ filters, onFiltersChange }: CompactFilterBarProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

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
      verified: 'verified' // Default to verified
    });
  };

  const hasActiveFilters = filters.ltype || filters.from || filters.to || filters.verified !== 'verified';

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[var(--wl-border)] px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        {/* Type Filter */}
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium text-[var(--wl-slate)] whitespace-nowrap">Type:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => handleFilterChange('ltype', undefined)}
              className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                !filters.ltype
                  ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]'
                  : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('ltype', 'event')}
              className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                filters.ltype === 'event'
                  ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]'
                  : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => handleFilterChange('ltype', 'hub')}
              className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                filters.ltype === 'hub'
                  ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]'
                  : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10'
              }`}
            >
              Hubs
            </button>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium text-[var(--wl-slate)] whitespace-nowrap">Date:</span>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap flex items-center space-x-1 ${
              filters.from || filters.to
                ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]'
                : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>
              {filters.from && filters.to 
                ? `${new Date(filters.from).toLocaleDateString()} - ${new Date(filters.to).toLocaleDateString()}`
                : filters.from 
                ? `From ${new Date(filters.from).toLocaleDateString()}`
                : 'Any date'
              }
            </span>
          </button>
        </div>

        {/* Verification Filter */}
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium text-[var(--wl-slate)] whitespace-nowrap">Verified:</span>
          <div className="flex space-x-1">
            <button
              onClick={() => handleFilterChange('verified', 'verified')}
              className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap flex items-center space-x-1 ${
                filters.verified === 'verified'
                  ? 'bg-[var(--wl-forest)] text-[var(--wl-white)]'
                  : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-forest)]/10'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleFilterChange('verified', 'all')}
              className={`px-2 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                filters.verified === 'all'
                  ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]'
                  : 'bg-[var(--wl-beige)] text-[var(--wl-forest)] hover:bg-[var(--wl-sky)]/10'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-2 py-1 text-xs text-[var(--wl-coral)] bg-[var(--wl-coral)]/10 rounded-full hover:bg-[var(--wl-coral)]/20 transition-colors whitespace-nowrap flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Date Picker Dropdown */}
      {showDatePicker && (
        <div className="mt-3 p-3 bg-[var(--wl-beige)] rounded-lg border border-[var(--wl-border)]">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--wl-slate)] mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.from || ''}
                onChange={(e) => handleFilterChange('from', e.target.value || undefined)}
                className="w-full px-2 py-1 text-xs border border-[var(--wl-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--wl-sky)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--wl-slate)] mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.to || ''}
                onChange={(e) => handleFilterChange('to', e.target.value || undefined)}
                className="w-full px-2 py-1 text-xs border border-[var(--wl-border)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--wl-sky)]"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setShowDatePicker(false)}
              className="px-3 py-1 text-xs bg-[var(--wl-forest)] text-white rounded hover:bg-[var(--wl-forest)]/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 