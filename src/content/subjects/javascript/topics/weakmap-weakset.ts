import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'weakmap-weakset',
  title: 'WeakMap and WeakSet',
  level: 'advanced',
  masteryMinutes: 45,
  tags: ['weak references', 'garbage collection', 'metadata', 'WeakRef'],
  summary: 'Weak collections hold object keys **without keeping them alive**. When nothing else references the key, the entry can be garbage-collected.',
  keyPoints: [
    {
      title: 'Keys must be objects',
      text: 'WeakMap keys and WeakSet values must be objects (or non-registered symbols). Primitives throw a `TypeError`.',
    },
    {
      title: 'Not iterable, no size',
      text: 'Because entries can vanish at any time, there is no `size`, no `keys()`, no `forEach`. Only `get`, `set`, `has`, `delete` (and `add` for WeakSet).',
    },
    {
      title: 'Attach data to objects you do not own',
      text: 'Cache results per object, or store private data per instance, without leaking memory when the object goes away.',
      code: c(`
const cache = new WeakMap();
function area(shape) {
  if (!cache.has(shape)) cache.set(shape, expensiveCalc(shape));
  return cache.get(shape);
}`),
    },
    {
      title: 'WeakSet for tagging',
      text: 'Mark objects as "seen" or "processed" (for example, to detect cycles) without holding them.',
    },
  ],
  qa: [
    {
      q: 'What is the difference between `Map` and `WeakMap`?',
      tag: 'Asked often',
      a: [
        '`WeakMap` keys must be objects; `Map` keys can be anything.',
        '`WeakMap` does not prevent its keys from being garbage-collected; `Map` does.',
        '`WeakMap` is not iterable and has no `size` or `clear`.',
      ],
    },
    {
      q: 'Why can\'t you iterate a WeakMap?',
      a: ['Garbage collection timing is unpredictable. If you could list the keys, the result would depend on when GC ran, which would make programs non-deterministic.'],
    },
    {
      q: 'Give a real use case for WeakMap.',
      a: [
        'Storing metadata for DOM nodes: when the node is removed and dropped, its entry disappears too.',
        'Memoizing per-object results.',
        'Private data for class instances (before `#private` fields existed).',
      ],
    },
    {
      q: 'What are `WeakRef` and `FinalizationRegistry`?',
      a: [
        '`WeakRef` holds a weak reference to one object; `deref()` returns it or `undefined` once collected.',
        '`FinalizationRegistry` lets you run a callback after an object is collected. Both are for rare, advanced cases; do not rely on timing.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const wm = new WeakMap();
try {
  wm.set('key', 1);
} catch (e) {
  console.log(e.name);
}`),
      options: ['TypeError', 'Nothing is logged', 'RangeError', 'ReferenceError'],
      answer: 0,
      explain: 'WeakMap keys must be objects. A string key throws `Invalid value used as weak map key`.',
    },
    {
      type: 'output',
      code: c(`
const ws = new WeakSet();
const a = {};
ws.add(a);
console.log(ws.has(a), ws.has({}), ws.size);`),
      options: ['true false undefined', 'true true 1', 'true false 1', 'false false 0'],
      answer: 0,
      explain: 'A new `{}` is a different object. WeakSet has no `size` property.',
    },
    {
      type: 'output',
      code: c(`
const wm = new WeakMap();
console.log(typeof wm.forEach, typeof wm.keys, typeof wm.get);`),
      options: ['undefined undefined function', 'function function function', 'undefined function function', 'function undefined function'],
      answer: 0,
      explain: 'Weak collections are not iterable, so there are no iteration methods.',
    },
    {
      type: 'mcq',
      question: 'You store extra data for DOM elements that may be removed later. Which is best?',
      options: ['A plain object keyed by element id', 'A `Map` keyed by the element', 'A `WeakMap` keyed by the element', 'An array of `[element, data]` pairs'],
      answer: 2,
      explain: 'A `WeakMap` lets removed elements be garbage-collected together with their data.',
    },
    {
      type: 'truefalse',
      statement: 'An entry in a WeakMap is removed as soon as its key object has no other references.',
      answer: false,
      explain: 'It becomes **eligible** for collection; the engine decides when (or whether) to actually collect it.',
    },
  ],
};

export default topic;
