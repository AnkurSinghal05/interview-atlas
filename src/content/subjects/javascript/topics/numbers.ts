import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'numbers',
  title: 'Numbers, NaN and floating point',
  level: 'beginner',
  masteryMinutes: 45,
  tags: ['IEEE 754', 'NaN', 'precision', 'MAX_SAFE_INTEGER'],
  summary: 'Every `number` is a 64-bit float, which explains `0.1 + 0.2 !== 0.3`, `NaN` and the safe-integer limit.',
  keyPoints: [
    {
      title: 'One number type',
      text: 'Integers and decimals are the same IEEE-754 double. Some decimals like 0.1 cannot be stored exactly.',
      code: c(`
0.1 + 0.2          // 0.30000000000000004
0.1 + 0.2 === 0.3  // false`),
    },
    {
      title: 'Compare decimals with a tolerance',
      text: 'Check that the difference is tiny, or work in whole units like cents.',
      code: c(`Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON // true`),
    },
    {
      title: '`NaN` means "not a valid number"',
      text: 'It comes from failed conversions and invalid maths. It is the only value not equal to itself. Test with `Number.isNaN`.',
    },
    {
      title: 'Safe integers stop at 2^53 − 1',
      text: 'Beyond `Number.MAX_SAFE_INTEGER` (9007199254740991) integers lose precision. Use `BigInt` for larger values.',
    },
  ],
  comparisons: [
    {
      items: ['`Number(x)`', '`+x`', '`parseInt(x, 10)`', '`parseFloat(x)`'],
      rows: [
        { aspect: 'How it reads the string', values: ['Whole string must be a number', 'Same as `Number`', 'Reads digits until the first bad character', 'Same, but keeps decimals'], key: true },
        { aspect: "`'42px'`", values: ['`NaN`', '`NaN`', '`42`', '`42`'] },
        { aspect: "`'3.14'`", values: ['`3.14`', '`3.14`', '`3`', '`3.14`'] },
        { aspect: "`''`", values: ['`0`', '`0`', '`NaN`', '`NaN`'] },
        { aspect: '`null`', values: ['`0`', '`0`', '`NaN`', '`NaN`'] },
        { aspect: "`'1e3'`", values: ['`1000`', '`1000`', '`1`', '`1000`'] },
        { aspect: '`10n` (BigInt)', values: ['`10`', '`TypeError`', '`10`', '`10`'] },
      ],
      reveal: '`Number` and `+` convert the **whole** value strictly; `parseInt` and `parseFloat` **parse** from the left and stop at the first character they do not understand.',
      whenToUse: ['Validating input that must be a number.', 'Short conversion when you know the type.', 'Reading a number out of text like `"42px"`; always pass the radix.', 'Same, when decimals matter.'],
    },
  ],
  qa: [
    {
      q: 'Why does `0.1 + 0.2` not equal `0.3`?',
      tag: 'Asked often',
      a: [
        'Numbers are stored in binary floating point. 0.1 and 0.2 are repeating fractions in binary, so they are stored as close approximations.',
        'The tiny errors add up to `0.30000000000000004`.',
        'Fix: compare with `Number.EPSILON`, round with `toFixed`, or use integers (cents).',
      ],
    },
    {
      q: 'What is the difference between `isNaN` and `Number.isNaN`?',
      a: [
        'Global `isNaN(x)` converts `x` to a number first, so `isNaN("abc")` is `true`.',
        '`Number.isNaN(x)` is `true` only if `x` is actually the `NaN` value.',
      ],
    },
    {
      q: 'What do `1 / 0` and `-1 / 0` give?',
      a: ['`Infinity` and `-Infinity`. Dividing by zero does not throw. `0 / 0` is `NaN`.'],
    },
    {
      q: 'How do you check if a value is an integer?',
      a: ['`Number.isInteger(5.0)` is `true`. Use `Number.isSafeInteger` to also check it is within the safe range.'],
    },
    {
      q: 'What does `toFixed` return?',
      a: ['A **string**, e.g. `(1.005).toFixed(2)` is `"1.00"` (not `"1.01"`, because 1.005 is really 1.00499…). Wrap in `Number()` if you need a number.'],
    },
    {
      q: 'What happens past `Number.MAX_SAFE_INTEGER`?',
      a: ['Integers can no longer be represented exactly, so `2 ** 53 === 2 ** 53 + 1` is `true`. Use `BigInt` (`2n ** 53n + 1n`).'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(0.1 + 0.2 === 0.3);
console.log(0.1 + 0.2);`),
      options: ['false\n0.30000000000000004', 'true\n0.3', 'false\n0.3', 'true\n0.30000000000000004'],
      answer: 0,
      explain: 'Binary floating point cannot store 0.1 or 0.2 exactly, so the sum is slightly off.',
    },
    {
      type: 'output',
      code: c(`
console.log(isNaN('hello'));
console.log(Number.isNaN('hello'));
console.log(NaN === NaN);`),
      options: ['true\nfalse\nfalse', 'false\nfalse\nfalse', 'true\ntrue\nfalse', 'true\nfalse\ntrue'],
      answer: 0,
      explain: 'Global `isNaN` converts `"hello"` to `NaN` first. `Number.isNaN` does not convert. `NaN` never equals itself.',
    },
    {
      type: 'output',
      code: c(`
console.log(1 / 0);
console.log(-1 / 0);
console.log(0 / 0);`),
      options: ['Infinity\n-Infinity\nNaN', 'Error', 'Infinity\nInfinity\n0', 'NaN\nNaN\nNaN'],
      answer: 0,
      explain: 'Division by zero gives signed infinities. `0 / 0` is undefined mathematically, so it is `NaN`.',
    },
    {
      type: 'output',
      code: c(`
console.log(typeof (0.5).toFixed(1));
console.log((1.005).toFixed(2));`),
      options: ['string\n1.00', 'number\n1.01', 'string\n1.01', 'number\n1.00'],
      answer: 0,
      explain: '`toFixed` returns a string. 1.005 is stored as 1.00499999…, so it rounds down.',
    },
    {
      type: 'output',
      code: c(`
const big = Number.MAX_SAFE_INTEGER;
console.log(big + 1 === big + 2);
console.log(9007199254740993n + 1n);`),
      options: ['true\n9007199254740994n', 'false\n9007199254740994n', 'true\n9007199254740994', 'false\nTypeError'],
      answer: 0,
      explain: 'Past the safe range, `big + 1` and `big + 2` round to the same double. `BigInt` stays exact.',
    },
    {
      type: 'output',
      code: c(`
console.log(Math.max());
console.log(Math.min());
console.log([10, 1, 2].sort());`),
      options: ['-Infinity\nInfinity\n[ 1, 10, 2 ]', 'undefined\nundefined\n[ 1, 2, 10 ]', '0\n0\n[ 1, 2, 10 ]', 'Infinity\n-Infinity\n[ 1, 10, 2 ]'],
      answer: 0,
      explain: '`Math.max()` with no arguments starts from `-Infinity`. `sort()` compares as strings by default, so `"10"` comes before `"2"`.',
    },
  ],
};

export default topic;
