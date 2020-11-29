import { renderHook, HookResult } from "@testing-library/react-hooks";
import { useCallbackRef } from "./useCallbackRef";

describe("useCallbackRef", () => {
  it("is a function", () => {
    expect(typeof useCallbackRef).toBe("function");
  });

  let cb = jest.fn((...args) => args[0]);
  let result: HookResult<jest.Mock>;
  let rerender: (newProps?: { cb: jest.Mock }) => void;
  beforeEach(() => {
    cb.mockClear();
    const rendered = renderHook(({ cb }) => useCallbackRef(cb), {
      initialProps: { cb },
    });
    ({ result, rerender } = rendered);
  });

  it("should return a new function", () => {
    expect(typeof result.current).toEqual("function");
    expect(result.current).not.toBe(cb);
    expect(cb).not.toHaveBeenCalled();
  });
  it("calling the function should call the original function", () => {
    result.current();
    expect(cb).toHaveBeenCalled();
  });
  it("all params and return value should be passed through", () => {
    const returnValue = result.current(1, 2, 3);
    expect(cb).toHaveBeenCalledWith(1, 2, 3);
    expect(returnValue).toEqual(1);
  });
  describe("when the callback is updated", () => {
    let newCb = jest.fn();
    let originalCallbackRef: typeof result.current;
    beforeEach(() => {
      newCb.mockClear();
      originalCallbackRef = result.current;
      rerender({ cb: newCb });
    });
    it("the callback ref doesn't change", () => {
      expect(originalCallbackRef).toBe(result.current);
    });
    it("calling the new callback ref only calls the new callback", () => {
      result.current();
      expect(cb).not.toHaveBeenCalled();
      expect(newCb).toHaveBeenCalled();
    });
    it("same goes for the 3rd call, etc", () => {
      const thirdCb = jest.fn();
      rerender({ cb: thirdCb });
      result.current();
      expect(cb).not.toHaveBeenCalled();
      expect(newCb).not.toHaveBeenCalled();
      expect(thirdCb).toHaveBeenCalled();
    });
  });
});
