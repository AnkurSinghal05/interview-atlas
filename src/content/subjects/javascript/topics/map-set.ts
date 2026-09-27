import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'map-set',
  title: 'Map and Set',
  level: 'intermediate',
  tags: ['Map', 'Set', 'unique values', 'object keys', 'LRU cache'],
  summary: '`Map` is a key-value store that accepts **any** key type. `Set` stores **unique** values. Both remember insertion order.',
  keyPoints: [
    {
      title: 'Map vs plain object',
      text: 'Map keys can be objects, functions or `NaN`. It has `size`, is directly iterable and has no inherited keys to trip on.',
      code: c(`
const visits = new Map();
const user = { id: 1 };
visits.set(user, 3);
visits.get(user); // 3`),
    },
    {
      title: 'Set for uniqueness',
      text: '`new Set(arr)` removes duplicates. `has` is fast (O(1) on average) compared to `array.includes` (O(n)).',
    },
    {
      title: 'Equality: SameValueZero',
      text: 'Keys are compared like `===`, except `NaN` equals `NaN`. Two different objects are two different keys.',
    },
    {
      title: 'Converting',
      text: '`new Map(Object.entries(obj))`, `Object.fromEntries(map)`, `[...set]`, `Array.from(map.keys())`.',
    },
  ],
  qa: [
    {
      q: 'When would you use a `Map` instead of an object?',
      tag: 'Asked often',
      a: [
        'Keys are not strings (objects, DOM nodes, numbers you do not want converted).',
        'Frequent adds and deletes, or you need `size` and ordered iteration.',
        'Keys come from user input (no risk of `__proto__` clashes).',
        'Use a plain object for fixed-shape records and JSON.',
      ],
    },
    {
      q: 'How do Set operations like union and intersection work?',
      a: ['Modern engines have `a.union(b)`, `a.intersection(b)`, `a.difference(b)`. Otherwise use spread and filter.'],
      code: c(`
const union = new Set([...a, ...b]);
const inter = new Set([...a].filter((x) => b.has(x)));`),
    },
    {
      q: 'Implement an LRU cache.',
      tag: 'Coding',
      a: ['A `Map` keeps insertion order, so re-insert on read and delete the first key when full.'],
      code: c(`
class LRU {
  constructor(limit) { this.limit = limit; this.map = new Map(); }
  get(k) {
    if (!this.map.has(k)) return undefined;
    const v = this.map.get(k);
    this.map.delete(k); this.map.set(k, v);
    return v;
  }
  set(k, v) {
    this.map.delete(k);
    this.map.set(k, v);
    if (this.map.size > this.limit) this.map.delete(this.map.keys().next().value);
  }
}`),
    },
    {
      q: 'Can you JSON.stringify a Map or Set?',
      a: ['Not directly: both become `{}`. Convert first: `JSON.stringify([...map])` or `Object.fromEntries(map)`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const s = new Set([1, 2, 2, '2', NaN, NaN]);
console.log(s.size);`),
      options: ['4', '6', '3', '5'],
      answer: 0,
      explain: 'Unique values are 1, 2, "2" and `NaN`. Set treats `NaN` as equal to itself and `2` differs from `"2"`.',
    },
    {
      type: 'output',
      code: c(`
const m = new Map();
m.set({}, 'a');
m.set({}, 'b');
console.log(m.size, m.get({}));`),
      options: ['2 undefined', '1 b', '2 b', '1 undefined'],
      answer: 0,
      explain: 'Each `{}` is a different object, so they are different keys. A third new `{}` finds nothing.',
    },
    {
      type: 'output',
      code: c(`
const m = new Map([[1, 'num'], ['1', 'str']]);
const o = { 1: 'num', '1': 'str' };
console.log(m.size, Object.keys(o).length);`),
      options: ['2 1', '1 1', '2 2', '1 2'],
      answer: 0,
      explain: 'Map keeps `1` and `"1"` apart. Object keys are strings, so both write the same key.',
    },
    {
      type: 'output',
      code: c(`
const m = new Map([['a', 1]]);
m.set('b', 2).set('a', 3);
console.log([...m]);`),
      options: ["[ [ 'a', 3 ], [ 'b', 2 ] ]", "[ [ 'b', 2 ], [ 'a', 3 ] ]", "[ [ 'a', 1 ], [ 'b', 2 ], [ 'a', 3 ] ]", "[ 'a', 'b' ]"],
      answer: 0,
      explain: '`set` returns the map so it chains. Updating an existing key keeps its original position.',
    },
    {
      type: 'output',
      code: c(`
const m = new Map([['x', 1]]);
console.log(JSON.stringify(m), JSON.stringify(Object.fromEntries(m)));`),
      options: ['{} {"x":1}', '[["x",1]] {"x":1}', '{"x":1} {"x":1}', 'TypeError'],
      answer: 0,
      explain: 'A Map has no enumerable own properties, so JSON sees `{}`. Convert it first.',
    },
    {
      type: 'output',
      code: c(`
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log([...a].filter((x) => !b.has(x)));`),
      options: ['[ 1 ]', '[ 4 ]', '[ 2, 3 ]', '[ 1, 4 ]'],
      answer: 0,
      explain: 'That is the set difference `a − b`.',
    },
  ],
};

export default topic;
