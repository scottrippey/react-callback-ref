import { useRef } from "react";

/**
 * Behaves exactly like `useCallback`, with 2 differences:
 * - No dependency list required
 * - The returned callback will ALWAYS be the same exact reference,
 *   even though calling it will always call the latest callback.
 *   This is extremely useful for memoization.
 */
export function useCallbackRef<TCallback extends Function>(callback: TCallback): TCallback {
  type CallbackWrapper = TCallback & { update(latestCallback: TCallback): void };
  const wrapper = useRef<CallbackWrapper>();

  // Create or update the callback wrapper:
  if (!wrapper.current) {
    // @ts-ignore - The generics are not easy to appease!
    wrapper.current = (...args) => callback(...args);
    wrapper.current!.update = (cb) => (callback = cb);
  } else {
    wrapper.current.update(callback!);
  }

  // Return the wrapper:
  return wrapper.current!;
}
