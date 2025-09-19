'use client';

import { useState } from 'react';
import { X, MapPin, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import type { ListingResponse } from '@/lib/validation';
import { formatPrice } from '@/lib/map';

interface MapPinPopupProps {
  listing: ListingResponse;
  onClose: () => void;
  onViewDetails: (listing: ListingResponse) => void;
}

export default function MapPinPopup({ listing, onClose, onViewDetails }: MapPinPopupProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    try {
      return new Intl.DateTimeFormat(undefined, { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }).format(new Date(dateString));
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateRange = () => {
    if (listing.is_permanent === true) {
      return "Always Open";
    }
    
    if (!listing.start_date) return 'Date not specified';
    
    if (listing.end_date && listing.start_date !== listing.end_date) {
      return `${formatDate(listing.start_date)} - ${formatDate(listing.end_date)}`;
    }
    
    return formatDate(listing.start_date);
  };

  const getLocationText = () => {
    const parts = [listing.city, listing.region, listing.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-[var(--wl-forest)]" />
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {listing.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Image */}
        {listing.photos && listing.photos.length > 0 && (
          <div className="aspect-video bg-gray-100">
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Type Badge */}
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              listing.ltype === 'event' 
                ? 'bg-[var(--wl-sky)] text-white' 
                : 'bg-[var(--wl-sand)] text-white'
            }`}>
              {listing.ltype}
            </span>
          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {listing.description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDateRange()}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{getLocationText()}</span>
            </div>
            
            {listing.price && (
              <div className="flex items-center space-x-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>{formatPrice(listing.price)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => onViewDetails(listing)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
