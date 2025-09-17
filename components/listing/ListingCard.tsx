import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import FavouriteButton from "@/components/FavouriteButton";

export function ListingCard({
  id, type, title, city, country, startDate, endDate, price, status, imageUrl, href,
}: {
  id: string; type: "hub" | "event"; title: string; city?: string; country?: string;
  startDate?: string; endDate?: string; price?: string;
  status: "verified" | "pending"; imageUrl?: string; href: string;
}) {
  const dateText = type === "event" && startDate
    ? new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" })
        .formatRange?.(new Date(startDate), new Date(endDate ?? startDate)) ?? ""
    : "";

  return (
    <article
      className="group grid md:grid-cols-[224px,1fr,160px] bg-white border border-[var(--wl-border)] rounded-2xl shadow-card overflow-hidden
                 transition hover:shadow-lg hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-[var(--wl-sky)]"
      role="article"
    >
      {/* Media column */}
      <div className="relative aspect-[16/10] md:aspect-auto md:h-full md:min-h-[172px] bg-[var(--wl-beige)]">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill sizes="(max-width: 768px) 100vw, 224px" className="object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-[var(--wl-slate)]/70 text-sm">No photo</div>
        )}
        
        {status === "verified" && (
          <span className="absolute top-2 left-2 rounded-full bg-[var(--wl-forest)] text-white text-xs px-2 py-1">✓ Verified</span>
        )}
        
        {/* Favourite button */}
        <div className="absolute top-2 right-2 z-10">
          <FavouriteButton listingId={id} size="md" />
        </div>
      </div>

      {/* Content column */}
      <div className="p-4 md:p-5 flex flex-col gap-2">
        <h3 className="text-lg md:text-xl font-semibold text-[var(--wl-ink)] line-clamp-2">{title}</h3>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[var(--wl-sky)]/15 text-[var(--wl-ink)] px-2 py-0.5 text-xs">{type}</span>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
            status === "verified" ? "bg-[var(--wl-forest)] text-white" : "bg-[var(--wl-sand)] text-[var(--wl-ink)]"
          }`}>{status}</span>
        </div>

        <ul className="mt-1 space-y-1 text-[var(--wl-slate)] text-sm">
          {dateText && <li>📅 {dateText}</li>}
          {(city || country) && <li>📍 {city}{country ? `, ${country}` : ""}</li>}
          {price && <li>💰 {price}</li>}
        </ul>

        {/* Mobile CTA inline under content */}
        <div className="mt-3 md:hidden">
          <Link href={href} className="block">
            <Button variant="primary" className="w-full">View more</Button>
          </Link>
        </div>
      </div>

      {/* CTA column (desktop only) */}
      <div className="hidden md:flex items-center justify-center md:border-l md:border-[var(--wl-border)] p-5">
        <Link href={href} className="w-full">
          <Button variant="primary" className="w-full">View more</Button>
        </Link>
      </div>
    </article>
  );
}
