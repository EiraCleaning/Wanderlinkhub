'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Calendar, Plus, User, LogOut } from 'lucide-react';
import Image from 'next/image';
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

export default function DesktopNav() {
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
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      router.push('/');
    }
  };

  return (
    <header className="hidden md:block bg-white border-b border-[var(--wl-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-32 h-32 flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="WanderLink Hub Logo" 
                  width={128} 
                  height={128} 
                  className="w-32 h-32"
                />
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-8" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-[var(--wl-forest)] bg-[var(--wl-beige)]' 
                      : 'text-[var(--wl-slate)] hover:text-[var(--wl-forest)] hover:bg-[var(--wl-beige)]'
                  }`}
                  aria-label={item.ariaLabel}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon 
                    size={20} 
                    className={isActive ? 'text-[var(--wl-forest)]' : 'text-[var(--wl-slate)]'}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - user menu or sign in */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-md">
                <User size={20} />
                <span className="hidden lg:block">Loading...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-4 py-2 bg-[var(--wl-forest)] text-white rounded-md hover:bg-[var(--wl-forest)]/90 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden lg:block">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden lg:block">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="flex items-center space-x-2 px-4 py-2 bg-[var(--wl-forest)] text-white rounded-md hover:bg-[var(--wl-forest)]/90 transition-colors"
              >
                <User size={20} />
                <span className="hidden lg:block">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 