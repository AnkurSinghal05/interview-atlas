import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'destructuring-spread',
  title: 'Destructuring and spread',
  level: 'beginner',
  masteryMinutes: 45,
  tags: ['destructuring', 'spread', 'rest', 'defaults', 'swap'],
  summary: 'Destructuring **unpacks** values into variables. Spread **expands** arrays and objects into new ones.',
  keyPoints: [
    {
      title: 'Arrays by position, objects by name',
      text: 'Array patterns match by index; object patterns match by key and can rename.',
      code: c(`
const [first, , third] = [1, 2, 3];
const { name: userName, age = 18 } = { name: 'Ada' };
// userName = "Ada", age = 18`),
    },
    {
      title: 'Defaults only for `undefined`',
      text: 'Like default parameters, a default applies when the value is `undefined`, not `null`.',
    },
    {
      title: 'Rest collects what is left',
      text: '`const { password, ...safe } = user` removes one key and keeps the rest in a new object.',
    },
    {
      title: 'Spread copies one level',
      text: '`[...arr]` and `{ ...obj }` are shallow copies. Nested objects are still shared.',
    },
  ],
  comparisons: [
    {
      items: ['Rest `...`', 'Spread `...`'],
      rows: [
        { aspect: 'What it does', values: ['Collects many values into one array/object', 'Expands one array/object into many values'], key: true },
        { aspect: 'Where', values: ['Destructuring patterns and parameter lists (receiving side)', 'Function calls, array and object literals (giving side)'], key: true },
        { aspect: 'Position', values: ['Must be last, only once', 'Anywhere, as many times as you like'] },
        { aspect: 'Example', values: ['`const [first, ...others] = arr`', '`Math.max(...arr)`'] },
      ],
      reveal: 'Same three dots, opposite directions. If it is on the left of `=` or in a parameter list, it is rest; otherwise it is spread.',
      whenToUse: ['Variadic functions and pulling out "everything else" (`const { password, ...safe } = user`).', 'Copying and merging arrays/objects and passing an array as arguments.'],
    },
  ],
  qa: [
    {
      q: 'How do you swap two variables without a temp?',
      tag: 'Asked often',
      a: ['`[a, b] = [b, a];`'],
    },
    {
      q: 'What is the difference between spread and rest?',
      a: [
        'Spread (`...x` in a call or literal) expands a collection into items.',
        'Rest (`...x` in a pattern or parameter list) gathers items into an array or object.',
      ],
    },
    {
      q: 'How do you destructure nested objects safely?',
      a: ['Provide defaults at each level so a missing parent does not throw.'],
      code: c(`
const { address: { city } = {} } = user; // no crash if address is missing`),
    },
    {
      q: 'What can you spread?',
      a: [
        'Into arrays / arguments: any **iterable** (arrays, strings, Sets, Maps, generators).',
        'Into object literals: any object\'s own enumerable properties. Spreading `null`/`undefined` into an object is fine; into an array it throws.',
      ],
    },
    {
      q: 'How do you remove a property without mutating the object?',
      a: ['Rest destructuring: `const { secret, ...rest } = obj;` then use `rest`.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const [a, b = 5, ...rest] = [1, undefined, 3, 4];
console.log(a, b, rest);`),
      options: ['1 5 [ 3, 4 ]', '1 undefined [ 3, 4 ]', '1 5 [ undefined, 3, 4 ]', '1 5 3'],
      answer: 0,
      explain: '`undefined` triggers the default. `rest` gathers the remaining items.',
    },
    {
      type: 'output',
      code: c(`
const { x = 1, y = 2 } = { x: null, y: undefined };
console.log(x, y);`),
      options: ['null 2', '1 2', 'null undefined', '1 undefined'],
      answer: 0,
      explain: 'Defaults apply only to `undefined`, so `null` is kept.',
    },
    {
      type: 'output',
      code: c(`
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b);`),
      options: ['2 1', '1 2', '2 2', 'SyntaxError'],
      answer: 0,
      explain: 'The right side builds `[2, 1]`, which is then unpacked into `a` and `b`.',
    },
    {
      type: 'output',
      code: c(`
const user = { id: 1, name: 'Ada', password: 'secret' };
const { password, ...publicUser } = user;
console.log(publicUser, 'password' in user);`),
      options: ["{ id: 1, name: 'Ada' } true", "{ id: 1, name: 'Ada' } false", "{ id: 1, name: 'Ada', password: 'secret' } true", 'SyntaxError'],
      answer: 0,
      explain: 'Rest builds a new object without `password`. The original is not changed.',
    },
    {
      type: 'output',
      code: c(`
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };
copy.a = 100;
copy.nested.b = 200;
console.log(original.a, original.nested.b);`),
      options: ['1 200', '100 200', '1 2', '100 2'],
      answer: 0,
      explain: 'Spread copies only the top level. `nested` still points to the same object.',
    },
    {
      type: 'output',
      code: c(`
console.log([...'hi']);
console.log({ ...'hi' });
console.log([...new Set([1, 1, 2])]);`),
      options: ["[ 'h', 'i' ]\n{ '0': 'h', '1': 'i' }\n[ 1, 2 ]", "[ 'hi' ]\n{}\n[ 1, 1, 2 ]", "[ 'h', 'i' ]\n{}\n[ 1, 2 ]", 'TypeError'],
      answer: 0,
      explain: 'Strings are iterable, and as objects they have index keys. A `Set` drops duplicates.',
    },
    {
      type: 'output',
      code: c(`
const { a: { b: deep } = { b: 'fallback' } } = {};
console.log(deep);`),
      options: ['fallback', 'undefined', 'TypeError', 'b'],
      answer: 0,
      explain: '`a` is missing, so its default object is used and `b` is read from it.',
    },
  ],
};

export default topic;
