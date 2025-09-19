import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function EventRow({
  type, 
  status, 
  title, 
  href, 
  dateText, 
  locationText, 
  price, 
  imageUrl,
}: {
  type: 'event' | 'hub';
  status: 'verified' | 'pending';
  title: string;
  href: string;
  dateText?: string;
  locationText?: string;
  price?: string;
  imageUrl?: string;
}) {
  return (
    <div className="p-4 sm:p-5 grid gap-3 sm:gap-4 sm:grid-cols-[112px,1fr,auto]">
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden bg-[var(--wl-beige)] sm:h-24 sm:w-28 sm:aspect-auto aspect-[16/10]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 112px"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-[var(--wl-slate)]/70 text-xs">No photo</div>
        )}
      </div>

      {/* Main content */}
      <div>
        <h3 className="text-[var(--wl-ink)] font-semibold text-base sm:text-lg line-clamp-1">
          <Link href={href} className="hover:underline">{title}</Link>
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs ${
            type === 'event' ? 'bg-[var(--wl-sky)]/15' : 'bg-[var(--wl-sand)]/15'
          } text-[var(--wl-ink)]`}>
            {type}
          </span>
        </div>
        <ul className="mt-1 space-y-1 text-[var(--wl-slate)] text-sm">
          {dateText && <li>🕒 {dateText}</li>}
          {locationText && <li>📍 {locationText}</li>}
          {price && <li>💰 {price}</li>}
        </ul>
      </div>

      {/* CTA */}
      <div className="hidden sm:flex items-center">
        <Link href={href}>
          <Button variant="primary">View</Button>
        </Link>
      </div>
      <div className="sm:hidden mt-3">
        <Link href={href}>
          <Button variant="primary" className="w-full">View</Button>
        </Link>
      </div>
    </div>
  );
}
