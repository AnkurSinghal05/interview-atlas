import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'memoization',
  title: 'Memoization',
  level: 'intermediate',
  masteryMinutes: 60,
  tags: ['caching', 'pure functions', 'closures', 'dynamic programming'],
  summary: 'Memoization caches a function\'s results by its arguments, so repeated calls with the same input return instantly.',
  keyPoints: [
    {
      title: 'Cache in a closure',
      text: 'A wrapper keeps a `Map` from arguments to results. On a hit it returns the cached value; on a miss it calls through and stores it.',
    },
    {
      title: 'Only for pure functions',
      text: 'The result must depend only on the arguments. Caching `Date.now()` or a network call gives stale answers.',
    },
    {
      title: 'Cache keys are the hard part',
      text: 'One primitive argument is easy. Multiple arguments need a key (e.g. `JSON.stringify(args)`), and object arguments compare by reference.',
    },
    {
      title: 'Trade memory for speed',
      text: 'An unbounded cache can grow forever. Use an LRU limit or a `WeakMap` for object keys.',
    },
  ],
  qa: [
    {
      q: 'Implement a `memoize` function.',
      tag: 'Coding',
      a: ['Wrap the function, build a key from the arguments, and cache in a `Map`.'],
      code: c(`
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`),
    },
    {
      q: 'Memoize a recursive Fibonacci.',
      tag: 'Coding',
      a: ['The recursive calls must go through the cache too, or you only cache the outer call.'],
      code: c(`
const fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
fib(50); // fast: O(n) instead of O(2^n)`),
    },
    {
      q: 'What are the downsides of memoization?',
      a: [
        'Memory use grows with every distinct input.',
        'Wrong results if the function is impure.',
        'Key building (like `JSON.stringify`) has its own cost and can collide for values like `undefined` vs `null`.',
      ],
    },
    {
      q: 'Where is memoization used in frameworks?',
      a: ['React\'s `useMemo`, `useCallback` and `React.memo`, and selector libraries like Reselect.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function memoize(fn) {
  const cache = {};
  return (n) => (n in cache ? cache[n] : (cache[n] = fn(n)));
}
let calls = 0;
const square = memoize((n) => { calls++; return n * n; });
square(4); square(4); square(5);
console.log(calls);`),
      options: ['2', '3', '1', '0'],
      answer: 0,
      explain: 'The second `square(4)` is served from the cache, so the real function runs twice.',
    },
    {
      type: 'output',
      code: c(`
function memoize(fn) {
  const cache = new Map();
  return (obj) => {
    if (!cache.has(obj)) cache.set(obj, fn(obj));
    return cache.get(obj);
  };
}
let runs = 0;
const keys = memoize((o) => { runs++; return Object.keys(o); });
keys({ a: 1 });
keys({ a: 1 });
console.log(runs);`),
      options: ['2', '1', '0', 'TypeError'],
      answer: 0,
      explain: 'Two object literals are different references, so they are different cache keys.',
    },
    {
      type: 'output',
      code: c(`
function memoize(fn) {
  const cache = new Map();
  return (n) => cache.has(n) ? cache.get(n) : (cache.set(n, fn(n)), cache.get(n));
}
let calls = 0;
const fib = memoize((n) => { calls++; return n < 2 ? n : fib(n - 1) + fib(n - 2); });
console.log(fib(10), calls);`),
      options: ['55 11', '55 177', '89 11', '55 10'],
      answer: 0,
      explain: 'Each `n` from 0 to 10 is computed once, so 11 real calls instead of 177.',
    },
    {
      type: 'truefalse',
      statement: 'It is safe to memoize a function that returns `Math.random()`.',
      answer: false,
      explain: 'Memoization assumes the same input always gives the same output. A random function would return the same "random" value forever.',
    },
  ],
};

export default topic;
