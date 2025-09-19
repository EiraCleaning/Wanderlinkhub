'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Calendar, Plus, User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  {
    href: '/explore',
    label: 'Explore',
    icon: Map,
    ariaLabel: 'Explore events and hubs'
  },
  {
    href: '/calendar',
    label: 'Calendar',
    icon: Calendar,
    ariaLabel: 'View event calendar'
  },
  {
    href: '/submit',
    label: 'Submit',
    icon: Plus,
    ariaLabel: 'Submit new listing'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: User,
    ariaLabel: 'User profile and settings'
  }
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear any Google OAuth state by redirecting to Google's logout
      // This ensures the next Google sign-in will ask for account selection
      window.location.href = 'https://accounts.google.com/logout';
      
      // Redirect to home after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: just redirect to home
      router.push('/');
    }
  };

  // Create nav items based on auth status
  const getNavItems = () => {
    if (isLoading) {
      return [
        ...navItems.slice(0, 3), // Explore, Calendar, Submit
        {
          href: '#',
          label: 'Loading...',
          icon: User,
          ariaLabel: 'Loading user menu'
        }
      ];
    }

    if (user) {
      return [
        ...navItems.slice(0, 3), // Explore, Calendar, Submit
        {
          href: '/profile',
          label: 'Profile',
          icon: User,
          ariaLabel: 'User profile and settings'
        },
        {
          href: '#',
          label: 'Logout',
          icon: LogOut,
          ariaLabel: 'Sign out',
          onClick: handleLogout
        }
      ];
    }

    return [
      ...navItems.slice(0, 3), // Explore, Calendar, Submit
      {
        href: '/signin',
        label: 'Sign In',
        icon: User,
        ariaLabel: 'Sign in to your account'
      }
    ];
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--wl-border)] safe-area-bottom"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(64px + env(safe-area-inset-bottom))'
      }}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-4">
        {getNavItems().map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          // Handle logout button differently
          if (item.onClick) {
            return (
              <button
                key={`${item.label}-${index}`}
                onClick={item.onClick}
                className={`flex flex-col items-center justify-center min-w-0 flex-1 h-full transition-colors ${
                  'text-[var(--wl-slate)] hover:text-[var(--wl-forest)]'
                }`}
                aria-label={item.ariaLabel}
              >
                <Icon 
                  size={24} 
                  className={`mb-1 ${
                    'text-[var(--wl-slate)]'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-0 flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-[var(--wl-forest)]' 
                  : 'text-[var(--wl-slate)] hover:text-[var(--wl-forest)]'
              }`}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon 
                size={24} 
                className={`mb-1 ${
                  isActive ? 'text-[var(--wl-forest)]' : 'text-[var(--wl-slate)]'
                }`}
                aria-hidden="true"
              />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 