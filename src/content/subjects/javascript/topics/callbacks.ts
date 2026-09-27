import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'callbacks',
  title: 'Callbacks',
  level: 'beginner',
  masteryMinutes: 45,
  tags: ['async', 'callback hell', 'error-first', 'inversion of control'],
  summary: 'A callback is a function you hand over to be called **later**. It was JS\'s first async tool and the reason promises exist.',
  keyPoints: [
    {
      title: 'Sync and async callbacks',
      text: '`[1,2].map(cb)` calls `cb` right away. `setTimeout(cb)` calls it after the current code finishes.',
    },
    {
      title: 'Error-first convention',
      text: 'Node-style APIs call back with `(err, result)`. Always check `err` first.',
      code: c(`
fs.readFile('a.txt', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});`),
    },
    {
      title: 'Callback hell',
      text: 'Each dependent step nests one level deeper, making code hard to read and errors hard to handle. Promises flatten this.',
    },
    {
      title: 'Inversion of control',
      text: 'You trust the other code to call your callback exactly once, at the right time. Promises guarantee that; callbacks do not.',
    },
  ],
  qa: [
    {
      q: 'What is the difference between synchronous and asynchronous functions?',
      tag: 'Asked often',
      a: [
        '**Synchronous:** runs to completion before the next line runs. A slow one blocks everything, including the UI.',
        '**Asynchronous:** starts work (a timer, a network request) and returns immediately. The result arrives later through a callback, a promise or `await`.',
      ],
    },
    {
      q: 'What is a callback?',
      tag: 'Asked often',
      a: ['A function passed as an argument to another function, which calls it at some point, either immediately or after an async task finishes.'],
    },
    {
      q: 'What is callback hell and how do you avoid it?',
      tag: 'Asked often',
      a: [
        'Deeply nested callbacks where each step depends on the previous one (the "pyramid of doom").',
        'Fixes: named functions, promises with `.then` chains, and `async/await`.',
      ],
      code: c(`
getUser(id, (user) => {
  getOrders(user, (orders) => {
    getItems(orders[0], (items) => {
      // ...and deeper
    });
  });
});`),
    },
    {
      q: 'How do you turn a callback API into a promise?',
      tag: 'Coding',
      a: ['Wrap it in `new Promise` and resolve or reject inside the callback. Node offers `util.promisify` for this.'],
      code: c(`
const promisify = (fn) => (...args) =>
  new Promise((resolve, reject) =>
    fn(...args, (err, result) => (err ? reject(err) : resolve(result))));`),
    },
    {
      q: 'Why is it bad for an API to call a callback sometimes sync and sometimes async?',
      a: ['Callers cannot predict ordering (sometimes called "releasing Zalgo"). Code after the call may run before or after the callback. Promises are always async, which avoids this.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function doWork(cb) {
  console.log('start');
  cb();
  console.log('end');
}
doWork(() => console.log('callback'));`),
      options: ['start\ncallback\nend', 'start\nend\ncallback', 'callback\nstart\nend', 'start\nend'],
      answer: 0,
      explain: 'This callback is synchronous: it runs right where `cb()` is called.',
    },
    {
      type: 'output',
      code: c(`
console.log('A');
setTimeout(() => console.log('B'), 0);
[1].forEach(() => console.log('C'));
console.log('D');`),
      options: ['A\nC\nD\nB', 'A\nB\nC\nD', 'A\nD\nC\nB', 'A\nC\nB\nD'],
      answer: 0,
      explain: '`forEach` calls back immediately. The timer callback waits for the call stack to empty.',
    },
    {
      type: 'output',
      code: c(`
function fetchData(id, cb) {
  setTimeout(() => {
    if (id < 0) cb(new Error('bad id'));
    else cb(null, { id });
  }, 0);
}
fetchData(-1, (err, data) => console.log(err ? err.message : data));
fetchData(7, (err, data) => console.log(err ? err.message : data));`),
      options: ['bad id\n{ id: 7 }', '{ id: 7 }\nbad id', 'bad id\nundefined', 'Error'],
      answer: 0,
      explain: 'Error-first callbacks: the first argument is the error (or `null`). Timers with the same delay run in the order they were set.',
    },
    {
      type: 'output',
      code: c(`
function run(cb) {
  try {
    setTimeout(() => cb(), 0);
  } catch (e) {
    console.log('caught');
  }
}
process.on('uncaughtException', () => console.log('uncaught'));
run(() => { throw new Error('boom'); });`),
      note: 'Runs in Node; `process.on` catches errors nothing else handled.',
      options: ['uncaught', 'caught', 'caught\nuncaught', 'Nothing is logged'],
      answer: 0,
      explain: 'The callback runs later, after `run` has returned, so the `try/catch` is no longer on the stack.',
    },
    {
      type: 'truefalse',
      statement: 'Every callback in JavaScript runs asynchronously.',
      answer: false,
      explain: 'Array methods like `map` and `forEach` call their callbacks synchronously.',
    },
  ],
};

export default topic;
