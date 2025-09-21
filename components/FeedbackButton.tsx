'use client';

import { useState } from 'react';

interface FeedbackButtonProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export default function FeedbackButton({ variant = 'default', className = '' }: FeedbackButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSdgUZ8BsrMh5CuPW5tqXLu_Xbv_nBwgIvw7PNfe0rabNxFmMA/viewform?usp=header',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const baseClasses = "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--wl-sky)] focus:ring-offset-2";
  const colorClasses = "bg-[var(--wl-forest)] hover:bg-[var(--wl-sky)]";
  const compactClasses = variant === 'compact' ? "px-3 py-1.5 text-xs" : "";
  
  const buttonClasses = `${baseClasses} ${colorClasses} ${compactClasses} ${className}`;

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={buttonClasses}
        aria-label="Report a bug or suggest a feature"
      >
        <span>🐞</span>
        <span>Report a Bug / 💡 Suggest a Feature</span>
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
          We're rolling out new features weekly — your feedback guides us!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
