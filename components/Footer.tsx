'use client';

import Link from 'next/link';
import Image from 'next/image';
import FeedbackButton from './FeedbackButton';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--wl-border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image 
                src="/logo.png" 
                alt="WanderLink Hub Logo" 
                width={64} 
                height={64} 
                className="w-16 h-16"
              />
              <span className="ml-3 text-xl font-bold text-[var(--wl-ink)]">WanderLink Hub</span>
            </Link>
            <p className="text-[var(--wl-slate)] text-sm max-w-md">
              Connecting families with amazing worldschooling events and hubs around the globe. 
              Discover, explore, and create unforgettable learning adventures together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--wl-ink)] uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/explore" className="text-[var(--wl-slate)] hover:text-[var(--wl-forest)] text-sm transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-[var(--wl-slate)] hover:text-[var(--wl-forest)] text-sm transition-colors">
                  Event Calendar
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[var(--wl-slate)] hover:text-[var(--wl-forest)] text-sm transition-colors">
                  Submit Listing
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[var(--wl-slate)] hover:text-[var(--wl-forest)] text-sm transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--wl-ink)] uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/signin" className="text-[var(--wl-slate)] hover:text-[var(--wl-forest)] text-sm transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <FeedbackButton variant="compact" />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[var(--wl-border)]">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-[var(--wl-slate)] text-sm">
              © 2025 WanderLink Hub. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <FeedbackButton variant="compact" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
