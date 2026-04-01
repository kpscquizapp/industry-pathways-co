import { useCallback, useEffect, useRef, useState } from "react";

export const useDebounce = <T>(value: T, delayMs: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isImmediate = delayMs <= 0;

  useEffect(() => {
    if (isImmediate) return;

    const timerId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [value, delayMs, isImmediate]);

  return isImmediate ? value : debouncedValue;
};

export const useDebouncedCallback = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number = 300
): ((...args: Args) => void) => {
  const callbackRef = useRef(callback);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    []
  );

  return useCallback(
    (...args: Args) => {
      if (delayMs <= 0) {
        callbackRef.current(...args);
        return;
      }

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs]
  );
};
