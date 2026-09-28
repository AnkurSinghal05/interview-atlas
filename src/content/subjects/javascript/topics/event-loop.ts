import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'event-loop',
  title: 'The event loop',
  level: 'advanced',
  masteryMinutes: 150,
  tags: ['microtask', 'macrotask', 'setTimeout', 'promises', 'async'],
  summary:
    'JS runs one thing at a time. After the current script, the event loop runs **every microtask**, then **one macrotask**, and repeats.',
  keyPoints: [
    { title: 'One call stack', text: 'Synchronous code runs to completion. Nothing else can interrupt it, not even a timer that is due.' },
    {
      title: 'The runtime does the waiting',
      text: 'Timers, network and file I/O happen outside JS. When they finish, their callback is put in a queue.',
    },
    {
      title: 'Microtasks first, all of them',
      text: '`.then` callbacks, code after `await`, and `queueMicrotask`. The queue is emptied completely, including microtasks added along the way.',
    },
    {
      title: 'Then one macrotask',
      text: '`setTimeout`, `setInterval`, I/O, UI events. After each one, microtasks drain again and the browser may repaint.',
    },
  ],
  comparisons: [
    {
      items: ['Microtasks', 'Macrotasks (tasks)'],
      rows: [
        { aspect: 'Examples', values: ['`.then` callbacks, code after `await`, `queueMicrotask`, `MutationObserver`', '`setTimeout`, `setInterval`, I/O, UI events, `MessageChannel`'] },
        { aspect: 'How many per loop turn', values: ['All of them, including ones added meanwhile', 'One'], key: true },
        { aspect: 'Runs', values: ['As soon as the call stack is empty', 'On the next loop turn, after microtasks and maybe a render'], key: true },
        { aspect: 'Can block rendering', values: ['Yes, if they keep queueing more', 'No, the browser can paint between tasks'] },
      ],
      reveal:
        'After each task the engine empties the whole microtask queue before it takes the next task or paints. That is why `Promise.resolve().then(...)` always beats `setTimeout(..., 0)`.',
      whenToUse: [
        'Work that must happen right after the current code, before anything else sees the state.',
        'Yielding to the browser so it can render or handle input: split long work with `setTimeout`.',
      ],
    },
  ],
  visuals: [
    {
      type: 'stepper',
      title: 'Why this prints A, D, C, B',
      code: c(`
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`),
      panels: ['Call stack', 'Microtasks', 'Macrotasks', 'Console'],
      steps: [
        {
          line: 1,
          note: 'The script starts. Synchronous code runs line by line.',
          state: { 'Call stack': ['script', "log('A')"], Console: ['A'] },
        },
        {
          line: 2,
          note: '`setTimeout` hands the timer to the runtime. After 0 ms the callback waits in the macrotask queue.',
          state: { 'Call stack': ['script', 'setTimeout()'], Macrotasks: ['() => log(B)'], Console: ['A'] },
        },
        {
          line: 3,
          note: 'The promise is already resolved, so its `.then` callback goes straight into the microtask queue.',
          state: { 'Call stack': ['script', '.then()'], Microtasks: ['() => log(C)'], Macrotasks: ['() => log(B)'], Console: ['A'] },
        },
        {
          line: 4,
          note: 'Sync code keeps going. Nothing queued can run yet.',
          state: { 'Call stack': ['script', "log('D')"], Microtasks: ['() => log(C)'], Macrotasks: ['() => log(B)'], Console: ['A', 'D'] },
        },
        {
          line: null,
          note: 'The script is done and the stack is empty. The event loop checks the microtask queue first.',
          state: { Microtasks: ['() => log(C)'], Macrotasks: ['() => log(B)'], Console: ['A', 'D'] },
        },
        {
          line: 3,
          note: 'All microtasks run before any macrotask.',
          state: { 'Call stack': ['() => log(C)'], Macrotasks: ['() => log(B)'], Console: ['A', 'D', 'C'] },
        },
        {
          line: 2,
          note: 'Microtasks are empty, so the loop takes one macrotask: the timer callback.',
          state: { 'Call stack': ['() => log(B)'], Console: ['A', 'D', 'C', 'B'] },
        },
      ],
    },
  ],
  qa: [
    {
      q: 'What is the event loop?',
      tag: 'Asked often',
      a: [
        'The mechanism that decides what JS runs next once the call stack is empty.',
        'Each turn: run one macrotask, then drain the whole microtask queue, then (in browsers) maybe render. Repeat.',
      ],
    },
    {
      q: 'What is the difference between microtasks and macrotasks?',
      tag: 'Asked often',
      a: [
        '**Microtasks**: promise `.then/.catch/.finally`, the rest of an `async` function after `await`, `queueMicrotask`, `MutationObserver`.',
        '**Macrotasks** (tasks): `setTimeout`, `setInterval`, I/O callbacks, UI events, `MessageChannel`.',
        'All microtasks run before the next macrotask starts.',
      ],
    },
    {
      q: 'Why does `setTimeout(fn, 0)` not run immediately?',
      a: [
        'The delay is a minimum. The callback waits until the current sync code and every microtask have finished.',
        'Browsers also clamp deeply nested timers to at least 4 ms.',
      ],
    },
    {
      q: 'How does `async/await` fit into the event loop?',
      a: [
        'Code before the first `await` runs synchronously when you call the function.',
        '`await` pauses only that function. The rest of it is queued as a microtask once the awaited promise settles.',
        'Meanwhile the caller keeps running.',
      ],
      code: c(`
async function load() {
  console.log(1);
  await null;
  console.log(3);
}
load();
console.log(2); // 1, 2, 3`),
    },
    {
      q: 'Can microtasks freeze the page?',
      a: [
        'Yes. The queue must be empty before a macrotask or a repaint happens.',
        'A microtask that keeps queueing another microtask starves timers, events and rendering forever.',
      ],
    },
    {
      q: 'What are `process.nextTick` and `setImmediate` in Node?',
      a: [
        '`process.nextTick` callbacks run before promise microtasks.',
        '`setImmediate` runs in the "check" phase, after I/O callbacks. From the main module its order against `setTimeout(fn, 0)` is not guaranteed.',
      ],
    },
    {
      q: 'What does "run to completion" mean?',
      a: [
        'Once a function starts, no other JS runs until it returns or hits `await`.',
        'Long sync work blocks input and rendering. Split it into chunks with timers, or move it to a Web Worker.',
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
console.log(4);`),
      options: ['1\n2\n3\n4', '1\n4\n3\n2', '1\n4\n2\n3', '1\n3\n4\n2'],
      answer: 1,
      explain: 'Sync logs first (1, 4), then the microtask (3), then the timer (2).',
    },
    {
      type: 'output',
      code: c(`
async function run() {
  console.log('a');
  await null;
  console.log('b');
}
run();
console.log('c');`),
      options: ['a\nb\nc', 'a\nc\nb', 'c\na\nb', 'a\nc'],
      answer: 1,
      explain: 'The body runs synchronously up to `await`. The rest is a microtask, which runs after the sync `c`.',
    },
    {
      type: 'output',
      code: c(`
new Promise((resolve) => {
  console.log('executor');
  resolve();
}).then(() => console.log('then'));
console.log('sync');`),
      options: ['executor\nsync\nthen', 'sync\nexecutor\nthen', 'executor\nthen\nsync', 'sync\nthen\nexecutor'],
      answer: 0,
      explain: 'The executor runs synchronously inside `new Promise`. Only the `.then` callback is deferred.',
    },
    {
      type: 'output',
      code: c(`
setTimeout(() => console.log('timeout'));
Promise.resolve()
  .then(() => console.log('then 1'))
  .then(() => console.log('then 2'));
queueMicrotask(() => console.log('micro'));`),
      options: [
        'then 1\nthen 2\nmicro\ntimeout',
        'then 1\nmicro\nthen 2\ntimeout',
        'micro\nthen 1\nthen 2\ntimeout',
        'timeout\nthen 1\nmicro\nthen 2',
      ],
      answer: 1,
      explain: '`then 2` is only queued once `then 1` has run, so it lands behind `micro`. The timer waits for all of them.',
    },
    {
      type: 'truefalse',
      statement: '`await` pauses the whole JavaScript thread until the promise resolves.',
      answer: false,
      explain: 'It pauses only the current async function. Other code, events and timers keep running.',
    },
    {
      type: 'output',
      code: c(`
setTimeout(() => {
  console.log('t1');
  Promise.resolve().then(() => console.log('p1'));
}, 0);
setTimeout(() => console.log('t2'), 0);`),
      options: ['t1\nt2\np1', 't1\np1\nt2', 'p1\nt1\nt2', 't2\nt1\np1'],
      answer: 1,
      explain: 'After each macrotask the microtask queue drains, so `p1` runs before the second timer.',
    },
    {
      type: 'output',
      code: c(`
async function f() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}
setTimeout(() => console.log(3), 0);
f().then(() => console.log(4));
console.log(5);`),
      options: ['1\n5\n2\n4\n3', '1\n2\n4\n5\n3', '5\n1\n2\n4\n3', '1\n5\n3\n2\n4'],
      answer: 0,
      explain: 'Sync: 1, 5. Microtasks: the rest of `f` logs 2, then `f` resolves and its `.then` logs 4. The timer logs 3 last.',
    },
  ],
};

export default topic;
