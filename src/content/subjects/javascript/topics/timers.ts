import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'timers',
  title: 'setTimeout, setInterval, rAF',
  level: 'intermediate',
  tags: ['setTimeout', 'setInterval', 'requestAnimationFrame', 'clearTimeout', 'minimum delay'],
  summary: 'Timers schedule a callback **no earlier than** the delay. The callback still waits for the call stack and microtasks to clear.',
  keyPoints: [
    {
      title: 'The delay is a minimum',
      text: '`setTimeout(fn, 0)` means "as soon as possible after the current task and its microtasks", not "now". Busy code delays it further.',
    },
    {
      title: 'Always clean up',
      text: 'Both return an id. `clearTimeout(id)` / `clearInterval(id)` cancel them. Uncleared intervals keep running and keep their closures in memory.',
    },
    {
      title: 'Recursive setTimeout vs setInterval',
      text: '`setInterval` fires on a fixed schedule even if the last run was slow. A `setTimeout` that re-schedules itself guarantees a gap between runs.',
      code: c(`
function poll() {
  doWork();
  setTimeout(poll, 1000); // 1s after the previous run finished
}`),
    },
    {
      title: '`requestAnimationFrame` for visuals',
      text: 'Runs right before the next repaint (usually 60 times a second) and pauses in background tabs. Use it for animations instead of timers.',
    },
  ],
  qa: [
    {
      q: 'Why doesn\'t `setTimeout(fn, 0)` run immediately?',
      tag: 'Asked often',
      a: [
        'It queues `fn` as a macrotask. It runs only after the current synchronous code finishes and all microtasks (promises) drain.',
        'Browsers also clamp nested timers to at least 4 ms after five levels of nesting.',
      ],
    },
    {
      q: 'What is the difference between `setTimeout` and `setInterval`?',
      a: [
        '`setTimeout` runs once after the delay.',
        '`setInterval` repeats every delay until cleared. If a run takes longer than the interval, runs can bunch up.',
      ],
    },
    {
      q: 'Implement `setInterval` using `setTimeout`.',
      tag: 'Coding',
      a: ['Schedule the next run from inside the callback, and return a way to stop it.'],
      code: c(`
function mySetInterval(fn, ms) {
  let id;
  const tick = () => { fn(); id = setTimeout(tick, ms); };
  id = setTimeout(tick, ms);
  return () => clearTimeout(id);
}`),
    },
    {
      q: 'Why use `requestAnimationFrame` instead of `setInterval` for animation?',
      a: [
        'It syncs with the display refresh, so frames are not dropped or doubled.',
        'It pauses in hidden tabs, saving battery.',
        'The callback receives a high-resolution timestamp for smooth, time-based motion.',
      ],
    },
    {
      q: 'What does `setTimeout` return?',
      a: ['A numeric id in browsers (a `Timeout` object in Node). Pass it to `clearTimeout` to cancel.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
setTimeout(() => console.log('A'), 10);
setTimeout(() => console.log('B'), 0);
setTimeout(() => console.log('C'), 0);
console.log('D');`),
      options: ['D\nB\nC\nA', 'A\nB\nC\nD', 'D\nA\nB\nC', 'B\nC\nD\nA'],
      answer: 0,
      explain: 'Sync code first. Timers then fire by delay; equal delays run in the order they were created.',
    },
    {
      type: 'output',
      code: c(`
const id = setTimeout(() => console.log('never'), 0);
clearTimeout(id);
console.log('cleared');`),
      options: ['cleared', 'never\ncleared', 'cleared\nnever', 'Nothing is logged'],
      answer: 0,
      explain: 'The timer is cancelled before it had a chance to run.',
    },
    {
      type: 'output',
      code: c(`
let count = 0;
const id = setInterval(() => {
  count++;
  console.log(count);
  if (count === 3) clearInterval(id);
}, 10);`),
      options: ['1\n2\n3', '1\n2\n3\n4', '1', 'Infinite output'],
      answer: 0,
      explain: 'The interval clears itself on the third run.',
    },
    {
      type: 'output',
      code: c(`
const start = Date.now();
setTimeout(() => console.log(Date.now() - start >= 100), 0);
while (Date.now() - start < 100) {}`),
      options: ['true', 'false', 'Nothing is logged', '0'],
      answer: 0,
      explain: 'The busy loop blocks the only thread. The 0 ms timer cannot run until the loop ends, at least 100 ms later.',
    },
    {
      type: 'output',
      code: c(`
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => {
  console.log('promise');
  setTimeout(() => console.log('inner timeout'), 0);
});`),
      options: ['promise\ntimeout\ninner timeout', 'timeout\npromise\ninner timeout', 'promise\ninner timeout\ntimeout', 'timeout\ninner timeout\npromise'],
      answer: 0,
      explain: 'The microtask runs first and schedules a second timer, which is queued after the first one.',
    },
    {
      type: 'output',
      code: c(`
for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), i * 10);
}`),
      options: ['4\n4\n4', '1\n2\n3', '3\n3\n3', '0\n1\n2'],
      answer: 0,
      explain: 'The delays are computed during the loop (10, 20, 30), but every callback reads the shared `var i`, which ends at 4.',
    },
  ],
};

export default topic;
