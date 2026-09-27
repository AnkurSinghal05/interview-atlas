import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'web-workers',
  title: 'Web Workers',
  level: 'advanced',
  masteryMinutes: 60,
  tags: ['threads', 'postMessage', 'service workers', 'off main thread'],
  summary: 'A Web Worker runs a script on a **separate thread** so heavy work does not freeze the page. It talks to the page only through messages.',
  keyPoints: [
    {
      title: 'Why',
      text: 'The main thread handles JS, layout and input. A long loop blocks all of it. Move CPU-heavy work (parsing, image processing) to a worker.',
    },
    {
      title: 'Messages, not shared variables',
      text: 'Send data with `postMessage` and receive it with `onmessage`. Data is copied with the structured clone algorithm (or transferred for `ArrayBuffer`s).',
      code: c(`
// main.js
const worker = new Worker('worker.js');
worker.postMessage(1_000_000);
worker.onmessage = (e) => console.log('sum', e.data);

// worker.js
onmessage = (e) => {
  let sum = 0;
  for (let i = 0; i < e.data; i++) sum += i;
  postMessage(sum);
};`),
    },
    {
      title: 'No DOM access',
      text: 'Workers cannot touch `document` or `window`. They have `fetch`, timers, IndexedDB and `self`.',
    },
    {
      title: 'Kinds of workers',
      text: '**Dedicated** workers (one page), **shared** workers (several tabs), and **service workers** (network proxy for offline and push).',
    },
  ],
  comparisons: [
    {
      items: ['Web Worker', 'Service Worker', 'Shared Worker'],
      rows: [
        { aspect: 'Purpose', values: ['Heavy CPU work off the main thread', 'Proxy for network requests: offline cache, push, background sync', 'One worker shared by several tabs'], key: true },
        { aspect: 'Lifetime', values: ['Lives with the page that made it', 'Managed by the browser; starts on events, stops when idle', 'Lives while any connected page is open'], key: true },
        { aspect: 'DOM access', values: ['No', 'No', 'No'] },
        { aspect: 'Serves', values: ['One page', 'Every page in its scope', 'Same-origin pages that connect'] },
        { aspect: 'Needs HTTPS', values: ['No', 'Yes (localhost excepted)', 'No'] },
        { aspect: 'Talk to it with', values: ['`postMessage`', '`postMessage`, plus it intercepts `fetch` events', '`port.postMessage`'] },
      ],
      reveal: 'All three run off the main thread with no DOM. A Web Worker is about **computation**, a Service Worker is about the **network**, a Shared Worker is about **sharing** one instance.',
      whenToUse: ['Parsing big files, image processing, heavy maths, anything that freezes the UI.', 'PWAs, offline support, caching assets, push notifications.', 'One WebSocket or shared state across tabs.'],
    },
  ],
  qa: [
    {
      q: 'What is a Web Worker and when would you use one?',
      tag: 'Asked often',
      a: [
        'A background thread for running JS in parallel with the main thread.',
        'Use it for CPU-heavy tasks that would otherwise freeze the UI: large JSON parsing, compression, image or data processing.',
      ],
    },
    {
      q: 'Can a worker update the DOM?',
      a: ['No. It sends a message back to the main thread, which updates the DOM.'],
    },
    {
      q: 'What is the difference between a Web Worker and a Service Worker?',
      a: [
        'Web Worker: offloads computation for one page, lives as long as the page.',
        'Service Worker: sits between the app and the network, intercepts requests (caching, offline, push notifications), and lives independently of any page.',
      ],
    },
    {
      q: 'Does a worker make JavaScript multi-threaded?',
      a: ['Each worker has its own event loop and memory. They do not share variables (except via `SharedArrayBuffer` with `Atomics`), so each thread still runs JS single-threaded.'],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'Inside a dedicated worker, what does `typeof document` return?',
      options: ['"object"', '"undefined"', '"function"', 'It throws'],
      answer: 1,
      explain: 'Workers have no DOM, so `document` does not exist there.',
    },
    {
      type: 'mcq',
      question: 'The page posts an object to a worker, and the worker changes a property on it. What does the page see?',
      options: ['The change', 'No change: the worker got a copy', 'An error', 'The property is deleted'],
      answer: 1,
      explain: '`postMessage` uses structured cloning, so each side has its own copy.',
    },
    {
      type: 'mcq',
      question: 'Which task is the best fit for a Web Worker?',
      options: ['Toggling a CSS class', 'Resizing a 20 MB image in JS', 'Reading `localStorage`', 'Handling a button click'],
      answer: 1,
      explain: 'Heavy CPU work is what workers are for. DOM and `localStorage` are not available in workers.',
    },
    {
      type: 'truefalse',
      statement: 'Service Workers can intercept network requests made by the page.',
      answer: true,
      explain: 'That is their main job, via the `fetch` event, which enables offline caching.',
    },
  ],
};

export default topic;
