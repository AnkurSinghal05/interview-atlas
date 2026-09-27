import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'new-keyword',
  title: 'The new keyword',
  level: 'intermediate',
  tags: ['constructor', 'instances', 'Object.create'],
  summary: '`new Fn()` does four things: create an object, link its prototype, run `Fn` with `this` set to it, and return it.',
  keyPoints: [
    {
      title: 'The four steps',
      text: '1. Create an empty object. 2. Set its `[[Prototype]]` to `Fn.prototype`. 3. Call `Fn` with `this` = that object. 4. Return the object, unless `Fn` returns its own object.',
    },
    {
      title: 'Returning from a constructor',
      text: 'Returning an **object** replaces the new instance. Returning a primitive is ignored.',
      code: c(`
function A() { this.x = 1; return { y: 2 }; }
function B() { this.x = 1; return 42; }
new A(); // { y: 2 }
new B(); // { x: 1 }`),
    },
    {
      title: 'Forgetting `new`',
      text: 'Calling a constructor function without `new` runs it as a normal function: `this` is the global object (sloppy) or `undefined` (strict).',
    },
    {
      title: '`new.target`',
      text: 'Inside a function, `new.target` is the constructor when called with `new`, otherwise `undefined`.',
    },
  ],
  qa: [
    {
      q: 'What is the difference between `function Person(){}`, `const person = Person()` and `const person = new Person()`?',
      tag: 'Asked often',
      a: [
        '`function Person(){}` just **declares** a function (by convention, a constructor).',
        '`Person()` **calls** it as a normal function: `this` is the global object (or `undefined` in strict mode), and `person` gets its return value, usually `undefined`.',
        '`new Person()` **constructs** a new object linked to `Person.prototype` and returns it.',
      ],
      code: c(`
function Person(name) { this.name = name; }
const a = Person('Ada');     // undefined (and sets a global in sloppy mode)
const b = new Person('Ada'); // Person { name: 'Ada' }`),
    },
    {
      q: 'What happens when you call a function with `new`?',
      tag: 'Asked often',
      a: [
        'A new empty object is created.',
        'Its prototype is linked to the function\'s `prototype` property.',
        'The function runs with `this` bound to the new object.',
        'The new object is returned, unless the function explicitly returns another object.',
      ],
    },
    {
      q: 'Implement `new` as a function.',
      tag: 'Coding',
      a: ['Recreate the four steps with `Object.create` and `apply`.'],
      code: c(`
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  return result !== null && (typeof result === 'object' || typeof result === 'function')
    ? result
    : obj;
}`),
    },
    {
      q: 'How do you stop a constructor from being called without `new`?',
      a: ['Use a `class` (it throws automatically), or check `new.target` and throw or re-call with `new`.'],
    },
    {
      q: 'Which functions cannot be used with `new`?',
      a: ['Arrow functions, methods defined with shorthand syntax, async functions and generators. They have no `[[Construct]]` behaviour.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function User(name) {
  this.name = name;
}
const u = new User('Ada');
console.log(u.name, u instanceof User);`),
      options: ['Ada true', 'undefined true', 'Ada false', 'TypeError'],
      answer: 0,
      explain: '`new` binds `this` to a fresh object linked to `User.prototype`, then returns it.',
    },
    {
      type: 'output',
      code: c(`
function A() {
  this.a = 1;
  return { b: 2 };
}
function B() {
  this.a = 1;
  return 'ignored';
}
console.log(new A(), new B());`),
      options: ['{ b: 2 } B { a: 1 }', 'A { a: 1 } B { a: 1 }', "{ b: 2 } 'ignored'", 'A { a: 1, b: 2 } B { a: 1 }'],
      answer: 0,
      explain: 'Returning an object replaces the instance. A returned primitive is ignored.',
    },
    {
      type: 'output',
      code: c(`
'use strict';
function Point(x) {
  this.x = x;
}
try {
  Point(1);
} catch (e) {
  console.log(e.name);
}`),
      options: ['TypeError', 'ReferenceError', 'Nothing is logged', 'SyntaxError'],
      answer: 0,
      explain: 'Without `new` in strict mode, `this` is `undefined`, and setting a property on `undefined` throws.',
    },
    {
      type: 'output',
      code: c(`
function Check() {
  return new.target === Check;
}
console.log(Check());
console.log(new Check() instanceof Check);`),
      options: ['false\ntrue', 'true\ntrue', 'false\nfalse', 'undefined\ntrue'],
      answer: 0,
      explain: 'A plain call has `new.target` undefined. With `new`, the returned boolean is a primitive, so it is ignored and the instance is returned.',
    },
    {
      type: 'output',
      code: c(`
const obj = { make() { return 1; } };
try {
  new obj.make();
} catch (e) {
  console.log(e.name);
}`),
      options: ['TypeError', 'Nothing is logged', 'ReferenceError', 'SyntaxError'],
      answer: 0,
      explain: 'Shorthand methods are not constructors, so `new` throws `obj.make is not a constructor`.',
    },
  ],
};

export default topic;
