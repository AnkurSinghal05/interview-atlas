import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'deep-copy',
  title: 'Shallow vs deep copy',
  level: 'intermediate',
  masteryMinutes: 90,
  tags: ['structuredClone', 'spread', 'Object.assign', 'references'],
  summary: 'A **shallow** copy duplicates the top level only; nested objects are shared. A **deep** copy duplicates everything.',
  keyPoints: [
    {
      title: 'Shallow copy tools',
      text: '`{ ...obj }`, `Object.assign({}, obj)`, `[...arr]`, `arr.slice()`, `Array.from(arr)`.',
    },
    {
      title: 'Deep copy tools',
      text: '`structuredClone(obj)` handles Dates, Maps, Sets, typed arrays and cycles. It cannot clone functions, DOM nodes or class prototypes.',
    },
    {
      title: 'The JSON trick has limits',
      text: '`JSON.parse(JSON.stringify(x))` drops `undefined` and functions, turns Dates into strings and throws on cycles.',
    },
    {
      title: 'When to deep copy',
      text: 'Immutable updates (e.g. React state) usually only need to copy the path you change, not the whole tree.',
      code: c(`
const next = { ...state, user: { ...state.user, name: 'Ada' } };`),
    },
  ],
  comparisons: [
    {
      title: 'Spread vs JSON round trip vs structuredClone',
      items: ['Spread / `Object.assign`', '`JSON.parse(JSON.stringify(x))`', '`structuredClone(x)`'],
      rows: [
        { aspect: 'Depth', values: ['Shallow: one level', 'Deep', 'Deep'], key: true },
        { aspect: 'Nested objects', values: ['Shared with the original', 'Copied', 'Copied'], key: true },
        { aspect: '`Date`', values: ['Same `Date` object', 'Becomes a string', 'Copied as a `Date`'] },
        { aspect: '`Map` / `Set`', values: ['Same instance', 'Becomes `{}`', 'Copied'] },
        { aspect: '`undefined` values', values: ['Kept', 'Key dropped', 'Kept'] },
        { aspect: 'Functions', values: ['Kept (same function)', 'Key dropped', '`DataCloneError`'] },
        { aspect: 'Circular references', values: ['Fine (only one level)', '`TypeError`', 'Handled'] },
        { aspect: 'Class instances', values: ['Become plain objects', 'Become plain objects', 'Become plain objects'] },
      ],
      reveal:
        'Spread only copies the top level, so nested objects are still shared. The JSON trick is deep but lossy: anything JSON cannot represent is changed or dropped. `structuredClone` is the built-in deep copy that keeps Dates, Maps, Sets and cycles, but it refuses functions and drops prototypes.',
      whenToUse: [
        'Flat objects, or immutable updates where you copy only the path you change (React state).',
        'Plain JSON-safe data, or when you are about to send it over the network anyway.',
        'The default deep copy in modern browsers and Node 17+.',
      ],
    },
  ],
  qa: [
    {
      q: 'What is the difference between a shallow and a deep copy?',
      tag: 'Asked often',
      a: [
        'Shallow: new outer object, but nested objects are the same references as in the original.',
        'Deep: every nested object is also copied, so no references are shared.',
      ],
    },
    {
      q: 'Write a deep clone function.',
      tag: 'Coding',
      a: ['Recurse into arrays and plain objects; use a `WeakMap` to handle circular references.'],
      code: c(`
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value);
  if (seen.has(value)) return seen.get(value);
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}`),
    },
    {
      q: 'What can `structuredClone` not copy?',
      a: ['Functions, DOM nodes, symbols as values, getters/setters (it copies the value) and class identity: a class instance comes back as a plain object.'],
    },
    {
      q: 'Does `const` or `Object.freeze` make copying unnecessary?',
      a: ['No. `const` stops reassignment only; `freeze` is shallow. To keep data safe from mutation you still copy, or freeze deeply.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const a = { n: 1, inner: { m: 1 } };
const b = { ...a };
b.n = 2;
b.inner.m = 2;
console.log(a.n, a.inner.m);`),
      options: ['1 2', '2 2', '1 1', '2 1'],
      answer: 0,
      explain: 'Spread copies the top level. `inner` is still shared.',
    },
    {
      type: 'output',
      code: c(`
const a = { d: new Date(0), inner: { m: 1 } };
const b = structuredClone(a);
b.inner.m = 2;
console.log(a.inner.m, b.d instanceof Date);`),
      options: ['1 true', '2 true', '1 false', '2 false'],
      answer: 0,
      explain: '`structuredClone` makes a real deep copy and keeps Dates as Dates.',
    },
    {
      type: 'output',
      code: c(`
const src = { f() {}, u: undefined, n: 1 };
console.log(JSON.parse(JSON.stringify(src)));`),
      options: ['{ n: 1 }', '{ f: {}, u: null, n: 1 }', '{ u: undefined, n: 1 }', 'TypeError'],
      answer: 0,
      explain: 'JSON drops functions and `undefined` values.',
    },
    {
      type: 'output',
      code: c(`
try {
  structuredClone({ fn: () => 1 });
} catch (e) {
  console.log(e.name);
}`),
      options: ['DataCloneError', 'TypeError', 'Nothing is logged', 'SyntaxError'],
      answer: 0,
      explain: 'Functions cannot be cloned; `structuredClone` throws a `DataCloneError` (a `DOMException`).',
    },
    {
      type: 'output',
      code: c(`
const arr = [[1], [2]];
const copy = arr.slice();
copy[0].push(99);
copy[1] = ['new'];
console.log(arr);`),
      options: ['[ [ 1, 99 ], [ 2 ] ]', "[ [ 1, 99 ], [ 'new' ] ]", '[ [ 1 ], [ 2 ] ]', "[ [ 1 ], [ 'new' ] ]"],
      answer: 0,
      explain: 'Mutating a shared inner array shows in both. Replacing an element in the copy does not affect the original.',
    },
  ],
};

export default topic;
