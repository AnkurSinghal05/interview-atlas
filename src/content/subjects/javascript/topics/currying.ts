import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'currying',
  title: 'Currying',
  level: 'intermediate',
  masteryMinutes: 90,
  tags: ['partial application', 'function arity', 'infinite currying'],
  summary: 'Currying turns `f(a, b, c)` into `f(a)(b)(c)`: a chain of functions that each take one argument.',
  keyPoints: [
    {
      title: 'The idea',
      text: 'Each call returns a new function that remembers the arguments so far (a closure) until it has enough to compute.',
      code: c(`
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3); // 6`),
    },
    {
      title: 'Currying vs partial application',
      text: 'Currying always takes one argument at a time. Partial application fixes some arguments and takes the rest at once (like `bind`).',
    },
    {
      title: 'Generic curry uses `fn.length`',
      text: 'Collect arguments until you have as many as the function declares, then call it.',
    },
    {
      title: 'Why use it',
      text: 'Build specialised functions from general ones (`const log = logger("error")`) and compose small functions.',
    },
  ],
  qa: [
    {
      q: 'Write a generic `curry` function.',
      tag: 'Coding',
      a: ['If enough arguments were collected, call the function; otherwise return a function that gathers more.'],
      code: c(`
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}
const sum3 = curry((a, b, c) => a + b + c);
sum3(1)(2)(3); // 6
sum3(1, 2)(3); // 6`),
    },
    {
      q: 'Implement `sum(1)(2)(3)()` that works for any number of calls.',
      tag: 'Coding',
      a: ['Keep returning a function while an argument is passed; return the total on an empty call.'],
      code: c(`
const sum = (a) => (b) => (b === undefined ? a : sum(a + b));
sum(1)(2)(3)(); // 6`),
    },
    {
      q: 'What is the difference between currying and partial application?',
      tag: 'Asked often',
      a: [
        'Currying: `f(a, b, c)` → `f(a)(b)(c)`, one argument per call.',
        'Partial application: fix some arguments now, pass the rest later, e.g. `f.bind(null, a)` → `g(b, c)`.',
      ],
    },
    {
      q: 'Why does a generic curry break with default or rest parameters?',
      a: ['It relies on `fn.length`, which stops counting at the first default or rest parameter.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const multiply = (a) => (b) => a * b;
const double = multiply(2);
console.log(double(5), multiply(3)(4));`),
      options: ['10 12', '10 7', '7 12', 'NaN NaN'],
      answer: 0,
      explain: '`multiply(2)` returns a function that remembers `a = 2`.',
    },
    {
      type: 'output',
      code: c(`
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
const vol = curry((l, w, h) => l * w * h);
console.log(vol(2)(3)(4), vol(2, 3)(4), vol(2)(3, 4));`),
      options: ['24 24 24', '24 NaN NaN', '24 24 NaN', '9 9 9'],
      answer: 0,
      explain: 'A generic curry accepts arguments in any grouping until it has three.',
    },
    {
      type: 'output',
      code: c(`
const sum = (a) => (b) => (b === undefined ? a : sum(a + b));
console.log(sum(1)(2)(3)(4)());`),
      options: ['10', '[Function]', '1', 'undefined'],
      answer: 0,
      explain: 'Each call adds to the running total; the empty call returns it.',
    },
    {
      type: 'output',
      code: c(`
const add = (a) => (b) => a + b;
console.log(typeof add(1), typeof add(1)(2));`),
      options: ['function number', 'number number', 'function function', 'number function'],
      answer: 0,
      explain: 'Until the last argument is supplied, you get a function back.',
    },
    {
      type: 'output',
      code: c(`
const log = (level) => (msg) => \`[\${level}] \${msg}\`;
const error = log('ERROR');
console.log(['disk full', 'oom'].map(error));`),
      options: ["[ '[ERROR] disk full', '[ERROR] oom' ]", "[ '[ERROR] disk full', '[ERROR] 1' ]", "[ '[undefined] disk full', '[undefined] oom' ]", 'TypeError'],
      answer: 0,
      explain: 'A curried function gives you ready-made one-argument callbacks. `map` passes extra args, but `error` only reads the first.',
    },
  ],
};

export default topic;
