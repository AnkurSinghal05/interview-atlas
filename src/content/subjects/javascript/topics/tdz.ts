import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'tdz',
  title: 'Temporal dead zone',
  level: 'intermediate',
  masteryMinutes: 45,
  tags: ['let', 'const', 'class', 'ReferenceError'],
  summary: 'The **TDZ** is the stretch between entering a scope and reaching a `let`/`const`/`class` line. Touching the variable there throws.',
  keyPoints: [
    {
      title: 'It is about time, not position',
      text: 'The TDZ ends when the declaration **runs**. A function defined above the declaration can use the variable if it is called after.',
      code: c(`
const read = () => value; // fine to define
// read();                // would throw here
let value = 1;
read();                   // 1`),
    },
    {
      title: 'The variable shadows the outer one',
      text: 'Inside the block, the name already refers to the inner, uninitialised variable. So the outer variable is not a fallback.',
    },
    {
      title: '`typeof` is not safe in the TDZ',
      text: '`typeof undeclared` returns `"undefined"`, but `typeof x` for a `let x` in the TDZ throws.',
    },
    {
      title: 'Why it exists',
      text: 'It catches use-before-declare bugs and makes `const` meaningful: a `const` must never be seen without its value.',
    },
  ],
  qa: [
    {
      q: 'What is the temporal dead zone?',
      tag: 'Asked often',
      a: [
        'The period from the start of a block until a `let`, `const` or `class` declaration is evaluated.',
        'Accessing the variable during that period throws `ReferenceError: Cannot access \'x\' before initialization`.',
      ],
    },
    {
      q: 'Are `let` and `const` hoisted then?',
      a: [
        'Yes, they are hoisted to the top of their block. That is why they shadow outer variables immediately.',
        'They are just not initialised, unlike `var` which is initialised to `undefined`.',
      ],
    },
    {
      q: 'Can default parameters be in a TDZ?',
      a: ['Yes. Parameters are initialised left to right, so a default can use earlier parameters but not later ones.'],
      code: c(`
function f(a = b, b = 1) {}
f(); // ReferenceError: Cannot access 'b' before initialization`),
    },
    {
      q: 'Do classes have a TDZ?',
      a: ['Yes. Unlike function declarations, you cannot use a class before its `class` line.'],
    },
    {
      q: 'What is the difference between "not defined" and "before initialization" errors?',
      a: [
        '`x is not defined`: no variable named `x` exists in any scope.',
        '`Cannot access \'x\' before initialization`: `x` exists but is still in the TDZ.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
let x = 'outer';
{
  try {
    console.log(x);
  } catch (e) {
    console.log(e.name);
  }
  let x = 'inner';
}`),
      options: ['ReferenceError', 'outer', 'undefined', 'inner'],
      answer: 0,
      explain: 'The inner `let x` is hoisted to the top of the block and shadows the outer `x`, but it is in the TDZ.',
    },
    {
      type: 'output',
      code: c(`
function getValue() {
  return value;
}
let value = 42;
console.log(getValue());`),
      options: ['42', 'ReferenceError', 'undefined', 'null'],
      answer: 0,
      explain: 'The TDZ is about when code runs. By the time `getValue()` is called, `value` is initialised.',
    },
    {
      type: 'output',
      code: c(`
console.log(typeof notDeclaredAnywhere);
try {
  console.log(typeof later);
} catch (e) {
  console.log(e.name);
}
let later = 1;`),
      options: ['undefined\nReferenceError', 'undefined\nundefined', 'ReferenceError', 'undefined\nnumber'],
      answer: 0,
      explain: '`typeof` is safe for names that do not exist at all, but not for a `let` in its TDZ.',
    },
    {
      type: 'output',
      code: c(`
function f(a = 1, b = a + 1) {
  return a + b;
}
console.log(f());
console.log(f(5));`),
      options: ['3\n11', '2\n6', 'ReferenceError', 'NaN\nNaN'],
      answer: 0,
      explain: '`b` can use `a` because `a` is initialised first. `f()` is `1 + 2`; `f(5)` is `5 + 6`.',
    },
    {
      type: 'output',
      code: c(`
try {
  const p = new Point();
} catch (e) {
  console.log(e.name);
}
class Point {}`),
      options: ['ReferenceError', 'TypeError', 'Nothing is logged', 'SyntaxError'],
      answer: 0,
      explain: 'Classes are hoisted but stay in the TDZ until their declaration runs.',
    },
    {
      type: 'truefalse',
      statement: 'Inside a block, a `let` variable in its TDZ falls back to an outer variable with the same name.',
      answer: false,
      explain: 'The inner declaration already shadows the outer one for the whole block, so access throws.',
    },
  ],
};

export default topic;
