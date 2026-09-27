import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'iterators-generators',
  title: 'Iterators and generators',
  level: 'advanced',
  masteryMinutes: 120,
  tags: ['Symbol.iterator', 'for...of', 'yield', 'lazy sequences', 'async iteration'],
  summary: 'An **iterator** hands out values one at a time via `next()`. A **generator** is a function that pauses at each `yield` to produce them.',
  keyPoints: [
    {
      title: 'The iterator protocol',
      text: '`next()` returns `{ value, done }`. An object is **iterable** if it has a `[Symbol.iterator]()` method that returns an iterator.',
    },
    {
      title: 'What uses it',
      text: '`for...of`, spread `[...x]`, array destructuring, `Array.from`, `Promise.all`, `new Map(iterable)`.',
    },
    {
      title: 'Generators pause and resume',
      text: 'Calling `function*` returns a generator object without running the body. Each `next()` runs until the next `yield`.',
      code: c(`
function* count() {
  yield 1;
  yield 2;
}
const g = count();
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: undefined, done: true }`),
    },
    {
      title: 'Lazy and infinite',
      text: 'Generators compute values only when asked, so they can describe infinite sequences safely.',
    },
  ],
  comparisons: [
    {
      items: ['`for...in`', '`for...of`'],
      rows: [
        { aspect: 'Gives you', values: ['Keys (property names, as strings)', 'Values'], key: true },
        { aspect: 'Works on', values: ['Any object', 'Iterables only: arrays, strings, Maps, Sets, generators'], key: true },
        { aspect: 'Plain object', values: ['Yes', '`TypeError: not iterable`'] },
        { aspect: 'Array `[10, 20]`', values: ["`'0'`, `'1'`", '`10`, `20`'] },
        { aspect: 'Inherited properties', values: ['Included if enumerable', 'Not applicable'] },
        { aspect: 'Uses', values: ['Enumerable property keys', '`[Symbol.iterator]()`'] },
      ],
      reveal: '`in` asks "what keys does this object have?", `of` asks "what does this collection produce?". `for...of` is driven by the iterator protocol, so anything with `[Symbol.iterator]` works.',
      whenToUse: ['Rarely; prefer `Object.keys` / `Object.entries` with `for...of`.', 'Arrays, strings, Maps, Sets and your own iterables.'],
    },
  ],
  qa: [
    {
      q: 'How is async/await related to generators?',
      a: [
        'A generator can pause at `yield` and be resumed with a value. If you `yield` a promise and resume the generator when it settles, you get async/await.',
        'Libraries like `co` did exactly this before `async/await` was added to the language.',
      ],
      code: c(`
function run(genFn) {
  const gen = genFn();
  const step = (value) => {
    const { value: promise, done } = gen.next(value);
    if (!done) Promise.resolve(promise).then(step);
  };
  step();
}
run(function* () {
  const user = yield fetchUser(); // behaves like await
  console.log(user);
});`),
    },
    {
      q: 'What is the difference between an iterable and an iterator?',
      tag: 'Asked often',
      a: [
        '**Iterable**: has a `[Symbol.iterator]()` method (arrays, strings, Maps, Sets).',
        '**Iterator**: the object returned by that method, with a `next()` method.',
      ],
    },
    {
      q: 'Make a plain object iterable.',
      tag: 'Coding',
      a: ['Add a `[Symbol.iterator]` method. A generator makes it short.'],
      code: c(`
const range = {
  from: 1, to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
[...range]; // [1, 2, 3]`),
    },
    {
      q: 'Why can\'t you use `for...of` on a plain object?',
      a: ['Plain objects are not iterable. Use `Object.entries(obj)` (which returns an array) with `for...of`, or `for...in` for keys.'],
    },
    {
      q: 'What is the difference between `for...in` and `for...of`?',
      tag: 'Asked often',
      a: [
        '`for...in` loops over **keys** (enumerable, including inherited) of any object.',
        '`for...of` loops over **values** of an iterable.',
      ],
    },
    {
      q: 'How do you pass a value into a generator?',
      a: ['`gen.next(value)` resumes the generator and makes the paused `yield` expression evaluate to `value`. The first `next()` argument is ignored.'],
    },
    {
      q: 'What are async generators?',
      a: ['`async function*` can `await` and `yield`. Consume them with `for await (const x of gen())`. Useful for paginated APIs and streams.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function* gen() {
  console.log('start');
  yield 1;
  yield 2;
}
const g = gen();
console.log('created');
console.log(g.next().value);`),
      options: ['created\nstart\n1', 'start\ncreated\n1', 'created\n1', 'start\n1\ncreated'],
      answer: 0,
      explain: 'Calling a generator function does not run its body. The first `next()` runs up to the first `yield`.',
    },
    {
      type: 'output',
      code: c(`
function* gen() {
  const x = yield 1;
  console.log('got', x);
  yield x * 2;
}
const g = gen();
console.log(g.next('ignored').value);
console.log(g.next(5).value);`),
      options: ['1\ngot 5\n10', '1\ngot ignored\nNaN', '1\n10', 'got 5\n1\n10'],
      answer: 0,
      explain: 'The first `next` argument is dropped. `next(5)` resumes the paused `yield`, making `x` 5.',
    },
    {
      type: 'output',
      code: c(`
function* abc() {
  yield 'a';
  yield 'b';
  return 'c';
}
console.log([...abc()]);`),
      options: ["[ 'a', 'b' ]", "[ 'a', 'b', 'c' ]", "[ 'c' ]", '[]'],
      answer: 0,
      explain: 'Spread and `for...of` stop at `done: true` and ignore the `return` value.',
    },
    {
      type: 'output',
      code: c(`
function* naturals() {
  let n = 1;
  while (true) yield n++;
}
const out = [];
for (const n of naturals()) {
  if (n > 3) break;
  out.push(n);
}
console.log(out);`),
      options: ['[ 1, 2, 3 ]', 'Infinite loop', '[ 1, 2, 3, 4 ]', '[]'],
      answer: 0,
      explain: 'Generators are lazy: values are made only when `for...of` asks, and `break` stops asking.',
    },
    {
      type: 'output',
      code: c(`
const arr = ['x', 'y'];
arr.extra = 'z';
for (const k in arr) console.log(k);
for (const v of arr) console.log(v);`),
      options: ['0\n1\nextra\nx\ny', '0\n1\nx\ny', 'x\ny\nextra\nx\ny', '0\n1\nextra\nx\ny\nz'],
      answer: 0,
      explain: '`for...in` lists enumerable keys, including the extra property. `for...of` uses the array iterator, which only yields elements.',
    },
    {
      type: 'output',
      code: c(`
const it = [10, 20][Symbol.iterator]();
console.log(it.next(), it.next(), it.next());`),
      options: [
        '{ value: 10, done: false } { value: 20, done: false } { value: undefined, done: true }',
        '{ value: 10, done: false } { value: 20, done: true } { value: undefined, done: true }',
        '10 20 undefined',
        '{ value: 10 } { value: 20 } { done: true }',
      ],
      answer: 0,
      explain: 'The iterator reports `done: true` only after it has run out of values.',
    },
    {
      type: 'output',
      code: c(`
function* inner() { yield 2; yield 3; }
function* outer() {
  yield 1;
  yield* inner();
  yield 4;
}
console.log([...outer()]);`),
      options: ['[ 1, 2, 3, 4 ]', '[ 1, {}, 4 ]', '[ 1, 4 ]', '[ 1, [ 2, 3 ], 4 ]'],
      answer: 0,
      explain: '`yield*` delegates to another iterable and yields each of its values.',
    },
  ],
};

export default topic;
