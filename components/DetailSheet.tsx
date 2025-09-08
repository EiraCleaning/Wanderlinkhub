'use client';

import { useEffect, useState } from 'react';
import { X, ExternalLink, Star } from 'lucide-react';
import type { ListingResponse, ReviewResponse } from '@/lib/validation';
import { formatPrice, getListingTypeIcon } from '@/lib/map';
import { format } from 'date-fns';

interface DetailSheetProps {
  listing: ListingResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailSheet({ listing, isOpen, onClose }: DetailSheetProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (listing && isOpen) {
      fetchReviews();
    }
  }, [listing, isOpen]);

  const fetchReviews = async () => {
    if (!listing) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews?listing_id=${listing.id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date specified';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateRange = () => {
    // Check for permanent hubs first
    if (listing?.is_permanent === true) {
      return 'Always Open';
    }
    
    if (!listing?.start_date) return 'Date not specified';
    
    if (listing.end_date && listing.start_date !== listing.end_date) {
      return `${formatDate(listing.start_date)} - ${formatDate(listing.end_date)}`;
    }
    
    return formatDate(listing.start_date);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (!listing) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getListingTypeIcon(listing.ltype)}</span>
              <div>
                                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
             listing.ltype === 'event' 
               ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
               : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
           }`}>
             {listing.ltype}
           </span>
                {listing.verify === 'pending' && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {listing.title}
          </h2>

          {/* Rating */}
          {reviews.length > 0 && (
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= averageRating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <span className="w-5 h-5">📅</span>
              <span className="text-gray-700">{formatDateRange()}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="w-5 h-5">📍</span>
              <span className="text-gray-700">
                {listing.city}
                {listing.region && `, ${listing.region}`}
                {listing.country && `, ${listing.country}`}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="w-5 h-5">💰</span>
              <span className="text-gray-700 font-medium">
                {formatPrice(listing.price)}
              </span>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>
          )}

          {/* Website */}
          {listing.website_url && (
            <div className="mb-6">
              <a
                href={listing.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Website</span>
              </a>
            </div>
          )}

          {/* Reviews */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Reviews ({reviews.length})
            </h3>
            
            {isLoading ? (
              <div className="text-gray-500">Loading reviews...</div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                ))}
                {reviews.length > 3 && (
                  <div className="text-center text-sm text-gray-500">
                    +{reviews.length - 3} more reviews
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No reviews yet
              </div>
            )}
          </div>

          {/* View Full Details Button */}
          <div className="text-center">
            <a
              href={`/listing/${listing.id}`}
              className="inline-block w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              View Full Details
            </a>
          </div>
        </div>
      </div>
    </>
  );
} 