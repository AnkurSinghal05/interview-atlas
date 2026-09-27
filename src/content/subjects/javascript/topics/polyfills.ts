import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'polyfills',
  title: 'Writing polyfills',
  level: 'intermediate',
  tags: ['map', 'filter', 'bind', 'Promise.all', 'flat', 'machine coding'],
  summary: 'A polyfill re-implements a built-in for environments that lack it. Interviewers use them to test how well you know the real behaviour.',
  keyPoints: [
    {
      title: 'Guard first',
      text: 'Only define it if missing: `if (!Array.prototype.includes) { ... }`. Use `this` to reach the array or function.',
    },
    {
      title: 'Match the spec details',
      text: 'Callback arguments `(item, index, array)`, the optional `thisArg`, skipping holes, and throwing the same errors as the real method.',
    },
    {
      title: 'Use `function`, not arrows',
      text: 'Prototype methods need their own `this` (the array or function they are called on). An arrow would capture the wrong `this`.',
    },
    {
      title: 'The usual list',
      text: '`map`, `filter`, `reduce`, `forEach`, `flat`, `bind`, `call`, `apply`, `Promise.all`, `Promise.allSettled`, `Promise.race`, `Object.assign`, `debounce`/`throttle`.',
    },
  ],
  qa: [
    {
      q: 'Polyfill `Array.prototype.filter`.',
      tag: 'Coding',
      a: ['Call the callback for each existing index and keep items where it returns truthy.'],
      code: c(`
Array.prototype.myFilter = function (cb, thisArg) {
  if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function');
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && cb.call(thisArg, this[i], i, this)) out.push(this[i]);
  }
  return out;
};`),
    },
    {
      q: 'Polyfill `Array.prototype.flat`.',
      tag: 'Coding',
      a: ['Recurse while depth remains.'],
      code: c(`
Array.prototype.myFlat = function (depth = 1) {
  const out = [];
  for (const item of this) {
    if (Array.isArray(item) && depth > 0) out.push(...item.myFlat(depth - 1));
    else out.push(item);
  }
  return out;
};`),
    },
    {
      q: 'Polyfill `Function.prototype.bind` (including `new` support).',
      tag: 'Coding',
      a: ['Return a function that applies the original with saved `this` and arguments. If called with `new`, ignore the saved `this`.'],
      code: c(`
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  function bound(...later) {
    const self = this instanceof bound ? this : ctx;
    return fn.apply(self, [...preset, ...later]);
  }
  bound.prototype = Object.create(fn.prototype);
  return bound;
};`),
    },
    {
      q: 'Polyfill `Promise.race`.',
      tag: 'Coding',
      a: ['Settle the outer promise with whichever input settles first.'],
      code: c(`
Promise.myRace = (items) =>
  new Promise((resolve, reject) => {
    for (const item of items) Promise.resolve(item).then(resolve, reject);
  });`),
    },
    {
      q: 'Polyfill `Object.assign`.',
      tag: 'Coding',
      a: ['Copy own enumerable string and symbol keys from each source to the target.'],
      code: c(`
function assign(target, ...sources) {
  if (target == null) throw new TypeError('Cannot convert undefined or null to object');
  const to = Object(target);
  for (const src of sources) {
    if (src == null) continue;
    for (const key of Reflect.ownKeys(src)) {
      if (Object.prototype.propertyIsEnumerable.call(src, key)) to[key] = src[key];
    }
  }
  return to;
}`),
    },
    {
      q: 'Is it OK to add polyfills to built-in prototypes in production?',
      a: ['Only spec-compliant polyfills guarded by a feature check (as core-js does). Adding your own non-standard methods to built-ins is risky: it can clash with future standards.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
Array.prototype.myMap = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) out.push(cb(this[i], i, this));
  return out;
};
console.log([1, 2, 3].myMap((x, i) => x * i));`),
      options: ['[ 0, 2, 6 ]', '[ 1, 4, 9 ]', '[ 2, 4, 6 ]', '[ 1, 2, 3 ]'],
      answer: 0,
      explain: 'The callback gets `(item, index)`: 1×0, 2×1, 3×2.',
    },
    {
      type: 'output',
      code: c(`
Array.prototype.bad = () => this;
Array.prototype.good = function () { return this; };
const arr = [1];
console.log(arr.bad() === arr, arr.good() === arr);`),
      options: ['false true', 'true true', 'true false', 'false false'],
      answer: 0,
      explain: 'An arrow function takes `this` from the surrounding scope, not from the array it is called on.',
    },
    {
      type: 'output',
      code: c(`
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return (...later) => fn.apply(ctx, [...preset, ...later]);
};
function greet(greeting, mark) { return greeting + ' ' + this.name + mark; }
const hi = greet.myBind({ name: 'Ada' }, 'Hi');
console.log(hi('!'));`),
      options: ['Hi Ada!', 'Hi undefined!', 'undefined Ada!', 'TypeError'],
      answer: 0,
      explain: 'The saved context and preset argument are combined with the later ones.',
    },
    {
      type: 'output',
      code: c(`
Array.prototype.myReduce = function (cb, init) {
  let acc = init;
  for (let i = 0; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};
console.log([1, 2, 3].myReduce((a, b) => a + b));`),
      options: ['NaN', '6', 'undefined', '0'],
      answer: 0,
      explain: 'This polyfill forgot to use the first element when no initial value is given, so it starts from `undefined + 1`. The real `reduce` would return 6.',
    },
    {
      type: 'output',
      code: c(`
Promise.myAll = (items) =>
  new Promise((resolve, reject) => {
    const out = [];
    let done = 0;
    items.forEach((p, i) =>
      Promise.resolve(p).then((v) => {
        out[i] = v;
        if (++done === items.length) resolve(out);
      }, reject)
    );
  });
Promise.myAll([Promise.resolve(1), 2, new Promise((r) => setTimeout(() => r(3), 10))])
  .then(console.log);`),
      options: ['[ 1, 2, 3 ]', '[ 3, 1, 2 ]', '[ 1, 2 ]', 'Nothing is logged'],
      answer: 0,
      explain: 'Results are stored by index and resolved once every item has finished.',
    },
  ],
};

export default topic;
