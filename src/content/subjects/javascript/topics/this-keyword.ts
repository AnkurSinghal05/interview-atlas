import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'this-keyword',
  title: 'The this keyword',
  level: 'intermediate',
  masteryMinutes: 120,
  tags: ['this', 'call', 'apply', 'bind', 'arrow functions'],
  summary:
    '`this` is set by **how a function is called**, not where it is written. Arrow functions are the exception: they borrow it from outside.',
  keyPoints: [
    { title: '1 · new', text: '`new Fn()` makes a fresh object and sets `this` to it. This rule wins over all others.' },
    { title: '2 · Explicit', text: '`fn.call(obj)`, `fn.apply(obj)` and `fn.bind(obj)` set `this` to the object you pass.' },
    { title: '3 · Implicit', text: '`obj.fn()` sets `this` to the object left of the dot, at call time.' },
    { title: '4 · Default', text: 'A plain `fn()` call gets `undefined` in strict mode and modules, or `globalThis` in sloppy scripts.' },
    {
      title: 'Arrow functions',
      text: 'Arrows have no `this` of their own. They use the `this` of the scope they were written in, and `call`/`bind` cannot change it.',
    },
  ],
  comparisons: [
    {
      title: 'The four `this` rules (plus arrows)',
      items: ['Plain call', 'Method call', '`call` / `apply` / `bind`', '`new`', 'Arrow function'],
      rows: [
        { aspect: 'Looks like', values: ['`fn()`', '`obj.fn()`', '`fn.call(o)`', '`new Fn()`', '`() => this`'] },
        { aspect: '`this` is', values: ['`undefined` in strict mode, else `globalThis`', 'The object before the dot', 'The object you pass', 'The brand-new object', 'Whatever `this` was where it was written'], key: true },
        { aspect: 'Priority', values: ['Lowest', 'Beats plain call', 'Beats method call', 'Highest (even beats `bind`)', 'Cannot be changed at all'] },
      ],
      reveal: '`this` is decided by the **call site**, not where the function is defined. Arrow functions are the one exception: they have no `this` of their own.',
      whenToUse: [
        'Helpers that do not use `this` at all.',
        'Methods on an object; watch out when you pass `obj.fn` as a callback, it becomes a plain call.',
        'Borrowing methods or fixing `this` for a callback.',
        'Constructors and classes.',
        'Callbacks inside methods that need the outer `this`.',
      ],
    },
  ],
  visuals: [
    {
      type: 'stepper',
      title: 'Same function, four call sites',
      code: c(`
function show() { console.log(this?.name); }
const ada = { name: 'Ada', show };
const bob = { name: 'Bob' };

ada.show();
show.call(bob);
const s = ada.show;
s();
new show();

const timer = {
  name: 'Timer',
  start() { setTimeout(() => console.log(this.name)); },
};
timer.start();`),
      panels: ['Call site', 'Rule', 'this is', 'Console'],
      steps: [
        {
          line: 5,
          note: 'Called as a method: there is an object left of the dot.',
          state: { 'Call site': ['ada.show()'], Rule: ['Implicit'], 'this is': ['ada'], Console: ['Ada'] },
        },
        {
          line: 6,
          note: '`call` sets `this` to its first argument, even though `bob` has no `show` method.',
          state: { 'Call site': ['show.call(bob)'], Rule: ['Explicit'], 'this is': ['bob'], Console: ['Ada', 'Bob'] },
        },
        {
          line: 7,
          note: 'Copying the method into a variable copies only the function. The link to `ada` is gone.',
          state: { Console: ['Ada', 'Bob'] },
        },
        {
          line: 8,
          note: 'A plain call. In strict mode and modules `this` is `undefined`.',
          state: { 'Call site': ['s()'], Rule: ['Default'], 'this is': ['undefined'], Console: ['Ada', 'Bob', 'undefined'] },
        },
        {
          line: 9,
          note: '`new` creates an empty object and binds `this` to it. It has no `name` yet.',
          state: {
            'Call site': ['new show()'],
            Rule: ['new'],
            'this is': ['{} (new object)'],
            Console: ['Ada', 'Bob', 'undefined', 'undefined'],
          },
        },
        {
          line: [15, 13],
          note: '`start()` is called on `timer`, so its `this` is `timer`. The arrow has no own `this` and reads it from `start`.',
          state: {
            'Call site': ['timer.start()', '→ arrow callback later'],
            Rule: ['Arrow: inherits'],
            'this is': ['timer'],
            Console: ['Ada', 'Bob', 'undefined', 'undefined', 'Timer'],
          },
        },
      ],
    },
  ],
  qa: [
    {
      q: 'How is the value of `this` decided?',
      tag: 'Asked often',
      a: [
        'By the call site, checked in this order: `new` → explicit `call`/`apply`/`bind` → method call `obj.fn()` → plain call.',
        'Arrow functions skip all four rules and use the surrounding `this`.',
      ],
    },
    {
      q: 'Why does a method lose `this` when passed as a callback?',
      tag: 'Asked often',
      a: [
        '`setTimeout(user.greet, 0)` passes only the function. It is later called as a plain function, so the default rule applies.',
        'Fix it with `user.greet.bind(user)`, a wrapper `() => user.greet()`, or a class field arrow method.',
      ],
      code: c(`
class Button {
  label = 'Save';
  onClick = () => console.log(this.label); // always bound
}`),
    },
    {
      q: 'What is the difference between `call`, `apply` and `bind`?',
      a: [
        '`call(thisArg, a, b)` runs now with arguments listed.',
        '`apply(thisArg, [a, b])` runs now with arguments as an array.',
        '`bind(thisArg, a)` does not run. It returns a new function with `this` (and optionally the first arguments) fixed.',
      ],
    },
    {
      q: 'Why should arrow functions not be used as object methods or constructors?',
      a: [
        'As a method, the arrow ignores the object and uses the outer `this` (often `undefined` or `window`).',
        'Arrows have no `prototype` and cannot be called with `new`; doing so throws a `TypeError`.',
        'They also have no own `arguments`.',
      ],
    },
    {
      q: 'What is `this` at the top level?',
      a: [
        'Classic browser script: `window` (same as `globalThis`).',
        'ES module: `undefined`.',
        'Node CommonJS file: `module.exports`, which starts as `{}`.',
      ],
    },
    {
      q: 'Can you re-bind a function that was already bound?',
      a: [
        'No. A second `bind` or a `call` cannot change `this` on a bound function.',
        'Only `new` overrides it, because the `new` rule has the highest priority.',
      ],
    },
    {
      q: 'What is `this` inside a DOM event listener?',
      a: [
        'With a regular function it is the element the listener is attached to (`event.currentTarget`).',
        'With an arrow function it is whatever `this` was outside.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      note: 'Assume the code runs as an ES module (strict mode).',
      code: c(`
const obj = {
  name: 'Ada',
  regular() { return this.name; },
  arrow: () => this?.name,
};
console.log(obj.regular(), obj.arrow());`),
      options: ['Ada Ada', 'Ada undefined', 'undefined Ada', 'TypeError'],
      answer: 1,
      explain: 'The method gets `obj` from the dot. The arrow takes `this` from the module scope, which is `undefined`.',
    },
    {
      type: 'output',
      code: c(`
'use strict';
function whoAmI() {
  return this;
}
console.log(whoAmI());`),
      options: ['window', 'undefined', '{}', 'globalThis'],
      answer: 1,
      explain: 'A plain call in strict mode leaves `this` as `undefined`.',
    },
    {
      type: 'output',
      note: 'Assume the code runs as an ES module (strict mode).',
      code: c(`
const counter = {
  count: 0,
  inc() { this.count++; return this.count; },
};
const inc = counter.inc;
try { inc(); } catch (e) { console.log(e.name); }
console.log(counter.inc());`),
      options: ['1\n2', 'TypeError\n1', 'NaN\n1', 'undefined\n1'],
      answer: 1,
      explain:
        '`inc()` is a plain call, so `this` is `undefined` and reading `this.count` throws. The real method call then works normally.',
    },
    {
      type: 'output',
      code: c(`
function Person(name) {
  this.name = name;
}
const Bound = Person.bind({ name: 'bound' });
const p = new Bound('Ada');
console.log(p.name);`),
      options: ['bound', 'Ada', 'undefined', 'TypeError'],
      answer: 1,
      explain: '`new` beats `bind`. A fresh object is created and `this.name` is set on it.',
    },
    {
      type: 'mcq',
      question: 'Which call sets `this` to `user` **and** runs the function right away with arguments `1, 2`?',
      options: ['`fn.bind(user, 1, 2)`', '`fn.call(user, [1, 2])`', '`fn.apply(user, [1, 2])`', '`fn.apply(user, 1, 2)`'],
      answer: 2,
      explain: '`apply` takes an array of arguments. `call` would need `fn.call(user, 1, 2)`, and `bind` does not run the function.',
    },
    {
      type: 'output',
      code: c(`
const a = { name: 'A', get() { return this.name; } };
const b = { name: 'B' };
const f = a.get.bind(b);
console.log(f.call(a));`),
      options: ['A', 'B', 'undefined', 'TypeError'],
      answer: 1,
      explain: 'Once bound, `this` is locked to `b`. `call(a)` cannot override it.',
    },
    {
      type: 'output',
      note: 'Assume the code runs as an ES module (strict mode).',
      code: c(`
const user = {
  name: 'Ada',
  viaFunction() {
    return [1].map(function () { return this?.name; });
  },
  viaArrow() {
    return [1].map(() => this.name);
  },
};
console.log(user.viaFunction(), user.viaArrow());`),
      options: ["['Ada'] ['Ada']", "[undefined] ['Ada']", "['Ada'] [undefined]", '[undefined] [undefined]'],
      answer: 1,
      explain:
        '`map` calls the regular function plainly, so `this` is `undefined`. The arrow inherits `this` from `viaArrow`, which is `user`.',
    },
  ],
};

export default topic;
