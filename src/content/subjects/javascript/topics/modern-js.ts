import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'modern-js',
  title: 'Modern JS (ES2022+)',
  level: 'intermediate',
  masteryMinutes: 60,
  tags: ['toSorted', 'findLast', 'groupBy', 'Set methods', 'iterator helpers', 'Array.fromAsync'],
  summary: 'The newer built-ins interviewers now expect you to know: non-mutating array copies, `findLast`, `groupBy`, Set algebra and iterator helpers.',
  keyPoints: [
    {
      title: 'Change-by-copy array methods',
      text: '`toSorted`, `toReversed`, `toSpliced` and `with(index, value)` return a new array and leave the original alone.',
      code: c(`
const nums = [3, 1, 2];
nums.toSorted();   // [1, 2, 3]
nums.with(0, 9);   // [9, 1, 2]
nums;              // [3, 1, 2] unchanged`),
    },
    {
      title: 'Search from the end',
      text: '`findLast` and `findLastIndex` work like `find`/`findIndex` but scan right to left. `at(-1)` reads the last item.',
    },
    {
      title: 'Grouping',
      text: '`Object.groupBy(items, fn)` returns a null-prototype object of arrays. `Map.groupBy` does the same with a `Map`, so keys can be any value.',
      code: c(`
Object.groupBy([1, 2, 3, 4], (n) => (n % 2 ? 'odd' : 'even'));
// { odd: [1, 3], even: [2, 4] }`),
    },
    {
      title: 'Sets and iterators grew up',
      text: 'Sets have `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`. Iterators have lazy `.map`, `.filter`, `.take`, `.drop` and `.toArray()`.',
    },
  ],
  qa: [
    {
      q: 'What are the immutable array methods (`toSorted`, `toReversed`, `toSpliced`, `with`)?',
      tag: 'Asked often',
      a: [
        'Copying versions of `sort`, `reverse`, `splice` and index assignment.',
        'They return a new array, which suits React state and other code that must not mutate.',
        '`with(i, v)` throws a `RangeError` for an out-of-range index instead of growing the array.',
      ],
    },
    {
      q: 'What does `Array.prototype.findLast()` do?',
      a: ['Returns the last element that matches the callback (or `undefined`). `findLastIndex` returns its index (or -1). Useful for "most recent" lookups without reversing.'],
    },
    {
      q: 'What are `Object.groupBy()` and `Map.groupBy()`?',
      a: [
        'Both group an iterable by the key your callback returns.',
        '`Object.groupBy` gives a plain object with a `null` prototype (keys become strings).',
        '`Map.groupBy` gives a `Map`, so you can group by objects or keep number keys as numbers.',
      ],
    },
    {
      q: 'What are the new Set methods?',
      a: [
        '`a.union(b)`, `a.intersection(b)`, `a.difference(b)`, `a.symmetricDifference(b)` return new Sets.',
        '`a.isSubsetOf(b)`, `a.isSupersetOf(b)`, `a.isDisjointFrom(b)` return booleans.',
      ],
    },
    {
      q: 'What are iterator helpers?',
      a: [
        'Methods like `.map`, `.filter`, `.take`, `.drop`, `.flatMap`, `.reduce` and `.toArray` directly on iterators (for example from a generator or `map.keys()`).',
        'They are **lazy**: values are produced one at a time, so they work on infinite sequences without building arrays.',
      ],
      code: c(`
function* naturals() { let n = 1; while (true) yield n++; }
naturals().filter((n) => n % 2).map((n) => n * n).take(3).toArray(); // [1, 9, 25]`),
    },
    {
      q: 'What is `Array.fromAsync`?',
      a: [
        'Like `Array.from`, but it accepts async iterables (or iterables of promises) and returns a **promise** of the array.',
        'Example: `await Array.fromAsync(readLines(file))` collects every line from an async generator.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const scores = [30, 10, 20];
const sorted = scores.toSorted((a, b) => a - b);
const changed = scores.with(1, 99);
console.log(scores, sorted, changed);`),
      options: ['[ 30, 10, 20 ] [ 10, 20, 30 ] [ 30, 99, 20 ]', '[ 10, 20, 30 ] [ 10, 20, 30 ] [ 10, 99, 30 ]', '[ 30, 99, 20 ] [ 10, 20, 30 ] [ 30, 99, 20 ]', 'TypeError'],
      answer: 0,
      explain: 'The change-by-copy methods never touch the original array.',
    },
    {
      type: 'output',
      code: c(`
const events = [
  { id: 1, type: 'click' },
  { id: 2, type: 'view' },
  { id: 3, type: 'click' },
];
console.log(events.findLast((e) => e.type === 'click').id, events.findLastIndex((e) => e.type === 'buy'));`),
      options: ['3 -1', '1 -1', '3 undefined', '1 2'],
      answer: 0,
      explain: '`findLast` scans from the end, so it finds id 3. No match gives -1 for the index version.',
    },
    {
      type: 'output',
      code: c(`
const grouped = Object.groupBy(['ant', 'bee', 'cat', 'ape'], (w) => w[0]);
console.log(grouped.a, Object.getPrototypeOf(grouped));`),
      options: ["[ 'ant', 'ape' ] null", "[ 'ant', 'ape' ] [Object: null prototype] {}", "[ 'ant' ] null", "undefined null"],
      answer: 0,
      explain: 'Items are grouped under the key the callback returns. The result object has a `null` prototype.',
    },
    {
      type: 'output',
      code: c(`
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log([...a.intersection(b)], [...a.symmetricDifference(b)], a.isSubsetOf(b));`),
      options: ['[ 2, 3 ] [ 1, 4 ] false', '[ 2, 3 ] [ 1 ] false', '[ 1, 2, 3, 4 ] [ 1, 4 ] true', '[ 2, 3 ] [ 1, 4 ] true'],
      answer: 0,
      explain: 'Intersection keeps shared items; symmetric difference keeps items in exactly one set. `a` has 1, which `b` lacks.',
    },
    {
      type: 'output',
      code: c(`
function* naturals() {
  let n = 1;
  while (true) yield n++;
}
console.log(naturals().filter((n) => n % 3 === 0).map((n) => n * 10).take(3).toArray());`),
      options: ['[ 30, 60, 90 ]', '[ 10, 20, 30 ]', 'Infinite loop', 'TypeError'],
      answer: 0,
      explain: 'Iterator helpers are lazy, so `take(3)` stops the infinite generator after three matches.',
    },
    {
      type: 'output',
      code: c(`
async function* source() {
  yield 1;
  yield Promise.resolve(2);
}
Array.fromAsync(source()).then((arr) => console.log(arr));
console.log('sync');`),
      options: ['sync\n[ 1, 2 ]', '[ 1, 2 ]\nsync', 'sync\n[ 1, Promise { 2 } ]', 'TypeError'],
      answer: 0,
      explain: '`Array.fromAsync` returns a promise, so the synchronous log wins. The yielded promise is awaited.',
    },
  ],
};

export default topic;
