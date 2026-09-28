import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'promise-combinators',
  title: 'Promise.all, race, any, allSettled',
  level: 'intermediate',
  masteryMinutes: 120,
  tags: ['parallel', 'fail-fast', 'timeouts', 'polyfill'],
  summary: 'Four ways to wait on many promises. They differ in **when** they settle and **what** they return.',
  keyPoints: [
    {
      title: '`all`: everything or the first failure',
      text: 'Fulfils with an array of results in **input order**. Rejects as soon as any promise rejects.',
    },
    {
      title: '`allSettled`: never rejects',
      text: 'Waits for every promise and returns `{ status, value }` or `{ status, reason }` for each.',
    },
    {
      title: '`race`: first to settle',
      text: 'Takes on the outcome of whichever promise settles first, success or failure. Great for timeouts.',
      code: c(`
const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
await Promise.race([fetch(url), timeout(5000)]);`),
    },
    {
      title: '`any`: first success',
      text: 'Fulfils with the first fulfilled value. Rejects with an `AggregateError` only if **all** reject.',
    },
  ],
  comparisons: [
    {
      title: 'Promise.all vs allSettled vs race vs any',
      items: ['`all`', '`allSettled`', '`race`', '`any`'],
      rows: [
        { aspect: 'Fulfils when', values: ['Every promise fulfils', 'Every promise settles', 'The first one settles (if it fulfilled)', 'The first one fulfils'], key: true },
        { aspect: 'Rejects when', values: ['The first rejection (fail fast)', 'Never', 'The first one settles (if it rejected)', 'All of them reject'], key: true },
        { aspect: 'Result', values: ['Values, in input order', '`{ status, value }` or `{ status, reason }` per promise', 'That first value or reason', 'The first value'] },
        { aspect: 'Error type', values: ['The first reason', 'None', 'The first reason', '`AggregateError` with all reasons'] },
        { aspect: 'Empty array', values: ['Fulfils with `[]`', 'Fulfils with `[]`', 'Stays pending forever', 'Rejects with `AggregateError`'] },
        { aspect: 'Added in', values: ['ES2015', 'ES2020', 'ES2015', 'ES2021'] },
      ],
      reveal:
        'All four start everything in parallel. They only answer two questions differently: wait for **everyone** or the **first** one, and does a rejection count as an answer?',
      whenToUse: [
        'Parallel requests that all have to succeed, like the data a page needs to render.',
        'Batch work where partial failure is fine and you want a report: bulk uploads, dashboards.',
        'Timeouts: race the real request against a promise that rejects after N ms.',
        'Redundant sources: take the fastest mirror or CDN that actually responds.',
      ],
    },
  ],
  qa: [
    {
      q: 'Compare `Promise.all`, `allSettled`, `race` and `any`.',
      tag: 'Asked often',
      a: [
        '`all`: all must succeed; fails fast on the first rejection.',
        '`allSettled`: waits for all, reports each outcome, never rejects.',
        '`race`: settles like the first promise to settle (either way).',
        '`any`: first fulfilment wins; rejects only if all reject (`AggregateError`).',
      ],
    },
    {
      q: 'Does `Promise.all` cancel the other promises when one fails?',
      a: ['No. Promises cannot be cancelled. The others keep running; their results are just ignored. Use `AbortController` to actually cancel requests.'],
    },
    {
      q: 'What does `Promise.all([])` return?',
      a: ['A promise that fulfils immediately with `[]`. `Promise.race([])` stays pending forever, and `Promise.any([])` rejects.'],
    },
    {
      q: 'Write a polyfill for `Promise.all`.',
      tag: 'Coding',
      a: ['Track a counter of fulfilled promises and store each result at its index.'],
      code: c(`
function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (items.length === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        if (++done === items.length) resolve(results);
      }, reject);
    });
  });
}`),
    },
    {
      q: 'Write a polyfill for `Promise.allSettled`.',
      tag: 'Coding',
      a: ['Map every promise to one that always fulfils with a status object, then use `Promise.all`.'],
      code: c(`
const allSettled = (items) =>
  Promise.all(items.map((p) =>
    Promise.resolve(p).then(
      (value) => ({ status: 'fulfilled', value }),
      (reason) => ({ status: 'rejected', reason }),
    )));`),
    },
    {
      q: 'How would you limit how many promises run at once?',
      tag: 'Coding',
      a: ['Keep a pool: start `limit` tasks, and each time one finishes, start the next until the queue is empty.'],
      code: c(`
async function runLimited(tasks, limit) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
Promise.all([wait(30, 'slow'), wait(10, 'fast'), 42])
  .then((res) => console.log(res));`),
      options: ["[ 'slow', 'fast', 42 ]", "[ 'fast', 'slow', 42 ]", "[ 42, 'fast', 'slow' ]", "'fast'"],
      answer: 0,
      explain: 'Results keep the input order no matter which finishes first. Plain values are treated as resolved promises.',
    },
    {
      type: 'output',
      code: c(`
Promise.all([
  Promise.resolve(1),
  Promise.reject(new Error('bad')),
  Promise.resolve(3),
])
  .then((r) => console.log('ok', r))
  .catch((e) => console.log('fail', e.message));`),
      options: ['fail bad', 'ok [ 1, 3 ]', "ok [ 1, undefined, 3 ]", 'fail undefined'],
      answer: 0,
      explain: 'One rejection is enough to reject `Promise.all`.',
    },
    {
      type: 'output',
      code: c(`
Promise.allSettled([Promise.resolve('a'), Promise.reject('b')])
  .then((r) => console.log(r.map((x) => x.status)));`),
      options: ["[ 'fulfilled', 'rejected' ]", "[ 'a', 'b' ]", "[ 'fulfilled', 'fulfilled' ]", 'b'],
      answer: 0,
      explain: '`allSettled` reports the status of each promise and never rejects itself.',
    },
    {
      type: 'output',
      code: c(`
const wait = (ms, v, fail) =>
  new Promise((res, rej) => setTimeout(() => (fail ? rej(v) : res(v)), ms));
Promise.race([wait(20, 'A'), wait(10, 'B', true)])
  .then((v) => console.log('won', v))
  .catch((e) => console.log('lost', e));
Promise.any([wait(20, 'A'), wait(10, 'B', true)])
  .then((v) => console.log('any', v));`),
      options: ['lost B\nany A', 'won A\nany A', 'lost B\nany B', 'won A\nlost B'],
      answer: 0,
      explain: '`race` follows the first to settle, which is a rejection. `any` ignores rejections and waits for the first success.',
    },
    {
      type: 'output',
      code: c(`
Promise.any([Promise.reject(1), Promise.reject(2)])
  .catch((e) => console.log(e.constructor.name, e.errors));`),
      options: ['AggregateError [ 1, 2 ]', 'Error [ 1, 2 ]', 'AggregateError 1', 'Nothing is logged'],
      answer: 0,
      explain: 'When every promise rejects, `any` rejects with an `AggregateError` holding all the reasons.',
    },
    {
      type: 'output',
      code: c(`
Promise.all([]).then((r) => console.log('all', r));
Promise.race([]).then(() => console.log('race'));`),
      options: ['all []', 'all []\nrace', 'race', 'Nothing is logged'],
      answer: 0,
      explain: '`all([])` fulfils immediately with an empty array. `race([])` never settles.',
    },
    {
      type: 'mcq',
      question: 'You want to show a dashboard even if some widgets fail to load. Which combinator fits best?',
      options: ['`Promise.all`', '`Promise.allSettled`', '`Promise.race`', '`Promise.any`'],
      answer: 1,
      explain: '`allSettled` waits for everything and tells you which succeeded and which failed.',
    },
  ],
};

export default topic;
