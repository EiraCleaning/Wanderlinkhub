export function DaySection({ 
  heading, 
  children 
}: {
  heading: string; 
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-5xl mx-auto mt-5">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-[var(--wl-ink)] font-semibold">{heading}</h2>
      </div>
      <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card mt-2 divide-y divide-[var(--wl-border)]">
        {children}
      </div>
    </section>
  );
}
