import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'type-coercion',
  title: 'Type coercion',
  level: 'intermediate',
  masteryMinutes: 90,
  tags: ['implicit conversion', 'ToPrimitive', '+ operator'],
  summary: 'JavaScript silently converts values to **string**, **number** or **boolean** when an operator needs a different type.',
  keyPoints: [
    {
      title: '`+` prefers strings',
      text: 'If either side of `+` is a string (after converting objects to primitives), both sides become strings and are joined.',
      code: c(`
1 + '2'    // "12"
'3' - 1    // 2   (minus only does maths)
true + 1   // 2`),
    },
    {
      title: 'Other maths operators prefer numbers',
      text: '`-`, `*`, `/`, `%` and unary `+` convert both sides to numbers. `Number("")` is 0, `Number("abc")` is `NaN`.',
    },
    {
      title: 'Objects become primitives first',
      text: 'An object is turned into a primitive with `valueOf()` or `toString()`. `[]` becomes `""`, `{}` becomes `"[object Object]"`.',
      code: c(`
[] + []   // ""
[] + {}   // "[object Object]"
[1,2] + 3 // "1,23"`),
    },
    {
      title: 'Explicit beats implicit',
      text: 'Prefer `Number(x)`, `String(x)` and `Boolean(x)` in real code so the conversion is visible.',
    },
  ],
  qa: [
    {
      q: 'What is the difference between implicit and explicit coercion?',
      a: [
        '**Explicit:** you call `Number()`, `String()`, `Boolean()`, `parseInt()` yourself.',
        '**Implicit:** an operator converts for you, e.g. `"5" * 2` or `if (value)`.',
      ],
    },
    {
      q: 'Why does `"5" + 3` give `"53"` but `"5" - 3` give `2`?',
      tag: 'Asked often',
      a: [
        '`+` is also string concatenation, so if one side is a string the other is converted to a string.',
        '`-` only means subtraction, so both sides are converted to numbers.',
      ],
    },
    {
      q: 'How does an object get converted to a primitive?',
      a: [
        'JS calls `Symbol.toPrimitive` if present.',
        'Otherwise, for a number hint it tries `valueOf()` then `toString()`; for a string hint it tries `toString()` first.',
        '`+` and `==` use the "default" hint, which behaves like the number hint for most objects (Dates prefer string).',
      ],
      code: c(`
const price = { valueOf: () => 42 };
price + 1;     // 43
\`\${price}\`;   // "[object Object]" (string hint uses toString)`),
    },
    {
      q: 'What is the difference between `Number()` and `parseInt()`?',
      a: [
        '`Number("12px")` is `NaN`: the whole string must be numeric.',
        '`parseInt("12px")` is `12`: it reads digits until it hits a non-digit.',
        '`Number("")` is `0` while `parseInt("")` is `NaN`.',
        'Always pass a radix: `parseInt(str, 10)`.',
      ],
    },
    {
      q: 'Why does `[] == ![]` evaluate to `true`?',
      tag: 'Trick question',
      a: [
        '`![]` is `false` because `[]` is truthy.',
        'Now `[] == false`: the boolean becomes `0`, `[]` becomes `""`, then `0`.',
        '`0 == 0` is `true`.',
      ],
    },
    {
      q: 'Why does `["1", "2", "3"].map(parseInt)` return `[1, NaN, NaN]`?',
      tag: 'Trick question',
      a: [
        '`map` passes `(value, index)`, so the calls are `parseInt("1", 0)`, `parseInt("2", 1)`, `parseInt("3", 2)`.',
        'Radix 0 means "guess" (10), radix 1 is invalid, and `3` is not a digit in base 2.',
        'Use `.map(Number)` or `.map((s) => parseInt(s, 10))`.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(1 + '2' + 3);
console.log(1 + 2 + '3');
console.log('3' - '1' + 1);`),
      options: ['123\n33\n3', '6\n33\n3', '123\n123\n21', '15\n33\n3'],
      answer: 0,
      explain: 'Evaluation is left to right. Once a string appears, `+` concatenates. `"3" - "1"` is numeric 2, then `2 + 1` is 3.',
    },
    {
      type: 'output',
      code: c(`
console.log([] + []);
console.log([] + {});
console.log([1, 2] + [3]);`),
      options: ['\n[object Object]\n1,23', '[]\n[object Object]\n[1,2,3]', '0\nNaN\n6', 'undefined\n{}\n1,2,3'],
      answer: 0,
      explain: '`[]` becomes `""`, `{}` becomes `"[object Object]"`, and `[1,2]` becomes `"1,2"`. The first line prints an empty string.',
    },
    {
      type: 'output',
      code: c(`
console.log(true + true);
console.log('5' * '2');
console.log(+'');
console.log(+'abc');`),
      options: ['2\n10\n0\nNaN', 'truetrue\n52\n0\nNaN', '2\n10\nNaN\nNaN', '1\n10\n0\n0'],
      answer: 0,
      explain: '`true` is 1, `*` converts strings to numbers, empty string is 0, and a non-numeric string is `NaN`.',
    },
    {
      type: 'output',
      code: c(`
console.log(['1', '2', '3'].map(parseInt));`),
      options: ['[ 1, NaN, NaN ]', '[ 1, 2, 3 ]', '[ NaN, NaN, NaN ]', '[ 1, 2, NaN ]'],
      answer: 0,
      explain: '`parseInt` receives the index as its radix: base 0 (auto), base 1 (invalid) and base 2 (no digit 3).',
    },
    {
      type: 'output',
      code: c(`
const obj = {
  valueOf() { return 10; },
  toString() { return 'obj'; },
};
console.log(obj + 5);
console.log(\`\${obj}\`);`),
      options: ['15\nobj', 'obj5\nobj', '15\n10', 'NaN\nobj'],
      answer: 0,
      explain: '`+` uses the default hint, so `valueOf()` wins. A template literal asks for a string, so `toString()` wins.',
    },
    {
      type: 'output',
      code: c(`
console.log(parseInt('12px'));
console.log(Number('12px'));
console.log(parseFloat('3.14.15'));`),
      options: ['12\nNaN\n3.14', 'NaN\nNaN\nNaN', '12\n12\n3.1415', '12\nNaN\nNaN'],
      answer: 0,
      explain: '`parseInt`/`parseFloat` stop at the first invalid character. `Number` needs the whole string to be numeric.',
    },
    {
      type: 'truefalse',
      statement: '`[] == ![]` is `true`.',
      answer: true,
      explain: '`![]` is `false`, which becomes `0`. `[]` becomes `""`, which becomes `0`. So `0 == 0`.',
    },
  ],
};

export default topic;
