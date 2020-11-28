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
  return (Object.assign(
    function callbackRef(...args: unknown[]) {
      return current(...args);
    },
    {
      update(newCallback: TCallback) {
        current = newCallback;
      },
    }
  ) as unknown) as CallbackRef<TCallback>;
}
