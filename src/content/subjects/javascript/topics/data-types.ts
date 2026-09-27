import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'data-types',
  title: 'Data types',
  level: 'beginner',
  tags: ['primitives', 'typeof', 'reference'],
  summary: 'Seven **primitive** types are copied by value; everything else is an **object** and is shared by reference.',
  keyPoints: [
    {
      title: '7 primitives + objects',
      text: '`string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`. Arrays, functions, dates and maps are all objects.',
    },
    {
      title: 'Primitives are immutable and copied',
      text: 'Assigning a primitive copies the value. Objects are copied by reference, so two variables can point to one object.',
      code: c(`
let a = 1; let b = a; b++;      // a is still 1
const o = { n: 1 }; const p = o;
p.n++;                          // o.n is now 2`),
    },
    {
      title: '`typeof` has two famous quirks',
      text: '`typeof null` is `"object"` (a bug kept for compatibility) and `typeof function(){}` is `"function"`, even though functions are objects.',
    },
    {
      title: 'Checking types properly',
      text: 'Use `Array.isArray(x)` for arrays, `x === null` for null, and `Object.prototype.toString.call(x)` for a precise tag like `[object Date]`.',
    },
  ],
  qa: [
    {
      q: 'What are the primitive types in JavaScript?',
      tag: 'Asked often',
      a: ['`string`, `number`, `bigint`, `boolean`, `undefined`, `null` and `symbol`. Everything else is an object.'],
    },
    {
      q: 'What is the difference between `null` and `undefined`?',
      tag: 'Asked often',
      a: [
        '`undefined`: a variable was declared but never given a value, a missing property, or a function with no `return`.',
        '`null`: an intentional "no value" that you assign yourself.',
        '`null == undefined` is `true`, but `null === undefined` is `false`.',
        '`typeof undefined` is `"undefined"`; `typeof null` is `"object"`.',
      ],
    },
    {
      q: 'Why is `typeof null === "object"`?',
      a: [
        'In the first JS engine, values were tagged with a type code and `null` used the same tag as objects.',
        'Fixing it would break existing websites, so it stayed.',
      ],
    },
    {
      q: 'How is pass-by-value different from pass-by-reference in JS?',
      a: [
        'JS always passes arguments **by value**, but for objects that value is a reference.',
        'So a function can mutate the object you passed, but reassigning the parameter does not affect the caller.',
      ],
      code: c(`
function change(obj) {
  obj.x = 2;      // visible to caller
  obj = { x: 3 }; // not visible, only rebinds the local
}
const o = { x: 1 };
change(o);
o.x; // 2`),
    },
    {
      q: 'How do you reliably check if a value is an array?',
      a: ['`Array.isArray(value)`. `typeof []` is `"object"`, so `typeof` cannot tell arrays apart.'],
    },
    {
      q: 'What is `BigInt` for?',
      a: [
        'Integers larger than `Number.MAX_SAFE_INTEGER` (2^53 − 1) without losing precision.',
        'Write it with an `n` suffix: `10n`. You cannot mix `BigInt` and `number` in arithmetic without converting.',
      ],
    },
    {
      q: 'What is a `Symbol`?',
      a: ['A unique, immutable value often used as an object key that cannot clash with other keys. `Symbol("a") !== Symbol("a")`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(typeof null);
console.log(typeof undefined);
console.log(typeof []);
console.log(typeof function () {});`),
      options: ['object\nundefined\nobject\nfunction', 'null\nundefined\narray\nfunction', 'object\nundefined\narray\nobject', 'null\nundefined\nobject\nfunction'],
      answer: 0,
      explain: '`typeof null` is the historic `"object"` quirk, arrays are objects, and functions get their own `"function"` result.',
    },
    {
      type: 'output',
      code: c(`
let a = { n: 1 };
let b = a;
b.n = 2;
b = { n: 3 };
console.log(a.n);`),
      options: ['1', '2', '3', 'undefined'],
      answer: 1,
      explain: '`b.n = 2` changes the shared object. `b = { n: 3 }` only points `b` elsewhere; `a` still sees the object with `n: 2`.',
    },
    {
      type: 'output',
      code: c(`
console.log(typeof NaN);
console.log(typeof 10n);
console.log(typeof Symbol('id'));`),
      options: ['number\nbigint\nsymbol', 'NaN\nnumber\nsymbol', 'number\nnumber\nobject', 'undefined\nbigint\nstring'],
      answer: 0,
      explain: '`NaN` is a special number value. `10n` is a `bigint`, and symbols have their own type.',
    },
    {
      type: 'output',
      code: c(`
const s = 'hello';
s[0] = 'H';
console.log(s);`),
      options: ['hello', 'Hello', 'TypeError', 'undefined'],
      answer: 0,
      explain: 'Strings are immutable primitives. The assignment is silently ignored (and throws only in strict mode).',
    },
    {
      type: 'output',
      code: c(`
console.log(null == undefined);
console.log(null === undefined);
console.log(typeof typeof 1);`),
      options: ['true\nfalse\nstring', 'false\nfalse\nnumber', 'true\ntrue\nstring', 'true\nfalse\nnumber'],
      answer: 0,
      explain: '`null` and `undefined` are loosely equal only to each other. `typeof 1` is the string `"number"`, and `typeof` of a string is `"string"`.',
    },
    {
      type: 'output',
      code: c(`
console.log(Object.prototype.toString.call([]));
console.log(Object.prototype.toString.call(null));`),
      options: ['[object Array]\n[object Null]', '[object Object]\n[object Object]', 'array\nnull', '[object Array]\n[object Object]'],
      answer: 0,
      explain: '`Object.prototype.toString` reports the internal tag, which is the most precise built-in type check.',
    },
    {
      type: 'mcq',
      question: 'Which of these is NOT a primitive type?',
      options: ['symbol', 'bigint', 'array', 'undefined'],
      answer: 2,
      explain: 'Arrays are objects. The seven primitives are string, number, bigint, boolean, undefined, null and symbol.',
    },
  ],
};

export default topic;
