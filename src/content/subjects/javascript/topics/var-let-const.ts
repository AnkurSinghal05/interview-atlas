import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'var-let-const',
  title: 'var, let and const',
  level: 'beginner',
  masteryMinutes: 45,
  tags: ['declarations', 'block scope', 'redeclaration'],
  summary: '`var` is function-scoped and hoisted as `undefined`. `let` and `const` are **block-scoped** and cannot be used before their line.',
  keyPoints: [
    {
      title: 'Scope: function vs block',
      text: '`var` belongs to the nearest function. `let` and `const` belong to the nearest `{ }` block, including `if` and loop bodies.',
      code: c(`
if (true) {
  var a = 1;
  let b = 2;
}
a; // 1
b; // ReferenceError`),
    },
    {
      title: 'Hoisting behaves differently',
      text: 'All three are hoisted. `var` starts as `undefined`; `let` and `const` stay uninitialised (the temporal dead zone) until their line runs.',
    },
    {
      title: '`const` locks the binding, not the value',
      text: 'You cannot reassign a `const`, but an object or array it holds can still be changed.',
      code: c(`
const user = { name: 'Ada' };
user.name = 'Linus'; // fine
user = {};           // TypeError`),
    },
    {
      title: 'Rule of thumb',
      text: 'Use `const` by default, `let` when the variable must change, and avoid `var` in new code.',
    },
  ],
  comparisons: [
    {
      items: ['`var`', '`let`', '`const`'],
      rows: [
        { aspect: 'Scope', values: ['Function', 'Block `{ }`', 'Block `{ }`'], key: true },
        { aspect: 'Hoisted?', values: ['Yes, and set to `undefined`', 'Yes, but in the TDZ until its line', 'Yes, but in the TDZ until its line'] },
        { aspect: 'Read before the declaration', values: ['`undefined`', '`ReferenceError`', '`ReferenceError`'] },
        { aspect: 'Redeclare in the same scope', values: ['Allowed', '`SyntaxError`', '`SyntaxError`'] },
        { aspect: 'Reassign', values: ['Yes', 'Yes', 'No, `TypeError`'], key: true },
        { aspect: 'Must be initialised', values: ['No', 'No', 'Yes'] },
        { aspect: 'Top level adds to `window`', values: ['Yes', 'No', 'No'] },
        { aspect: 'Closures in a `for` loop', values: ['One shared `i` for all iterations', 'A fresh `i` per iteration', 'Works in `for...of`, throws in `i++` loops'] },
        { aspect: 'Mutate an object it holds', values: ['Yes', 'Yes', 'Yes: the binding is fixed, not the value'] },
      ],
      reveal:
        'All three are hoisted. What differs is the scope (function vs block), whether the name is usable before its line (`var` gives `undefined`, the others sit in the TDZ), and whether it can be reassigned. `const` locks the **binding**, not the object.',
      whenToUse: [
        'Only when reading or maintaining old code. Avoid it in new code.',
        'When the value really changes: counters, accumulators, a variable set in an `if/else`.',
        'The default for everything else, including objects and arrays you will mutate.',
      ],
      code: [
        c(`
for (var i = 0; i < 3; i++)
  setTimeout(() => console.log(i));
// 3 3 3`),
        c(`
for (let i = 0; i < 3; i++)
  setTimeout(() => console.log(i));
// 0 1 2`),
        c(`
const user = { name: 'A' };
user.name = 'B'; // fine
user = {};       // TypeError`),
      ],
    },
  ],
  qa: [
    {
      q: 'What are the differences between `var`, `let` and `const`?',
      tag: 'Asked often',
      a: [
        '**Scope:** `var` is function-scoped; `let` and `const` are block-scoped.',
        '**Hoisting:** `var` is initialised to `undefined`; `let`/`const` are in the TDZ until declared.',
        '**Redeclaration:** `var` can be redeclared in the same scope; `let`/`const` cannot.',
        '**Reassignment:** `var` and `let` can be reassigned; `const` cannot.',
        '**Global object:** a top-level `var` becomes a property of `window`; `let`/`const` do not.',
      ],
    },
    {
      q: 'Can you change an object declared with `const`?',
      a: [
        'Yes. `const` only stops the variable from pointing somewhere else.',
        'To stop changes to the object itself, use `Object.freeze()` (shallow).',
      ],
      code: c(`
const arr = [1, 2];
arr.push(3);   // [1, 2, 3]
Object.freeze(arr);
arr.push(4);   // TypeError: object is not extensible`),
    },
    {
      q: 'Must a `const` be initialised when declared?',
      a: ['Yes. `const x;` is a SyntaxError because it could never get a value later.'],
    },
    {
      q: 'Why does `let` fix the classic loop-with-`setTimeout` bug?',
      a: [
        'A `for (let i ...)` loop creates a **new binding of `i` for every iteration**.',
        'Each callback closes over its own `i`, while `var` gives all callbacks one shared variable.',
      ],
    },
    {
      q: 'What happens if you assign to an undeclared variable?',
      a: [
        'In sloppy mode it silently creates a global variable (a common bug).',
        'In strict mode it throws a `ReferenceError`.',
      ],
      code: c(`
function f() { leaked = 5; }
f();
console.log(leaked); // 5 in sloppy mode`),
    },
    {
      q: 'Is `let` slower or faster than `var`?',
      a: ['In practice there is no meaningful difference. Pick by semantics, not speed.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(a);
var a = 10;
console.log(a);`),
      options: ['undefined\n10', 'ReferenceError', '10\n10', 'null\n10'],
      answer: 0,
      explain: 'The declaration `var a` is hoisted and set to `undefined`. The assignment stays on its line.',
    },
    {
      type: 'output',
      code: c(`
console.log(b);
let b = 10;`),
      options: ['undefined', 'ReferenceError', '10', 'null'],
      answer: 1,
      explain: '`b` is hoisted but sits in the temporal dead zone until `let b` runs, so reading it throws.',
    },
    {
      type: 'output',
      code: c(`
function test() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  console.log(x);
  console.log(typeof y);
}
test();`),
      options: ['1\nundefined', '1\nnumber', 'ReferenceError', 'undefined\nundefined'],
      answer: 0,
      explain: '`x` is function-scoped so it is visible after the block. `y` does not exist outside the block, and `typeof` on an undeclared name returns `"undefined"`.',
    },
    {
      type: 'output',
      code: c(`
const nums = [1, 2, 3];
nums.push(4);
console.log(nums.length);
try {
  nums = [];
} catch (e) {
  console.log(e.name);
}`),
      options: ['4\nTypeError', '3\nTypeError', '4\nSyntaxError', '0'],
      answer: 0,
      explain: 'Mutating the array is allowed. Reassigning a `const` throws a `TypeError` at runtime.',
    },
    {
      type: 'output',
      code: c(`
let count = 1;
{
  let count = 2;
  console.log(count);
}
console.log(count);`),
      options: ['2\n2', '2\n1', '1\n1', 'SyntaxError'],
      answer: 1,
      explain: 'The inner `count` is a separate variable that shadows the outer one only inside the block.',
    },
    {
      type: 'output',
      code: c(`
var fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i);
let gns = [];
for (let j = 0; j < 3; j++) gns.push(() => j);
console.log(fns[0](), gns[0]());`),
      options: ['0 0', '3 0', '3 3', '0 3'],
      answer: 1,
      explain: 'All `fns` share one `i`, which ends at 3. Each `gns` function has its own `j`.',
    },
    {
      type: 'truefalse',
      statement: '`let` and `const` declarations are not hoisted at all.',
      answer: false,
      explain: 'They are hoisted to the top of their block but left uninitialised, which is why reading them early throws instead of finding an outer variable.',
    },
  ],
};

export default topic;
