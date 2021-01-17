import { renderHook } from "@testing-library/react-hooks";

import { useCallbackRef } from "./useCallbackRef";

describe("useCallbackRef", () => {
  it("is a function", () => {
    expect(typeof useCallbackRef).toBe("function");
  });

  let callback = jest.fn((...args) => args);
  let callbackRef: jest.Mock;
  let rerender: (newCallback?: jest.Mock) => void;
  beforeEach(() => {
    jest.clearAllMocks();

    rerender = renderHook(
      (cb) => {
        callbackRef = useCallbackRef(cb);
      },
      { initialProps: callback }
    ).rerender;
  });

  it("should return a new function", () => {
    expect(typeof callbackRef).toEqual("function");
    expect(callbackRef).not.toBe(callback);
    expect(callback).not.toHaveBeenCalled();
  });

  it("calling the callbackRef should call the original callback", () => {
    callbackRef();
    expect(callback).toHaveBeenCalled();
  });

  it("all params and return value should be passed through", () => {
    const returnValue = callbackRef(1, 2, 3);
    expect(callback).toHaveBeenCalledWith(1, 2, 3);
    expect(returnValue).toEqual([1, 2, 3]);
  });

  describe("when the callback is updated", () => {
    let newCallback = jest.fn();
    let originalCallbackRef: typeof callbackRef;
    beforeEach(() => {
      originalCallbackRef = callbackRef;
      rerender(newCallback);
    });

    it("the callback ref doesn't change", () => {
      expect(callbackRef).toBe(originalCallbackRef);
    });

    it("calling the callbackRef only calls the new callback", () => {
      callbackRef();
      expect(callback).not.toHaveBeenCalled();
      expect(newCallback).toHaveBeenCalled();
    });

    it("same goes for the 3rd call, etc", () => {
      const thirdCallback = jest.fn();
      rerender(thirdCallback);
      callbackRef();
      expect(callback).not.toHaveBeenCalled();
      expect(newCallback).not.toHaveBeenCalled();
      expect(thirdCallback).toHaveBeenCalled();
    });
  });
});
