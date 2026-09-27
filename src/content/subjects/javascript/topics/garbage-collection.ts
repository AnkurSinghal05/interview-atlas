import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'garbage-collection',
  title: 'Memory and garbage collection',
  level: 'advanced',
  tags: ['mark and sweep', 'reachability', 'memory leaks', 'stack vs heap'],
  summary: 'JS frees memory automatically: anything no longer **reachable** from the roots gets collected. Leaks happen when you keep references by accident.',
  keyPoints: [
    {
      title: 'Reachability',
      text: 'Roots are globals, the current call stack and active closures. Anything you can reach by following references from a root is kept alive.',
    },
    {
      title: 'Mark and sweep',
      text: 'The collector marks everything reachable from the roots, then frees the rest. Cycles are fine: two objects pointing only at each other are collected.',
    },
    {
      title: 'Stack and heap',
      text: 'Primitives in local variables live on the stack (roughly). Objects live on the heap and variables hold references to them.',
    },
    {
      title: 'Generational GC',
      text: 'Engines like V8 split the heap into young and old generations. Most objects die young, so the young space is collected often and cheaply.',
    },
  ],
  qa: [
    {
      q: 'How does garbage collection work in JavaScript?',
      tag: 'Asked often',
      a: [
        'The engine periodically finds all objects reachable from roots (globals, stack, closures) and frees the unreachable ones.',
        'The main algorithm is mark-and-sweep, with generational and incremental optimisations.',
      ],
    },
    {
      q: 'What are common causes of memory leaks?',
      tag: 'Asked often',
      a: [
        'Accidental globals (assigning without declaring).',
        'Forgotten timers and intervals that reference big data.',
        'Event listeners never removed, especially on long-lived elements.',
        'Detached DOM nodes still referenced from JS.',
        'Caches (plain `Map`s) that grow forever.',
        'Closures that capture more than they need.',
      ],
    },
    {
      q: 'Does reference counting explain JS GC?',
      a: ['Not fully. Pure reference counting cannot free cycles. Modern engines use tracing (mark-and-sweep), so cycles that are unreachable are collected.'],
    },
    {
      q: 'How do you find a memory leak?',
      a: [
        'Chrome DevTools Memory tab: take heap snapshots before and after an action and compare.',
        'Look for detached DOM trees and growing arrays or maps.',
        'The Performance monitor shows JS heap size over time.',
      ],
    },
    {
      q: 'How do you avoid leaks with listeners and timers?',
      a: ['Remove listeners (`removeEventListener`, `AbortController` signal), clear intervals, and clean up in component unmount (e.g. `useEffect` cleanup).'],
      code: c(`
const controller = new AbortController();
window.addEventListener('resize', onResize, { signal: controller.signal });
// later
controller.abort(); // removes the listener`),
    },
  ],
  quiz: [
    {
      type: 'truefalse',
      statement: 'Two objects that reference each other, but that nothing else references, will never be garbage-collected.',
      answer: false,
      explain: 'Mark-and-sweep starts from roots. If the pair is unreachable, both are collected.',
    },
    {
      type: 'mcq',
      question: 'Which of these is most likely to cause a memory leak?',
      options: ['A local array inside a function that returns', 'A `setInterval` that is never cleared and captures a large object', 'A `WeakMap` keyed by DOM nodes', 'An object set to `null` after use'],
      answer: 1,
      explain: 'An active interval keeps its callback, and everything the callback closes over, alive forever.',
    },
    {
      type: 'mcq',
      question: 'Which is NOT a garbage-collection root?',
      options: ['Global variables', 'Local variables of functions currently on the call stack', 'An object only referenced from a WeakMap key', 'Variables captured by a live closure'],
      answer: 2,
      explain: 'WeakMap keys are held weakly and do not keep an object alive.',
    },
    {
      type: 'truefalse',
      statement: 'Setting a variable to `null` immediately frees the object it pointed to.',
      answer: false,
      explain: 'It only removes one reference. The object is freed later, when the collector runs and finds no other references.',
    },
    {
      type: 'mcq',
      question: 'A removed DOM element is still stored in a JS array. What is this called?',
      options: ['Shadow DOM', 'A detached DOM node leak', 'Event bubbling', 'Hoisting'],
      answer: 1,
      explain: 'The element is gone from the page but still reachable from JS, so it cannot be collected.',
    },
  ],
};

export default topic;
