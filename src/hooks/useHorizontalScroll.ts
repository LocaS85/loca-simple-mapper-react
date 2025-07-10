import { useEffect, useRef, useCallback } from 'react';

interface UseHorizontalScrollOptions {
  sensitivity?: number;
  momentum?: boolean;
}

export const useHorizontalScroll = (
  options: UseHorizontalScrollOptions = {}
) => {
  const { sensitivity = 1, momentum = true } = options;
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!scrollRef.current) return;
    
    const container = scrollRef.current;
    const isScrollable = container.scrollWidth > container.clientWidth;
    
    if (isScrollable && Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      e.preventDefault();
      
      const scrollAmount = e.deltaY * sensitivity;
      
      if (momentum) {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  }, [sensitivity, momentum]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return scrollRef;
};