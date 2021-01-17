import "jest"; // Needed to support "module augmentation" mode

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeNear(expected: number, upperTolerance?: number, lowerTolerance?: number): R;
    }
  }
}

expect.extend({
  toBeNear(actual: number, expected: number, upperTolerance = 0.5, lowerTolerance = -upperTolerance) {
    const diff = expected - actual;
    const pass = lowerTolerance < diff && diff < upperTolerance;

    return {
      pass,
      message: () => {
        const tolerance =
          upperTolerance === -lowerTolerance ? `±${upperTolerance}` : `+${upperTolerance} -${lowerTolerance}`;
        return `expected ${actual}${pass ? " not" : ""} to be near ${expected} (${tolerance})`;
      },
    };
  },
});
