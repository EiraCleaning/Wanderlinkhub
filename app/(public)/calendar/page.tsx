'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import AppShell from '@/components/AppShell';
import { MonthHeader } from '@/components/calendar';
import { ListingCard, ListingCardSkeleton } from '@/components/listing';
import { formatPrice } from '@/lib/map';
import type { ListingResponse } from '@/lib/validation';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings');
      if (response.ok) {
        const data = await response.json();
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    
    // Smooth scroll to today's section
    const todayElement = document.getElementById(`day-${format(today, 'yyyy-MM-dd')}`);
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const monthLabel = format(currentMonth, 'MMMM yyyy');
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Separate permanent hubs from dated events
  const permanentHubs = listings.filter(listing => listing.is_permanent);
  const datedEvents = listings.filter(listing => !listing.is_permanent);

  // Group dated events by date
  const listingsByDate = datedEvents.reduce((acc, listing) => {
    if (listing.start_date) {
      const dateKey = format(parseISO(listing.start_date), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(listing);
    }
    return acc;
  }, {} as Record<string, ListingResponse[]>);

  const formatDateText = (startDate: string, endDate?: string | null) => {
    const start = parseISO(startDate);
    if (endDate && endDate !== startDate) {
      const end = parseISO(endDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    return format(start, 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="animate-pulse">
          <div className="relative w-full bg-[var(--wl-beige)] min-h-[160px] sm:min-h-[220px]">
            <div className="absolute inset-0 bg-[var(--wl-forest)]/35" />
            <div className="relative max-w-5xl mx-auto px-4 py-6 sm:py-8">
              <div className="h-8 bg-white/20 rounded w-1/3 mb-2" />
              <div className="h-4 bg-white/20 rounded w-2/3" />
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4 -mt-8 sm:-mt-10">
            <div className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4">
              <div className="h-6 bg-[var(--wl-border)] rounded w-1/2" />
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4 mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[var(--wl-border)] rounded-2xl shadow-card p-4">
                <div className="h-5 bg-[var(--wl-border)] rounded w-1/3 mb-2" />
                <div className="space-y-2">
                  <div className="h-3 bg-[var(--wl-border)] rounded w-1/2" />
                  <div className="h-3 bg-[var(--wl-border)] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Hero Cover */}
      <div className="relative w-full bg-[var(--wl-beige)] min-h-[160px] sm:min-h-[220px]">
        <Image
          src="/calendarhero.jpg"
          alt="Calendar background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[var(--wl-forest)]/35" />
        <div className="relative max-w-5xl mx-auto px-4 py-6 sm:py-8">
          <h1 className="text-white text-2xl sm:text-3xl font-semibold">
            Calendar
          </h1>
          <p className="text-white/90 mt-1 text-sm sm:text-base">
            Browse family-friendly hubs and events by month.
          </p>
        </div>
      </div>

      {/* Month Header */}
      <MonthHeader
        monthLabel={monthLabel}
        onPrev={goToPreviousMonth}
        onNext={goToNextMonth}
        onToday={goToToday}
      />

      {/* Month Calendar */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        {daysInMonth.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayListings = listingsByDate[dateKey] || [];
          
          if (dayListings.length === 0) return null;

          return (
            <section key={dateKey} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--wl-ink)] brand-heading">
                  {format(day, 'EEEE, d MMMM yyyy')}
                </h2>
                <span className="text-sm text-[var(--wl-slate)]">
                  {dayListings.length} {dayListings.length === 1 ? 'listing' : 'listings'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {dayListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    type={listing.ltype}
                    title={listing.title}
                    city={listing.city}
                    country={listing.country}
                    startDate={listing.start_date || undefined}
                    endDate={listing.end_date || undefined}
                    price={listing.price ? formatPrice(listing.price) : undefined}
                    status={listing.verify === 'rejected' ? 'pending' : listing.verify}
                    imageUrl={listing.photos && listing.photos.length > 0 ? listing.photos[0] : undefined}
                    href={`/listing/${listing.id}`}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Empty state if no dated listings in month */}
        {daysInMonth.every(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          return !listingsByDate[dateKey] || listingsByDate[dateKey].length === 0;
        }) && datedEvents.length > 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--wl-slate)] text-lg">
              No events or hubs scheduled for {monthLabel}
            </p>
            <p className="text-[var(--wl-slate)] text-sm mt-2">
              Try navigating to another month or check back later.
            </p>
          </div>
        )}

        {/* Permanent Hubs Section */}
        {permanentHubs.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[var(--wl-forest)] mb-2">
                Always Open
              </h2>
              <p className="text-lg text-[var(--wl-slate)]">
                These hubs are available year-round for families
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {permanentHubs.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  type={listing.ltype}
                  title={listing.title}
                  city={listing.city}
                  country={listing.country}
                  startDate={listing.start_date || undefined}
                  endDate={listing.end_date || undefined}
                  price={listing.price ? formatPrice(listing.price) : undefined}
                  status={listing.verify === 'rejected' ? 'pending' : listing.verify}
                  imageUrl={listing.photos && listing.photos.length > 0 ? listing.photos[0] : undefined}
                  href={`/listing/${listing.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Listings Message */}
        {listings.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-[var(--wl-slate)]">No events or hubs found.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
} 