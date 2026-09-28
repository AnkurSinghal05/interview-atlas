import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'map-set',
  title: 'Map and Set',
  level: 'intermediate',
  masteryMinutes: 45,
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
  comparisons: [
    {
      items: ['`Map`', 'Plain object'],
      rows: [
        { aspect: 'Key types', values: ['Any value: objects, functions, `NaN`', 'Strings and symbols (others become strings)'], key: true },
        { aspect: 'Key order', values: ['Insertion order', 'Integer-like keys first (ascending), then insertion order'] },
        { aspect: 'Size', values: ['`map.size`', '`Object.keys(obj).length`'] },
        { aspect: 'Iterate', values: ['Directly: `for (const [k, v] of map)`', 'Through `Object.keys` / `Object.entries`'] },
        { aspect: 'Inherited keys', values: ['None', "From `Object.prototype` (unless `Object.create(null)`)"] },
        { aspect: 'Frequent add/delete', values: ['Optimised for it', 'Slower'] },
        { aspect: 'JSON', values: ['Not directly (`Object.fromEntries` first)', 'Native'] },
      ],
      reveal:
        'An object is a record with a fixed shape; a `Map` is a real dictionary. The deciding question is usually the keys: if they are not strings, or come from user input, use a `Map`.',
      whenToUse: [
        'Lookups with non-string or user-supplied keys, caches, counters that grow and shrink.',
        'Fixed, known fields, and data you serialise to JSON.',
      ],
    },
    {
      items: ['`Set`', 'Array'],
      rows: [
        { aspect: 'Duplicates', values: ['Not allowed', 'Allowed'], key: true },
        { aspect: 'Check membership', values: ['`set.has(x)`: O(1) average', '`arr.includes(x)`: O(n)'], key: true },
        { aspect: 'Remove a value', values: ['`set.delete(x)`: O(1)', '`splice` or `filter`: O(n)'] },
        { aspect: 'Index access', values: ['No', 'Yes, `arr[i]`'] },
        { aspect: 'Order', values: ['Insertion order', 'Index order'] },
      ],
      reveal: 'Same data, different question: a `Set` answers "is it there?" fast, an array answers "what is at position i?" fast.',
      whenToUse: ['Unique values and lots of "have I seen this?" checks. `[...new Set(arr)]` removes duplicates.', 'Ordered lists, duplicates, sorting and index access.'],
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
