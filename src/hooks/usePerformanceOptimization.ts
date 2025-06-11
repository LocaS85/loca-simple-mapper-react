
import { useCallback, useMemo } from 'react';

interface PerformanceConfig {
  enableVirtualization?: boolean;
  debounceMs?: number;
  throttleMs?: number;
  enableMemoization?: boolean;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    enableVirtualization = true,
    debounceMs = 300,
    throttleMs = 100,
    enableMemoization = true
  } = config;

  const optimizedConfig = useMemo(() => ({
    isProduction: import.meta.env.PROD,
    enableVirtualization,
    debounceMs,
    throttleMs,
    enableMemoization
  }), [enableVirtualization, debounceMs, throttleMs, enableMemoization]);

  const createDebounce = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const createThrottle = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          func.apply(null, args);
          timeoutId = null;
        }, delay);
      }
    };
  }, []);

  return {
    config: optimizedConfig,
    debounce: createDebounce,
    throttle: createThrottle
  };
};
