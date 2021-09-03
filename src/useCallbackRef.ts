import { useRef } from "react";

export type CallbackRef<TCallback extends Function> = TCallback & {
  update(newCallback: TCallback): void;
};

/**
 * Behaves exactly like `useCallback`, with 2 differences:
 * - Dependency list not required
 * - It returns a callback wrapper that will ALWAYS be the same exact reference,
 *   and calling it will always call the latest callback.
 *   This is extremely useful for memoization.
 */
export function useCallbackRef<TCallback extends Function>(callback: TCallback): TCallback {
  const wrapper = useRef<CallbackRef<TCallback>>();

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
