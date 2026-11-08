import { useEffect, useRef, useCallback } from 'react';

export function useThrottledCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  limitMs: number = 150
): (...args: Parameters<T>) => void {
  const lastRanTimestamp = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedCallback = useRef<T>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeRemaining = limitMs - (now - lastRanTimestamp.current);

      if (timeRemaining <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastRanTimestamp.current = now;
        savedCallback.current(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastRanTimestamp.current = Date.now();
          timeoutRef.current = null;
          savedCallback.current(...args);
        }, timeRemaining);
      }
    },
    [limitMs]
  );
}

// Attaches a throttled passive scroll listener to `window`

export function useThrottledScroll(
  onScroll: () => void,
  limitMs: number = 150
): void {
  const throttledScrollHandler = useThrottledCallback(onScroll, limitMs);

  useEffect(() => {
    throttledScrollHandler();
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [throttledScrollHandler]);
}