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

  const extraProps = Object.keys(resultRef.current) as (keyof TProps)[];
  const newProps = Object.keys(props) as (keyof TProps)[];

  for (const prop of newProps) {
    removeFromArray(extraProps, prop);

    const newValue = props[prop];
    const currentValue = clonedProps[prop] as unknown;

    if (typeof newValue === "function") {
      const callbackRef = currentValue as CallbackRef<Function> | undefined;
      if (
        // Make sure it's a CallbackRef:
        typeof callbackRef === "function" &&
        typeof callbackRef.update === "function"
      ) {
        callbackRef.update(newValue);
      } else {
        clonedProps[prop] = createCallbackRef(newValue);
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
