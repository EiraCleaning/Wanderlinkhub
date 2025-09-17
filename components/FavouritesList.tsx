'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ListingCard } from '@/components/listing/ListingCard';
import { formatPrice } from '@/lib/map';
import { Heart } from 'lucide-react';

interface FavouriteListing {
  id: string;
  title: string;
  ltype: 'hub' | 'event';
  description: string;
  city?: string;
  country?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  photos?: string[];
  verify: 'verified' | 'pending' | 'rejected';
}

interface Favourite {
  id: string;
  created_at: string;
  listings: FavouriteListing;
}

interface FavouritesListProps {
  user?: any;
}

export default function FavouritesList({ user }: FavouritesListProps) {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      fetchFavourites();
    } else {
      setIsAuthenticated(false);
      setFavourites([]);
    }
  }, [user]);


  const fetchFavourites = async () => {
    try {
      console.log('FavouritesList: Starting fetchFavourites, user:', !!user);
      
      // Use shared supabase client
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.log('FavouritesList: No access token available');
        setIsAuthenticated(false);
        return;
      }

      console.log('FavouritesList: Making API call to /api/favourites');
      const response = await fetch('/api/favourites', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      console.log('FavouritesList: API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('FavouritesList: API response data:', data);
        setFavourites(data.favourites || []);
      } else {
        const errorText = await response.text();
        console.error('FavouritesList: Failed to fetch favourites:', response.status, errorText);
      }
    } catch (error) {
      console.error('FavouritesList: Error fetching favourites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavouriteRemoved = (listingId: string) => {
    setFavourites(prev => prev.filter(fav => fav.listings.id !== listingId));
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to view favourites</h3>
        <p className="text-gray-600 mb-4">
          Sign in to save your favourite events and hubs
        </p>
        <a
          href="/signin"
          className="inline-flex items-center px-4 py-2 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No favourites yet</h3>
        <p className="text-gray-600 mb-4">
          Start exploring events and hubs to add them to your favourites
        </p>
        <a
          href="/explore"
          className="inline-flex items-center px-4 py-2 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 transition-colors"
        >
          Explore Events
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          My Favourites ({favourites.length})
        </h3>
      </div>
      
      <div className="grid gap-4">
        {favourites.map((favourite) => {
          const listing = favourite.listings;
          return (
            <div key={favourite.id} className="relative">
              <ListingCard
                id={listing.id}
                type={listing.ltype}
                title={listing.title}
                city={listing.city}
                country={listing.country}
                startDate={listing.start_date}
                endDate={listing.end_date}
                price={listing.price ? formatPrice(listing.price) : undefined}
                status={listing.verify === 'rejected' ? 'pending' : listing.verify}
                imageUrl={listing.photos && listing.photos.length > 0 ? listing.photos[0] : undefined}
                href={`/listing/${listing.id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
