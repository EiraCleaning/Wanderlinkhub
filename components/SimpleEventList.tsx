'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { ListingResponse } from '@/lib/validation';

interface SimpleEventListProps {
  listings: ListingResponse[];
  className?: string;
}

export default function SimpleEventList({ listings, className = '' }: SimpleEventListProps) {
  const [currentDate, setCurrentDate] = useState(new Date('2025-01-01')); // Start at January 2025

  // Filter events and hubs
  const events = useMemo(() => {
    return listings.filter(listing => listing.ltype === 'event' || listing.ltype === 'hub');
  }, [listings]);

  // Group events by month
  const eventsByMonth = useMemo(() => {
    const grouped: { [key: string]: ListingResponse[] } = {};
    
    events.forEach(event => {
      if (event.start_date) {
        const date = new Date(event.start_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }
        grouped[monthKey].push(event);
      } else {
        // Events without dates go to "No Date" category
        if (!grouped['no-date']) {
          grouped['no-date'] = [];
        }
        grouped['no-date'].push(event);
      }
    });
    
    return grouped;
  }, [events]);

  // Get month name and year
  const getMonthDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get current month key
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentMonthEvents = eventsByMonth[currentMonthKey] || [];
  


  // Sort events by date
  const sortedEvents = currentMonthEvents.sort((a, b) => {
    if (!a.start_date || !b.start_date) return 0;
    return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
  });

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Events & Hubs Calendar</h2>
        <p className="text-sm text-gray-600">
          Browse events and hubs month by month
        </p>
      </div>
      


      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            {getMonthDisplay(currentDate)}
          </h3>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      

      {/* Events List */}
      <div className="space-y-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events this month</h3>
            <p className="text-gray-600">Try navigating to a different month or check back later.</p>
          </div>
        ) : (
          sortedEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                // Navigate to event detail page
                window.location.href = `/listing/${event.id}`;
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{event.ltype === 'event' ? '🎉' : '🏠'}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.ltype === 'event' 
                      ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
                      : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                  }`}>
                    {event.ltype === 'event' ? 'Event' : 'Hub'}
                  </span>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.verify === 'verified' 
                    ? 'bg-[var(--wl-forest)] text-[var(--wl-white)]'
                    : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                }`}>
                  {event.verify}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h3>

              {event.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4">📅</span>
                  <span>
                    {event.start_date && new Date(event.start_date).toLocaleDateString()}
                    {event.end_date && event.end_date !== event.start_date && 
                      ` - ${new Date(event.end_date).toLocaleDateString()}`
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4">📍</span>
                  <span>
                    {event.city}
                    {event.region && `, ${event.region}`}
                    {event.country && `, ${event.country}`}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4">💰</span>
                  <span className="font-medium">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </span>
                </div>
              </div>

              {event.website_url && (
                <div className="mt-3 pt-3 border-t border-[var(--wl-border)]">
                  <span className="text-[var(--wl-sky)] text-sm hover:underline">
                    Visit Website →
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Month Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''} in {getMonthDisplay(currentDate)}
        </p>
      </div>



      {/* Events & Hubs Without Dates */}
      {eventsByMonth['no-date'] && eventsByMonth['no-date'].length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events & Hubs Without Dates</h3>
          <div className="space-y-4">
            {eventsByMonth['no-date'].map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-yellow-50"
                onClick={() => {
                  window.location.href = `/listing/${event.id}`;
                }}
              >
                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                  <span className="text-2xl">{event.ltype === 'event' ? '🎉' : '🏠'}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.ltype === 'event' 
                      ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
                      : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                  }`}>
                    {event.ltype === 'event' ? 'Event' : 'Hub'}
                  </span>
                </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.verify === 'verified' 
                      ? 'bg-[var(--wl-forest)] text-[var(--wl-white)]'
                      : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                  }`}>
                    {event.verify}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>

                {event.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4">⚠️</span>
                    <span className="text-yellow-600 font-medium">No date set</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4">📍</span>
                    <span>
                      {event.city}
                      {event.region && `, ${event.region}`}
                      {event.country && `, ${event.country}`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4">💰</span>
                    <span className="font-medium">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </span>
                  </div>
                </div>

                {event.website_url && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className="text-blue-600 text-sm hover:underline">
                      Visit Website →
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 