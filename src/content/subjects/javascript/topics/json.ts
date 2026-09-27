import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'json',
  title: 'JSON',
  level: 'beginner',
  masteryMinutes: 30,
  tags: ['stringify', 'parse', 'replacer', 'reviver', 'toJSON'],
  summary: '`JSON.stringify` turns data into text, `JSON.parse` turns it back. Anything JSON cannot represent is dropped or changed.',
  keyPoints: [
    {
      title: 'What gets lost',
      text: '`undefined`, functions and symbols are skipped in objects (and become `null` in arrays). `NaN`/`Infinity` become `null`. Dates become strings. Maps and Sets become `{}`.',
    },
    {
      title: 'Circular references throw',
      text: 'An object that refers to itself causes `TypeError: Converting circular structure to JSON`.',
    },
    {
      title: 'Replacer, space, toJSON',
      text: '`stringify(value, replacer, space)` can filter keys and pretty-print. An object\'s `toJSON()` method controls its own output.',
      code: c(`
JSON.stringify({ a: 1, b: 2 }, ['a']);   // '{"a":1}'
JSON.stringify({ a: 1 }, null, 2);       // pretty-printed`),
    },
    {
      title: 'Parse is strict',
      text: 'Keys need double quotes, no trailing commas, no comments. Invalid input throws a `SyntaxError`, so wrap it in `try/catch`.',
    },
  ],
  qa: [
    {
      q: 'Is `JSON.parse(JSON.stringify(obj))` a good deep clone?',
      tag: 'Asked often',
      a: [
        'Only for plain JSON-safe data.',
        'It loses `undefined`, functions, symbols, `Infinity`/`NaN`, turns Dates into strings, Maps/Sets into `{}`, and throws on cycles.',
        'Prefer `structuredClone(obj)`.',
      ],
    },
    {
      q: 'What is a reviver in `JSON.parse`?',
      a: ['A function `(key, value) => newValue` called for every value while parsing, often used to turn date strings back into `Date` objects.'],
    },
    {
      q: 'How do you pretty-print JSON?',
      a: ['`JSON.stringify(data, null, 2)` indents with 2 spaces.'],
    },
    {
      q: 'What does `toJSON` do?',
      a: ['If an object has a `toJSON` method, `stringify` serialises its return value instead. `Date` uses this to produce ISO strings.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const data = { a: undefined, b: () => 1, c: NaN, d: [undefined, 1] };
console.log(JSON.stringify(data));`),
      options: ['{"c":null,"d":[null,1]}', '{"a":null,"b":null,"c":null,"d":[null,1]}', '{"c":NaN,"d":[undefined,1]}', '{"d":[1]}'],
      answer: 0,
      explain: 'Object keys with `undefined` or functions are skipped. In arrays they become `null`. `NaN` becomes `null`.',
    },
    {
      type: 'output',
      code: c(`
const obj = { name: 'x' };
obj.self = obj;
try {
  JSON.stringify(obj);
} catch (e) {
  console.log(e.name);
}`),
      options: ['TypeError', 'RangeError', 'SyntaxError', 'Nothing is logged'],
      answer: 0,
      explain: 'Circular references cannot be represented in JSON, so `stringify` throws a `TypeError`.',
    },
    {
      type: 'output',
      code: c(`
const copy = JSON.parse(JSON.stringify({ when: new Date(0) }));
console.log(typeof copy.when);`),
      options: ['string', 'object', 'number', 'undefined'],
      answer: 0,
      explain: 'Dates serialise to ISO strings via `toJSON`, and `parse` does not turn them back into Dates.',
    },
    {
      type: 'output',
      code: c(`
const user = {
  name: 'Ada',
  password: 'secret',
  toJSON() { return { name: this.name }; },
};
console.log(JSON.stringify(user));`),
      options: ['{"name":"Ada"}', '{"name":"Ada","password":"secret"}', '{}', '{"toJSON":{}}'],
      answer: 0,
      explain: '`stringify` uses whatever `toJSON` returns.',
    },
    {
      type: 'output',
      code: c(`
try {
  JSON.parse("{'a': 1}");
} catch (e) {
  console.log(e.name);
}`),
      options: ['SyntaxError', 'TypeError', 'Nothing is logged', 'ReferenceError'],
      answer: 0,
      explain: 'JSON requires double-quoted keys and strings.',
    },
    {
      type: 'output',
      code: c(`
const json = JSON.stringify({ a: 1, b: 2, c: 3 }, (key, value) =>
  key === 'b' ? undefined : value
);
console.log(json);`),
      options: ['{"a":1,"c":3}', '{"a":1,"b":null,"c":3}', '{"a":1,"b":2,"c":3}', 'undefined'],
      answer: 0,
      explain: 'Returning `undefined` from a replacer function drops that key.',
    },
  ],
};

export default topic;
