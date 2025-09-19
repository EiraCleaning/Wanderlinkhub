'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { ListingResponse } from '@/lib/validation';
import { formatPrice, getListingTypeIcon } from '@/lib/map';

interface ListingCardProps {
  listing: ListingResponse;
  showStatus?: boolean;
}

export default function ListingCard({ listing, showStatus = false }: ListingCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateRange = () => {
    // Check for permanent hubs first
    if (listing.is_permanent === true) {
      return "Always Open";
    }
    
    // For non-permanent listings, check dates
    if (!listing.start_date) return 'Date not specified';
    
    if (listing.end_date && listing.start_date !== listing.end_date) {
      return `${formatDate(listing.start_date)} - ${formatDate(listing.end_date)}`;
    }
    
    return formatDate(listing.start_date);
  };

  const handleCardClick = () => {
    window.location.href = `/listing/${listing.id}`;
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--wl-border)] overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Left: Image (16:9 aspect ratio, height matches card content) */}
        <div className="w-full sm:w-auto flex-shrink-0">
          {listing.photos && listing.photos.length > 0 ? (
            <img 
              src={listing.photos[0]} 
              alt={`${listing.title} - Featured photo`}
              className="w-full object-cover"
              style={{ 
                aspectRatio: '16/9',
                height: '100%'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full flex items-center justify-center text-[var(--wl-slate)] bg-[var(--wl-slate)]/20" style="aspect-ratio: 16/9; height: 100%;">
                      <div class="text-center">
                        <div class="text-2xl mb-1">📷</div>
                        <div class="text-xs">Photo</div>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          ) : (
            <div className="w-full flex items-center justify-center text-[var(--wl-slate)] bg-[var(--wl-slate)]/20" style={{ aspectRatio: '16/9', height: '100%' }}>
              <div className="text-center">
                <div className="text-2xl mb-1">📷</div>
                <div className="text-xs">No photo</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Top section: Title, type, status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-[var(--wl-ink)] text-lg line-clamp-2 mb-2">
                {listing.title}
              </h3>
              
              <div className="flex items-center space-x-2 mb-2 flex-wrap">
                <span className="text-2xl">{getListingTypeIcon(listing.ltype)}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  listing.ltype === 'event' 
                    ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
                    : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                }`}>
                  {listing.ltype}
                </span>
                
              </div>
            </div>
          </div>

          {/* Middle section: Essential info */}
          <div className="space-y-2 text-sm text-[var(--wl-slate)] mb-4">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4">📅</span>
              <span className={listing.is_permanent ? "font-medium text-[var(--wl-forest)]" : ""}>
                {formatDateRange()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4">📍</span>
              <span className="line-clamp-1">
                {listing.city}
                {listing.region && `, ${listing.region}`}
                {listing.country && `, ${listing.country}`}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="w-4 h-4">💰</span>
              <span className="font-medium">{formatPrice(listing.price)}</span>
            </div>
          </div>

          {/* Bottom section: View more button */}
          <div className="flex justify-end">
            <button
              onClick={handleCardClick}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--wl-forest)] text-white text-sm font-medium rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors"
            >
              <span>View More</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 