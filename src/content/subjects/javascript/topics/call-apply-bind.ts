import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'call-apply-bind',
  title: 'call, apply and bind',
  level: 'intermediate',
  tags: ['explicit binding', 'this', 'partial application', 'polyfill'],
  summary: '`call` and `apply` run a function now with a chosen `this`. `bind` returns a **new** function with `this` locked in.',
  keyPoints: [
    {
      title: 'call vs apply',
      text: 'Both invoke immediately. `call` takes arguments one by one; `apply` takes them as an array.',
      code: c(`
function intro(greeting, punct) { return greeting + ' ' + this.name + punct; }
const ada = { name: 'Ada' };
intro.call(ada, 'Hi', '!');    // "Hi Ada!"
intro.apply(ada, ['Hi', '!']); // "Hi Ada!"`),
    },
    {
      title: 'bind returns a function',
      text: '`fn.bind(obj, ...args)` does not run anything. It gives back a function whose `this` is fixed and whose first arguments are pre-filled.',
    },
    {
      title: 'Bound is bound for good',
      text: 'Calling `bind` again, or `call`/`apply` on a bound function, cannot change its `this`. Only `new` overrides it.',
    },
    {
      title: 'Arrows ignore all three',
      text: 'Arrow functions take `this` lexically, so the `this` argument is ignored.',
    },
  ],
  qa: [
    {
      q: 'What is the difference between `call`, `apply` and `bind`?',
      tag: 'Asked often',
      a: [
        '`call(thisArg, a, b)`: invokes now, arguments listed.',
        '`apply(thisArg, [a, b])`: invokes now, arguments as an array.',
        '`bind(thisArg, a)`: returns a new function to call later, with `this` and leading arguments fixed.',
      ],
    },
    {
      q: 'When would you use `bind`?',
      a: [
        'Passing a method as a callback without losing `this`: `button.onclick = obj.handle.bind(obj)`.',
        'Partial application: `const double = multiply.bind(null, 2)`.',
      ],
    },
    {
      q: 'Write a polyfill for `bind`.',
      tag: 'Coding',
      a: ['Return a function that calls the original with the saved `this` and the combined arguments.'],
      code: c(`
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...later) {
    return fn.apply(ctx, [...preset, ...later]);
  };
};`),
    },
    {
      q: 'Write a polyfill for `call`.',
      tag: 'Coding',
      a: ['Temporarily attach the function to the object with a unique key, call it as a method, then remove it.'],
      code: c(`
Function.prototype.myCall = function (ctx = globalThis, ...args) {
  const key = Symbol();
  ctx = Object(ctx);
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};`),
    },
    {
      q: 'What happens if you pass `null` as `thisArg`?',
      a: ['In strict mode `this` is `null`. In sloppy mode it is replaced with the global object.'],
    },
    {
      q: 'How is `apply` used with `Math.max`?',
      a: ['`Math.max.apply(null, [3, 7, 2])` is 7. Today spread does the same: `Math.max(...arr)`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const person = { name: 'Ada' };
function say(greeting) {
  return \`\${greeting}, \${this.name}\`;
}
console.log(say.call(person, 'Hi'));
console.log(say.apply(person, ['Hey']));`),
      options: ['Hi, Ada\nHey, Ada', 'Hi, undefined\nHey, undefined', 'Hi, Ada\nH, Ada', 'TypeError'],
      answer: 0,
      explain: 'Both set `this` to `person`. `apply` unpacks the array into arguments.',
    },
    {
      type: 'output',
      code: c(`
function getName() { return this.name; }
const a = { name: 'A' };
const b = { name: 'B' };
const bound = getName.bind(a);
console.log(bound.call(b));
console.log(bound.bind(b)());`),
      options: ['A\nA', 'B\nB', 'A\nB', 'B\nA'],
      answer: 0,
      explain: 'A bound function ignores later attempts to change `this`, whether through `call` or another `bind`.',
    },
    {
      type: 'output',
      code: c(`
function multiply(a, b) { return a * b; }
const double = multiply.bind(null, 2);
console.log(double(5), double(5, 100));`),
      options: ['10 10', '10 1000', 'NaN NaN', '10 200'],
      answer: 0,
      explain: '`a` is pre-filled with 2. The first extra argument becomes `b`; any beyond that are ignored.',
    },
    {
      type: 'output',
      code: c(`
const counter = {
  count: 0,
  inc() { this.count++; return this.count; },
};
const inc = counter.inc;
const safeInc = counter.inc.bind(counter);
safeInc();
console.log(safeInc(), counter.count);`),
      options: ['2 2', '1 1', '2 0', 'NaN 0'],
      answer: 0,
      explain: '`safeInc` always runs with `this = counter`, so both calls increment `counter.count`.',
    },
    {
      type: 'output',
      code: c(`
const arrow = () => typeof this;
console.log(arrow.call({ a: 1 }));`),
      note: 'Assume the code runs as an ES module (strict mode).',
      options: ['undefined', 'object', 'function', 'TypeError'],
      answer: 0,
      explain: 'Arrows ignore the `this` passed to `call`. At module top level `this` is `undefined`.',
    },
    {
      type: 'output',
      code: c(`
const nums = [5, 1, 9, 3];
console.log(Math.max.apply(null, nums));
console.log(Math.max(nums));`),
      options: ['9\nNaN', '9\n9', 'NaN\nNaN', '9\nundefined'],
      answer: 0,
      explain: '`apply` spreads the array into separate arguments. Passing the array itself converts it to `NaN`.',
    },
    {
      type: 'truefalse',
      statement: '`fn.bind(obj)` calls `fn` immediately with `this` set to `obj`.',
      answer: false,
      explain: '`bind` only returns a new function. You still need to call it.',
    },
  ],
};

export default topic;
