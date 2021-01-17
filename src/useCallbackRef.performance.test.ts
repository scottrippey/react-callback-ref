import { runPerfTests } from "./performanceTester";
import { renderHook } from "@testing-library/react-hooks";
import { useCallback, useMemo, useRef } from "react";
import { useCallbackRef } from "./useCallbackRef";

import "./toBeNear";

describe("useCallbackRef performance", () => {
  // let value1 = "value1";
  // let value2 = "value2";
  // let value3 = "value3";
  let value1 = 1;
  let value2 = 2;
  let value3 = 3;

  it("useCallback compared to itself", () => {
    const { results } = runPerfTests({
      useCallback1: () => {
        const { rerender } = renderHook(() => useCallback(() => value1++ + value2++, [value1, value2]));
        return () => rerender();
      },
      useCallback2: () => {
        const { rerender } = renderHook(() => useCallback(() => value1++ + value2++, [value1, value2]));
        return () => rerender();
      },
    });

    expect(results.useCallback2.score).toBeNear(100);
  });

  describe("compared to useCallback", () => {
    function testItNow(desc: string, cb: () => any) {
      // const results = cb();
      // it(desc + " (" + results.useCallbackRef.score.toFixed(1) + ") ", () => {});
    }
    testItNow("with no dependencies", () => {
      const { results } = runPerfTests({
        useCallback: () => {
          const { rerender } = renderHook(() => {
            return useCallback(() => {
              return value1;
            }, []);
          });
          return rerender;
        },
        useCallbackRef: () => {
          const { rerender } = renderHook(() => {
            return useCallbackRef(() => {
              return value1;
            });
          });
          return rerender;
        },
      });
      console.log(results);
      return results;
    });

    testItNow("with a single unchanging dependency", () => {
      const { results } = runPerfTests({
        useCallback: () => {
          const { rerender } = renderHook(() => {
            return useCallback(() => {
              return value1;
            }, [value1]);
          });
          return rerender;
        },
        useCallbackRef: () => {
          const { rerender } = renderHook(() => {
            return useCallbackRef(() => {
              return value1;
            });
          });
          return rerender;
        },
      });
      console.log(results);
      return results;
    });

    testItNow("with 2 unchanging dependencies", () => {
      const { results } = runPerfTests({
        useCallback: () => {
          const { rerender } = renderHook(() => {
            return useCallback(() => {
              return value1 + value2;
            }, [value1, value2]);
          });
          return rerender;
        },
        useCallbackRef: () => {
          const { rerender } = renderHook(() => {
            return useCallbackRef(() => {
              return value1 + value2;
            });
          });
          return rerender;
        },
      });
      console.log(results);
      return results;
    });

    testItNow("with 3 unchanging dependencies", () => {
      const { results } = runPerfTests({
        useCallback: () => {
          const { rerender } = renderHook(() => {
            return useCallback(() => {
              return value1 + value2 + value3;
            }, [value1, value2, value3]);
          });
          return rerender;
        },
        useCallbackRef: () => {
          const { rerender } = renderHook(() => {
            return useCallbackRef(() => {
              return value1 + value2 + value3;
            });
          });
          return rerender;
        },
      });
      console.log(results);
      return results;
    });

    testItNow("with a single changing dependency", () => {
      const { results } = runPerfTests({
        useCallback: () => {
          const { rerender } = renderHook(() => {
            return useCallback(() => {
              return value1 + value2;
            }, [{}]);
          });
          return rerender;
        },
        useCallbackRef: () => {
          const { rerender } = renderHook(() => {
            return useCallbackRef(() => {
              return value1 + value2;
            });
          });
          return rerender;
        },
      });
      console.log(results);
      return results;
    });

    testItNow("with multiple changing dependencies", () => {
      const { results } = runPerfTests({
        useCallback: () => {
          const { rerender } = renderHook(() => {
            return useCallback(() => {
              return value1 + value2;
            }, [{}, {}, {}]);
          });
          return rerender;
        },
        useCallbackRef: () => {
          const { rerender } = renderHook(() => {
            return useCallbackRef(() => {
              return value1 + value2;
            });
          });
          return rerender;
        },
      });
      console.log(results);
      return results;
    });
  });
});

it("testing useMemo vs useRef", () => {
  const createThing = () => {
    return "HEY!".toLowerCase();
  };
  const noDeps = [] as never[];

  const { results } = runPerfTests({
    useRef: () => {
      const { rerender } = renderHook(() => {
        const ref = useRef<ReturnType<typeof createThing> | null>(null);
        if (!ref.current) {
          ref.current = createThing();
        }
        return ref.current!;
      });
      return rerender;
    },
    useMemo: () => {
      const { rerender } = renderHook(() => useMemo(createThing, noDeps));
      return rerender;
    },
  });
  console.log(results);
});
