'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import type { ListingResponse } from '@/lib/validation';

interface CalendarViewProps {
  listings: ListingResponse[];
  className?: string;
}

export default function CalendarView({ listings, className = '' }: CalendarViewProps) {
  const [events, setEvents] = useState<any[]>([]);


  useEffect(() => {
    
    // Convert listings to calendar events
    const calendarEvents = listings
      .filter(listing => {
        return listing.ltype === 'event' && listing.start_date;
      })
      .map(listing => {
        const event = {
          id: listing.id,
          title: listing.title,
          start: listing.start_date,
          end: listing.end_date || listing.start_date,
          display: 'block',
          backgroundColor: listing.verify === 'verified' ? '#3B82F6' : '#F59E0B',
          borderColor: listing.verify === 'verified' ? '#2563EB' : '#D97706',
          textColor: '#FFFFFF',
          extendedProps: {
            listing
          }
        };
        return event;
      });
    
    
    setEvents(calendarEvents);
  }, [listings]);

  const handleEventClick = (info: any) => {
    const listing = info.event.extendedProps.listing;
    if (listing) {
      window.location.href = `/listing/${listing.id}`;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Events Calendar</h2>
        <p className="text-sm text-gray-600">
          Click on any event to view details
        </p>
      </div>
      
      <div className="calendar-container">
        
        <FullCalendar
          key={`calendar-${events.length}-${Date.now()}`}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          dayMaxEvents={true}
          moreLinkClick="popover"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
          }}
          dayHeaderFormat={{
            weekday: 'short'
          }}
          titleFormat={{
            month: 'long',
            year: 'numeric'
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week'
          }}
          firstDay={1}
          weekends={true}
          selectable={false}
          editable={false}
          selectMirror={false}
          unselectAuto={true}
          eventBackgroundColor="#3B82F6"
          eventBorderColor="#2563EB"
          eventTextColor="#FFFFFF"
          eventClassNames="cursor-pointer hover:opacity-80"
          dayCellContent={(arg) => {
            return arg.dayNumberText;
          }}
        />
      </div>

      <style jsx global>{`
        .calendar-container .fc {
          font-family: inherit;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        
        .calendar-container .fc-toolbar {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .calendar-container .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }
        
        .calendar-container .fc-button {
          background-color: #3B82F6;
          border-color: #2563EB;
          font-weight: 500;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
        }
        
        .calendar-container .fc-button:hover {
          background-color: #2563EB;
          border-color: #1D4ED8;
        }
        
        .calendar-container .fc-button:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .calendar-container .fc-daygrid-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.875rem;
          margin: 1px;
          cursor: pointer;
        }
        
        .calendar-container .fc-daygrid-day {
          border: 1px solid #f3f4f6;
          min-height: 80px;
        }
        
        .calendar-container .fc-daygrid-day:hover {
          background-color: #F8FAFC;
        }
        
        .calendar-container .fc-daygrid-day.fc-day-today {
          background-color: #EFF6FF;
        }
        
        .calendar-container .fc-daygrid-day-number {
          padding: 4px;
          font-weight: 500;
        }
        
        .calendar-container .fc-col-header {
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .calendar-container .fc-col-header-cell {
          padding: 0.5rem;
          font-weight: 600;
          color: #374151;
        }
      `}</style>
    </div>
  );
} 