'use client';

import { useEffect, useRef } from 'react';
import { scrollAfterLayout } from '@/lib/scrollAfterUpdate';
import MapView from '@/components/MapView';
import { ListingCard } from '@/components/listing/ListingCard';
import { ListingResponse } from '@/lib/validation';

type Props = { 
  isLoading: boolean; 
  items: ListingResponse[]; 
  shouldScrollAfterApply?: boolean;
  onPinClick?: (listing: ListingResponse) => void;
  center?: { lat: number; lng: number };
};

export default function ListingsSection({ 
  isLoading, 
  items, 
  shouldScrollAfterApply,
  onPinClick,
  center
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);

  // Data-ready effect
  useEffect(() => {
    if (!shouldScrollAfterApply) return;
    if (scrolledRef.current) return;
    if (isLoading) return;
    if (!items?.length) return;

    const el = ref.current;
    if (!el) return;

    const cancel = scrollAfterLayout(el, { maxWaitMs: 1500 });
    scrolledRef.current = true;
    return cancel;
  }, [isLoading, items?.length, shouldScrollAfterApply]);

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
      price: listing.price ? `$${listing.price}` : undefined,
      status: listing.verify === 'rejected' ? 'pending' : listing.verify,
      imageUrl,
      href: `/listing/${listing.id}`,
      distance: listing.distance,
    };
  };

  return (
    <section 
      id="listings-section" 
      ref={ref}
      data-listings-loading={isLoading ? 'true' : 'false'}
      className="min-h-[70vh] p-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4">
          <h2 className="text-xl font-semibold text-[var(--wl-ink)] mb-4 brand-heading">
            Explore Listings
          </h2>
          {isLoading ? (
            <div className="h-96 md:h-[600px] bg-[var(--wl-beige)] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--wl-forest)] mx-auto mb-2"></div>
                <p className="text-[var(--wl-slate)]">Loading map...</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-[var(--wl-slate)]">
              <p className="text-lg">No listings found</p>
              <p className="text-sm">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <MapView 
              listings={items} 
              onPinClick={onPinClick}
              className="h-96 md:h-[600px]"
              center={center}
            />
          )}
        </div>
      </div>

      {/* All Listings Grid */}
      <div className="p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4">
            <h2 className="text-xl font-semibold text-[var(--wl-ink)] mb-4 brand-heading">
              All Listings ({items.length})
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card overflow-hidden animate-pulse">
                    <div className="grid md:grid-cols-[224px,1fr,160px]">
                      <div className="bg-[var(--wl-beige)] aspect-[16/10] md:aspect-auto md:h-full md:min-h-[172px]"></div>
                      <div className="p-4 md:p-5 flex flex-col gap-2">
                        <div className="h-5 w-2/3 bg-[var(--wl-border)] rounded mb-3"></div>
                        <div className="h-4 w-24 bg-[var(--wl-border)] rounded mb-2"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-40 bg-[var(--wl-border)] rounded"></div>
                          <div className="h-3 w-32 bg-[var(--wl-border)] rounded"></div>
                          <div className="h-3 w-28 bg-[var(--wl-border)] rounded"></div>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center justify-center md:border-l md:border-[var(--wl-border)] p-5">
                        <div className="h-10 w-full bg-[var(--wl-border)] rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-[var(--wl-slate)]">
                <p className="text-lg">No listings found</p>
                <p className="text-sm">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {items.map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    {...mapListingToCardProps(listing)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
