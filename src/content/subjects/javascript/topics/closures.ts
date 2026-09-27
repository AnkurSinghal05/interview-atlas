import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'closures',
  title: 'Closures',
  level: 'intermediate',
  tags: ['scope', 'lexical environment', 'private state'],
  summary: 'A function remembers the variables from where it was **created**, even after that outer function has returned.',
  keyPoints: [
    {
      title: 'Scope is decided where code is written',
      text: 'JavaScript uses lexical scope. A function looks up variables in the place it was defined, never in the place it is called from.',
    },
    {
      title: 'Functions carry their birthplace',
      text: 'Every function keeps a hidden link to its outer scope. That function plus the link is the closure.',
    },
    {
      title: 'It holds live variables, not copies',
      text: 'The closure points at the variable itself, so a later change is visible inside the function.',
      code: c(`
let x = 1;
const getX = () => x;
x = 2;
getX(); // 2`),
    },
    {
      title: 'Why interviewers care',
      text: 'Closures power private state, function factories, `once()`, memoize, debounce and throttle. They also explain the classic `var` in a loop bug.',
    },
  ],
  visuals: [
    {
      type: 'stepper',
      title: 'Watch a counter keep its state',
      code: c(`
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const counter = makeCounter();
console.log(counter());
console.log(counter());`),
      panels: ['Call stack', 'Scope kept alive', 'Console'],
      steps: [
        {
          line: 8,
          note: '`makeCounter()` is called. A fresh scope is created for this one call.',
          state: { 'Call stack': ['global', 'makeCounter()'] },
        },
        {
          line: 2,
          note: '`count` is created inside that scope.',
          state: { 'Call stack': ['global', 'makeCounter()'], 'Scope kept alive': ['makeCounter scope: count = 0'] },
        },
        {
          line: [3, 4, 5, 6],
          note: 'The inner function is created here, so it captures a link to this scope.',
          state: { 'Call stack': ['global', 'makeCounter()'], 'Scope kept alive': ['makeCounter scope: count = 0'] },
        },
        {
          line: 8,
          note: '`makeCounter` returns and leaves the stack. Its scope is **not** thrown away, because `counter` still points to it.',
          state: { 'Call stack': ['global'], 'Scope kept alive': ['count = 0  ← held by counter'] },
        },
        {
          line: [9, 4],
          note: '`counter()` runs and bumps `count` through the closure.',
          state: { 'Call stack': ['global', 'counter()'], 'Scope kept alive': ['count = 1  ← held by counter'] },
        },
        {
          line: 9,
          note: 'It returns 1, which gets logged.',
          state: { 'Call stack': ['global'], 'Scope kept alive': ['count = 1  ← held by counter'], Console: ['1'] },
        },
        {
          line: 10,
          note: 'Same scope, same `count`. The second call sees 1 and makes it 2.',
          state: { 'Call stack': ['global'], 'Scope kept alive': ['count = 2  ← held by counter'], Console: ['1', '2'] },
        },
      ],
    },
  ],
  qa: [
    {
      q: 'What is a closure?',
      tag: 'Asked often',
      a: [
        'A function together with references to the variables of the scope where it was defined.',
        'Every JS function is a closure. It becomes visible when the function **outlives** that scope, for example when it is returned or passed as a callback.',
      ],
      code: c(`
function greeter(greeting) {
  return (name) => \`\${greeting}, \${name}\`;
}
const hi = greeter('Hi');
hi('Ada'); // "Hi, Ada"  (greeting is remembered)`),
    },
    {
      q: 'Does a closure copy the values of outer variables?',
      a: [
        'No. It keeps a reference to the variable binding, so it always sees the current value.',
        'Two closures created in the same scope share the same variables.',
      ],
    },
    {
      q: 'Why does `var` inside a loop with `setTimeout` print the same number every time?',
      tag: 'Asked often',
      a: [
        '`var` is function-scoped, so the whole loop shares **one** `i`.',
        'The callbacks run after the loop finishes, when `i` is already 3.',
        'Fix it with `let` (a new binding per iteration) or by passing `i` into an IIFE.',
      ],
      code: c(`
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0 1 2`),
    },
    {
      q: 'How do you make private variables with closures?',
      a: [
        'Keep the variable inside a function and return only the functions that may touch it. Code outside has no way to reach the variable directly.',
      ],
      code: c(`
function createWallet() {
  let balance = 0;
  return {
    deposit: (n) => (balance += n),
    get: () => balance,
  };
}
const w = createWallet();
w.deposit(50);
w.balance; // undefined, it is private`),
    },
    {
      q: 'Name some practical uses of closures.',
      a: [
        'Data privacy and the module pattern.',
        'Function factories and partial application.',
        'Memoization caches, `once()`, debounce and throttle.',
        'Event handlers and callbacks that need to remember state.',
      ],
    },
    {
      q: 'Can closures cause memory leaks?',
      a: [
        'A closure keeps its captured scope alive as long as the function itself is reachable.',
        'A long-lived listener or timer that closes over a large object keeps that object in memory.',
        'Remove listeners, clear timers, and drop references you no longer need.',
      ],
    },
    {
      q: 'What is the difference between scope and a closure?',
      a: [
        '**Scope** is the set of variables visible at a place in the code, fixed when you write it.',
        'A **closure** is the runtime pairing of a function with that scope, which can live on after the outer function returns.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`),
      options: ['0\n1\n2', '3\n3\n3', '0\n0\n0', 'undefined\nundefined\nundefined'],
      answer: 1,
      explain: '`var` gives one shared `i`. By the time the timers fire, the loop has finished and `i` is 3.',
    },
    {
      type: 'output',
      code: c(`
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`),
      options: ['0\n1\n2', '3\n3\n3', '2\n2\n2', '1\n2\n3'],
      answer: 0,
      explain: '`let` creates a new `i` for each iteration, so each callback closes over its own value.',
    },
    {
      type: 'output',
      code: c(`
function outer() {
  let count = 0;
  return () => ++count;
}
const a = outer();
const b = outer();
console.log(a(), a(), b());`),
      options: ['1 2 3', '1 2 1', '1 1 1', '0 1 0'],
      answer: 1,
      explain: 'Each call to `outer()` makes a separate `count`. `a` and `b` never share state.',
    },
    {
      type: 'output',
      code: c(`
let name = 'Ada';
function greet() {
  console.log(name);
}
function run() {
  let name = 'Linus';
  greet();
}
run();`),
      options: ['Ada', 'Linus', 'undefined', 'ReferenceError'],
      answer: 0,
      explain: '`greet` was written at the top level, so it sees the top-level `name`. Where it is called from does not matter.',
    },
    {
      type: 'truefalse',
      statement: 'A closure stores a snapshot of outer variable values from the moment the function was created.',
      answer: false,
      explain: 'It stores a reference to the variables themselves, so it sees later changes.',
    },
    {
      type: 'output',
      code: c(`
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(((j) => () => j)(i));
}
console.log(fns.map((f) => f()));`),
      options: ['[0, 1, 2]', '[3, 3, 3]', '[2, 2, 2]', '[undefined, undefined, undefined]'],
      answer: 0,
      explain: 'The IIFE runs immediately with the current `i` and gives each arrow its own parameter `j`.',
    },
    {
      type: 'output',
      code: c(`
function once(fn) {
  let done = false, result;
  return (...args) => {
    if (!done) { done = true; result = fn(...args); }
    return result;
  };
}
const init = once((x) => x * 10);
console.log(init(1), init(5));`),
      options: ['10 50', '10 10', '10 undefined', '50 50'],
      answer: 1,
      explain: '`done` and `result` live in the closure. The second call skips `fn` and returns the cached 10.',
    },
  ],
};

export default topic;
