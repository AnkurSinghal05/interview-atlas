import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'async-await',
  title: 'async / await',
  level: 'intermediate',
  masteryMinutes: 90,
  tags: ['async functions', 'await', 'try/catch', 'sequential vs parallel'],
  summary: '`async` functions always return a promise. `await` pauses **that function** (not the whole program) until a promise settles.',
  keyPoints: [
    {
      title: '`async` wraps the return value',
      text: 'Returning `5` from an async function gives `Promise<5>`. Throwing gives a rejected promise.',
    },
    {
      title: 'Code before the first `await` is sync',
      text: 'An async function runs synchronously until it hits `await`. Everything after an `await` continues as a microtask.',
      code: c(`
async function f() {
  console.log('1');  // sync
  await null;
  console.log('3');  // later
}
f(); console.log('2');`),
    },
    {
      title: 'Errors: plain `try/catch`',
      text: 'An awaited rejection throws at the `await` line, so a normal `try/catch` handles it.',
    },
    {
      title: 'Don\'t serialise independent work',
      text: 'Awaiting in a loop runs tasks one after another. Start them together and `await Promise.all(...)` to run them in parallel.',
      code: c(`
// slow: one by one
for (const id of ids) await load(id);
// fast: all at once
await Promise.all(ids.map(load));`),
    },
  ],
  qa: [
    {
      q: 'What is the difference between async/await and raw promises?',
      a: [
        'Same machinery: `async/await` is syntax on top of promises, and an async function returns a promise.',
        '`await` makes async code read top to bottom and lets you use normal `try/catch`, loops and conditionals.',
        'Raw `.then` chains are handy for simple one-liners and for combinators like `Promise.all`.',
        'Easy mistake with `await`: accidentally running independent tasks one after another instead of in parallel.',
      ],
    },
    {
      q: 'What does an `async` function return?',
      tag: 'Asked often',
      a: ['Always a promise. A returned value becomes the fulfilment value; a thrown error becomes the rejection reason.'],
    },
    {
      q: 'Does `await` block the main thread?',
      a: [
        'No. It suspends only the current async function and returns control to the caller.',
        'The rest of the function resumes as a microtask when the awaited promise settles.',
      ],
    },
    {
      q: 'How do you handle errors with async/await?',
      a: [
        'Wrap the `await` in `try/catch`.',
        'Or attach `.catch` to the call: `load().catch(handle)`.',
        'An error in an async function that nobody awaits or catches becomes an unhandled rejection.',
      ],
    },
    {
      q: 'Why doesn\'t `await` work inside `forEach`?',
      tag: 'Asked often',
      a: [
        '`forEach` ignores the promises its callback returns, so it does not wait.',
        'Use `for...of` for sequential work or `Promise.all(arr.map(...))` for parallel work.',
      ],
    },
    {
      q: 'Is `return await promise` different from `return promise`?',
      a: [
        'Inside `try/catch`, yes: `return await` lets the `catch` handle a rejection; plain `return` skips it.',
        'Outside `try`, the result is the same.',
      ],
    },
    {
      q: 'What is top-level `await`?',
      a: ['In ES modules you can use `await` outside an async function. The module (and modules importing it) waits for it to finish.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
async function f() {
  return 1;
}
console.log(f() instanceof Promise);
f().then((v) => console.log(v));`),
      options: ['true\n1', 'false\n1', '1\n1', 'true\nundefined'],
      answer: 0,
      explain: 'An async function always returns a promise, which fulfils with the returned value.',
    },
    {
      type: 'output',
      code: c(`
async function run() {
  console.log('A');
  await null;
  console.log('B');
}
run();
console.log('C');`),
      options: ['A\nC\nB', 'A\nB\nC', 'C\nA\nB', 'A\nC'],
      answer: 0,
      explain: 'The function runs synchronously until `await`. The rest resumes as a microtask after C.',
    },
    {
      type: 'output',
      code: c(`
async function a() {
  console.log('a1');
  await b();
  console.log('a2');
}
async function b() {
  console.log('b');
}
console.log('start');
a();
Promise.resolve().then(() => console.log('then'));
console.log('end');`),
      options: ['start\na1\nb\nend\na2\nthen', 'start\na1\nb\na2\nthen\nend', 'start\na1\nend\nb\na2\nthen', 'start\na1\nb\nend\nthen\na2'],
      answer: 0,
      explain: '`b()` runs synchronously. The continuation `a2` was queued before the `then`, so it runs first.',
    },
    {
      type: 'output',
      code: c(`
async function fail() {
  throw new Error('oops');
}
async function main() {
  try {
    await fail();
  } catch (e) {
    console.log('caught', e.message);
  }
}
main();`),
      options: ['caught oops', 'Uncaught Error: oops', 'Nothing is logged', 'caught undefined'],
      answer: 0,
      explain: 'Awaiting a rejected promise throws at that line, so `catch` handles it.',
    },
    {
      type: 'output',
      code: c(`
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
async function main() {
  const out = [];
  [3, 1, 2].forEach(async (n) => {
    await wait(n * 10);
    out.push(n);
  });
  console.log(out);
}
main();`),
      options: ['[]', '[ 3, 1, 2 ]', '[ 1, 2, 3 ]', 'undefined'],
      answer: 0,
      explain: '`forEach` does not wait for async callbacks, so `out` is still empty when it is logged.',
    },
    {
      type: 'output',
      code: c(`
async function withTry() {
  try {
    return Promise.reject(new Error('x'));
  } catch {
    return 'handled';
  }
}
withTry().then(console.log, (e) => console.log('rejected', e.message));`),
      options: ['rejected x', 'handled', 'x', 'undefined'],
      answer: 0,
      explain: 'Without `await`, the rejected promise is returned before `try` can see it. `return await` would make it print `handled`.',
    },
    {
      type: 'output',
      code: c(`
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
async function main() {
  const t = Date.now();
  const [a, b] = await Promise.all([wait(100, 'a'), wait(100, 'b')]);
  console.log(a + b, Date.now() - t < 180);
}
main();`),
      options: ['ab true', 'ab false', 'a true', 'undefined true'],
      answer: 0,
      explain: 'Both timers start together, so the total wait is about 100 ms, not 200 ms.',
    },
  ],
};

export default topic;
