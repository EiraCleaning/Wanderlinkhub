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
        await checkFavouriteStatus(session.access_token);
      } else {
        console.log('FavouriteButton: No user session');
        setIsAuthenticated(false);
        setIsFavourited(false);
      }
    } catch (error) {
      console.error('FavouriteButton: Auth check error:', error);
      setIsAuthenticated(false);
      setIsFavourited(false);
    }
  };


  const checkFavouriteStatus = async (accessToken: string) => {
    try {
      const response = await fetch(`/api/favourites/check?listing_id=${listingId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavourited(data.isFavourited);
        console.log('FavouriteButton: Favourite status:', data.isFavourited);
      } else {
        console.log('FavouriteButton: Failed to check favourite status:', response.status);
        setIsFavourited(false);
      }
    } catch (error) {
      console.error('FavouriteButton: Error checking favourite status:', error);
      setIsFavourited(false);
    }
  };

  const toggleFavourite = async () => {
    console.log('FavouriteButton: Toggle clicked, isAuthenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('FavouriteButton: Not authenticated, redirecting to signin');
      window.location.href = '/signin';
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
        console.log('FavouriteButton: Removing favourite');
        const response = await fetch(`/api/favourites?listing_id=${listingId}`, {
          method: 'DELETE',
          headers,
        });

        if (response.ok) {
          setIsFavourited(false);
          console.log('FavouriteButton: Successfully removed favourite');
        } else {
          console.error('FavouriteButton: Failed to remove favourite:', response.status);
        }
      } else {
        // Add favourite
        console.log('FavouriteButton: Adding favourite');
        const response = await fetch('/api/favourites', {
          method: 'POST',
          headers,
          body: JSON.stringify({ listing_id: listingId }),
        });

        if (response.ok) {
          setIsFavourited(true);
          console.log('FavouriteButton: Successfully added favourite');
        } else if (response.status === 409) {
          // Already favourited
          setIsFavourited(true);
          console.log('FavouriteButton: Already favourited');
        } else {
          console.error('FavouriteButton: Failed to add favourite:', response.status);
        }
      }
    } catch (error) {
      console.error('FavouriteButton: Error toggling favourite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={toggleFavourite}
        className={`${sizeClasses[size]} text-slate-400 hover:text-slate-600 transition-colors bg-white/80 rounded-full p-1 ${className}`}
        title="Sign in to add favourites"
      >
        <Heart className="w-full h-full" />
      </button>
    );
  }

  return (
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
      title={isFavourited ? 'Remove from favourites' : 'Add to favourites'}
    >
      <Heart 
        className={`w-full h-full ${isFavourited ? 'fill-current' : ''}`} 
      />
    </button>
  );
}
