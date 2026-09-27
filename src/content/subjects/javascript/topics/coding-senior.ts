import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'coding-senior',
  title: 'Senior: implement it',
  level: 'advanced',
  tags: ['event emitter', 'Promise.all', 'Promise.allSettled', 'curry', 'getElementsByClassName'],
  summary: 'Five senior-level builds: an event emitter, `Promise.all`, `Promise.allSettled`, `curry` and `getElementsByClassName`. They test async ordering, API design and DOM traversal.',
  keyPoints: [
    {
      title: 'Design the API out loud',
      text: 'For the emitter, decide what `on` returns, whether duplicates are allowed, and what happens if a listener unsubscribes mid-emit. Seniors are graded on these choices.',
    },
    {
      title: 'Promises: order and counting',
      text: 'Store each result at its **index**, count completions separately, and wrap every input in `Promise.resolve` so plain values work. Handle the empty array.',
    },
    {
      title: 'Curry depends on `fn.length`',
      text: 'Collect arguments until you have as many as the function declares. Mention that default and rest parameters break this.',
    },
    {
      title: 'DOM: walk the tree',
      text: 'Traverse `element.children` recursively (or with a stack) and test `classList.contains` for every requested class.',
    },
  ],
  qa: [
    {
      q: '14. Implement an `EventEmitter` with `on`, `off`, `once` and `emit`.',
      tag: 'Coding',
      a: [
        'A `Map` from event name to an array of listeners.',
        '`on` returns an unsubscribe function. `emit` loops over a **copy** so listeners that remove themselves do not skip others.',
      ],
      code: c(`
class EventEmitter {
  #events = new Map();

  on(name, listener) {
    if (!this.#events.has(name)) this.#events.set(name, []);
    this.#events.get(name).push(listener);
    return () => this.off(name, listener);
  }

  off(name, listener) {
    const list = this.#events.get(name);
    if (!list) return;
    const i = list.findIndex((l) => l === listener || l.original === listener);
    if (i !== -1) list.splice(i, 1);
  }

  once(name, listener) {
    const wrapper = (...args) => {
      this.off(name, wrapper);
      listener.apply(this, args);
    };
    wrapper.original = listener;
    return this.on(name, wrapper);
  }

  emit(name, ...args) {
    const list = this.#events.get(name);
    if (!list?.length) return false;
    [...list].forEach((listener) => listener.apply(this, args));
    return true;
  }
}`),
    },
    {
      q: '15. Implement `Promise.all`.',
      tag: 'Coding',
      a: [
        'Resolve with results in input order once every item fulfils; reject as soon as one rejects.',
        'Accept any iterable and plain values; resolve immediately for an empty input.',
      ],
      code: c(`
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = [...iterable];
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}`),
    },
    {
      q: '16. Implement `Promise.allSettled`.',
      tag: 'Coding',
      a: ['Never reject. Record `{ status: "fulfilled", value }` or `{ status: "rejected", reason }` for each input, in order.'],
      code: c(`
function promiseAllSettled(iterable) {
  return new Promise((resolve) => {
    const items = [...iterable];
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item)
        .then(
          (value) => (results[i] = { status: 'fulfilled', value }),
          (reason) => (results[i] = { status: 'rejected', reason }),
        )
        .then(() => {
          if (--remaining === 0) resolve(results);
        });
    });
  });
}`),
    },
    {
      q: '17. Implement `curry(fn)`.',
      tag: 'Coding',
      a: ['Return a function that keeps collecting arguments until it has `fn.length` of them, then calls `fn`. Keep `this` for method use.'],
      code: c(`
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

const add3 = curry((a, b, c) => a + b + c);
add3(1)(2)(3); // 6
add3(1, 2)(3); // 6`),
    },
    {
      q: '18. Implement `getElementsByClassName(root, classNames)`.',
      tag: 'Coding',
      a: [
        'Split the class string on whitespace, then walk every descendant of `root` (not `root` itself) and keep elements that have **all** the classes.',
        'The real method returns a **live** `HTMLCollection` that updates as the DOM changes; this version returns a static array.',
      ],
      code: c(`
function getElementsByClassName(root, classNames) {
  const wanted = classNames.trim().split(/\\s+/).filter(Boolean);
  const result = [];
  function walk(el) {
    for (const child of el.children) {
      if (wanted.every((cls) => child.classList.contains(cls))) result.push(child);
      walk(child);
    }
  }
  walk(root);
  return result;
}`),
    },
    {
      q: 'What is a live collection, and why does it matter?',
      a: [
        '`getElementsByClassName` and `children` return live collections that update automatically when the DOM changes.',
        '`querySelectorAll` returns a static `NodeList`.',
        'Looping over a live collection while removing matched elements skips items; copy it first with `[...collection]`.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
class EventEmitter {
  events = new Map();
  on(n, l) { (this.events.get(n) ?? this.events.set(n, []).get(n)).push(l); return () => this.off(n, l); }
  off(n, l) { const a = this.events.get(n) ?? []; const i = a.indexOf(l); if (i > -1) a.splice(i, 1); }
  emit(n, ...args) { [...(this.events.get(n) ?? [])].forEach((l) => l(...args)); }
}
const bus = new EventEmitter();
const unsubscribe = bus.on('save', (id) => console.log('A', id));
bus.on('save', (id) => console.log('B', id));
bus.emit('save', 1);
unsubscribe();
bus.emit('save', 2);`),
      options: ['A 1\nB 1\nB 2', 'A 1\nB 1\nA 2\nB 2', 'A 1\nB 1', 'B 1\nB 2'],
      answer: 0,
      explain: 'The function returned by `on` removes listener A, so only B hears the second event.',
    },
    {
      type: 'output',
      code: c(`
function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = items.length;
    if (!remaining) return resolve(results);
    items.forEach((item, i) =>
      Promise.resolve(item).then((v) => {
        results[i] = v;
        if (--remaining === 0) resolve(results);
      }, reject));
  });
}
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
promiseAll([wait(30, 'a'), 'b', wait(10, 'c')]).then(console.log);
promiseAll([]).then((r) => console.log('empty', r));`),
      options: ["empty []\n[ 'a', 'b', 'c' ]", "[ 'a', 'b', 'c' ]\nempty []", "empty []\n[ 'b', 'c', 'a' ]", "[ 'b', 'c', 'a' ]\nempty []"],
      answer: 0,
      explain: 'The empty input resolves right away. The other keeps input order even though `c` finished before `a`.',
    },
    {
      type: 'output',
      code: c(`
function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = [];
    items.forEach((item, i) =>
      Promise.resolve(item).then((v) => {
        results[i] = v;
        if (results.length === items.length) resolve(results);
      }, reject));
  });
}
const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
promiseAll([wait(20, 'slow'), wait(5, 'fast')]).then((r) => console.log(r.length, r[0]));`),
      options: ['2 undefined', '2 slow', '1 fast', 'Nothing is logged'],
      answer: 0,
      explain: 'A classic bug: writing index 1 first makes `results.length` 2 immediately, so it resolves before `slow` arrives. Count completions instead.',
    },
    {
      type: 'output',
      code: c(`
function allSettled(items) {
  return Promise.all(items.map((p) =>
    Promise.resolve(p).then(
      (value) => ({ status: 'fulfilled', value }),
      (reason) => ({ status: 'rejected', reason }))));
}
allSettled([1, Promise.reject('no'), Promise.resolve(3)])
  .then((r) => console.log(r.map((x) => x.value ?? x.reason)));`),
      options: ["[ 1, 'no', 3 ]", 'Uncaught (in promise) no', '[ 1, 3 ]', "[ 1, undefined, 3 ]"],
      answer: 0,
      explain: 'Each rejection is turned into a fulfilled status object, so the combined promise never rejects.',
    },
    {
      type: 'output',
      code: c(`
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}
const join = curry((a, b, c) => [a, b, c].join('-'));
const withDefault = curry((a, b = 2) => a + b);
console.log(join('x')('y')('z'), join('x', 'y', 'z', 'extra'));
console.log(withDefault(1));`),
      options: ['x-y-z x-y-z\n3', 'x-y-z x-y-z-extra\n3', 'x-y-z x-y-z\n[Function]', 'x-y-z x-y-z\nNaN'],
      answer: 0,
      explain: 'Extra arguments are passed but ignored by the function. `withDefault.length` is 1 (defaults are not counted), so one argument is enough to call it.',
    },
    {
      type: 'output',
      code: c(`
// <div id="root" class="card"><p class="card big">A</p><section><span class="big card x">B</span></section><p class="big">C</p></div>
function byClass(root, names) {
  const wanted = names.trim().split(/\\s+/);
  const out = [];
  (function walk(el) {
    for (const child of el.children) {
      if (wanted.every((c) => child.classList.contains(c))) out.push(child.textContent);
      walk(child);
    }
  })(root);
  return out;
}
console.log(byClass(document.getElementById('root'), ' card  big ').join(','));`),
      note: 'In a browser.',
      options: ['A,B', 'A,B,C', 'A', 'root,A,B'],
      answer: 0,
      explain: 'Only descendants are searched (not `root` itself), class order does not matter, and C lacks `card`.',
    },
    {
      type: 'output',
      code: c(`
// <ul id="list"><li class="item">1</li><li class="item">2</li><li class="item">3</li></ul>
const live = document.getElementsByClassName('item');
const frozen = document.querySelectorAll('.item');
for (let i = 0; i < live.length; i++) live[i].classList.remove('item');
console.log(live.length, frozen.length);`),
      note: 'In a browser.',
      options: ['1 3', '0 3', '0 0', '3 3'],
      answer: 0,
      explain: 'The live collection shrinks while you loop, so the loop skips an element and one `.item` is left. `querySelectorAll` returned a static snapshot.',
    },
  ],
};

export default topic;
