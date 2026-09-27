import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'object-methods',
  title: 'Working with objects',
  level: 'beginner',
  tags: ['Object.keys', 'entries', 'assign', 'for...in', 'computed keys'],
  summary: 'The everyday toolkit: create, loop over, merge and transform objects with `Object.*` helpers.',
  keyPoints: [
    {
      title: 'keys, values, entries',
      text: 'Each returns an array of the object\'s **own enumerable** string keys, values or `[key, value]` pairs.',
      code: c(`
const p = { x: 1, y: 2 };
Object.entries(p); // [['x', 1], ['y', 2]]
Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v * 10]));
// { x: 10, y: 20 }`),
    },
    {
      title: 'Key order',
      text: 'Integer-like keys come first in ascending order, then string keys in insertion order, then symbols.',
    },
    {
      title: 'Merging',
      text: '`Object.assign(target, ...sources)` and `{ ...a, ...b }` copy own enumerable props; later sources win. Both are shallow.',
    },
    {
      title: 'Keys are strings (or symbols)',
      text: 'Any other key is converted to a string. `obj[1]` and `obj["1"]` are the same property, and an object key becomes `"[object Object]"`.',
    },
  ],
  qa: [
    {
      q: 'What are the different ways to create objects in JavaScript?',
      tag: 'Asked often',
      a: [
        'Object literal: `{ name: "Ada" }`.',
        'Constructor function with `new`: `new Person("Ada")`.',
        '`class` syntax: `new User("Ada")`.',
        '`Object.create(proto)` to choose the prototype (or `null` for none).',
        'Factory function that returns a literal: `createUser("Ada")`.',
        '`Object.assign({}, ...)`, `Object.fromEntries(...)`, `structuredClone(...)` to build from other data.',
      ],
    },
    {
      q: 'How do you iterate over array items?',
      a: [
        'Classic `for (let i = 0; i < arr.length; i++)`: fastest control, can `break`.',
        '`arr.forEach(cb)`: simple, cannot `break` or `await` properly.',
        '`for (const item of arr)`: readable, supports `break`, `continue` and `await`.',
        '`for (const [i, item] of arr.entries())`: when you need the index too.',
        'Avoid `for...in` on arrays: it iterates keys as strings and includes inherited enumerable properties.',
      ],
    },
    {
      q: 'What are the ways to loop over an object?',
      tag: 'Asked often',
      a: [
        '`for...in`: own **and inherited** enumerable keys (filter with `Object.hasOwn`).',
        '`Object.keys/values/entries` with `for...of` or array methods: own enumerable keys only.',
        '`Reflect.ownKeys`: all own keys, including non-enumerable and symbols.',
      ],
    },
    {
      q: 'How do you check if an object has a property?',
      a: [
        '`Object.hasOwn(obj, key)` or `obj.hasOwnProperty(key)`: own properties only.',
        '`key in obj`: also inherited ones.',
        '`obj.key !== undefined` fails when the value is actually `undefined`.',
      ],
    },
    {
      q: 'How do you check if an object is empty?',
      a: ['`Object.keys(obj).length === 0` (for plain objects). `JSON.stringify(obj) === "{}"` also works but is slower.'],
    },
    {
      q: 'What are computed property names and shorthand?',
      a: ['`{ [key]: value }` uses an expression as the key. `{ name }` is shorthand for `{ name: name }`, and `{ hi() {} }` for a method.'],
    },
    {
      q: 'Does `Object.assign` deep-copy?',
      a: ['No. It copies top-level values, so nested objects are shared. See the Shallow vs deep copy topic.'],
    },
    {
      q: 'How do you group an array of objects by a key?',
      tag: 'Coding',
      a: ['Use `Object.groupBy` (ES2024) or `reduce`.'],
      code: c(`
const byRole = users.reduce((acc, u) => {
  (acc[u.role] ??= []).push(u);
  return acc;
}, {});`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const obj = { b: 1, 2: 'two', a: 2, 1: 'one' };
console.log(Object.keys(obj));`),
      options: ["[ '1', '2', 'b', 'a' ]", "[ 'b', '2', 'a', '1' ]", "[ 'a', 'b', '1', '2' ]", "[ 1, 2, 'b', 'a' ]"],
      answer: 0,
      explain: 'Integer-like keys come first in ascending order, then other strings in insertion order. All keys are strings.',
    },
    {
      type: 'output',
      code: c(`
const a = {};
const k1 = { id: 1 };
const k2 = { id: 2 };
a[k1] = 'first';
a[k2] = 'second';
console.log(a[k1]);`),
      options: ['second', 'first', 'undefined', 'TypeError'],
      answer: 0,
      explain: 'Both object keys become the string `"[object Object]"`, so the second write overwrites the first. Use a `Map` for object keys.',
    },
    {
      type: 'output',
      code: c(`
const defaults = { theme: 'light', size: 'm' };
const user = { size: 'l' };
const merged = { ...defaults, ...user, theme: undefined };
console.log(merged);`),
      options: ["{ theme: undefined, size: 'l' }", "{ theme: 'light', size: 'l' }", "{ size: 'l' }", "{ theme: 'light', size: 'm' }"],
      answer: 0,
      explain: 'Later properties win, even when the later value is `undefined`. The key keeps its first position.',
    },
    {
      type: 'output',
      code: c(`
const parent = { inherited: 1 };
const child = Object.create(parent);
child.own = 2;
const seen = [];
for (const k in child) seen.push(k);
console.log(seen, Object.keys(child));`),
      options: ["[ 'own', 'inherited' ] [ 'own' ]", "[ 'own' ] [ 'own' ]", "[ 'own', 'inherited' ] [ 'own', 'inherited' ]", "[ 'inherited', 'own' ] [ 'own' ]"],
      answer: 0,
      explain: '`for...in` also walks inherited enumerable properties; `Object.keys` does not.',
    },
    {
      type: 'output',
      code: c(`
const key = 'color';
const car = { [key]: 'red', [\`\${key}Code\`]: 'R' };
console.log(car);`),
      options: ["{ color: 'red', colorCode: 'R' }", "{ key: 'red', keyCode: 'R' }", "{ '[key]': 'red' }", 'SyntaxError'],
      answer: 0,
      explain: 'Square brackets in an object literal evaluate the expression and use the result as the key.',
    },
    {
      type: 'output',
      code: c(`
const prices = { apple: 2, pear: 3 };
const doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);
console.log(doubled);`),
      options: ['{ apple: 4, pear: 6 }', "[ [ 'apple', 4 ], [ 'pear', 6 ] ]", '{ apple: 2, pear: 3 }', '[ 4, 6 ]'],
      answer: 0,
      explain: '`entries` → `map` → `fromEntries` is the standard way to transform an object\'s values.',
    },
  ],
};

export default topic;
