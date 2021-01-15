import { renderHook } from "@testing-library/react-hooks";
import { useCallbackRefs } from "./useCallbackRefs";

describe("useCallbackRefs", () => {
  type TestProps = {
    value?: unknown;
    onChange?: Function;
    onTest?: Function;
  };

  const originalProps: TestProps = {
    value: ["this object should be copied"],
    onChange: jest.fn((...args) => args),
    onTest: jest.fn((...args) => args),
  };
  let props: TestProps;
  let rerender: (newProps: TestProps) => void;
  beforeEach(() => {
    jest.clearAllMocks();

    rerender = renderHook(
      (cb) => {
        props = useCallbackRefs(cb);
      },
      { initialProps: originalProps }
    ).rerender;
  });

  it("should create a copy of props", () => {
    expect(props).not.toBe(originalProps);
    expect(Object.keys(props)).toEqual(Object.keys(originalProps));
  });

  it("the values should all be copied", async () => {
    expect(props.value).toBe(originalProps.value);
    expect(props.value).toEqual(["this object should be copied"]);
  });

  it("the functions should all be callbackRefs", () => {
    expect(typeof props.onChange).toBe("function");
    expect(typeof props.onTest).toBe("function");
    expect(props.onChange).not.toBe(originalProps.onChange);
    expect(props.onTest).not.toBe(originalProps.onTest);
  });

  it("calling the callback calls the original function", () => {
    props.onChange!("one", "two");
    expect(originalProps.onChange).toHaveBeenCalledWith("one", "two");
    expect(originalProps.onChange).toHaveReturnedWith(["one", "two"]);

    props.onTest!("test");
    expect(originalProps.onTest).toHaveBeenCalledWith("test");
    expect(originalProps.onTest).toHaveReturnedWith(["test"]);
  });

  describe("when updating the props", () => {
    it("the callbackRefs stay the same", () => {
      const firstProps = { ...props };
      const newProps: TestProps = {
        onChange: jest.fn(),
        onTest: jest.fn(),
      };
      rerender(newProps);

      expect(props.onChange).toBe(firstProps.onChange);
      expect(props.onTest).toBe(firstProps.onTest);
    });

    it("the props always match properly", () => {
      const newValue = ["new value"];
      rerender({ value: newValue });
      expect(props).toEqual({ value: newValue });

      rerender({});
      expect(props).toEqual({});

      rerender({ value: "new value", onChange: jest.fn() });
      expect(props).toEqual({
        value: "new value",
        onChange: expect.any(Function),
      });
    });

    it("the callbackRefs only call the latest callbacks", () => {
      let newProps: TestProps = { onChange: jest.fn() };
      rerender(newProps);

      props.onChange!("test");
      expect(originalProps.onChange).not.toHaveBeenCalled();
      expect(newProps.onChange).toHaveBeenCalled();

      newProps = { onTest: jest.fn() };
      rerender(newProps);
      props.onTest!("test");
      expect(originalProps.onTest).not.toHaveBeenCalled();
      expect(newProps.onTest).toHaveBeenCalled();
    });
  });
});
