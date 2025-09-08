import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Calendar, Plus, User } from 'lucide-react';
import Image from 'next/image';

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

          {/* Right side - could add user menu, notifications, etc. */}
          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="flex items-center space-x-2 px-4 py-2 bg-[var(--wl-forest)] text-white rounded-md hover:bg-[var(--wl-forest)]/90 transition-colors"
            >
              <User size={20} />
              <span className="hidden lg:block">Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 