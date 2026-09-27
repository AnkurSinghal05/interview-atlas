import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'equality',
  title: '== vs ===',
  level: 'beginner',
  masteryMinutes: 45,
  tags: ['loose equality', 'strict equality', 'Object.is'],
  summary: '`===` compares type and value with no conversion. `==` converts types first, following a short list of rules.',
  keyPoints: [
    {
      title: '`===` never converts',
      text: 'Different types are never strictly equal. `1 === "1"` is `false`.',
    },
    {
      title: '`==` converts, then compares',
      text: 'Booleans become numbers, strings compared with numbers become numbers, objects become primitives. `null` and `undefined` only equal each other.',
      code: c(`
1 == '1'          // true
0 == ''           // true
null == 0         // false
null == undefined // true`),
    },
    {
      title: 'Objects compare by identity',
      text: 'Two objects are equal only if they are the same object in memory, with either operator.',
      code: c(`
{} === {}   // false
[1] == [1]  // false
const a = []; a === a // true`),
    },
    {
      title: '`Object.is` fixes two edge cases',
      text: 'It works like `===` except `Object.is(NaN, NaN)` is `true` and `Object.is(0, -0)` is `false`.',
    },
  ],
  comparisons: [
    {
      items: ['`==`', '`===`', '`Object.is`'],
      rows: [
        { aspect: 'Converts types first', values: ['Yes', 'No', 'No'], key: true },
        { aspect: "`1` vs `'1'`", values: ['`true`', '`false`', '`false`'] },
        { aspect: '`null` vs `undefined`', values: ['`true`', '`false`', '`false`'] },
        { aspect: '`NaN` vs `NaN`', values: ['`false`', '`false`', '`true`'], key: true },
        { aspect: '`+0` vs `-0`', values: ['`true`', '`true`', '`false`'], key: true },
        { aspect: 'Two objects', values: ['Same reference only', 'Same reference only', 'Same reference only'] },
        { aspect: 'Spec name', values: ['Loose equality', 'Strict equality', 'SameValue'] },
      ],
      reveal:
        '`===` is `==` without the type conversion. `Object.is` is `===` with two edge cases fixed: `NaN` equals itself and `+0` is not `-0`. None of them compare objects by content.',
      whenToUse: [
        'Only for `x == null`, which checks `null` and `undefined` in one go.',
        'The default for every comparison.',
        'When `NaN` or `-0` matter. React uses it to decide whether state changed.',
      ],
    },
  ],
  qa: [
    {
      q: 'What is the difference between `==` and `===`?',
      tag: 'Asked often',
      a: [
        '`===` (strict) checks type and value without converting.',
        '`==` (loose) converts the operands to a common type first.',
        'Use `===` by default. A common exception is `x == null`, which checks for both `null` and `undefined`.',
      ],
    },
    {
      q: 'What are the rules `==` follows?',
      a: [
        'Same type: compare like `===`.',
        '`null == undefined` is true; neither equals anything else.',
        'Number vs string: the string becomes a number.',
        'Boolean vs anything: the boolean becomes a number first.',
        'Object vs primitive: the object becomes a primitive.',
      ],
    },
    {
      q: 'Why is `NaN === NaN` false and how do you check for `NaN`?',
      a: [
        'By the IEEE-754 standard, `NaN` is not equal to anything, including itself.',
        'Use `Number.isNaN(x)` or `Object.is(x, NaN)`. The global `isNaN("abc")` is `true` because it converts first, so avoid it.',
      ],
    },
    {
      q: 'How do you compare two objects by content?',
      a: [
        'There is no built-in deep equality.',
        'Write a recursive compare, use a library such as lodash `isEqual`, or for simple data compare `JSON.stringify` output (key order matters).',
      ],
    },
    {
      q: 'What does `Object.is` do differently from `===`?',
      a: ['`Object.is(NaN, NaN)` is `true` and `Object.is(+0, -0)` is `false`. Everything else matches `===`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(0 == '');
console.log(0 == '0');
console.log('' == '0');`),
      options: ['true\ntrue\nfalse', 'true\ntrue\ntrue', 'false\ntrue\nfalse', 'false\nfalse\nfalse'],
      answer: 0,
      explain: 'The first two convert the string to a number (0). The last compares two strings directly, and `""` is not `"0"`. `==` is not transitive.',
    },
    {
      type: 'output',
      code: c(`
console.log(null == 0);
console.log(null >= 0);
console.log(undefined == null);`),
      options: ['false\ntrue\ntrue', 'true\ntrue\ntrue', 'false\nfalse\ntrue', 'false\ntrue\nfalse'],
      answer: 0,
      explain: '`==` treats `null` specially (equal only to `undefined`), but `>=` converts `null` to `0`, so `0 >= 0` is true.',
    },
    {
      type: 'output',
      code: c(`
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log(Object.is(0, -0));`),
      options: ['false\ntrue\nfalse', 'true\ntrue\ntrue', 'false\nfalse\nfalse', 'false\ntrue\ntrue'],
      answer: 0,
      explain: '`NaN` is never `===` to itself, but `Object.is` treats it as equal and tells `0` and `-0` apart.',
    },
    {
      type: 'output',
      code: c(`
const a = [1, 2];
const b = [1, 2];
const c = a;
console.log(a == b, a === c, a == '1,2');`),
      options: ['false true true', 'true true true', 'false true false', 'true false true'],
      answer: 0,
      explain: 'Different arrays are never equal. `c` is the same array as `a`. Against a string, the array converts to `"1,2"`.',
    },
    {
      type: 'output',
      code: c(`
console.log(true == '1');
console.log(true == 'true');
console.log(false == []);`),
      options: ['true\nfalse\ntrue', 'true\ntrue\nfalse', 'false\nfalse\ntrue', 'true\ntrue\ntrue'],
      answer: 0,
      explain: 'The boolean becomes a number first: `1 == "1"` is true, `1 == "true"` is `1 == NaN`, false. `0 == []` becomes `0 == ""` then `0 == 0`.',
    },
    {
      type: 'mcq',
      question: 'Which check is true for both `null` and `undefined` and nothing else?',
      options: ['`x === null`', '`x == null`', '`!x`', '`typeof x === "undefined"`'],
      answer: 1,
      explain: 'Loose equality with `null` matches exactly `null` and `undefined`. `!x` also matches `0`, `""` and `false`.',
    },
  ],
};

export default topic;
