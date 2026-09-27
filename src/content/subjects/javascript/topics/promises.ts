import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'promises',
  title: 'Promises',
  level: 'intermediate',
  tags: ['then', 'catch', 'finally', 'chaining', 'microtasks'],
  summary: 'A promise is a placeholder for a future value. It is **pending**, then settles once: **fulfilled** or **rejected**.',
  keyPoints: [
    {
      title: 'Settles only once',
      text: 'After the first `resolve` or `reject`, later calls are ignored. The state never changes back.',
    },
    {
      title: 'The executor runs synchronously',
      text: 'The function passed to `new Promise` runs immediately. Only the `.then` callbacks are async (microtasks).',
      code: c(`
new Promise((resolve) => {
  console.log('runs now');
  resolve();
});`),
    },
    {
      title: '`.then` returns a new promise',
      text: 'Whatever a `then` callback returns becomes the next value. Returning a promise makes the chain wait for it. Throwing rejects the next promise.',
    },
    {
      title: 'Errors skip ahead to `.catch`',
      text: 'A rejection skips every `.then` until a `.catch` (or a second `then` argument). After `.catch` returns, the chain is fulfilled again.',
    },
  ],
  visuals: [
    {
      type: 'stepper',
      title: 'Sync code first, then microtasks',
      code: c(`
console.log('1');
const p = new Promise((resolve) => {
  console.log('2');
  resolve('4');
});
p.then((v) => console.log(v));
console.log('3');`),
      panels: ['Call stack', 'Microtask queue', 'Console'],
      steps: [
        { line: 1, note: 'Plain synchronous log.', state: { 'Call stack': ['global'], Console: ['1'] } },
        { line: [2, 3], note: 'The executor runs right away, inside the constructor.', state: { 'Call stack': ['global', 'executor'], Console: ['1', '2'] } },
        { line: 4, note: '`resolve` settles the promise as fulfilled with "4". No callback is waiting yet.', state: { 'Call stack': ['global', 'executor'], Console: ['1', '2'] } },
        { line: 6, note: '`then` on an already fulfilled promise queues its callback as a microtask. It does **not** run now.', state: { 'Call stack': ['global'], 'Microtask queue': ['log(v)'], Console: ['1', '2'] } },
        { line: 7, note: 'Synchronous code continues.', state: { 'Call stack': ['global'], 'Microtask queue': ['log(v)'], Console: ['1', '2', '3'] } },
        { line: 6, note: 'The stack is empty, so the microtask queue drains.', state: { 'Call stack': ['then callback'], Console: ['1', '2', '3', '4'] } },
      ],
    },
  ],
  qa: [
    {
      q: 'What is a promise and what states can it be in?',
      tag: 'Asked often',
      a: [
        'An object representing the eventual result of an async operation.',
        'States: **pending**, **fulfilled** (with a value) or **rejected** (with a reason). Fulfilled or rejected = settled.',
        'Once settled, it never changes.',
      ],
    },
    {
      q: 'Is the code inside `new Promise(...)` async?',
      a: ['No. The executor runs synchronously. Only `then`/`catch`/`finally` callbacks run later, as microtasks.'],
    },
    {
      q: 'What does `.then` return?',
      a: [
        'A **new** promise, resolved with whatever the callback returns.',
        'If the callback returns a promise, the new promise follows it.',
        'If the callback throws, the new promise is rejected.',
      ],
    },
    {
      q: 'What does `.finally` do with the value?',
      a: [
        'It runs on either outcome and receives no argument.',
        'Its return value is ignored: the original value or error passes through. Only a throw (or rejected promise) inside `finally` changes the result.',
      ],
    },
    {
      q: 'Implement a basic `sleep(ms)` with a promise.',
      tag: 'Coding',
      a: ['Resolve inside a `setTimeout`.'],
      code: c(`
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await sleep(500);`),
    },
    {
      q: 'What is an unhandled rejection?',
      a: [
        'A rejected promise with no `.catch` attached by the time the microtask queue drains.',
        'Browsers log a warning and fire `unhandledrejection`; Node crashes the process by default.',
      ],
    },
    {
      q: 'Write a minimal Promise from scratch.',
      tag: 'Coding',
      a: ['Keep state, value and a list of callbacks; flush them asynchronously when the promise settles. A full version also handles thenables and chaining.'],
      code: c(`
class MyPromise {
  #state = 'pending'; #value; #handlers = [];
  constructor(executor) {
    const settle = (state) => (value) => {
      if (this.#state !== 'pending') return;
      this.#state = state; this.#value = value;
      this.#handlers.forEach((h) => h());
    };
    try { executor(settle('fulfilled'), settle('rejected')); }
    catch (e) { settle('rejected')(e); }
  }
  then(onOk, onFail) {
    return new MyPromise((resolve, reject) => {
      const run = () => queueMicrotask(() => {
        const cb = this.#state === 'fulfilled' ? onOk : onFail;
        if (typeof cb !== 'function')
          return (this.#state === 'fulfilled' ? resolve : reject)(this.#value);
        try { resolve(cb(this.#value)); } catch (e) { reject(e); }
      });
      this.#state === 'pending' ? this.#handlers.push(run) : run();
    });
  }
}`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log('A');
new Promise((resolve) => {
  console.log('B');
  resolve();
}).then(() => console.log('C'));
console.log('D');`),
      options: ['A\nB\nD\nC', 'A\nD\nB\nC', 'A\nB\nC\nD', 'B\nA\nD\nC'],
      answer: 0,
      explain: 'The executor runs synchronously (B). The `then` callback is a microtask, so it waits for D.',
    },
    {
      type: 'output',
      code: c(`
const p = new Promise((resolve, reject) => {
  resolve('first');
  resolve('second');
  reject(new Error('nope'));
});
p.then((v) => console.log(v)).catch(() => console.log('caught'));`),
      options: ['first', 'second', 'caught', 'first\ncaught'],
      answer: 0,
      explain: 'A promise settles only once. Later `resolve`/`reject` calls are ignored.',
    },
    {
      type: 'output',
      code: c(`
Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => { throw new Error(String(x)); })
  .then(() => console.log('skipped'))
  .catch((e) => { console.log('caught', e.message); return 10; })
  .then((x) => console.log('after', x));`),
      options: ['caught 2\nafter 10', 'skipped\ncaught 2\nafter 10', 'caught 2\nafter undefined', 'caught 1\nafter 10'],
      answer: 0,
      explain: 'The throw skips the next `then`. `catch` handles it and returns 10, which fulfils the rest of the chain.',
    },
    {
      type: 'output',
      code: c(`
Promise.resolve('value')
  .finally(() => 'ignored')
  .then((v) => console.log(v));`),
      options: ['value', 'ignored', 'undefined', 'Nothing is logged'],
      answer: 0,
      explain: '`finally` passes the original value through; its return value is ignored.',
    },
    {
      type: 'output',
      code: c(`
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then((v) => console.log(v));`),
      options: ['1', '2', '3', 'undefined'],
      answer: 0,
      explain: 'Non-function arguments to `then` are ignored, so the original 1 passes straight through.',
    },
    {
      type: 'output',
      code: c(`
Promise.reject(new Error('x'))
  .then(
    () => console.log('ok'),
    () => console.log('handler 2')
  )
  .catch(() => console.log('catch'))
  .then(() => console.log('done'));`),
      options: ['handler 2\ndone', 'catch\ndone', 'handler 2\ncatch\ndone', 'ok\ndone'],
      answer: 0,
      explain: 'The second argument of `then` handles the rejection, so `catch` has nothing to catch.',
    },
    {
      type: 'output',
      code: c(`
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('micro 1'));
queueMicrotask(() => console.log('micro 2'));
console.log('sync');`),
      options: ['sync\nmicro 1\nmicro 2\ntimeout', 'sync\ntimeout\nmicro 1\nmicro 2', 'micro 1\nmicro 2\nsync\ntimeout', 'sync\nmicro 2\nmicro 1\ntimeout'],
      answer: 0,
      explain: 'Sync code first, then all microtasks in order, then the next macrotask (the timer).',
    },
  ],
};

export default topic;
