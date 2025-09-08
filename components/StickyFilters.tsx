'use client';

import { motion, AnimatePresence } from 'framer-motion';
import SearchFilters from './filters/SearchFilters';

interface StickyFiltersProps {
  visible: boolean;
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

export default function StickyFilters({ visible, onFiltersApply }: StickyFiltersProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="
            sticky top-0 z-30
            border-b border-[var(--wl-border)]
            bg-[var(--wl-beige)]/95
            backdrop-blur
            supports-[backdrop-filter]:bg-[var(--wl-beige)]/90
            shadow-sm
          "
          role="region"
          aria-label="Sticky filters"
        >
          <div className="max-w-5xl mx-auto px-3 py-2">
            <SearchFilters variant="sticky" onApply={onFiltersApply} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 