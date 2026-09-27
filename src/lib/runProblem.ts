/*
 * Runs a problem's approach code against its examples.
 * No app imports, so scripts/verify-problems.mjs can use it too.
 */

export interface RunResult {
  ok: boolean;
  got?: unknown;
  error?: string;
  ms: number;
}

const canonical = (v: unknown, anyOrder: boolean): string => {
  if (anyOrder && Array.isArray(v)) return JSON.stringify(v.map((x) => canonical(x, anyOrder)).sort());
  return JSON.stringify(v);
};

export function sameOutput(a: unknown, b: unknown, anyOrder = false) {
  return canonical(a, anyOrder) === canonical(b, anyOrder);
}

/** Compile `code` and return the function it defines under `fn`. Throws on syntax errors. */
export function compile(code: string, fn: string): (...args: unknown[]) => unknown {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const f = new Function(`${code}\nreturn ${fn};`)();
  if (typeof f !== 'function') throw new Error(`The code does not define ${fn}()`);
  return f;
}

export function runExample(code: string, fn: string, args: unknown[], expected: unknown, anyOrder = false): RunResult {
  const start = performance.now();
  try {
    const f = compile(code, fn);
    const got = f(...structuredClone(args));
    return { ok: sameOutput(got, expected, anyOrder), got, ms: performance.now() - start };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e), ms: performance.now() - start };
  }
}

/** Short display form of a value: arrays and objects as JSON, strings quoted. */
export function show(v: unknown): string {
  if (v === undefined) return 'undefined';
  if (typeof v === 'number' && !Number.isFinite(v)) return String(v);
  return JSON.stringify(v);
}
