'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { ListingResponse } from '@/lib/validation';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  listings: ListingResponse[];
  onListingSelect: (listing: ListingResponse) => void;
}

export default function BottomSheet({ isOpen, onClose, listings, onListingSelect }: BottomSheetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setTranslateY(0);
    } else {
      setTranslateY(100);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    
    if (diff > 0) { // Only allow downward drag
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (translateY > 100) { // If dragged down more than 100px, close
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateRange = (startDate: string | null, endDate: string | null, isPermanent: boolean = false) => {
    // Check for permanent hubs first
    if (isPermanent === true) {
      return 'Always Open';
    }
    
    if (!startDate) return 'Date not specified';
    
    if (endDate && startDate !== endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    
    return formatDate(startDate);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl"
        style={{
          transform: `translateY(${typeof translateY === 'number' ? translateY : 0}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="px-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--wl-ink)]">
              {listings.length} Listing{listings.length !== 1 ? 's' : ''} Found
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div 
          className="max-h-[70vh] overflow-y-auto px-4 py-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white border border-[var(--wl-border)] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onListingSelect(listing)}
              >
                {/* Header with Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {listing.ltype === 'event' ? '🎉' : '🏠'}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      listing.ltype === 'event' 
                        ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
                        : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                    }`}>
                      {listing.ltype === 'event' ? 'Event' : 'Hub'}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    listing.verify === 'verified' 
                      ? 'bg-[var(--wl-forest)] text-[var(--wl-white)]'
                      : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                  }`}>
                    {listing.verify}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-[var(--wl-ink)] mb-2 line-clamp-2">
                  {listing.title}
                </h3>

                {/* Description */}
                {listing.description && (
                  <p className="text-[var(--wl-slate)] text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-2 text-sm text-[var(--wl-slate)] mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateRange(listing.start_date, listing.end_date, listing.is_permanent)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {listing.city}
                      {listing.region && `, ${listing.region}`}
                      {listing.country && `, ${listing.country}`}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>View Details</span>
                  </Link>
                  
                  {listing.website_url && (
                    <a
                      href={listing.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-3 py-2 text-[var(--wl-sky)] hover:text-[var(--wl-sky)]/80 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 