import { useEffect, useState, useRef } from 'react';

export function useStickyOnScroll() {
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { 
        rootMargin: '0px 0px 0px 0px', 
        threshold: 0 
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { stuck, sentinelRef };
}

