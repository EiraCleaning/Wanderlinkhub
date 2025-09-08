import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'neutral' | 'info' | 'verified' | 'pending';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'neutral', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    
    const variants = {
      success: 'bg-[var(--wl-coral)] text-[var(--wl-white)]',
      warning: 'bg-[var(--wl-sand)] text-[var(--wl-white)]',
      neutral: 'bg-[var(--wl-slate)] text-[var(--wl-white)] border border-[var(--wl-border)]',
      info: 'bg-[var(--wl-sky)]/20 text-[var(--wl-ink)]',
      verified: 'bg-[var(--wl-forest)] text-[var(--wl-white)]',
      pending: 'bg-[var(--wl-sand)] text-[var(--wl-ink)]',
    };
    
    return (
      <div
        className={cn(
          baseClasses,
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps }; 