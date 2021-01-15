export type CallbackRef<TCallback extends Function> = TCallback & {
  update(newCallback: TCallback): void;
};

/**
 *
 */
export function createCallbackRef<TCallback extends Function>(
  callback: TCallback
): CallbackRef<TCallback> {
  let current = callback;

  // @ts-ignore - The generics are not easy to appease!
  const callbackRef: CallbackRef<TCallback> = (...args) => {
    return current(...args);
  };

  callbackRef.update = (newCallback: TCallback) => {
    current = newCallback;
  };

  return callbackRef;
}
