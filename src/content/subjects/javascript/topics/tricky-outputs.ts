import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'tricky-outputs',
  title: 'Mixed tricky outputs',
  level: 'advanced',
  tags: ['output prediction', 'revision', 'mixed topics'],
  summary: 'A revision round of classic "what does this print?" questions that combine hoisting, closures, `this`, coercion and the event loop.',
  keyPoints: [
    {
      title: 'Read in two passes',
      text: 'First find the declarations (what is hoisted, what is in the TDZ). Then run the code line by line.',
    },
    {
      title: 'Track three queues for async',
      text: 'Call stack → all microtasks (promises, `await` continuations) → one macrotask (timer) → microtasks again.',
    },
    {
      title: 'For `this`, find the call site',
      text: 'Ask: was it called with `new`? With `call`/`apply`/`bind`? As `obj.method()`? Otherwise it is a plain call. Arrows skip all of this.',
    },
    {
      title: 'For `+` and `==`, convert step by step',
      text: 'Write down each conversion: object → primitive, boolean → number, string ↔ number.',
    },
  ],
  qa: [
    {
      q: 'How should you approach an output question in an interview?',
      a: [
        'Think aloud. Name the concept being tested ("this is about hoisting").',
        'Trace line by line, writing variable values and queue contents.',
        'If unsure, state your assumption (strict mode or not, browser or Node).',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
(async () => {
  console.log(4);
  await null;
  console.log(5);
})();
console.log(6);`),
      options: ['1\n4\n6\n3\n5\n2', '1\n4\n6\n2\n3\n5', '1\n6\n4\n3\n5\n2', '1\n4\n3\n5\n6\n2'],
      answer: 0,
      explain: 'Sync: 1, 4 (async function body before `await`), 6. Microtasks in queue order: 3, 5. Then the timer: 2.',
    },
    {
      type: 'output',
      code: c(`
var a = 1;
function b() {
  a = 10;
  return;
  function a() {}
}
b();
console.log(a);`),
      options: ['1', '10', 'undefined', '[Function: a]'],
      answer: 0,
      explain: 'The hoisted `function a` creates a local `a` inside `b`, so `a = 10` changes the local one. The global stays 1.',
    },
    {
      type: 'output',
      code: c(`
const obj = {
  name: 'obj',
  getName() { return this.name; },
  delayed() { return [1].map(function () { return this?.name; }); },
};
const get = obj.getName;
console.log(obj.getName(), obj.delayed()[0], typeof get.call({ name: 'x' }));`),
      note: 'Assume the code runs as an ES module (strict mode).',
      options: ['obj undefined string', 'obj obj string', 'obj undefined undefined', 'undefined undefined string'],
      answer: 0,
      explain: 'The method call binds `obj`. The regular callback inside `map` gets `this = undefined`. `call` rebinds to `{ name: "x" }`.',
    },
    {
      type: 'output',
      code: c(`
console.log([] + null + 1);
console.log([1, 2] == '1,2');
console.log({} + []);`),
      options: ['null1\ntrue\n[object Object]', '1\ntrue\n[object Object]', 'null1\nfalse\n0', 'NaN\ntrue\n[object Object]'],
      answer: 0,
      explain: '`[]` → `""`, then `"" + null` → `"null"`, then `+ 1` → `"null1"`. The array becomes `"1,2"`. Inside `console.log`, `{}` is an object, so `{} + []` is `"[object Object]"`.',
    },
    {
      type: 'output',
      code: c(`
let x = 1;
const f = () => x;
{
  let x = 2;
  console.log(f());
}`),
      options: ['1', '2', 'ReferenceError', 'undefined'],
      answer: 0,
      explain: '`f` was defined where the outer `x` is visible. Calling it from a block with another `x` does not matter.',
    },
    {
      type: 'output',
      code: c(`
function Foo() {
  getName = () => 1;
  return this;
}
Foo.getName = () => 2;
Foo.prototype.getName = () => 3;
var getName = () => 4;
console.log(Foo.getName());
console.log(getName());
console.log(new Foo().getName());`),
      options: ['2\n4\n3', '2\n1\n3', '1\n4\n3', '2\n4\n1'],
      answer: 0,
      explain: 'Static method: 2. Global `getName` is still 4 (Foo has not run yet). `new Foo()` returns the instance, whose prototype method gives 3 (Foo also overwrote the global to 1 on the way).',
    },
    {
      type: 'output',
      code: c(`
const p = new Promise((resolve) => {
  setTimeout(() => resolve('A'), 0);
  resolve('B');
});
p.then(console.log);
setTimeout(() => console.log('C'), 0);`),
      options: ['B\nC', 'A\nC', 'B\nA\nC', 'C\nB'],
      answer: 0,
      explain: 'The promise settles synchronously with B; the later `resolve("A")` is ignored. Microtask B runs before timer C.',
    },
    {
      type: 'output',
      code: c(`
const arr = [1, 2, 3];
arr.length = 0;
console.log(arr[0], arr.length);
const arr2 = [1, 2, 3];
delete arr2[1];
console.log(arr2.length, arr2[1]);`),
      options: ['undefined 0\n3 undefined', '1 0\n2 undefined', 'undefined 0\n2 3', 'TypeError'],
      answer: 0,
      explain: 'Setting `length = 0` empties the array. `delete` leaves a hole but does not change `length`.',
    },
    {
      type: 'output',
      code: c(`
function createCounter() {
  let count = 0;
  return {
    inc: () => count++,
    get value() { return count; },
  };
}
const c = createCounter();
console.log(c.inc(), c.inc(), c.value);`),
      options: ['0 1 2', '1 2 2', '0 1 1', '1 2 3'],
      answer: 0,
      explain: 'Postfix `count++` returns the old value, then increments. The getter reads the live closure value.',
    },
    {
      type: 'output',
      code: c(`
async function one() {
  console.log('one start');
  await two();
  console.log('one end');
}
async function two() {
  console.log('two');
}
setTimeout(() => console.log('timeout'), 0);
one().then(() => console.log('done'));
console.log('sync');`),
      options: ['one start\ntwo\nsync\none end\ndone\ntimeout', 'one start\nsync\ntwo\none end\ndone\ntimeout', 'one start\ntwo\none end\nsync\ndone\ntimeout', 'sync\none start\ntwo\none end\ndone\ntimeout'],
      answer: 0,
      explain: '`two()` runs synchronously inside `one`. The rest of `one` and then `done` are microtasks; the timer is last.',
    },
    {
      type: 'output',
      code: c(`
console.log(typeof typeof null);
console.log(0.1 * 3 === 0.3);
console.log(3 > 2 > 1);`),
      options: ['string\nfalse\nfalse', 'object\nfalse\ntrue', 'string\ntrue\ntrue', 'object\ntrue\nfalse'],
      answer: 0,
      explain: '`typeof` always returns a string. `0.1 * 3` is `0.30000000000000004`. `3 > 2` is `true`, and `true > 1` is `1 > 1`, false.',
    },
  ],
};

export default topic;
