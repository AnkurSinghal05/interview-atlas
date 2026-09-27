import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'symbols',
  title: 'Symbols',
  level: 'advanced',
  masteryMinutes: 45,
  tags: ['unique keys', 'Symbol.for', 'well-known symbols', 'Symbol.iterator'],
  summary: 'A `Symbol` is a unique primitive, mostly used as a property key that cannot clash with any other key.',
  keyPoints: [
    {
      title: 'Always unique',
      text: '`Symbol("id") !== Symbol("id")`. The description is only a label for debugging.',
    },
    {
      title: 'Hidden from normal enumeration',
      text: 'Symbol keys are skipped by `for...in`, `Object.keys` and `JSON.stringify`. `Object.getOwnPropertySymbols` or `Reflect.ownKeys` find them.',
    },
    {
      title: 'Global registry',
      text: '`Symbol.for("app.id")` returns the same symbol everywhere (even across iframes) for that key.',
    },
    {
      title: 'Well-known symbols hook into the language',
      text: '`Symbol.iterator` (for...of), `Symbol.toPrimitive` (coercion), `Symbol.asyncIterator`, `Symbol.hasInstance` (instanceof).',
      code: c(`
const money = {
  amount: 5,
  [Symbol.toPrimitive](hint) { return hint === 'string' ? '$5' : 5; },
};
\`\${money}\`; // "$5"
money * 2;   // 10`),
    },
  ],
  comparisons: [
    {
      items: ['`Symbol(desc)`', '`Symbol.for(key)`'],
      rows: [
        { aspect: 'Each call', values: ['Makes a brand-new unique symbol', 'Returns the one symbol registered for that key'], key: true },
        { aspect: 'Same description twice', values: ["`Symbol('a') === Symbol('a')` is `false`", "`Symbol.for('a') === Symbol.for('a')` is `true`"] },
        { aspect: 'Across iframes and workers', values: ['Not shared', 'Shared (global registry)'] },
        { aspect: '`Symbol.keyFor(s)`', values: ['`undefined`', 'The key'] },
        { aspect: 'Usable as `WeakMap` key', values: ['Yes', 'No'] },
      ],
      reveal: 'The description is just a label. Uniqueness comes from the call: `Symbol()` always creates, `Symbol.for()` looks up first.',
      whenToUse: ['Private-ish keys and collision-free property names inside one module.', 'A symbol that separate pieces of code (or realms) must agree on.'],
    },
  ],
  qa: [
    {
      q: 'What is a Symbol used for?',
      tag: 'Asked often',
      a: [
        'Unique property keys that cannot collide, e.g. adding metadata to objects you do not own.',
        'Customising built-in behaviour through well-known symbols like `Symbol.iterator`.',
      ],
    },
    {
      q: 'Are symbol properties private?',
      a: ['No. They are hidden from common enumeration but can be listed with `Object.getOwnPropertySymbols`. Use `#private` fields for real privacy.'],
    },
    {
      q: 'What is the difference between `Symbol()` and `Symbol.for()`?',
      a: ['`Symbol()` always makes a new unique symbol. `Symbol.for(key)` looks up a global registry and returns the same symbol for the same key.'],
    },
    {
      q: 'Can you convert a symbol to a string implicitly?',
      a: ['No. `"" + sym` throws a `TypeError`. Use `String(sym)` or `sym.description`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
console.log(Symbol('a') === Symbol('a'));
console.log(Symbol.for('a') === Symbol.for('a'));`),
      options: ['false\ntrue', 'true\ntrue', 'false\nfalse', 'true\nfalse'],
      answer: 0,
      explain: 'Every `Symbol()` is unique. `Symbol.for` returns the registered symbol for that key.',
    },
    {
      type: 'output',
      code: c(`
const id = Symbol('id');
const user = { name: 'Ada', [id]: 7 };
console.log(Object.keys(user), JSON.stringify(user), user[id]);`),
      options: ['[ \'name\' ] {"name":"Ada"} 7', '[ \'name\', \'id\' ] {"name":"Ada","id":7} 7', '[ \'name\' ] {"name":"Ada"} undefined', "[ 'name', Symbol(id) ] {\"name\":\"Ada\"} 7"],
      answer: 0,
      explain: 'Symbol keys are skipped by `Object.keys` and JSON, but still readable directly.',
    },
    {
      type: 'output',
      code: c(`
const s = Symbol('tag');
try {
  console.log('x' + s);
} catch (e) {
  console.log(e.name, String(s), s.description);
}`),
      options: ['TypeError Symbol(tag) tag', 'xSymbol(tag)', 'TypeError tag tag', 'x[object Symbol]'],
      answer: 0,
      explain: 'Implicit string conversion of a symbol throws. `String()` and `.description` are the safe ways.',
    },
    {
      type: 'output',
      code: c(`
const countdown = {
  *[Symbol.iterator]() {
    yield 3; yield 2; yield 1;
  },
};
console.log([...countdown]);`),
      options: ['[ 3, 2, 1 ]', '[]', 'TypeError', '[ 1, 2, 3 ]'],
      answer: 0,
      explain: 'Defining `Symbol.iterator` makes any object work with spread and `for...of`.',
    },
    {
      type: 'output',
      code: c(`
console.log(typeof Symbol(), typeof Symbol.iterator);`),
      options: ['symbol symbol', 'object symbol', 'symbol object', 'function symbol'],
      answer: 0,
      explain: 'Symbols are a primitive type, including the built-in well-known ones.',
    },
  ],
};

export default topic;
