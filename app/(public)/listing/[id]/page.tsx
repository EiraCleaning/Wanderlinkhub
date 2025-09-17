'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, Star, MapPin, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import AppShell from '@/components/AppShell';
import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { formatPrice, getListingTypeIcon } from '@/lib/map';
import type { ListingResponse, ReviewResponse } from '@/lib/validation';
import { supabase } from '@/lib/supabaseClient';
import FavouriteButton from '@/components/FavouriteButton';

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = params.id as string;
  
  const [listing, setListing] = useState<ListingResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userReview, setUserReview] = useState<ReviewResponse | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (listingId) {
      fetchListing();
      fetchReviews();
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}`);
      if (response.ok) {
        const data = await response.json();
        setListing(data.listing);
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?listing_id=${listingId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleReviewSubmit = async (reviewData: { rating: number; comment: string }) => {
    setIsSubmittingReview(true);
    
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('Please sign in to submit a review');
        return;
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          listing_id: listingId,
          ...reviewData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserReview(result.review);
        await fetchReviews(); // Refresh reviews
        alert('Review submitted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to submit review'}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting your review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
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

  if (isLoading) {
    return (
      <AppShell>
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!listing) {
    return (
      <AppShell>
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">
            The listing you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4" aria-label="Main" aria-current="page">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/explore"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getListingTypeIcon(listing.ltype)}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                listing.ltype === 'event' 
                  ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
                  : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
              }`}>
                {listing.ltype}
              </span>
              {listing.verify === 'pending' && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--wl-sand)] text-[var(--wl-white)]">
                  Pending
                </span>
              )}
            </div>
            
            {/* Favourite Button */}
            <FavouriteButton 
              listingId={listingId} 
              className="z-10"
              size="lg"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 brand-heading">
          {listing.title}
        </h1>

        {/* Rating */}
        {reviews.length > 0 && (
          <div className="flex items-center space-x-2">
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
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Description */}
        {listing.description && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {listing.description}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{formatDateRange()}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                {listing.city}
                {listing.region && `, ${listing.region}`}
                {listing.country && `, ${listing.country}`}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">
                {formatPrice(listing.price)}
              </span>
            </div>

            {/* New Enhanced Fields */}
            {listing.organiser_name && (
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-gray-500">👤</span>
                <span className="text-gray-700">
                  <strong>Organiser:</strong> {listing.organiser_name}
                </span>
              </div>
            )}

            {listing.age_range && (
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-gray-500">👶</span>
                <span className="text-gray-700">
                  <strong>Age Range:</strong> {listing.age_range}
                </span>
              </div>
            )}

            {listing.capacity && (
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 text-gray-500">👥</span>
                <span className="text-gray-700">
                  <strong>Capacity:</strong> {listing.capacity}
                </span>
              </div>
            )}

            {listing.organiser_about && (
              <div className="flex items-start space-x-3">
                <span className="w-5 h-5 text-gray-500 mt-1">ℹ️</span>
                <div className="text-gray-700">
                  <strong>About the Organiser:</strong>
                  <p className="mt-1">{listing.organiser_about}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photos Gallery */}
        {listing.photos && listing.photos.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Photos ({listing.photos.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listing.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={photo} 
                    alt={`${listing.title} - Photo ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => window.open(photo, '_blank')}
                    onError={(e) => {
                      // Hide broken image and show placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center text-gray-500">
                            <div class="text-center">
                              <div class="text-2xl mb-1">📷</div>
                              <div class="text-xs">Photo unavailable</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {listing.social_links && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect & Follow</h2>
            <div className="space-y-3">
              {listing.social_links.website && (
                <a
                  href={listing.social_links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[var(--wl-sky)] text-white rounded-lg hover:bg-[var(--wl-sky)]/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Website</span>
                </a>
              )}
              
              {listing.social_links.facebook && (
                <a
                  href={listing.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-3"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </a>
              )}
              
              {listing.social_links.instagram && (
                <a
                  href={listing.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors ml-3"
                >
                  <span>📷</span>
                  <span>Instagram</span>
                </a>
              )}
              
              {listing.social_links.other && (
                <a
                  href={listing.social_links.other}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ml-3"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Other Link</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Legacy Website Support */}
        {listing.website_url && !listing.social_links?.website && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Website</h2>
            <a
              href={listing.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Website</span>
            </a>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-6">
          <ReviewList reviews={reviews} />
          
          {/* Review Form */}
          <ReviewForm
            listingId={listingId}
            existingReview={userReview}
            onSubmit={handleReviewSubmit}
            isSubmitting={isSubmittingReview}
          />
        </div>
      </div>
    </AppShell>
  );
} 