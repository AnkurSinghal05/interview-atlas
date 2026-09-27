import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'higher-order',
  title: 'Higher-order functions',
  level: 'beginner',
  tags: ['first-class functions', 'callbacks', 'pure functions', 'composition'],
  summary: 'Functions are values. A **higher-order function** takes a function as an argument, returns one, or both.',
  keyPoints: [
    {
      title: 'Functions are first-class',
      text: 'You can store a function in a variable, put it in an array, pass it as an argument and return it from another function.',
    },
    {
      title: 'Taking a function',
      text: '`map`, `filter`, `reduce`, `forEach`, `setTimeout` and `addEventListener` all accept a callback.',
      code: c(`[1, 2, 3].map((n) => n * 2); // [2, 4, 6]`),
    },
    {
      title: 'Returning a function',
      text: 'Factories, currying, `bind`, debounce and memoize all return new functions that close over their inputs.',
      code: c(`
const multiplyBy = (k) => (n) => n * k;
const triple = multiplyBy(3);
triple(5); // 15`),
    },
    {
      title: 'Pure functions compose well',
      text: 'A pure function returns the same output for the same input and has no side effects. Pure callbacks make HOFs predictable.',
    },
  ],
  qa: [
    {
      q: 'What is a higher-order function?',
      tag: 'Asked often',
      a: ['A function that accepts another function as an argument or returns a function. Examples: `map`, `filter`, `reduce`, `bind`, and any function factory.'],
    },
    {
      q: 'What does "functions are first-class citizens" mean?',
      a: ['Functions are treated like any other value: assigned to variables, stored in data structures, passed as arguments and returned.'],
    },
    {
      q: 'What is a pure function?',
      a: [
        'Same input always gives the same output.',
        'No side effects: it does not change outside state, the DOM, or its arguments.',
        '`Math.max` is pure; `Math.random` and `arr.push` are not.',
      ],
    },
    {
      q: 'What is function composition?',
      a: ['Combining small functions so the output of one is the input of the next: `compose(f, g)(x) === f(g(x))`. See the Pipe and compose topic.'],
    },
    {
      q: 'Write your own `map` for arrays.',
      tag: 'Coding',
      a: ['Loop over the array, call the callback with `(item, index, array)`, and push the result into a new array.'],
      code: c(`
Array.prototype.myMap = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) out[i] = cb.call(thisArg, this[i], i, this);
  }
  return out;
};`),
    },
    {
      q: 'What is a callback function?',
      a: ['A function passed to another function to be called later, either synchronously (`map`) or asynchronously (`setTimeout`, event handlers).'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const add = (a) => (b) => a + b;
const add5 = add(5);
console.log(add5(3), add(1)(2));`),
      options: ['8 3', '8 12', 'NaN 3', '[Function] 3'],
      answer: 0,
      explain: '`add(5)` returns a function that remembers `a = 5`. `add(1)(2)` calls both levels at once.',
    },
    {
      type: 'output',
      code: c(`
function repeat(n, fn) {
  for (let i = 0; i < n; i++) fn(i);
}
const out = [];
repeat(3, (i) => out.push(i * i));
console.log(out);`),
      options: ['[ 0, 1, 4 ]', '[ 1, 4, 9 ]', '[ 0, 1, 2 ]', '3'],
      answer: 0,
      explain: 'The callback is called with 0, 1 and 2 and pushes their squares.',
    },
    {
      type: 'output',
      code: c(`
const fns = [Math.abs, String, (x) => x * 2];
console.log(fns.map((f) => f(-3)));`),
      options: ["[ 3, '-3', -6 ]", '[ 3, -3, -6 ]', "[ '3', '-3', '-6' ]", 'TypeError'],
      answer: 0,
      explain: 'Functions are values you can store in an array and call in a loop. `String(-3)` returns a string.',
    },
    {
      type: 'output',
      code: c(`
const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);
const inc = (x) => x + 1;
const dbl = (x) => x * 2;
console.log(compose(inc, dbl)(5));`),
      options: ['11', '12', '10', '6'],
      answer: 0,
      explain: '`compose` runs right to left: `dbl(5)` is 10, then `inc(10)` is 11.',
    },
    {
      type: 'output',
      code: c(`
function counterFactory() {
  let n = 0;
  return { inc: () => ++n, get: () => n };
}
const c1 = counterFactory();
c1.inc(); c1.inc();
console.log(c1.get(), counterFactory().get());`),
      options: ['2 0', '2 2', '0 0', '1 0'],
      answer: 0,
      explain: 'Each factory call creates a fresh `n`. The returned functions share only their own `n`.',
    },
    {
      type: 'mcq',
      question: 'Which function is pure?',
      options: ['`(arr) => arr.push(1)`', '`(x) => x * 2`', '`() => Date.now()`', '`(x) => console.log(x)`'],
      answer: 1,
      explain: 'Doubling depends only on the input and changes nothing outside. The others mutate, depend on time, or do I/O.',
    },
  ],
};

export default topic;
