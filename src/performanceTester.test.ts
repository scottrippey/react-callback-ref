import { runPerfTests } from "./performanceTester";
import "./toBeNear";

describe("runPerfTests", () => {
  it("simple for loops", () => {
    const results = runPerfTests({
      for1000: () => () => {
        let dummy = 0;
        for (let i = 0; i < 1000; i++) {
          dummy += dummy;
        }
      },
      for2000: () => () => {
        let dummy = 0;
        for (let i = 0; i < 2000; i++) {
          dummy += dummy;
        }
      },
      for10000: () => () => {
        let dummy = 0;
        for (let i = 0; i < 10000; i++) {
          dummy += dummy;
        }
      },
    });

    console.log(results.results);

    expect(results.results.for1000.score).toBeNear(100, +0.1);
    expect(results.results.for2000.score).toBeNear(50, +1, -5);
    expect(results.results.for10000.score).toBeNear(10, +1, -1);
  });
});
