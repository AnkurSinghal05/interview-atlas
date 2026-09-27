import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'optional-chaining',
  title: 'Optional chaining and ??',
  level: 'beginner',
  masteryMinutes: 30,
  tags: ['?.', '??', '??=', '||=', '&&='],
  summary: '`?.` stops and returns `undefined` when the left side is `null`/`undefined`. `??` gives a fallback only for those two values.',
  keyPoints: [
    {
      title: '`?.` guards property access',
      text: 'If the value before `?.` is `null` or `undefined`, the whole chain returns `undefined` instead of throwing.',
      code: c(`
const user = null;
user?.address?.city   // undefined
user.address          // TypeError`),
    },
    {
      title: 'Works for calls and brackets too',
      text: '`obj.method?.()` calls only if the method exists. `arr?.[0]` reads only if `arr` exists.',
    },
    {
      title: '`??` vs `||`',
      text: '`??` falls back only on `null`/`undefined`. `||` falls back on any falsy value, including `0` and `""`.',
    },
    {
      title: 'Logical assignment',
      text: '`a ??= b` assigns only if `a` is nullish. `a ||= b` if falsy. `a &&= b` if truthy.',
      code: c(`
const opts = { retries: 0 };
opts.retries ??= 3; // stays 0
opts.timeout ??= 1000; // set to 1000`),
    },
  ],
  comparisons: [
    {
      items: ['`||`', '`??`'],
      rows: [
        { aspect: 'Falls back when the left side is', values: ['Any falsy value: `0`, `\'\'`, `false`, `NaN`, `null`, `undefined`', 'Only `null` or `undefined`'], key: true },
        { aspect: '`0 ... 10`', values: ['`10`', '`0`'] },
        { aspect: "`'' ... 'N/A'`", values: ["`'N/A'`", "`''`"] },
        { aspect: 'Mixed with `&&` without brackets', values: ['Allowed', '`SyntaxError`'] },
        { aspect: 'Assignment form', values: ['`a ||= b`', '`a ??= b`'] },
      ],
      reveal: '`||` treats every falsy value as missing, `??` only treats **nothing** as missing. That is why `??` is safe for counts, prices and empty strings.',
      whenToUse: ['When `0`, `\'\'` and `false` really should be replaced.', 'Defaults for config and API data where `0` or `\'\'` are valid values.'],
    },
  ],
  qa: [
    {
      q: 'What does optional chaining do?',
      tag: 'Asked often',
      a: [
        'It short-circuits: if the value before `?.` is `null` or `undefined`, evaluation stops and the result is `undefined`.',
        'It replaces long guards like `a && a.b && a.b.c`.',
      ],
    },
    {
      q: 'Can you use `?.` on the left side of an assignment?',
      a: ['No. `user?.name = "x"` is a SyntaxError. Optional chaining is read-only.'],
    },
    {
      q: 'What is the difference between `??` and `||`?',
      tag: 'Asked often',
      a: [
        '`a || b` returns `b` if `a` is **falsy** (`0`, `""`, `false`, `NaN`, `null`, `undefined`).',
        '`a ?? b` returns `b` only if `a` is **nullish** (`null` or `undefined`).',
      ],
      code: c(`
const port = 0;
port || 3000 // 3000  (bug if 0 is valid)
port ?? 3000 // 0`),
    },
    {
      q: 'Can you mix `??` with `||` or `&&`?',
      a: ['Not without parentheses. `a || b ?? c` is a SyntaxError; write `(a || b) ?? c`.'],
    },
    {
      q: 'Does `?.` protect against a property that exists but is not a function?',
      a: ['No. `obj.name?.()` still throws a `TypeError` if `name` is a string. It only skips `null`/`undefined`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const user = { profile: null };
console.log(user.profile?.name);
console.log(user.settings?.theme ?? 'light');`),
      options: ['undefined\nlight', 'null\nlight', 'TypeError', 'undefined\nundefined'],
      answer: 0,
      explain: '`profile` is `null`, so the chain returns `undefined`. `settings` is missing, so `??` supplies the default.',
    },
    {
      type: 'output',
      code: c(`
const a = 0;
const b = '';
console.log(a || 'x', a ?? 'x');
console.log(b || 'y', b ?? 'y');`),
      options: ['x 0\ny ', '0 0\n ', 'x x\ny y', 'x 0\ny y'],
      answer: 0,
      explain: '`||` skips falsy values; `??` keeps them. The last value printed is the empty string.',
    },
    {
      type: 'output',
      code: c(`
const obj = { greet: () => 'hi' };
console.log(obj.greet?.());
console.log(obj.bye?.());`),
      options: ['hi\nundefined', 'hi\nTypeError', 'undefined\nundefined', 'hi\nnull'],
      answer: 0,
      explain: '`?.()` calls the function if it exists and returns `undefined` if the property is missing.',
    },
    {
      type: 'output',
      code: c(`
let count = 0;
const data = null;
data?.items[count++];
console.log(count);`),
      options: ['0', '1', 'TypeError', 'undefined'],
      answer: 0,
      explain: 'Short-circuiting skips the **entire** rest of the chain, including `count++`.',
    },
    {
      type: 'output',
      code: c(`
const cfg = { a: 0, b: null, c: 5 };
cfg.a ||= 10;
cfg.b ??= 20;
cfg.c &&= 30;
console.log(cfg);`),
      options: ['{ a: 10, b: 20, c: 30 }', '{ a: 0, b: 20, c: 30 }', '{ a: 10, b: null, c: 5 }', '{ a: 0, b: null, c: 30 }'],
      answer: 0,
      explain: '`a` is falsy so `||=` assigns. `b` is nullish so `??=` assigns. `c` is truthy so `&&=` assigns.',
    },
    {
      type: 'truefalse',
      statement: '`user?.name = "Ada"` sets the name when `user` exists.',
      answer: false,
      explain: 'Optional chaining cannot be an assignment target; this line is a SyntaxError.',
    },
  ],
};

export default topic;
