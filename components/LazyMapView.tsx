'use client';

import dynamic from 'next/dynamic';
import LazyComponent from './LazyComponent';

// Dynamically import MapView with no SSR to avoid hydration issues
const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-96 md:h-[600px] bg-[var(--wl-beige)] rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--wl-forest)] mx-auto mb-2"></div>
        <p className="text-[var(--wl-slate)]">Loading map...</p>
      </div>
    </div>
  )
});

interface LazyMapViewProps {
  listings: any[];
  onPinClick: (listing: any) => void;
  className?: string;
  center?: { lat: number; lng: number };
}

export default function LazyMapView(props: LazyMapViewProps) {
  return (
    <LazyComponent
      fallback={
        <div className="h-96 md:h-[600px] bg-[var(--wl-beige)] rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--wl-forest)] mx-auto mb-2"></div>
            <p className="text-[var(--wl-slate)]">Loading map...</p>
          </div>
        </div>
      }
    >
      <MapView {...props} />
    </LazyComponent>
  );
}
