'use client';

import { useEffect, useState } from 'react';
import { Shield, Check, X, Eye } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import type { ListingResponse } from '@/lib/validation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [pendingListings, setPendingListings] = useState<ListingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<ListingResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndFetchListings();
  }, []);

  const checkAuthAndFetchListings = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('You must be logged in to access the admin panel');
        return;
      }

      // Check if user has admin role via API
      const response = await fetch('/api/admin/check-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        alert('Authentication error. Please sign in again.');
        return;
      }

      const data = await response.json();
      
      if (!data.isAdmin) {
        alert('Access denied. Admin privileges required.');
        return;
      }
      

      setIsAuthenticated(true);
      await fetchPendingListings(session.access_token);
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication error. Please sign in again.');
    }
  };

  const fetchPendingListings = async (token: string) => {
    try {
      const response = await fetch('/api/listings?verified=false', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPendingListings(data.listings || []);
      }
    } catch (error) {
      console.error('Error fetching pending listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (listingId: string, action: 'verify' | 'reject') => {
    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert('Authentication expired. Please sign in again.');
        return;
      }

      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id: listingId, action }),
      });

      if (response.ok) {
        // Remove the listing from the pending list
        setPendingListings(prev => prev.filter(listing => listing.id !== listingId));
        alert(`Listing ${action}ed successfully`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to update listing'}`);
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const openDetailModal = (listing: ListingResponse) => {
    setSelectedListing(listing);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedListing(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">
          Review and manage pending listings. Click on any listing to see full details before approving or rejecting.
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {pendingListings.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending listings
            </h3>
            <p className="text-gray-500">
              All listings have been reviewed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingListings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300"
                onClick={() => openDetailModal(listing)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {listing.ltype === 'event' ? '🎉' : '🏠'}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                      <p className="text-sm text-gray-500">
                        {listing.city}, {listing.country}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    listing.ltype === 'event' 
                      ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
                      : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                  }`}>
                    {listing.ltype}
                  </span>
                </div>

                {listing.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Submitted: {new Date(listing.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetailModal(listing);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerification(listing.id, 'verify');
                      }}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerification(listing.id, 'reject');
                      }}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    💡 Click anywhere on the card to view full details
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Listing Details</h2>
                <button
                  onClick={closeDetailModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Title</h3>
                  <p className="text-gray-700">{selectedListing.title}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Type</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedListing.ltype === 'event' 
                      ? 'bg-[var(--wl-sky)] text-[var(--wl-white)]' 
                      : 'bg-[var(--wl-sand)] text-[var(--wl-white)]'
                  }`}>
                    {selectedListing.ltype}
                  </span>
                </div>

                {/* Permanent Hub Status */}
                {selectedListing.ltype === 'hub' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hub Type</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedListing.is_permanent 
                        ? 'bg-[var(--wl-forest)] text-white' 
                        : 'bg-[var(--wl-sky)] text-white'
                    }`}>
                      {selectedListing.is_permanent ? 'Permanent Hub' : 'Temporary Hub'}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedListing.is_permanent 
                        ? 'This hub is always open and available' 
                        : 'This hub has specific opening/closing dates'
                      }
                    </p>
                  </div>
                )}

                {selectedListing.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedListing.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Start Date</h3>
                    <p className="text-gray-700">
                      {selectedListing.start_date ? new Date(selectedListing.start_date).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">End Date</h3>
                    <p className="text-gray-700">
                      {selectedListing.end_date ? new Date(selectedListing.end_date).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-700">
                    {selectedListing.city}
                    {selectedListing.region && `, ${selectedListing.region}`}
                    {selectedListing.country && `, ${selectedListing.country}`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {selectedListing.lat}, {selectedListing.lng}
                  </p>
                </div>

                {selectedListing.price !== null && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Price</h3>
                    <p className="text-gray-700">
                      {selectedListing.price === 0 ? 'Free' : `$${selectedListing.price.toFixed(2)}`}
                    </p>
                  </div>
                )}

                {selectedListing.website_url && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                    <a
                      href={selectedListing.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline break-all"
                    >
                      {selectedListing.website_url}
                    </a>
                  </div>
                )}

                {/* New Enhanced Fields */}
                {selectedListing.organiser_name && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Organiser Name</h3>
                    <p className="text-gray-700">{selectedListing.organiser_name}</p>
                  </div>
                )}

                {selectedListing.contact_email && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Email</h3>
                    <p className="text-gray-700 text-sm font-mono">{selectedListing.contact_email}</p>
                  </div>
                )}

                {selectedListing.contact_phone && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Phone</h3>
                    <p className="text-gray-700">{selectedListing.contact_phone}</p>
                  </div>
                )}

                {selectedListing.organiser_about && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">About Organiser</h3>
                    <p className="text-gray-700">{selectedListing.organiser_about}</p>
                  </div>
                )}

                {selectedListing.age_range && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Age Range</h3>
                    <p className="text-gray-700">{selectedListing.age_range}</p>
                  </div>
                )}

                {selectedListing.capacity && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Capacity</h3>
                    <p className="text-gray-700">{selectedListing.capacity}</p>
                  </div>
                )}

                {selectedListing.social_links && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Social Links</h3>
                    <div className="space-y-2">
                      {selectedListing.social_links.website && (
                        <div>
                          <span className="font-medium text-gray-700">Website: </span>
                          <a
                            href={selectedListing.social_links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline break-all"
                          >
                            {selectedListing.social_links.website}
                          </a>
                        </div>
                      )}
                      {selectedListing.social_links.facebook && (
                        <div>
                          <span className="font-medium text-gray-700">Facebook: </span>
                          <a
                            href={selectedListing.social_links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline break-all"
                          >
                            {selectedListing.social_links.facebook}
                          </a>
                        </div>
                      )}
                      {selectedListing.social_links.instagram && (
                        <div>
                          <span className="font-medium text-gray-700">Instagram: </span>
                          <a
                            href={selectedListing.social_links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline break-all"
                          >
                            {selectedListing.social_links.instagram}
                          </a>
                        </div>
                      )}
                      {selectedListing.social_links.other && (
                        <div>
                          <span className="font-medium text-gray-700">Other: </span>
                          <a
                            href={selectedListing.social_links.other}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline break-all"
                          >
                            {selectedListing.social_links.other}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedListing.photos && selectedListing.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Photos ({selectedListing.photos.length})</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedListing.photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded overflow-hidden">
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedListing.verified_intent && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Verification Intent</h3>
                    <p className="text-gray-700">
                      <span className="text-green-600">✓</span> User agreed to provide proof if requested
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Submitted</h3>
                  <p className="text-gray-700">
                    {new Date(selectedListing.created_at).toLocaleDateString()} at {new Date(selectedListing.created_at).toLocaleTimeString()}
                  </p>
                </div>

                {selectedListing.created_by && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">User ID</h3>
                    <p className="text-gray-700 text-sm font-mono">{selectedListing.created_by}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleVerification(selectedListing.id, 'verify');
                    closeDetailModal();
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleVerification(selectedListing.id, 'reject');
                    closeDetailModal();
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
} 