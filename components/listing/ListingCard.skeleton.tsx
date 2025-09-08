export function ListingCardSkeleton() {
  return (
    <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="grid md:grid-cols-[224px,1fr,160px]">
        {/* Media skeleton */}
        <div className="bg-[var(--wl-beige)] aspect-[16/10] md:aspect-auto md:h-full md:min-h-[172px]" />
        
        {/* Content skeleton */}
        <div className="p-4 md:p-5 flex flex-col gap-2">
          <div className="h-5 w-2/3 bg-[var(--wl-border)] rounded mb-3" />
          <div className="h-4 w-24 bg-[var(--wl-border)] rounded mb-2" />
          <div className="space-y-2">
            <div className="h-3 w-40 bg-[var(--wl-border)] rounded" />
            <div className="h-3 w-32 bg-[var(--wl-border)] rounded" />
            <div className="h-3 w-28 bg-[var(--wl-border)] rounded" />
          </div>
        </div>
        
        {/* CTA skeleton (desktop only) */}
        <div className="hidden md:flex items-center justify-center md:border-l md:border-[var(--wl-border)] p-5">
          <div className="h-10 w-full bg-[var(--wl-border)] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
