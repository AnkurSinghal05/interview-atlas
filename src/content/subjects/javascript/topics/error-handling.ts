import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'error-handling',
  title: 'Error handling',
  level: 'intermediate',
  tags: ['try/catch/finally', 'custom errors', 'Error types', 'async errors'],
  summary: '`try/catch` handles errors thrown **synchronously** in its block. Async errors need `await` inside the `try`, or `.catch`.',
  keyPoints: [
    {
      title: 'Built-in error types',
      text: '`TypeError` (wrong type, e.g. calling a non-function), `ReferenceError` (unknown name), `SyntaxError`, `RangeError` (value out of range), plus `AggregateError` and `URIError`.',
    },
    {
      title: '`finally` always runs',
      text: 'It runs after `try` or `catch`, even if they `return`. A `return` inside `finally` overrides the earlier one.',
    },
    {
      title: 'Custom errors',
      text: 'Extend `Error` and set `name`, so you can check `instanceof` and log clearly.',
      code: c(`
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}`),
    },
    {
      title: 'Throw `Error` objects',
      text: 'You can throw any value, but only `Error` objects carry a `stack` trace. Use `{ cause }` to wrap a lower-level error.',
    },
  ],
  qa: [
    {
      q: 'Can `try/catch` catch an error thrown inside `setTimeout`?',
      tag: 'Asked often',
      a: [
        'No. The callback runs later on a new call stack, after the `try` block has finished.',
        'Put the `try/catch` inside the callback, or use promises with `await`.',
      ],
    },
    {
      q: 'What does `finally` do if both `try` and `finally` return?',
      a: ['The `finally` return wins. Avoid returning from `finally` because it also swallows thrown errors.'],
    },
    {
      q: 'How do you create a custom error class?',
      a: ['Extend `Error`, call `super(message)`, set `this.name`, and add any extra fields.'],
    },
    {
      q: 'How do you handle errors globally?',
      a: [
        'Browser: `window.onerror` / `error` event for sync errors, `unhandledrejection` for promises.',
        'Node: `process.on("uncaughtException")` and `process.on("unhandledRejection")`. Log and exit; do not keep running in an unknown state.',
      ],
    },
    {
      q: 'What is error `cause`?',
      a: ['`new Error("Failed to save", { cause: err })` attaches the original error so you keep the full chain of what went wrong.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function f() {
  try {
    return 'try';
  } finally {
    console.log('finally');
  }
}
console.log(f());`),
      options: ['finally\ntry', 'try\nfinally', 'try', 'finally'],
      answer: 0,
      explain: '`finally` runs before the function actually returns, so its log appears first.',
    },
    {
      type: 'output',
      code: c(`
function f() {
  try {
    throw new Error('boom');
  } catch (e) {
    return 'catch';
  } finally {
    return 'finally';
  }
}
console.log(f());`),
      options: ['finally', 'catch', 'boom', 'catch\nfinally'],
      answer: 0,
      explain: 'A `return` in `finally` overrides the `return` from `catch`.',
    },
    {
      type: 'output',
      code: c(`
try {
  null.length;
} catch (e) {
  console.log(e.name);
}
try {
  undefinedFn();
} catch (e) {
  console.log(e.name);
}
try {
  new Array(-1);
} catch (e) {
  console.log(e.name);
}`),
      options: ['TypeError\nReferenceError\nRangeError', 'TypeError\nTypeError\nRangeError', 'ReferenceError\nReferenceError\nTypeError', 'TypeError\nReferenceError\nTypeError'],
      answer: 0,
      explain: 'Reading a property of `null` is a `TypeError`, an unknown name is a `ReferenceError`, and a negative array length is a `RangeError`.',
    },
    {
      type: 'output',
      code: c(`
class NotFound extends Error {
  constructor(what) {
    super(what + ' not found');
    this.name = 'NotFound';
  }
}
try {
  throw new NotFound('user');
} catch (e) {
  console.log(e instanceof NotFound, e instanceof Error, e.message);
}`),
      options: ['true true user not found', 'true false user not found', 'false true user not found', 'true true NotFound'],
      answer: 0,
      explain: 'A subclass instance is also an `Error`. The message comes from `super(...)`.',
    },
    {
      type: 'output',
      code: c(`
async function load() {
  throw new Error('network');
}
let pending;
try {
  pending = load();
  console.log('no error here');
} catch (e) {
  console.log('caught');
}
pending.catch((e) => console.log('handled', e.message));`),
      options: ['no error here\nhandled network', 'caught\nhandled network', 'no error here\ncaught\nhandled network', 'caught'],
      answer: 0,
      explain: 'Calling an async function without `await` returns a rejected promise instead of throwing, so the `try` sees nothing.',
    },
    {
      type: 'output',
      code: c(`
try {
  throw 'just a string';
} catch (e) {
  console.log(typeof e, e.stack);
}`),
      options: ['string undefined', 'object undefined', 'string [stack trace]', 'TypeError'],
      answer: 0,
      explain: 'You can throw any value, but non-`Error` values have no `stack` property.',
    },
  ],
};

export default topic;
