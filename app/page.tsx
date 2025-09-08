'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/explore');
  }, [router]);
  
  return (
    <AppShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-64 h-64 flex items-center justify-center mx-auto mb-4">
              <Image 
                src="/logo.png" 
                alt="WanderLink Hub Logo" 
                width={256} 
                height={256} 
                className="w-64 h-64"
              />
            </div>
            <p className="text-[var(--wl-slate)] brand-subtitle">
              Family-Friendly Events & Hubs
            </p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--wl-forest)] mx-auto mb-4"></div>
          <p className="text-[var(--wl-slate)]">Redirecting to explore...</p>
        </div>
      </div>
    </AppShell>
  );
}
