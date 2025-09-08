'use client';

import Image from 'next/image';
import SearchFilters from './filters/SearchFilters';

interface HeroExploreProps {
  children?: React.ReactNode;
  onFiltersApply?: (filters: {
    location: string;
    type: 'all' | 'event' | 'hub';
    fromDate: string;
    toDate: string;
    verifiedOnly: boolean;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }) => void;
}

export default function HeroExplore({ children, onFiltersApply }: HeroExploreProps) {
  return (
    <section className="relative w-full bg-[var(--wl-beige)] min-h-[240px] sm:min-h-[320px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Beautiful landscape for WanderLink Hub"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--wl-forest)]/45" />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 pt-8 sm:pt-12 pb-4 sm:pb-8">
        <h1 className="text-white text-3xl sm:text-4xl font-semibold drop-shadow">
          Explore the world, together
        </h1>
        <p className="text-white/90 mt-2">
          Join a global network of verified hubs and family-friendly adventures where learning and community meet.
        </p>
        <div className="mt-5 sm:mt-6">
          <div className="sm:bg-white sm:border sm:border-[var(--wl-border)] sm:rounded-2xl sm:shadow-card sm:p-5 bg-white/95 sm:bg-white rounded-t-2xl p-4">
            <SearchFilters variant="hero" onApply={onFiltersApply} />
          </div>
        </div>
      </div>
      {/* Sentinel used by IntersectionObserver */}
      <div id="hero-sentinel" className="absolute bottom-0 left-0 right-0 h-1" />
      {children}
    </section>
  );
} 