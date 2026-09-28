import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'property-descriptors',
  title: 'Property descriptors',
  level: 'advanced',
  masteryMinutes: 60,
  tags: ['defineProperty', 'writable', 'enumerable', 'configurable', 'freeze', 'seal'],
  summary: 'Every property has hidden flags: **writable**, **enumerable**, **configurable**. `defineProperty` sets them; `freeze` and `seal` flip them in bulk.',
  keyPoints: [
    {
      title: 'The three flags',
      text: '`writable`: can the value change? `enumerable`: does it show in `for...in` and `Object.keys`? `configurable`: can it be deleted or have its flags changed?',
    },
    {
      title: '`defineProperty` defaults to false',
      text: 'Normal assignment makes all flags `true`. `Object.defineProperty` makes every flag you leave out `false`.',
      code: c(`
const o = {};
Object.defineProperty(o, 'id', { value: 1 });
o.id = 2;          // ignored (throws in strict mode)
Object.keys(o);    // []`),
    },
    {
      title: 'Accessor properties',
      text: 'Instead of `value`/`writable`, a property can have `get` and `set` functions that run on read and write.',
    },
    {
      title: 'Locking objects',
      text: '`preventExtensions`: no new props. `seal`: also no delete. `freeze`: also no changes. All are **shallow**.',
    },
  ],
  comparisons: [
    {
      title: 'freeze vs seal vs preventExtensions',
      items: ['`Object.freeze`', '`Object.seal`', '`Object.preventExtensions`'],
      rows: [
        { aspect: 'Add properties', values: ['No', 'No', 'No'] },
        { aspect: 'Delete properties', values: ['No', 'No', 'Yes'], key: true },
        { aspect: 'Change values', values: ['No', 'Yes', 'Yes'], key: true },
        { aspect: 'Reconfigure (e.g. to a getter)', values: ['No', 'No', 'Yes'] },
        { aspect: 'Check with', values: ['`Object.isFrozen`', '`Object.isSealed`', '`Object.isExtensible`'] },
        { aspect: 'Nested objects', values: ['Not affected (shallow)', 'Not affected (shallow)', 'Not affected (shallow)'] },
        { aspect: 'A blocked change', values: ['Ignored; `TypeError` in strict mode', 'Ignored; `TypeError` in strict mode', 'Ignored; `TypeError` in strict mode'] },
      ],
      reveal:
        'Each step is stricter than the last: `preventExtensions` blocks new keys, `seal` also sets every property `configurable: false`, `freeze` also sets `writable: false`. All three are shallow.',
      whenToUse: ['Constants and config objects that must never change (deep-freeze recursively for nested data).', 'Fixed shape, changeable values: a record whose fields can update but not appear or vanish.', 'Rare: stop new keys being added but allow everything else.'],
    },
    {
      items: ['Data descriptor', 'Accessor descriptor'],
      rows: [
        { aspect: 'Own keys', values: ['`value`, `writable`', '`get`, `set`'], key: true },
        { aspect: 'Shared keys', values: ['`enumerable`, `configurable`', '`enumerable`, `configurable`'] },
        { aspect: 'Defaults with `defineProperty`', values: ['All `false`', 'All `false`'] },
        { aspect: 'Defaults when created normally', values: ['All `true`', '`configurable: true`; enumerable in object literals, not in classes'] },
      ],
      reveal: 'A property holds either a value or a getter/setter pair, never both. Mixing `value` and `get` in one descriptor throws a `TypeError`.',
      whenToUse: ['Normal stored values, or read-only constants with `writable: false`.', 'Computed or validated values, lazy loading, logging reads and writes.'],
    },
  ],
  qa: [
    {
      q: 'What is a property descriptor?',
      tag: 'Asked often',
      a: [
        'An object describing a property: either `{ value, writable, enumerable, configurable }` (data property) or `{ get, set, enumerable, configurable }` (accessor property).',
        'Read it with `Object.getOwnPropertyDescriptor(obj, key)`.',
      ],
    },
    {
      q: 'What is the difference between `Object.freeze` and `Object.seal`?',
      tag: 'Asked often',
      a: [
        '`seal`: cannot add or delete properties, but existing values **can** change.',
        '`freeze`: cannot add, delete **or** change values.',
        'Both are shallow: nested objects are still mutable.',
      ],
    },
    {
      q: 'How do you deep-freeze an object?',
      tag: 'Coding',
      a: ['Freeze the object, then recurse into every property that is an object.'],
      code: c(`
function deepFreeze(obj) {
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') deepFreeze(value);
  }
  return Object.freeze(obj);
}`),
    },
    {
      q: 'How do you make a read-only property?',
      a: ['`Object.defineProperty(obj, "key", { value, writable: false })`, or a getter with no setter.'],
    },
    {
      q: 'Why do built-in methods like `Array.prototype.map` not show up in `for...in`?',
      a: ['They are defined as non-enumerable. `for...in` and `Object.keys` only list enumerable properties.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const user = {};
Object.defineProperty(user, 'id', { value: 7 });
user.id = 99;
console.log(user.id, Object.keys(user), JSON.stringify(user));`),
      options: ['7 [] {}', '99 [ \'id\' ] {"id":99}', '7 [ \'id\' ] {"id":7}', 'TypeError'],
      answer: 0,
      explain: 'Omitted flags default to `false`: the property is read-only (the write is silently ignored here) and hidden from `keys` and JSON.',
    },
    {
      type: 'output',
      code: c(`
const cfg = Object.freeze({ level: 1, nested: { on: false } });
cfg.level = 2;
cfg.nested.on = true;
console.log(cfg.level, cfg.nested.on);`),
      options: ['1 true', '2 true', '1 false', '2 false'],
      answer: 0,
      explain: '`freeze` is shallow. `level` cannot change, but the nested object is not frozen.',
    },
    {
      type: 'output',
      code: c(`
const obj = Object.seal({ a: 1 });
obj.a = 2;
obj.b = 3;
delete obj.a;
console.log(obj);`),
      options: ['{ a: 2 }', '{ a: 1 }', '{ a: 2, b: 3 }', '{}'],
      answer: 0,
      explain: 'Sealed objects allow changing existing values but block adding and deleting properties.',
    },
    {
      type: 'output',
      code: c(`
const temp = {
  _c: 25,
  get f() { return this._c * 9 / 5 + 32; },
};
temp.f = 0;
console.log(temp.f);
console.log(Object.getOwnPropertyDescriptor(temp, 'f').set);`),
      options: ['77\nundefined', '0\nundefined', '77\n[Function: set f]', 'TypeError'],
      answer: 0,
      explain: 'A getter with no setter makes the property read-only. The write is ignored in sloppy mode.',
    },
    {
      type: 'output',
      code: c(`
'use strict';
const o = {};
Object.defineProperty(o, 'x', { value: 1, writable: false });
try {
  o.x = 2;
} catch (e) {
  console.log(e.name);
}`),
      options: ['TypeError', 'Nothing is logged', 'ReferenceError', 'SyntaxError'],
      answer: 0,
      explain: 'In strict mode, writing to a non-writable property throws instead of failing silently.',
    },
    {
      type: 'output',
      code: c(`
const o = { a: 1 };
console.log(Object.getOwnPropertyDescriptor(o, 'a'));`),
      options: [
        '{ value: 1, writable: true, enumerable: true, configurable: true }',
        '{ value: 1, writable: false, enumerable: false, configurable: false }',
        '{ value: 1 }',
        'undefined',
      ],
      answer: 0,
      explain: 'Properties created by normal assignment or literals get all flags set to `true`.',
    },
    {
      type: 'truefalse',
      statement: '`Object.freeze` also freezes nested objects.',
      answer: false,
      explain: 'It is shallow. Write a recursive `deepFreeze` if you need nested immutability.',
    },
  ],
};

export default topic;
