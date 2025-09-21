import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import DesktopNav from './DesktopNav';
import Footer from './Footer';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

export default function AppShell({ children, className = '' }: AppShellProps) {
  return (
    <div className={`min-h-screen bg-[var(--wl-beige)] text-[var(--wl-ink)] ${className}`}>
      {/* Desktop navigation - only visible on desktop */}
      <DesktopNav />
      
      {/* Main content area with bottom padding for mobile nav */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Footer - only visible on desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Bottom navigation - only visible on mobile */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
} 