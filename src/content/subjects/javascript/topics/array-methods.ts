import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'array-methods',
  title: 'Array methods',
  level: 'beginner',
  tags: ['map', 'filter', 'reduce', 'sort', 'mutating vs non-mutating'],
  summary: 'Know which methods **return a new array** and which **change the original**. Interviewers love that distinction.',
  keyPoints: [
    {
      title: 'Non-mutating (return new)',
      text: '`map`, `filter`, `slice`, `concat`, `flat`, `flatMap`, and the ES2023 copies `toSorted`, `toReversed`, `toSpliced`, `with`.',
    },
    {
      title: 'Mutating (change in place)',
      text: '`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`.',
    },
    {
      title: '`reduce` builds anything',
      text: 'It folds an array into one value: a sum, an object, a new array. Always pass an initial value.',
      code: c(`
const total = [5, 10, 15].reduce((sum, n) => sum + n, 0); // 30`),
    },
    {
      title: '`sort` compares strings by default',
      text: 'Without a comparator, numbers are sorted as text. Use `(a, b) => a - b` for numbers.',
      code: c(`
[10, 9, 1].sort();              // [1, 10, 9]
[10, 9, 1].sort((a, b) => a - b); // [1, 9, 10]`),
    },
  ],
  qa: [
    {
      q: 'What is the difference between `map`, `filter`, `forEach` and `reduce`?',
      tag: 'Asked often',
      a: [
        '`map`: same length, each item transformed.',
        '`filter`: subset of items where the callback returns truthy.',
        '`forEach`: runs a side effect, returns `undefined`, cannot be chained or stopped (except by throwing).',
        '`reduce`: combines all items into a single value.',
      ],
    },
    {
      q: 'What is the difference between `slice` and `splice`?',
      tag: 'Asked often',
      a: [
        '`slice(start, end)` returns a copy of part of the array. The original is unchanged.',
        '`splice(start, deleteCount, ...items)` removes/inserts **in place** and returns the removed items.',
      ],
    },
    {
      q: 'What is the difference between `find`, `findIndex`, `some`, `every` and `includes`?',
      a: [
        '`find`: first matching item (or `undefined`). `findIndex`: its index (or -1).',
        '`some`: true if any item matches. `every`: true if all match (true for an empty array).',
        '`includes(x)`: uses SameValueZero, so it finds `NaN`; `indexOf` does not.',
      ],
    },
    {
      q: 'How do you remove duplicates from an array?',
      tag: 'Coding',
      a: ['`[...new Set(arr)]`. For objects by key, use a `Map` or `filter` with a seen set.'],
    },
    {
      q: 'Write a polyfill for `reduce`.',
      tag: 'Coding',
      a: ['Start from the initial value (or the first item), then fold the rest.'],
      code: c(`
Array.prototype.myReduce = function (cb, init) {
  let i = 0;
  let acc = init;
  if (arguments.length < 2) {
    if (this.length === 0) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[i++];
  }
  for (; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};`),
    },
    {
      q: 'How do you flatten a nested array?',
      tag: 'Coding',
      a: ['`arr.flat(Infinity)`, or recursively with `reduce`.'],
      code: c(`
const flatten = (arr) =>
  arr.reduce((out, x) => out.concat(Array.isArray(x) ? flatten(x) : x), []);`),
    },
    {
      q: 'How do you empty an array?',
      a: ['`arr.length = 0` (mutates, all references see it), `arr.splice(0)`, or `arr = []` (only rebinds this variable).'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const arr = [1, 2, 3, 4, 5];
const a = arr.slice(1, 3);
const b = arr.splice(1, 2);
console.log(a, b, arr);`),
      options: ['[ 2, 3 ] [ 2, 3 ] [ 1, 4, 5 ]', '[ 2, 3 ] [ 2, 3 ] [ 1, 2, 3, 4, 5 ]', '[ 2, 3 ] [ 2 ] [ 1, 3, 4, 5 ]', '[ 2 ] [ 2, 3 ] [ 1, 4, 5 ]'],
      answer: 0,
      explain: '`slice(1, 3)` copies indexes 1 and 2. `splice(1, 2)` removes two items starting at index 1 and changes `arr`.',
    },
    {
      type: 'output',
      code: c(`
console.log([1, 10, 2, 21].sort());
console.log([1, 10, 2, 21].sort((a, b) => a - b));`),
      options: ['[ 1, 10, 2, 21 ]\n[ 1, 2, 10, 21 ]', '[ 1, 2, 10, 21 ]\n[ 1, 2, 10, 21 ]', '[ 21, 10, 2, 1 ]\n[ 1, 2, 10, 21 ]', '[ 1, 2, 21, 10 ]\n[ 1, 2, 10, 21 ]'],
      answer: 0,
      explain: 'The default sort compares strings, and `"10"` comes before `"2"`.',
    },
    {
      type: 'output',
      code: c(`
const r = [1, 2, 3].map((n) => {
  if (n > 1) return n * 2;
});
console.log(r);`),
      options: ['[ undefined, 4, 6 ]', '[ 4, 6 ]', '[ 1, 4, 6 ]', '[ 2, 4, 6 ]'],
      answer: 0,
      explain: '`map` always keeps the length. A callback that returns nothing gives `undefined`.',
    },
    {
      type: 'output',
      code: c(`
const words = ['apple', 'bob', 'cat', 'apple'];
const counts = words.reduce((acc, w) => {
  acc[w] = (acc[w] || 0) + 1;
  return acc;
}, {});
console.log(counts);`),
      options: ['{ apple: 2, bob: 1, cat: 1 }', '{ apple: 1, bob: 1, cat: 1 }', '[ 2, 1, 1 ]', '4'],
      answer: 0,
      explain: '`reduce` with an object accumulator is the classic frequency counter.',
    },
    {
      type: 'output',
      code: c(`
console.log([NaN].includes(NaN), [NaN].indexOf(NaN));
console.log([].every((x) => x > 5), [].some((x) => x > 5));`),
      options: ['true -1\ntrue false', 'false -1\nfalse false', 'true 0\ntrue false', 'true -1\nfalse false'],
      answer: 0,
      explain: '`includes` can find `NaN`; `indexOf` uses `===` and cannot. `every` on an empty array is vacuously true.',
    },
    {
      type: 'output',
      code: c(`
const nums = [3, 1, 2];
const sorted = nums.sort();
sorted.push(4);
console.log(nums);`),
      options: ['[ 1, 2, 3, 4 ]', '[ 3, 1, 2 ]', '[ 1, 2, 3 ]', '[ 3, 1, 2, 4 ]'],
      answer: 0,
      explain: '`sort` sorts in place and returns the **same** array, so `sorted` and `nums` are one object. Use `toSorted()` for a copy.',
    },
    {
      type: 'output',
      code: c(`
const arr = [1, [2, [3, [4]]]];
console.log(arr.flat());
console.log(arr.flat(Infinity));`),
      options: ['[ 1, 2, [ 3, [ 4 ] ] ]\n[ 1, 2, 3, 4 ]', '[ 1, 2, 3, 4 ]\n[ 1, 2, 3, 4 ]', '[ 1, [ 2, [ 3, [ 4 ] ] ] ]\n[ 1, 2, 3, 4 ]', '[ 1, 2, [ 3, 4 ] ]\n[ 1, 2, 3, 4 ]'],
      answer: 0,
      explain: '`flat()` goes one level deep by default. `Infinity` flattens everything.',
    },
    {
      type: 'output',
      code: c(`
const arr = [1, 2, 3];
arr[10] = 11;
console.log(arr.length);
console.log(arr.filter(() => true).length);`),
      options: ['11\n4', '4\n4', '11\n11', '10\n4'],
      answer: 0,
      explain: 'Writing index 10 sets `length` to 11 and leaves holes. Iteration methods skip holes.',
    },
  ],
};

export default topic;
