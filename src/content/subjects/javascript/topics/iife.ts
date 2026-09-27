import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'iife',
  title: 'IIFE',
  level: 'beginner',
  masteryMinutes: 30,
  tags: ['immediately invoked', 'module pattern', 'private scope'],
  summary: 'An **Immediately Invoked Function Expression** runs as soon as it is defined, giving you a private scope.',
  keyPoints: [
    {
      title: 'The shape',
      text: 'Wrap a function in parentheses to make it an expression, then call it.',
      code: c(`
(function () {
  const secret = 42;
})();

(() => { /* arrow version */ })();`),
    },
    {
      title: 'Why the parentheses?',
      text: 'A line starting with `function` is parsed as a declaration, which cannot be called in place. The parentheses force an expression.',
    },
    {
      title: 'What it was used for',
      text: 'Before `let`/`const` and modules, IIFEs avoided polluting globals, created private state (the module pattern) and captured loop values.',
    },
    {
      title: 'Still useful',
      text: 'Running top-level `async` code in scripts: `(async () => { await init(); })();`',
    },
  ],
  qa: [
    {
      q: 'What is an IIFE and why use one?',
      tag: 'Asked often',
      a: [
        'A function expression that is called immediately.',
        'It creates a private scope so variables do not leak into the global scope.',
        'It was the basis of the module pattern before ES modules.',
      ],
    },
    {
      q: 'Why does `function(){}()` throw a SyntaxError?',
      a: ['At the start of a statement, `function` begins a declaration, which needs a name and cannot be invoked directly. Wrapping it in `( )` makes it an expression.'],
    },
    {
      q: 'What is the module pattern?',
      a: ['An IIFE that keeps state private and returns an object of public methods.'],
      code: c(`
const counter = (function () {
  let count = 0;
  return {
    inc: () => ++count,
    reset: () => (count = 0),
  };
})();
counter.inc(); // 1`),
    },
    {
      q: 'Can an IIFE have a name?',
      a: ['Yes, a named function expression. The name is only visible inside the function, which is useful for recursion and stack traces.'],
    },
    {
      q: 'How did IIFEs fix the `var` in a loop problem?',
      a: ['By passing the current value as an argument, each callback got its own copy in a new function scope.'],
      code: c(`
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j));
  })(i);
}`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
var result = (function (a, b) {
  return a * b;
})(3, 4);
console.log(result);`),
      options: ['12', '7', 'undefined', '[Function]'],
      answer: 0,
      explain: 'The function runs immediately with 3 and 4, and `result` holds the return value.',
    },
    {
      type: 'output',
      code: c(`
(function () {
  var inside = 'secret';
})();
console.log(typeof inside);`),
      options: ['undefined', 'string', 'ReferenceError', 'object'],
      answer: 0,
      explain: '`inside` lives only in the IIFE scope. `typeof` on a missing name returns `"undefined"`.',
    },
    {
      type: 'output',
      code: c(`
const fact = (function f(n) {
  return n <= 1 ? 1 : n * f(n - 1);
})(5);
console.log(fact, typeof f);`),
      options: ['120 undefined', '120 function', 'ReferenceError', '5 undefined'],
      answer: 0,
      explain: 'A named function expression can call itself by name, but the name is not visible outside.',
    },
    {
      type: 'output',
      code: c(`
var x = 10;
(function () {
  console.log(x);
  var x = 20;
})();`),
      options: ['undefined', '10', '20', 'ReferenceError'],
      answer: 0,
      explain: 'The IIFE has its own hoisted `var x`, which shadows the global one and is `undefined` at the log.',
    },
    {
      type: 'output',
      code: c(`
const api = (() => {
  let hits = 0;
  return { hit: () => ++hits };
})();
api.hit();
api.hit();
console.log(api.hit(), api.hits);`),
      options: ['3 undefined', '3 3', '1 undefined', '2 undefined'],
      answer: 0,
      explain: 'The module pattern hides `hits`; only `hit()` can change it.',
    },
    {
      type: 'truefalse',
      statement: 'An arrow function can be used as an IIFE.',
      answer: true,
      explain: '`(() => { ... })()` works fine.',
    },
  ],
};

export default topic;
