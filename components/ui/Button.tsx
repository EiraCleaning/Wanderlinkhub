import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-[var(--wl-forest)] text-[var(--wl-white)] hover:bg-[var(--wl-forest)]/90 focus-visible:ring-[var(--wl-forest)]',
      secondary: 'bg-[var(--wl-sand)] text-[var(--wl-white)] hover:bg-[var(--wl-sand)]/90 focus-visible:ring-[var(--wl-sand)]',
      ghost: 'text-[var(--wl-forest)] hover:bg-[var(--wl-beige)] hover:text-[var(--wl-sky)] focus-visible:ring-[var(--wl-sky)]',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
    };
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps }; 