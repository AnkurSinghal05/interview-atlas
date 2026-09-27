import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'coding-mid',
  title: 'Mid-level: implement it',
  level: 'intermediate',
  masteryMinutes: 300,
  tags: ['deep equal', 'deep clone', 'merge', 'classnames', 'once', 'memoize', 'get'],
  summary: 'Seven mid-level utilities that test recursion, type checks and closures: deep equal, deep clone, merging, classnames, once, memoize and get.',
  keyPoints: [
    {
      title: 'Recursion needs a type check first',
      text: 'Deep equal, deep clone and deep merge all start the same way: handle primitives and `null`, then arrays, then plain objects.',
      code: c(`
const isObject = (v) => v !== null && typeof v === 'object';`),
    },
    {
      title: 'Watch for cycles',
      text: 'An object that contains itself sends naive recursion into an infinite loop. A `WeakMap` of already-visited objects fixes it.',
    },
    {
      title: 'Closures hold the state',
      text: '`once` remembers whether it ran and what it returned; `memoize` keeps a cache. Both return a wrapper that closes over that state.',
    },
    {
      title: 'Say what you are skipping',
      text: 'Dates, Maps, Sets, symbols and class instances make these harder. Handle the basics, then name the extras you would add.',
    },
  ],
  qa: [
    {
      q: '7. Implement `deepEqual(a, b)`.',
      tag: 'Coding',
      a: [
        'Same value (using `Object.is`, so `NaN` equals `NaN`) → true.',
        'Both objects: same array-ness, same number of keys, and every key deep-equal.',
      ],
      code: c(`
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}`),
    },
    {
      q: '8. Implement `deepClone(value)`.',
      tag: 'Coding',
      a: [
        'Return primitives as they are. Copy arrays and objects key by key, recursively.',
        'Use a `WeakMap` so circular references point to the new copy instead of looping forever.',
        'In real code, `structuredClone(value)` does this for you.',
      ],
      code: c(`
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value);
  if (seen.has(value)) return seen.get(value);
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}`),
    },
    {
      q: '9. How do you merge objects and arrays? Implement a deep merge.',
      tag: 'Coding',
      a: [
        '**Shallow:** `{ ...a, ...b }` or `Object.assign({}, a, b)` for objects; `[...a, ...b]` or `a.concat(b)` for arrays. Later values win.',
        '**Deep:** when both sides have a plain object at the same key, merge them recursively instead of replacing.',
      ],
      code: c(`
const isPlainObject = (v) => Object.prototype.toString.call(v) === '[object Object]';

function deepMerge(target, source) {
  const out = { ...target };
  for (const [key, value] of Object.entries(source)) {
    out[key] = isPlainObject(value) && isPlainObject(out[key])
      ? deepMerge(out[key], value)
      : value;
  }
  return out;
}

deepMerge({ a: { x: 1, y: 2 }, list: [1] }, { a: { y: 3 }, list: [2] });
// { a: { x: 1, y: 3 }, list: [2] }`),
    },
    {
      q: '10. Implement `classnames(...args)`.',
      tag: 'Coding',
      a: [
        'Accept strings, numbers, arrays (recursively) and objects whose truthy keys are included. Ignore falsy values.',
        'Used everywhere in React to build `className` strings.',
      ],
      code: c(`
function classNames(...args) {
  const classes = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string' || typeof arg === 'number') classes.push(arg);
    else if (Array.isArray(arg)) classes.push(classNames(...arg));
    else if (typeof arg === 'object') {
      for (const [key, on] of Object.entries(arg)) if (on) classes.push(key);
    }
  }
  return classes.filter(Boolean).join(' ');
}

classNames('btn', { active: true, disabled: false }, ['lg', null]); // "btn active lg"`),
    },
    {
      q: '11. Implement `once(fn)`.',
      tag: 'Coding',
      a: ['Call `fn` the first time, cache its result, and return that result on every later call without calling `fn` again.'],
      code: c(`
function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}`),
    },
    {
      q: '12. Implement `memoize(fn)`.',
      tag: 'Coding',
      a: [
        'Cache results by argument. For one primitive argument, use it as the `Map` key; for several, build a key (or accept a custom resolver).',
        'Only memoize pure functions.',
      ],
      code: c(`
function memoize(fn, resolver = (...args) => args.length === 1 ? args[0] : JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = resolver(...args);
    if (!cache.has(key)) cache.set(key, fn.apply(this, args));
    return cache.get(key);
  };
}`),
    },
    {
      q: '13. Implement `get(obj, path, defaultValue)` to safely read nested properties.',
      tag: 'Coding',
      a: [
        'Accept `"a.b[0].c"` or `["a", "b", "0", "c"]`. Walk one key at a time and stop at `null`/`undefined`.',
        'Return the default only when the final value is `undefined`, so real `null`, `0` or `""` values come through.',
      ],
      code: c(`
function get(obj, path, defaultValue) {
  const keys = Array.isArray(path) ? path : String(path).replace(/\\[(\\w+)\\]/g, '.$1').split('.').filter(Boolean);
  let current = obj;
  for (const key of keys) {
    if (current == null) return defaultValue;
    current = current[key];
  }
  return current === undefined ? defaultValue : current;
}

get({ a: { b: [{ c: 3 }] } }, 'a.b[0].c'); // 3
get({ a: null }, 'a.b', 'none');           // "none"`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.hasOwn(b, k) && deepEqual(a[k], b[k]));
}
console.log(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }));
console.log(deepEqual([1, 2], { 0: 1, 1: 2 }));
console.log(deepEqual(NaN, NaN), deepEqual({ a: undefined }, { b: undefined }));`),
      options: ['true\nfalse\ntrue false', 'true\ntrue\nfalse false', 'false\nfalse\ntrue true', 'true\nfalse\nfalse true'],
      answer: 0,
      explain: 'Nested structures match. An array never equals a plain object. `Object.is` treats `NaN` as equal, and different keys fail even when both values are `undefined`.',
    },
    {
      type: 'output',
      code: c(`
function deepClone(v, seen = new WeakMap()) {
  if (v === null || typeof v !== 'object') return v;
  if (seen.has(v)) return seen.get(v);
  const copy = Array.isArray(v) ? [] : {};
  seen.set(v, copy);
  for (const k of Object.keys(v)) copy[k] = deepClone(v[k], seen);
  return copy;
}
const original = { name: 'root', child: { n: 1 } };
original.self = original;
const copy = deepClone(original);
copy.child.n = 2;
console.log(original.child.n, copy.self === copy, copy.self === original);`),
      options: ['1 true false', '2 true false', '1 false true', 'RangeError'],
      answer: 0,
      explain: 'The nested object was copied, and the `WeakMap` makes the cycle point at the new copy rather than the original.',
    },
    {
      type: 'output',
      code: c(`
const a = { theme: { color: 'red', size: 1 }, tags: ['x'] };
const b = { theme: { size: 2 }, tags: ['y'] };
console.log({ ...a, ...b });`),
      options: [
        "{ theme: { size: 2 }, tags: [ 'y' ] }",
        "{ theme: { color: 'red', size: 2 }, tags: [ 'x', 'y' ] }",
        "{ theme: { color: 'red', size: 2 }, tags: [ 'y' ] }",
        "{ theme: { color: 'red', size: 1 }, tags: [ 'x' ] }",
      ],
      answer: 0,
      explain: 'Spread is a shallow merge: `b.theme` replaces `a.theme` entirely. You need a deep merge to keep `color`.',
    },
    {
      type: 'output',
      code: c(`
function classNames(...args) {
  const out = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string' || typeof arg === 'number') out.push(arg);
    else if (Array.isArray(arg)) out.push(classNames(...arg));
    else for (const [k, on] of Object.entries(arg)) if (on) out.push(k);
  }
  return out.filter(Boolean).join(' ');
}
console.log(classNames('a', 0, { b: 1, c: '' }, ['d', ['e', false]], null));`),
      options: ['a b d e', 'a 0 b d e', 'a b c d e', 'a b d,e'],
      answer: 0,
      explain: 'Falsy values like `0`, `""`, `false` and `null` are skipped. Nested arrays are flattened by recursion.',
    },
    {
      type: 'output',
      code: c(`
function once(fn) {
  let called = false, result;
  return (...args) => {
    if (!called) { called = true; result = fn(...args); }
    return result;
  };
}
let runs = 0;
const init = once((x) => { runs++; return x * 2; });
console.log(init(5), init(10), runs);`),
      options: ['10 10 1', '10 20 2', '10 undefined 1', '10 20 1'],
      answer: 0,
      explain: 'Only the first call runs `fn`. Later calls return the cached 10, whatever their arguments.',
    },
    {
      type: 'output',
      code: c(`
function get(obj, path, def) {
  const keys = path.replace(/\\[(\\w+)\\]/g, '.$1').split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return def;
    cur = cur[k];
  }
  return cur === undefined ? def : cur;
}
const data = { user: { tags: ['a', 'b'], score: 0, bio: null } };
console.log(get(data, 'user.tags[1]'));
console.log(get(data, 'user.score', 99), get(data, 'user.bio', 'none'));
console.log(get(data, 'user.address.city', 'n/a'));`),
      options: ['b\n0 null\nn/a', 'b\n99 none\nn/a', 'b\n0 none\nundefined', 'undefined\n0 null\nn/a'],
      answer: 0,
      explain: 'The default is used only for `undefined` or a broken path. Real `0` and `null` values come through unchanged.',
    },
    {
      type: 'output',
      code: c(`
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}
let calls = 0;
const add = memoize((a, b) => { calls++; return a + b; });
add(1, 2); add(1, 2); add(2, 1);
console.log(calls);`),
      options: ['2', '1', '3', '0'],
      answer: 0,
      explain: '`[1,2]` and `[2,1]` make different keys, so there are two real calls; the repeat `add(1, 2)` is cached.',
    },
  ],
};

export default topic;
