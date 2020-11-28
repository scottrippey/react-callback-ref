import { useRef } from "react";

import { CallbackRef, createCallbackRef } from "./createCallbackRef";

/**
 *
 */
export function useCallbackRefs<TProps extends object>(props: TProps): TProps {
  const resultRef = useRef<TProps>();
  if (!resultRef.current) {
    resultRef.current = {} as TProps;
  }

  const clonedProps = resultRef.current;

  const extraProps = Object.keys(resultRef.current);

  for (const _prop of Object.keys(props)) {
    const prop = _prop as keyof TProps;
    const value = props[prop];

    removeFromArray(extraProps, prop);
    const currentValue = clonedProps[prop];

    if (typeof value === "function") {
      const callbackRef = (currentValue as unknown) as
        | CallbackRef<Function>
        | undefined;
      if (callbackRef) {
        callbackRef.update(value);
      } else {
        clonedProps[prop] = createCallbackRef(value);
      }
    } else if (value !== currentValue) {
      clonedProps[prop] = value;
    }
  }

  // Clean up dropped props:
  for (const extraProp of extraProps) {
    delete clonedProps[extraProp as keyof TProps];
  }

  return clonedProps;
}

function removeFromArray(array: unknown[], value: unknown) {
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
