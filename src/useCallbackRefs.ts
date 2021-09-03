import { useRef } from "react";

export type CallbackRef<TCallback extends Function> = TCallback & {
  update(newCallback: TCallback): void;
};

/**
 *
 */
export function useCallbackRefs<TProps extends object>(props: TProps): TProps {
  const resultRef = useRef<TProps>();

  if (!resultRef.current) {
    resultRef.current = {} as TProps;
  }

  const clonedProps = resultRef.current;

  const extraProps = Object.keys(resultRef.current) as Array<keyof TProps>;
  const newProps = Object.keys(props) as Array<keyof TProps>;

  for (const prop of newProps) {
    removeFromArray(extraProps, prop);

    let newValue = props[prop];
    const previousValue = clonedProps[prop] as unknown;

    if (typeof newValue === "function") {
      let callbackRef = previousValue as CallbackRef<Function> | undefined;
      if (
        // Make sure it's a CallbackRef:
        typeof callbackRef === "function" &&
        typeof callbackRef.update === "function"
      ) {
        callbackRef.update(newValue);
      } else {
        // Create the callback ref:
        let callback: Function = newValue;
        // @ts-ignore
        callbackRef = (...args) => callback(...args);
        callbackRef!.update = (cb) => (callback = cb);
        // @ts-ignore
        clonedProps[prop] = callbackRef;
      }
    } else {
      clonedProps[prop] = newValue;
    }
  }

  // Clean up dropped props:
  for (const extraProp of extraProps) {
    delete clonedProps[extraProp];
  }

  return clonedProps;
}

function removeFromArray(array: unknown[], value: unknown) {
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
