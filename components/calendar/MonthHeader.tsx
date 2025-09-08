'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export function MonthHeader({ 
  monthLabel, 
  onPrev, 
  onNext, 
  onToday 
}: {
  monthLabel: string; 
  onPrev: () => void; 
  onNext: () => void; 
  onToday: () => void;
}) {
  return (
    <div className="bg-white border border-[var(--wl-border)] shadow-card rounded-2xl -mt-8 sm:-mt-10 relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1" aria-label="Change month">
        <button 
          onClick={onPrev} 
          className="rounded-full p-2 text-[var(--wl-ink)] hover:bg-[var(--wl-beige)] transition-colors" 
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-[var(--wl-ink)] text-lg sm:text-xl font-semibold flex items-center gap-2">
          🗓️ {monthLabel}
        </div>
        <button 
          onClick={onNext} 
          className="rounded-full p-2 text-[var(--wl-ink)] hover:bg-[var(--wl-beige)] transition-colors" 
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <button 
        onClick={onToday} 
        className="inline-flex items-center gap-2 rounded-2xl bg-[var(--wl-forest)] text-white px-3 py-1.5 text-sm font-medium hover:bg-[var(--wl-forest)]/90 transition-colors"
      >
        <span>Today</span>
      </button>
    </div>
  );
}
