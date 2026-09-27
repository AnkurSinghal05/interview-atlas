import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'scope-hoisting',
  title: 'Scope and hoisting',
  level: 'beginner',
  masteryMinutes: 60,
  tags: ['lexical scope', 'scope chain', 'function declarations', 'shadowing'],
  summary: 'Before running a scope, JS registers its declarations. That is **hoisting**: functions arrive ready to call, `var` arrives as `undefined`.',
  keyPoints: [
    {
      title: 'Three kinds of scope',
      text: '**Global**, **function** and **block** (`{}` with `let`/`const`). Inner scopes can read outer ones, never the other way round.',
    },
    {
      title: 'The scope chain',
      text: 'To find a variable, JS looks in the current scope, then its parent, and so on up to global. The first match wins (shadowing).',
    },
    {
      title: 'What gets hoisted, and how',
      text: 'Function declarations are hoisted **with their body**. `var` is hoisted as `undefined`. `let`, `const` and `class` are hoisted but unusable until their line.',
      code: c(`
sayHi();          // works
function sayHi() { console.log('hi'); }

greet();          // TypeError: greet is not a function
var greet = function () {};`),
    },
    {
      title: 'Two phases',
      text: 'Each scope is first **created** (declarations registered) and then **executed** line by line. Hoisting is just a name for the first phase.',
    },
  ],
  comparisons: [
    {
      items: ['Function declaration', 'Function expression'],
      rows: [
        { aspect: 'Looks like', values: ['`function add() {}`', '`const add = function () {}` or an arrow'] },
        { aspect: 'Callable before its line', values: ['Yes, hoisted with its body', 'No: `var` gives `TypeError`, `let`/`const` give `ReferenceError`'], key: true },
        { aspect: 'Name', values: ['Required', 'Optional; a named expression sees its name only inside itself'] },
        { aspect: 'Can be passed inline', values: ['No', 'Yes, as a callback or IIFE'] },
      ],
      reveal: 'The function is the same; what is hoisted differs. A declaration hoists the whole function, an expression only hoists the variable it is assigned to.',
      whenToUse: ['Top-level helpers you want to call from anywhere in the file.', 'Callbacks, conditional definitions, and functions you want to keep `const`.'],
    },
  ],
  visuals: [
    {
      type: 'stepper',
      title: 'Creation phase, then execution',
      code: c(`
console.log(a);
console.log(add(2, 3));
var a = 1;
function add(x, y) {
  return x + y;
}
console.log(a);`),
      panels: ['Memory', 'Console'],
      steps: [
        {
          line: null,
          note: 'Creation phase: before any line runs, JS scans the scope and registers declarations.',
          state: { Memory: ['a: undefined', 'add: ƒ add(x, y)'] },
        },
        {
          line: 1,
          note: '`a` exists but only holds `undefined` so far.',
          state: { Memory: ['a: undefined', 'add: ƒ add(x, y)'], Console: ['undefined'] },
        },
        {
          line: 2,
          note: 'The whole function was hoisted, so it can be called before its line.',
          state: { Memory: ['a: undefined', 'add: ƒ add(x, y)'], Console: ['undefined', '5'] },
        },
        {
          line: 3,
          note: 'Only now is the value 1 assigned.',
          state: { Memory: ['a: 1', 'add: ƒ add(x, y)'], Console: ['undefined', '5'] },
        },
        {
          line: 7,
          note: 'The declaration on lines 4 to 6 was already handled, so execution skips to here.',
          state: { Memory: ['a: 1', 'add: ƒ add(x, y)'], Console: ['undefined', '5', '1'] },
        },
      ],
    },
  ],
  qa: [
    {
      q: 'What is the difference between a function declaration and a function expression?',
      tag: 'Asked often',
      a: [
        '**Declaration:** `function add() {}` is hoisted with its body, so you can call it before the line.',
        '**Expression:** `const add = function () {}` (or an arrow) is only a value assigned to a variable, so it is not callable before that line.',
        'Named function expressions only expose their name inside their own body.',
      ],
      code: c(`
hoisted();  // works
notYet();   // ReferenceError (TDZ)
function hoisted() {}
const notYet = function () {};`),
    },
    {
      q: 'Are `import` statements hoisted?',
      a: [
        'Yes. All static imports are resolved and loaded before any code in the module runs, wherever they appear in the file.',
        'Convention is still to put them at the top.',
      ],
    },
    {
      q: 'What are scopes in JavaScript, and what is lexical scoping?',
      a: [
        'Scopes: **global**, **module**, **function** and **block** (`let`/`const` inside `{}`).',
        '**Lexical scoping** means a function can see the variables of the places it was written inside, decided at write time, not call time.',
      ],
    },
    {
      q: 'What is hoisting?',
      tag: 'Asked often',
      a: [
        'During the creation phase, declarations are registered at the top of their scope before code runs.',
        'Function declarations get their full value; `var` gets `undefined`; `let`/`const`/`class` stay uninitialised (TDZ).',
        'Nothing is physically moved; it is how the engine sets up scope.',
      ],
    },
    {
      q: 'Are function expressions hoisted?',
      a: [
        'Only the variable is hoisted, not the function.',
        'With `var fn = function(){}`, calling `fn()` early throws `TypeError: fn is not a function`. With `let`/`const`, it throws a `ReferenceError`.',
      ],
    },
    {
      q: 'What is lexical scope?',
      a: ['Scope determined by where code is written, not where it is called. A function always sees the variables around its definition.'],
    },
    {
      q: 'What is variable shadowing?',
      a: [
        'Declaring a variable in an inner scope with the same name as an outer one. Inside, the inner one hides the outer.',
        'Shadowing a `let` with `var` in the same function scope is a SyntaxError ("illegal shadowing").',
      ],
    },
    {
      q: 'If a function and a `var` have the same name, which wins?',
      a: [
        'During hoisting the function declaration wins over the `var` declaration.',
        'But once a `var` **assignment** line runs, it overwrites the function.',
      ],
      code: c(`
console.log(typeof foo); // "function"
var foo = 1;
function foo() {}
console.log(typeof foo); // "number"`),
    },
    {
      q: 'Are function declarations inside blocks hoisted?',
      a: ['In strict mode they are block-scoped. In sloppy mode browsers use legacy rules that vary, so avoid declaring functions inside `if` blocks.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
var x = 1;
function f() {
  console.log(x);
  var x = 2;
}
f();`),
      options: ['undefined', '1', '2', 'ReferenceError'],
      answer: 0,
      explain: 'The local `var x` is hoisted to the top of `f` and shadows the global one, so the log sees the local `undefined`.',
    },
    {
      type: 'output',
      code: c(`
console.log(typeof foo);
var foo = 'bar';
function foo() {}
console.log(typeof foo);`),
      options: ['function\nstring', 'undefined\nstring', 'string\nstring', 'function\nfunction'],
      answer: 0,
      explain: 'The function declaration wins during hoisting. Then the assignment on line 2 replaces it with a string.',
    },
    {
      type: 'output',
      code: c(`
try {
  hello();
} catch (e) {
  console.log(e.name);
}
var hello = function () {
  console.log('hi');
};`),
      options: ['TypeError', 'hi', 'ReferenceError', 'undefined'],
      answer: 0,
      explain: '`hello` is hoisted as `undefined`, and calling `undefined` throws a `TypeError`.',
    },
    {
      type: 'output',
      code: c(`
function outer() {
  var a = 'outer';
  function inner() {
    console.log(a);
  }
  return inner;
}
var a = 'global';
outer()();`),
      options: ['outer', 'global', 'undefined', 'ReferenceError'],
      answer: 0,
      explain: 'Lexical scope: `inner` finds `a` in `outer`, where it was defined.',
    },
    {
      type: 'output',
      code: c(`
function test() {
  console.log(a, b);
  var a = 1;
  function b() {}
}
test();`),
      options: ['undefined [Function: b]', 'undefined undefined', '1 [Function: b]', 'ReferenceError'],
      answer: 0,
      explain: '`a` is hoisted as `undefined`; `b` is hoisted with its body.',
    },
    {
      type: 'output',
      code: c(`
var n = 10;
(function () {
  n = 20;
  var n;
  console.log(n);
})();
console.log(n);`),
      options: ['20\n10', '20\n20', '10\n10', 'undefined\n10'],
      answer: 0,
      explain: '`var n` is hoisted inside the IIFE, so `n = 20` writes to the local variable. The global stays 10.',
    },
    {
      type: 'truefalse',
      statement: 'Hoisting physically moves declarations to the top of the file.',
      answer: false,
      explain: 'Nothing moves. The engine registers declarations when it creates the scope, before running the code.',
    },
  ],
};

export default topic;
