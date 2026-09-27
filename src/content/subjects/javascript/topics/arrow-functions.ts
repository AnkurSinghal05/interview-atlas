import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'arrow-functions',
  title: 'Arrow functions',
  level: 'beginner',
  masteryMinutes: 45,
  tags: ['lexical this', 'arguments', 'implicit return'],
  summary: 'Arrows are short functions that **borrow** `this` and `arguments` from the surrounding code and cannot be used with `new`.',
  keyPoints: [
    {
      title: 'Short syntax',
      text: 'One expression returns automatically. Wrap an object literal in parentheses or it is read as a block.',
      code: c(`
const sq = (n) => n * n;
const make = () => ({ ok: true });
const broken = () => { ok: true }; // returns undefined`),
    },
    {
      title: 'No own `this`',
      text: 'An arrow uses `this` from where it is defined. `call`, `apply` and `bind` cannot change it.',
    },
    {
      title: 'No `arguments`, no `new`, no `prototype`',
      text: 'Use rest parameters (`...args`) instead of `arguments`. Calling an arrow with `new` throws.',
    },
    {
      title: 'When not to use them',
      text: 'Object methods that need `this`, constructors, and DOM handlers that rely on `this` being the element.',
    },
  ],
  comparisons: [
    {
      items: ['Arrow function', 'Regular function'],
      rows: [
        { aspect: '`this`', values: ['Taken from the surrounding scope when it is created', 'Decided by how it is called'], key: true },
        { aspect: '`call` / `apply` / `bind` change `this`', values: ['No (arguments still pass through)', 'Yes'] },
        { aspect: '`arguments` object', values: ['None (it sees the outer one); use `...args`', 'Yes'] },
        { aspect: 'Use with `new`', values: ['`TypeError`', 'Works'] },
        { aspect: '`prototype` property', values: ['None', 'Yes'] },
        { aspect: 'As an object method', values: ['`this` is not the object', '`this` is the object before the dot'] },
        { aspect: 'Implicit return', values: ['Yes, with an expression body: `x => x * 2`', 'No, needs `return`'] },
        { aspect: 'Hoisting', values: ['Like the `const`/`let` holding it (TDZ)', 'Declarations are hoisted whole'] },
      ],
      reveal:
        'An arrow function is not a shorter regular function. It has no `this`, `arguments`, `super` or `new.target` of its own, so it borrows them from where it was written.',
      whenToUse: [
        'Callbacks inside methods (`map`, `setTimeout`, `.then`) where you want the outer `this`, and short one-line helpers.',
        'Object and prototype methods, constructors, DOM handlers that use `this` as the element, and anything that needs `arguments`.',
      ],
      code: [
        c(`
const timer = {
  s: 0,
  start() {
    setInterval(() => this.s++, 1000); // this = timer
  },
};`),
        c(`
const timer = {
  s: 0,
  start() {
    setInterval(function () {
      this.s++; // this is not timer
    }, 1000);
  },
};`),
      ],
    },
  ],
  qa: [
    {
      q: 'Why use arrow functions inside constructors (or as class fields)?',
      a: [
        'An arrow created inside the constructor captures that instance as its `this` forever.',
        'So it can be passed around as a callback (`button.onclick = this.handleClick`) without `bind`.',
        'The cost: each instance gets its own copy of the function instead of sharing one on the prototype.',
      ],
      code: c(`
function Counter() {
  this.count = 0;
  this.inc = () => { this.count++; }; // this is always this Counter
}
const counter = new Counter();
setTimeout(counter.inc); // still works, no bind needed`),
    },
    {
      q: 'What are practical use cases for arrow functions?',
      a: [
        'Short callbacks: `items.map((x) => x.id)`.',
        'Callbacks inside methods that need the outer `this` (timers, promise chains, event handlers set up in a class).',
        'Small inline helpers and function factories: `const add = (a) => (b) => a + b`.',
      ],
    },
    {
      q: 'How do arrow functions differ from regular functions?',
      tag: 'Asked often',
      a: [
        'No own `this`: it is taken lexically from the enclosing scope.',
        'No own `arguments` object.',
        'Cannot be used as constructors (`new` throws) and have no `prototype`.',
        'Cannot be generators.',
        'Shorter syntax with implicit return.',
      ],
    },
    {
      q: 'Why is an arrow function a bad choice for an object method?',
      a: [
        'Its `this` comes from the surrounding scope (usually the module or global), not from the object.',
      ],
      code: c(`
const user = {
  name: 'Ada',
  hi: () => this.name,     // not user
  hello() { return this.name; }, // 'Ada'
};`),
    },
    {
      q: 'Where do arrow functions shine?',
      a: [
        'Callbacks inside methods, where you want the outer `this`: `setTimeout(() => this.tick(), 1000)`.',
        'Short array callbacks like `map` and `filter`.',
      ],
    },
    {
      q: 'Can you change `this` of an arrow function with `bind`?',
      a: ['No. `bind`, `call` and `apply` ignore the `this` argument for arrows. Arguments are still passed normally.'],
    },
    {
      q: 'How do you get all arguments in an arrow function?',
      a: ['Use rest parameters: `(...args) => args.length`. Referencing `arguments` would read the enclosing function\'s `arguments`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const obj = {
  name: 'obj',
  regular() { return this.name; },
  arrow: () => typeof this,
};
console.log(obj.regular());
console.log(obj.arrow());`),
      note: 'Assume the code runs as an ES module (strict mode).',
      options: ['obj\nundefined', 'obj\nobject', 'undefined\nundefined', 'obj\nstring'],
      answer: 0,
      explain: 'The method gets `this = obj`. The arrow takes `this` from the module top level, which is `undefined`.',
    },
    {
      type: 'output',
      code: c(`
const make = () => { value: 1 };
const make2 = () => ({ value: 1 });
console.log(make(), make2());`),
      options: ['undefined { value: 1 }', '{ value: 1 } { value: 1 }', 'SyntaxError', '1 { value: 1 }'],
      answer: 0,
      explain: 'Without parentheses the braces are a function body, and `value:` is a label. Nothing is returned.',
    },
    {
      type: 'output',
      code: c(`
function outer() {
  const inner = () => arguments[0];
  return inner('ignored');
}
console.log(outer('from outer'));`),
      options: ['from outer', 'ignored', 'undefined', 'ReferenceError'],
      answer: 0,
      explain: 'Arrows have no own `arguments`, so `arguments` refers to `outer`\'s.',
    },
    {
      type: 'output',
      code: c(`
const Person = (name) => {
  this.name = name;
};
try {
  new Person('Ada');
} catch (e) {
  console.log(e.name);
}`),
      options: ['TypeError', 'ReferenceError', 'SyntaxError', 'Nothing is logged'],
      answer: 0,
      explain: 'Arrow functions are not constructors. `new` on them throws `TypeError: Person is not a constructor`.',
    },
    {
      type: 'output',
      code: c(`
const timer = {
  seconds: 0,
  start() {
    [1, 2, 3].forEach(() => this.seconds++);
    return this.seconds;
  },
};
console.log(timer.start());`),
      options: ['3', '0', 'NaN', 'TypeError'],
      answer: 0,
      explain: 'The arrow uses `this` from `start`, which is `timer`. A regular function callback would lose it.',
    },
    {
      type: 'output',
      code: c(`
const getThis = () => this;
const bound = getThis.bind({ x: 1 });
console.log(bound() === getThis());`),
      options: ['true', 'false', 'TypeError', 'undefined'],
      answer: 0,
      explain: '`bind` cannot change an arrow\'s `this`, so both calls return the same outer value.',
    },
  ],
};

export default topic;
