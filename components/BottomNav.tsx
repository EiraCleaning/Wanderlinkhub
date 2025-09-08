'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Calendar, Plus, User } from 'lucide-react';

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
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
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