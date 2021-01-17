export type InitializeFunction = () => RenderFunction;
export type RenderFunction = (renderCount: number) => void;
export type TestsObject = Record<string, InitializeFunction>;

function adjustBatchSize(
  batchSize: number,
  elapsed: number,
  duration: number,
  renderCount: number
) {
  const estimatedTotal = Math.ceil((renderCount * duration) / elapsed);
  const estimatedRemaining = estimatedTotal - renderCount;

  batchSize = Math.max(1, Math.min(estimatedTotal >> 2, estimatedRemaining));

  // if (batchSize === 1) {
  //   batchSize = 5;
  // } else if (renderCount < estimatedRemaining) {
  //   batchSize = estimatedRemaining >> 1;
  // } else {
  //   batchSize = estimatedRemaining;
  // }

  // console.log({
  //   elapsed,
  //   duration,
  //   renderCount,
  //   estimatedTotal,
  //   estimatedRemaining,
  //   nextBatchSize: batchSize,
  // });

  return batchSize;
}

export function runPerfTests<TTest extends TestsObject>({
  duration = 1000,
  ...tests
}: TTest & {
  duration?: number;
}) {
  const testNames = Object.keys(tests) as Array<keyof TTest>;
  const testMethods = Object.values(tests) as Array<() => () => void>;
  const testCount = testMethods.length;

  if (testCount === 0) {
    throw new Error("Must specify at least one test case!");
  }

  let renderMethods: RenderFunction[] = new Array(testCount);
  let initializeTimes: number[] = new Array(testCount);
  let renderTimes: number[] = new Array(testCount).fill(0);

  let renderCount = 0;
  let batchSize = 1;

  // Start your engines!
  let start = performance.now();
  let stop = start + duration;

  // Initialize:
  let now = start;
  for (let i = 0; i < testCount; i++) {
    renderMethods[i] = testMethods[i]();

    const newNow = performance.now();
    initializeTimes[i] = newNow - now;
    now = newNow;
  }

  // Repeat:
  const durationLeft = stop - now;
  const renderStart = now;
  do {
    for (let testIndex = 0; testIndex < testCount; testIndex++) {
      const renderMethod = renderMethods[testIndex];

      const batchStop = renderCount + batchSize;
      now = performance.now();
      for (let renderNumber = renderCount; renderNumber < batchStop; renderNumber++) {
        renderMethod(renderNumber);
      }

      const newNow = performance.now();
      // if (batchSize)
      renderTimes[testIndex] += newNow - now;
      now = newNow;
    }
    renderCount += batchSize;

    batchSize = adjustBatchSize(batchSize, now - renderStart, durationLeft, renderCount);
  } while (now < stop);

  // Done!
  return new PerformanceTestResults<TTest>(testNames, initializeTimes, renderTimes, renderCount);
}

export class PerformanceTestResults<TTests extends TestsObject> {
  constructor(
    public testNames: Array<keyof TTests>,
    public initializeTimes: number[],
    public renderTimes: number[],
    public renderCount: number
  ) {}

  relativePerformance = this.getRelativePerformance();
  getRelativePerformance() {
    const { renderTimes } = this;

    let baseline = renderTimes[0];
    return renderTimes.map((time) => time / baseline);
  }

  rendersPerSecond = this.getRendersPerSecond();
  getRendersPerSecond() {
    const { renderTimes, renderCount } = this;

    return renderTimes.map((time) => renderCount / time);
  }

  scores = this.getScores();
  getScores() {
    const { renderTimes } = this;
    const baseline = renderTimes[0];
    console.log({
      baseline,
      renderTimes,
      scores: renderTimes.map((time) => (100 * baseline) / time),
    });

    return renderTimes.map((time) => (100 * baseline) / time);
  }

  results = this.getResults();
  getResults() {
    const { testNames, initializeTimes, renderTimes, rendersPerSecond, scores, renderCount } = this;

    const results = {} as Record<keyof TTests, any>;
    testNames.forEach((_, i) => {
      results[testNames[i]] = {
        name: testNames[i],
        initializeTime: initializeTimes[i],
        renderTime: renderTimes[i],
        rendersPerSecond: rendersPerSecond[i],
        score: scores[i],
        renderCount,
      };
    });
    return results;
  }
}
