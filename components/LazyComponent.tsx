'use client';

import { Suspense } from 'react';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function LazyComponent({ children, fallback }: LazyComponentProps) {
  return (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-200 rounded h-32" />}>
      {children}
    </Suspense>
  );
}
