'use client';

import { useState } from 'react';
import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
import type { ReviewResponse } from '@/lib/validation';

interface ReviewListProps {
  reviews: ReviewResponse[];
  className?: string;
}

export default function ReviewList({ reviews, className = '' }: ReviewListProps) {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 5);
  const hasMoreReviews = reviews.length > 5;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingCounts = reviews.reduce((counts, review) => {
    counts[review.rating] = (counts[review.rating] || 0) + 1;
    return counts;
  }, {} as Record<number, number>);

  if (reviews.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 text-center ${className}`}>
        <div className="text-gray-400 mb-2">
          <Star className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header with Rating Summary */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Reviews ({reviews.length})
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= averageRating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-5 gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {rating}
              </div>
              <div className="text-xs text-gray-500">
                {ratingCounts[rating] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-200">
        {displayedReviews.map((review) => (
          <div key={review.id} className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Anonymous User
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(review.created_at), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="ml-13">
              <p className={`text-gray-700 leading-relaxed ${
                expandedReviews.has(review.id) || review.comment.length <= 150
                  ? ''
                  : 'line-clamp-3'
              }`}>
                {review.comment}
              </p>
              
              {review.comment.length > 150 && (
                <button
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {expandedReviews.has(review.id) ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {hasMoreReviews && !showAll && (
        <div className="p-6 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Show All {reviews.length} Reviews
          </button>
        </div>
      )}

      {showAll && hasMoreReviews && (
        <div className="p-6 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="px-6 py-2 text-sm text-gray-600 hover:text-gray-700 font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  );
} 