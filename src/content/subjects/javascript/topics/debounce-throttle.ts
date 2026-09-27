import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'debounce-throttle',
  title: 'Debounce and throttle',
  level: 'intermediate',
  masteryMinutes: 120,
  tags: ['rate limiting', 'timers', 'search input', 'scroll'],
  summary: '**Debounce** waits for a pause before running. **Throttle** runs at most once per time window.',
  keyPoints: [
    {
      title: 'Debounce: act after it goes quiet',
      text: 'Each new call resets the timer. Only the last call in a burst runs. Use for search-as-you-type, resize end, autosave.',
    },
    {
      title: 'Throttle: steady rate',
      text: 'The first call runs, and further calls are ignored until the window passes. Use for scroll, mousemove, drag.',
    },
    {
      title: 'Both rely on closures',
      text: 'The timer id and last-run time live in the closure returned by `debounce()` / `throttle()`.',
    },
    {
      title: 'Leading vs trailing',
      text: 'Debounce normally fires on the trailing edge; a "leading" option fires on the first call instead. Throttle can also fire a trailing call.',
    },
  ],
  qa: [
    {
      q: 'Implement `debounce`.',
      tag: 'Coding',
      a: ['Clear the previous timer on every call and start a new one.'],
      code: c(`
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`),
    },
    {
      q: 'Implement `throttle`.',
      tag: 'Coding',
      a: ['Remember when it last ran; skip calls inside the window.'],
      code: c(`
function throttle(fn, limit) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn.apply(this, args);
    }
  };
}`),
    },
    {
      q: 'When would you choose debounce over throttle?',
      tag: 'Asked often',
      a: [
        '**Debounce** when only the final value matters: search box, window resize finished, form validation.',
        '**Throttle** when you need regular updates during continuous activity: scroll position, infinite scroll, game input.',
      ],
    },
    {
      q: 'Why use `fn.apply(this, args)` inside the wrapper?',
      a: ['So the original function keeps the caller\'s `this` (for example, the element in a DOM handler) and receives the latest arguments.'],
    },
    {
      q: 'How would you add a `cancel` method to debounce?',
      a: ['Attach a function to the returned wrapper that calls `clearTimeout(timer)`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
const log = debounce((x) => console.log(x), 50);
log(1); log(2); log(3);
setTimeout(() => log(4), 100);`),
      options: ['3\n4', '1\n2\n3\n4', '1\n4', '4'],
      answer: 0,
      explain: 'The first three calls come in one burst, so only the last (3) runs. The call at 100 ms starts a new burst.',
    },
    {
      type: 'output',
      code: c(`
function throttle(fn, ms) {
  let last = 0;
  return (...a) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...a); }
  };
}
const log = throttle((x) => console.log(x), 1000);
log('a'); log('b'); log('c');`),
      options: ['a', 'c', 'a\nb\nc', 'a\nc'],
      answer: 0,
      explain: 'The first call runs immediately; the others fall inside the same 1-second window and are dropped.',
    },
    {
      type: 'output',
      code: c(`
function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
let calls = 0;
const save = debounce(() => calls++, 10);
for (let i = 0; i < 100; i++) save();
setTimeout(() => console.log(calls), 50);`),
      options: ['1', '100', '0', '10'],
      answer: 0,
      explain: 'All 100 calls happen before the 10 ms timer can fire, so it keeps getting reset and runs once.',
    },
    {
      type: 'mcq',
      question: 'You fetch search suggestions as the user types. Which fits best?',
      options: ['Throttle', 'Debounce', 'setInterval', 'Neither'],
      answer: 1,
      explain: 'Debounce waits until the user pauses typing, avoiding a request per keystroke.',
    },
    {
      type: 'mcq',
      question: 'You update a "back to top" button while the user scrolls. Which fits best?',
      options: ['Throttle', 'Debounce', 'Promise.all', 'requestIdleCallback only'],
      answer: 0,
      explain: 'Throttle gives regular updates during continuous scrolling. Debounce would wait until scrolling stops.',
    },
  ],
};

export default topic;
