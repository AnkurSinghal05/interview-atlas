import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'proxy-reflect',
  title: 'Proxy and Reflect',
  level: 'advanced',
  masteryMinutes: 90,
  tags: ['traps', 'metaprogramming', 'validation', 'reactivity'],
  summary: 'A `Proxy` wraps an object and intercepts operations like get, set and delete. `Reflect` performs the default behaviour.',
  keyPoints: [
    {
      title: 'Target + handler',
      text: '`new Proxy(target, handler)`. Each handler method (a **trap**) intercepts one operation; missing traps fall through to the target.',
      code: c(`
const loud = new Proxy({ a: 1 }, {
  get(target, key) { return key in target ? target[key] : 'missing'; },
});
loud.a; // 1
loud.b; // "missing"`),
    },
    {
      title: 'Common traps',
      text: '`get`, `set`, `has` (the `in` operator), `deleteProperty`, `apply` (function calls), `construct` (`new`), `ownKeys`.',
    },
    {
      title: '`Reflect` mirrors the traps',
      text: '`Reflect.get`, `Reflect.set`, etc. do the default thing and return booleans instead of throwing. Use them inside traps to forward the operation.',
    },
    {
      title: 'Real uses',
      text: 'Validation, default values, logging, negative array indexes, and reactivity systems like Vue 3.',
    },
  ],
  qa: [
    {
      q: 'What is a Proxy?',
      tag: 'Asked often',
      a: ['An object that wraps a target and lets you redefine fundamental operations (property read/write, `in`, `delete`, function calls) through handler traps.'],
    },
    {
      q: 'Why use `Reflect` inside a trap?',
      a: [
        'It forwards the operation with correct semantics, including the `receiver` for getters and setters.',
        'It returns `true`/`false` instead of throwing, which matches what `set` and `deleteProperty` traps must return.',
      ],
      code: c(`
set(target, key, value, receiver) {
  console.log('set', key);
  return Reflect.set(target, key, value, receiver);
}`),
    },
    {
      q: 'Build a validating object with Proxy.',
      tag: 'Coding',
      a: ['Check the value in a `set` trap and throw if it is invalid.'],
      code: c(`
const person = new Proxy({}, {
  set(t, key, value) {
    if (key === 'age' && !Number.isInteger(value)) throw new TypeError('age must be an integer');
    t[key] = value;
    return true;
  },
});`),
    },
    {
      q: 'How does Vue 3 use Proxy for reactivity?',
      a: ['The `get` trap records which effect read a property (tracking); the `set` trap re-runs those effects (triggering).'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const target = { a: 1 };
const p = new Proxy(target, {
  get: (t, k) => (k in t ? t[k] : \`no \${String(k)}\`),
});
console.log(p.a, p.b);`),
      options: ['1 no b', '1 undefined', 'undefined no b', 'TypeError'],
      answer: 0,
      explain: 'The `get` trap runs for every read and can supply defaults.',
    },
    {
      type: 'output',
      code: c(`
const target = {};
const p = new Proxy(target, {});
p.x = 5;
console.log(target.x, p === target);`),
      options: ['5 false', 'undefined false', '5 true', 'undefined true'],
      answer: 0,
      explain: 'With no traps, operations pass through to the target. The proxy is still a different object.',
    },
    {
      type: 'output',
      code: c(`
const arr = new Proxy([10, 20, 30], {
  get(t, k, r) {
    const i = Number(k);
    return Number.isInteger(i) && i < 0 ? t[t.length + i] : Reflect.get(t, k, r);
  },
});
console.log(arr[-1], arr[0], arr.length);`),
      options: ['30 10 3', 'undefined 10 3', '30 10 undefined', '10 10 3'],
      answer: 0,
      explain: 'Negative keys are remapped; everything else is forwarded with `Reflect.get`.',
    },
    {
      type: 'output',
      code: c(`
const hidden = new Proxy({ _secret: 1, name: 'x' }, {
  has: (t, k) => !k.startsWith('_') && k in t,
  ownKeys: (t) => Reflect.ownKeys(t).filter((k) => !k.startsWith('_')),
});
console.log('_secret' in hidden, Object.keys(hidden));`),
      options: ["false [ 'name' ]", "true [ '_secret', 'name' ]", "false [ '_secret', 'name' ]", "true [ 'name' ]"],
      answer: 0,
      explain: 'The `has` trap controls `in`; `ownKeys` controls what `Object.keys` sees.',
    },
    {
      type: 'output',
      code: c(`
const fn = new Proxy((a, b) => a + b, {
  apply(target, thisArg, args) {
    return target(...args) * 10;
  },
});
console.log(fn(1, 2));`),
      options: ['30', '3', '12', 'TypeError'],
      answer: 0,
      explain: 'The `apply` trap intercepts calls to a function proxy.',
    },
  ],
};

export default topic;
