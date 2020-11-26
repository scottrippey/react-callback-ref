import { useRef } from 'react';

import { CallbackRef, createCallbackRef } from './createCallbackRef';

/**
 *
 */
export function useCallbackRef<TCallback extends Function>(callback: TCallback): TCallback {
  const ref = useRef<CallbackRef<TCallback>>();
  if (!ref.current) {
    ref.current = createCallbackRef(callback);
  } else {
    ref.current.update(callback);
  }
  return ref.current!;
}
