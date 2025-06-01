
import { useCallback, useMemo, useRef } from 'react';

export const usePerformanceOptimization = () => {
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(Date.now());

  const trackRender = useCallback((componentName: string) => {
    renderCountRef.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎭 ${componentName} render #${renderCountRef.current} (+${timeSinceLastRender}ms)`);
    }
    
    lastRenderTimeRef.current = now;
  }, []);

  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T => {
    const timeoutRef = useRef<NodeJS.Timeout>();
    
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => func(...args), delay);
    }) as T;
  }, []);

  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): T => {
    const inThrottle = useRef(false);
    
    return ((...args: Parameters<T>) => {
      if (!inThrottle.current) {
        func(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    }) as T;
  }, []);

  const memoizedValue = useMemo;
  const memoizedCallback = useCallback;

  return {
    trackRender,
    debounce,
    throttle,
    memoizedValue,
    memoizedCallback,
    renderCount: renderCountRef.current
  };
};
