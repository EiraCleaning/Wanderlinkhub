'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface FavouriteButtonProps {
  listingId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavouriteButton({ 
  listingId, 
  className = '', 
  size = 'md'
}: FavouriteButtonProps) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSupporter, setIsSupporter] = useState(false);
  const [showSupporterPopup, setShowSupporterPopup] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  useEffect(() => {
    checkAuthAndFavouriteStatus();
  }, [listingId]);

  const checkAuthAndFavouriteStatus = async () => {
    try {
      // Use shared supabase client to avoid multiple instances
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('FavouriteButton: User authenticated:', session.user.email);
        setIsAuthenticated(true);
        
        // Check if user is a supporter
        await checkSupporterStatus(session.access_token);
        
        // Only check favourite status if user is a supporter
        if (isSupporter) {
          await checkFavouriteStatus(session.access_token);
        }
      } else {
        console.log('FavouriteButton: No user session');
        setIsAuthenticated(false);
        setIsSupporter(false);
        setIsFavourited(false);
      }
    } catch (error) {
      console.error('FavouriteButton: Auth check error:', error);
      setIsAuthenticated(false);
      setIsSupporter(false);
      setIsFavourited(false);
    }
  };

  const checkSupporterStatus = async (accessToken: string) => {
    try {
      console.log('FavouriteButton: Checking supporter status');
      const response = await fetch('/api/check-supporter', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('FavouriteButton: Supporter check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('FavouriteButton: Supporter status:', data.isSupporter);
        setIsSupporter(data.isSupporter);
      } else {
        const errorText = await response.text();
        console.log('FavouriteButton: Failed to check supporter status:', response.status, errorText);
        setIsSupporter(false);
      }
    } catch (error) {
      console.error('FavouriteButton: Error checking supporter status:', error);
      setIsSupporter(false);
    }
  };

  const checkFavouriteStatus = async (accessToken: string) => {
    try {
      console.log('FavouriteButton: Checking favourite status for listing:', listingId);
      const response = await fetch(`/api/favourites/check?listing_id=${listingId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('FavouriteButton: API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('FavouriteButton: API response data:', data);
        setIsFavourited(data.isFavourited);
        console.log('FavouriteButton: Favourite status set to:', data.isFavourited);
      } else {
        const errorText = await response.text();
        console.log('FavouriteButton: Failed to check favourite status:', response.status, errorText);
        setIsFavourited(false);
      }
    } catch (error) {
      console.error('FavouriteButton: Error checking favourite status:', error);
      setIsFavourited(false);
    }
  };

  const toggleFavourite = async () => {
    console.log('FavouriteButton: Toggle clicked, isAuthenticated:', isAuthenticated, 'isSupporter:', isSupporter);
    
    if (!isAuthenticated) {
      console.log('FavouriteButton: Not authenticated, redirecting to signin');
      window.location.href = '/signin';
      return;
    }

    if (!isSupporter) {
      console.log('FavouriteButton: Not a supporter, showing supporter popup');
      setShowSupporterPopup(true);
      // Auto-hide popup after 3 seconds
      setTimeout(() => setShowSupporterPopup(false), 3000);
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('FavouriteButton: No access token, redirecting to signin');
        window.location.href = '/signin';
        return;
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };

      if (isFavourited) {
        // Remove favourite
        console.log('FavouriteButton: Removing favourite for listing:', listingId);
        const response = await fetch(`/api/favourites?listing_id=${listingId}`, {
          method: 'DELETE',
          headers,
        });

        console.log('FavouriteButton: DELETE response status:', response.status);
        
        if (response.ok) {
          setIsFavourited(false);
          console.log('FavouriteButton: Successfully removed favourite');
        } else {
          const errorText = await response.text();
          console.error('FavouriteButton: Failed to remove favourite:', response.status, errorText);
        }
      } else {
        // Add favourite
        console.log('FavouriteButton: Adding favourite for listing:', listingId);
        const response = await fetch('/api/favourites', {
          method: 'POST',
          headers,
          body: JSON.stringify({ listing_id: listingId }),
        });

        console.log('FavouriteButton: POST response status:', response.status);
        
        if (response.ok) {
          setIsFavourited(true);
          console.log('FavouriteButton: Successfully added favourite');
        } else if (response.status === 409) {
          // Already favourited
          setIsFavourited(true);
          console.log('FavouriteButton: Already favourited');
        } else {
          const errorText = await response.text();
          console.error('FavouriteButton: Failed to add favourite:', response.status, errorText);
        }
      }
    } catch (error) {
      console.error('FavouriteButton: Error toggling favourite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleFavourite}
        disabled={isLoading}
        className={`
          ${sizeClasses[size]} 
          transition-all duration-200 
          bg-white/80 rounded-full p-1
          ${isFavourited 
            ? 'text-[#2E5D50] hover:text-[#1e3d35]' 
            : 'text-slate-400 hover:text-slate-600'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
          ${className}
        `}
        title={
          !isAuthenticated 
            ? 'Sign in to add favourites'
            : !isSupporter 
            ? 'Become a Founding Supporter to save favourites'
            : isFavourited 
            ? 'Remove from favourites' 
            : 'Add to favourites'
        }
      >
        <Heart 
          className={`w-full h-full ${isFavourited ? 'fill-current' : ''}`} 
        />
      </button>

      {/* Supporter Popup */}
      {showSupporterPopup && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-auto" onClick={() => setShowSupporterPopup(false)}>
            <div className="relative w-full h-full">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-3 shadow-xl max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🌍</span>
                    <div>
                      <p className="font-medium">Become a Founding Supporter</p>
                      <p className="text-gray-300 text-xs">to save favourites</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setShowSupporterPopup(false);
                        window.location.href = '/profile';
                      }}
                      className="w-full px-3 py-1 bg-[#2E5D50] text-white text-xs rounded hover:bg-[#1e3d35] transition-colors"
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
