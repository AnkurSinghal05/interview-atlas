import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'truthy-falsy',
  title: 'Truthy and falsy',
  level: 'beginner',
  masteryMinutes: 30,
  tags: ['boolean context', '&&', '||', '??'],
  summary: 'Only **eight** values are falsy. Everything else, including `[]`, `{}` and `"0"`, is truthy.',
  keyPoints: [
    {
      title: 'The falsy list',
      text: '`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` and `NaN`. Learn these; everything else is truthy.',
    },
    {
      title: 'Surprising truthy values',
      text: '`"0"`, `"false"`, `" "`, `[]`, `{}` and `function(){}` are all truthy.',
    },
    {
      title: '`&&` and `||` return a value, not a boolean',
      text: '`a || b` returns the first truthy value (or the last one). `a && b` returns the first falsy value (or the last one).',
      code: c(`
'' || 'default'   // "default"
'hi' && 42        // 42
0 && 'never'      // 0`),
    },
    {
      title: '`??` only skips null and undefined',
      text: 'Use `??` for defaults when `0` or `""` are valid values that `||` would wrongly replace.',
      code: c(`
0 || 10   // 10
0 ?? 10   // 0`),
    },
  ],
  qa: [
    {
      q: 'List all falsy values in JavaScript.',
      tag: 'Asked often',
      a: ['`false`, `0`, `-0`, `0n`, `""` (empty string), `null`, `undefined`, `NaN`. (`document.all` is a legacy browser oddity too.)'],
    },
    {
      q: 'Is an empty array truthy or falsy?',
      a: [
        'Truthy. All objects are truthy, even empty ones.',
        'To check for emptiness use `arr.length === 0` or `Object.keys(obj).length === 0`.',
      ],
    },
    {
      q: 'What does `!!value` do?',
      a: ['It converts any value to its boolean equivalent. The first `!` flips it to a boolean, the second flips it back. Same as `Boolean(value)`.'],
    },
    {
      q: 'What is short-circuit evaluation?',
      a: [
        '`a && b` does not evaluate `b` if `a` is falsy; `a || b` does not evaluate `b` if `a` is truthy.',
        'It is used for guards like `user && user.name` and defaults like `name || "Guest"`.',
      ],
    },
    {
      q: 'When should you use `??` instead of `||`?',
      a: [
        'When `0`, `""` or `false` are valid values.',
        '`count || 10` replaces a real `0`; `count ?? 10` only replaces `null`/`undefined`.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(Boolean('0'));
console.log(Boolean([]));
console.log(Boolean(NaN));
console.log(Boolean(' '));`),
      options: ['true\ntrue\nfalse\ntrue', 'false\nfalse\nfalse\nfalse', 'false\ntrue\nfalse\nfalse', 'true\nfalse\nfalse\ntrue'],
      answer: 0,
      explain: 'Non-empty strings (even `"0"` and `" "`) and all objects are truthy. `NaN` is falsy.',
    },
    {
      type: 'output',
      code: c(`
console.log(0 || null || 'hi' || 5);
console.log(1 && 'a' && 0 && 'b');
console.log(null || undefined);`),
      options: ['hi\n0\nundefined', 'true\nfalse\nfalse', 'hi\nb\nnull', '5\n0\nnull'],
      answer: 0,
      explain: '`||` returns the first truthy value. `&&` returns the first falsy value. If none is found, the last value is returned.',
    },
    {
      type: 'output',
      code: c(`
const settings = { volume: 0, title: '' };
console.log(settings.volume || 50);
console.log(settings.volume ?? 50);
console.log(settings.title ?? 'Untitled');`),
      options: ['50\n0\n', '0\n0\nUntitled', '50\n50\nUntitled', '50\n0\nUntitled'],
      answer: 0,
      explain: '`||` treats `0` as missing. `??` keeps `0` and `""` because they are not `null`/`undefined`, so the last line prints an empty string.',
    },
    {
      type: 'output',
      code: c(`
if ([] && {}) console.log('A');
if ([] == false) console.log('B');
if (null) console.log('C');`),
      options: ['A\nB', 'A', 'B', 'A\nB\nC'],
      answer: 0,
      explain: 'Both objects are truthy, so A prints. `[] == false` is coercion, not truthiness: `"" == 0` is true, so B prints too.',
    },
    {
      type: 'output',
      code: c(`
let calls = 0;
const inc = () => ++calls;
false && inc();
true || inc();
null ?? inc();
console.log(calls);`),
      options: ['1', '0', '2', '3'],
      answer: 0,
      explain: 'The first two short-circuit and never call `inc`. `null ?? inc()` has to evaluate the right side.',
    },
    {
      type: 'truefalse',
      statement: '`!!"false"` is `false`.',
      answer: false,
      explain: '`"false"` is a non-empty string, so it is truthy. `!!"false"` is `true`.',
    },
  ],
};

export default topic;
