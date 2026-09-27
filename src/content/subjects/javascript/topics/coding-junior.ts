import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'coding-junior',
  title: 'Junior: implement it',
  level: 'beginner',
  masteryMinutes: 180,
  tags: ['debounce', 'throttle', 'map', 'filter', 'reduce', 'flatten', 'machine coding'],
  summary: 'The six "write it from scratch" questions most often asked at junior level, each with a reference solution and the edge cases interviewers check.',
  keyPoints: [
    {
      title: 'Clarify before you code',
      text: 'Ask about inputs and edge cases: empty arrays, sparse arrays, `this` binding, how deep to flatten. Saying them out loud earns as much credit as the code.',
    },
    {
      title: 'Match the real API',
      text: 'Callbacks get `(item, index, array)`, an optional `thisArg` is honoured, and holes in sparse arrays are skipped. Mention these even if you skip some.',
    },
    {
      title: 'Timers live in closures',
      text: 'Debounce and throttle keep their timer id or last-run time in a closure, and use `fn.apply(this, args)` so the wrapped function keeps its `this` and arguments.',
    },
    {
      title: 'Test with a tiny example',
      text: 'Finish by running one or two inputs by hand, including an edge case. Interviewers want to see you check your own work.',
    },
  ],
  qa: [
    {
      q: '1. Implement `debounce(fn, wait)`.',
      tag: 'Coding',
      a: [
        'Every call cancels the pending timer and starts a new one, so `fn` runs only after calls stop for `wait` ms.',
        'Follow-ups: a `cancel()` method, a `leading` option that fires on the first call.',
      ],
      code: c(`
function debounce(fn, wait = 0) {
  let timer = null;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, wait);
  }
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}`),
    },
    {
      q: '2. Implement `throttle(fn, wait)`.',
      tag: 'Coding',
      a: [
        'Run immediately, then ignore calls until `wait` ms have passed.',
        'Follow-up: also run once at the end of the window with the latest arguments (trailing call).',
      ],
      code: c(`
function throttle(fn, wait = 0) {
  let locked = false;
  return function (...args) {
    if (locked) return;
    locked = true;
    fn.apply(this, args);
    setTimeout(() => (locked = false), wait);
  };
}`),
    },
    {
      q: '3. Implement `Array.prototype.myMap`.',
      tag: 'Coding',
      a: ['Build a new array of the same length. Skip holes, pass `(item, index, array)` and respect `thisArg`.'],
      code: c(`
Array.prototype.myMap = function (callback, thisArg) {
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (Object.hasOwn(this, i)) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};`),
    },
    {
      q: '4. Implement `Array.prototype.myFilter`.',
      tag: 'Coding',
      a: ['Keep items whose callback result is truthy. Read the item before calling the callback, in case the callback mutates the array.'],
      code: c(`
Array.prototype.myFilter = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (!Object.hasOwn(this, i)) continue;
    const item = this[i];
    if (callback.call(thisArg, item, i, this)) result.push(item);
  }
  return result;
};`),
    },
    {
      q: '5. Implement `Array.prototype.myReduce`.',
      tag: 'Coding',
      a: [
        'With no initial value, start from the first existing element.',
        'An empty array with no initial value must throw a `TypeError`, just like the real one.',
      ],
      code: c(`
Array.prototype.myReduce = function (callback, initialValue) {
  const hasInitial = arguments.length >= 2;
  let acc = initialValue;
  let i = 0;
  if (!hasInitial) {
    while (i < this.length && !Object.hasOwn(this, i)) i++;
    if (i >= this.length) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[i++];
  }
  for (; i < this.length; i++) {
    if (Object.hasOwn(this, i)) acc = callback(acc, this[i], i, this);
  }
  return acc;
};`),
    },
    {
      q: '6. Implement `flatten(arr, depth)`.',
      tag: 'Coding',
      a: [
        'Recurse into nested arrays while depth remains. Default to fully flattening.',
        'Follow-up: an iterative version with a stack, which avoids deep recursion.',
      ],
      code: c(`
function flatten(value, depth = Infinity) {
  const result = [];
  for (const item of value) {
    if (Array.isArray(item) && depth > 0) result.push(...flatten(item, depth - 1));
    else result.push(item);
  }
  return result;
}

// iterative, full depth
function flattenIterative(value) {
  const stack = [...value];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) stack.push(...item);
    else result.push(item);
  }
  return result.reverse();
}`),
    },
    {
      q: 'What is the difference between debounce and throttle, in one line each?',
      tag: 'Asked often',
      a: [
        '**Debounce:** run once, after the calls stop. Good for search inputs.',
        '**Throttle:** run at most once per interval while calls continue. Good for scroll handlers.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
const log = debounce((v) => console.log(v), 20);
log('a');
setTimeout(() => log('b'), 5);
setTimeout(() => log('c'), 60);`),
      options: ['b\nc', 'a\nb\nc', 'a\nc', 'c'],
      answer: 0,
      explain: '`a` is cancelled by `b` 5 ms later. `b` fires at about 25 ms. `c` comes after a quiet gap, so it fires too.',
    },
    {
      type: 'output',
      code: c(`
function throttle(fn, wait) {
  let locked = false;
  return (...args) => {
    if (locked) return;
    locked = true;
    fn(...args);
    setTimeout(() => (locked = false), wait);
  };
}
const log = throttle((v) => console.log(v), 30);
log(1); log(2);
setTimeout(() => log(3), 10);
setTimeout(() => log(4), 50);`),
      options: ['1\n4', '1\n2\n3\n4', '1\n3', '4'],
      answer: 0,
      explain: 'Calls 2 and 3 land inside the 30 ms lock after call 1. Call 4 comes after the lock is released.',
    },
    {
      type: 'output',
      code: c(`
Array.prototype.myMap = function (cb, thisArg) {
  const out = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (Object.hasOwn(this, i)) out[i] = cb.call(thisArg, this[i], i, this);
  }
  return out;
};
const res = [1, , 3].myMap((x) => x * 2);
console.log(res.length, 1 in res, res[2]);`),
      options: ['3 false 6', '2 true 6', '3 true 6', '3 false NaN'],
      answer: 0,
      explain: 'Like the real `map`, the hole is skipped but the length is kept.',
    },
    {
      type: 'output',
      code: c(`
Array.prototype.myReduce = function (cb, init) {
  const hasInit = arguments.length >= 2;
  let acc = init, i = 0;
  if (!hasInit) {
    if (this.length === 0) throw new TypeError('empty');
    acc = this[i++];
  }
  for (; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};
console.log([1, 2, 3].myReduce((a, b) => a + b));
console.log([].myReduce((a, b) => a + b, 'init'));
try { [].myReduce((a, b) => a + b); } catch (e) { console.log(e.name); }`),
      options: ['6\ninit\nTypeError', '6\nundefined\nTypeError', 'NaN\ninit\nTypeError', '6\ninit\nundefined'],
      answer: 0,
      explain: 'Without an initial value it starts from the first item. An empty array returns the initial value, or throws if there is none.',
    },
    {
      type: 'output',
      code: c(`
function flatten(value, depth = Infinity) {
  const out = [];
  for (const item of value) {
    if (Array.isArray(item) && depth > 0) out.push(...flatten(item, depth - 1));
    else out.push(item);
  }
  return out;
}
console.log(flatten([1, [2, [3, [4]]]], 1));
console.log(flatten([1, [2, [3, [4]]]]));`),
      options: ['[ 1, 2, [ 3, [ 4 ] ] ]\n[ 1, 2, 3, 4 ]', '[ 1, 2, 3, 4 ]\n[ 1, 2, 3, 4 ]', '[ 1, [ 2, [ 3, [ 4 ] ] ] ]\n[ 1, 2, 3, 4 ]', '[ 1, 2, [ 3, 4 ] ]\n[ 1, 2, 3, 4 ]'],
      answer: 0,
      explain: 'Depth 1 unwraps only one level. The default depth of `Infinity` unwraps everything.',
    },
    {
      type: 'output',
      code: c(`
Array.prototype.myFilter = function (cb) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    const item = this[i];
    if (cb(item, i, this)) out.push(item);
  }
  return out;
};
console.log([0, 1, '', 'a', null, 2].myFilter(Boolean));`),
      options: ["[ 1, 'a', 2 ]", "[ 0, 1, '', 'a', null, 2 ]", "[ 1, 2 ]", "[ 0, '', null ]"],
      answer: 0,
      explain: 'Passing `Boolean` as the callback keeps only truthy values, a common interview shortcut.',
    },
  ],
};

export default topic;
