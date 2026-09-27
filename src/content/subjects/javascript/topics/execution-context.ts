import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'execution-context',
  title: 'Execution context and call stack',
  level: 'intermediate',
  masteryMinutes: 90,
  tags: ['call stack', 'global context', 'stack overflow', 'single-threaded'],
  summary: 'Every function call gets an **execution context**, pushed on the **call stack** and popped when it returns.',
  keyPoints: [
    {
      title: 'What an execution context holds',
      text: 'Its variables and functions (the environment), a link to the outer scope, and the value of `this`.',
    },
    {
      title: 'Global first, then one per call',
      text: 'The global context is created when the script starts. Each function call creates a new context on top of the stack.',
    },
    {
      title: 'Last in, first out',
      text: 'JS runs only the context on top of the stack. When it returns, it is popped and the one below continues.',
    },
    {
      title: 'Stack overflow',
      text: 'Recursion without a base case keeps pushing contexts until the engine throws `RangeError: Maximum call stack size exceeded`.',
    },
  ],
  visuals: [
    {
      type: 'stepper',
      title: 'Push and pop on the call stack',
      code: c(`
function square(n) {
  return n * n;
}
function sumOfSquares(a, b) {
  return square(a) + square(b);
}
console.log(sumOfSquares(2, 3));`),
      panels: ['Call stack', 'Console'],
      steps: [
        { line: 7, note: 'The script starts in the global execution context.', state: { 'Call stack': ['global'] } },
        { line: [7, 5], note: '`sumOfSquares(2, 3)` gets its own context with `a = 2`, `b = 3`.', state: { 'Call stack': ['global', 'sumOfSquares(2, 3)'] } },
        { line: [5, 2], note: '`square(2)` is pushed on top. Only the top context runs.', state: { 'Call stack': ['global', 'sumOfSquares(2, 3)', 'square(2)'] } },
        { line: 5, note: '`square(2)` returns 4 and is popped.', state: { 'Call stack': ['global', 'sumOfSquares(2, 3)'] } },
        { line: [5, 2], note: '`square(3)` is pushed, returns 9, and is popped.', state: { 'Call stack': ['global', 'sumOfSquares(2, 3)', 'square(3)'] } },
        { line: 7, note: '`sumOfSquares` returns 13 and is popped. `console.log` prints it.', state: { 'Call stack': ['global'], Console: ['13'] } },
      ],
    },
  ],
  qa: [
    {
      q: 'What is an execution context?',
      tag: 'Asked often',
      a: [
        'The environment in which a piece of code runs.',
        'It is created in two phases: **creation** (hoist declarations, set up scope chain, decide `this`) and **execution** (run code line by line).',
        'Kinds: global, function, and `eval`.',
      ],
    },
    {
      q: 'What is the call stack?',
      a: [
        'A LIFO stack that tracks which function is running.',
        'A call pushes a context; a return pops it. Error stack traces show this stack.',
      ],
    },
    {
      q: 'What does "JavaScript is single-threaded" mean?',
      a: [
        'There is one call stack, so only one piece of JS runs at a time.',
        'Async work (timers, network) is handled by the environment and callbacks are queued until the stack is empty. See the Event loop topic.',
      ],
    },
    {
      q: 'What causes "Maximum call stack size exceeded"?',
      a: ['Too many nested calls, almost always recursion without a working base case. Fix the base case, or convert deep recursion into a loop.'],
    },
    {
      q: 'What is the difference between an execution context and scope?',
      a: [
        '**Scope** is static: which variables are visible where, decided by the code layout.',
        'An **execution context** is created at runtime for each call and includes a scope plus `this`.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function a() { console.log('a start'); b(); console.log('a end'); }
function b() { console.log('b'); }
a();`),
      options: ['a start\nb\na end', 'a start\na end\nb', 'b\na start\na end', 'a start\nb'],
      answer: 0,
      explain: '`b()` is pushed on top of `a` and runs to completion before `a` continues.',
    },
    {
      type: 'output',
      code: c(`
function recurse(n) {
  return recurse(n + 1);
}
try {
  recurse(0);
} catch (e) {
  console.log(e.name);
}`),
      options: ['RangeError', 'StackOverflowError', 'TypeError', 'InternalError'],
      answer: 0,
      explain: 'Engines throw `RangeError: Maximum call stack size exceeded` when the stack grows too deep.',
    },
    {
      type: 'output',
      code: c(`
function first() {
  setTimeout(() => console.log('timeout'), 0);
  second();
  console.log('first done');
}
function second() { console.log('second'); }
first();`),
      options: ['second\nfirst done\ntimeout', 'timeout\nsecond\nfirst done', 'second\ntimeout\nfirst done', 'first done\nsecond\ntimeout'],
      answer: 0,
      explain: 'The timer callback waits until the call stack is empty, which happens after `first` returns.',
    },
    {
      type: 'output',
      code: c(`
function countdown(n) {
  if (n === 0) return [];
  return [n, ...countdown(n - 1)];
}
console.log(countdown(3));`),
      options: ['[ 3, 2, 1 ]', '[ 1, 2, 3 ]', '[ 3, 2, 1, 0 ]', 'RangeError'],
      answer: 0,
      explain: 'Each call waits for the deeper call to return, then prepends its own `n`.',
    },
    {
      type: 'mcq',
      question: 'Which is NOT decided when an execution context is created?',
      options: ['The value of `this`', 'Hoisted declarations', 'The link to the outer scope', 'The value returned by the function'],
      answer: 3,
      explain: 'The return value is only known after the execution phase runs.',
    },
  ],
};

export default topic;
