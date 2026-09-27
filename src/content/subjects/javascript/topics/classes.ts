import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'classes',
  title: 'Classes',
  level: 'intermediate',
  tags: ['extends', 'super', 'static', 'private fields', 'getters'],
  summary: '`class` is cleaner syntax over prototypes, plus real extras: private `#fields`, `static` members and strict mode.',
  keyPoints: [
    {
      title: 'Still prototypes underneath',
      text: 'Methods go on `ClassName.prototype`. `typeof MyClass` is `"function"`.',
      code: c(`
class User {
  constructor(name) { this.name = name; }
  hi() { return 'Hi ' + this.name; }
}
typeof User;                     // "function"
User.prototype.hasOwnProperty('hi'); // true`),
    },
    {
      title: '`extends` and `super`',
      text: 'A subclass must call `super()` before using `this` in its constructor. `super.method()` calls the parent version.',
    },
    {
      title: 'Fields, private and static',
      text: 'Class fields are set per instance. `#secret` is truly private. `static` members live on the class itself, not on instances.',
      code: c(`
class Counter {
  #count = 0;
  static created = 0;
  inc() { return ++this.#count; }
}`),
    },
    {
      title: 'Differences from functions',
      text: 'Classes are not hoisted for use (TDZ), always run in strict mode, and throw if called without `new`.',
    },
  ],
  qa: [
    {
      q: 'Are JavaScript classes real classes?',
      tag: 'Asked often',
      a: [
        'They are mostly syntax over constructor functions and prototypes.',
        'But they add things functions cannot do simply: private `#fields`, must-use-`new`, strict mode, and correct subclassing of built-ins like `Array` and `Error`.',
      ],
    },
    {
      q: 'Why must you call `super()` before using `this`?',
      a: ['In a derived class the parent constructor creates the object. Until `super()` runs, `this` does not exist and touching it throws a `ReferenceError`.'],
    },
    {
      q: 'What are static methods used for?',
      a: ['Helpers that belong to the class rather than an instance, such as factories (`User.fromJSON`) or utilities (`Array.isArray`). Instances cannot call them directly.'],
    },
    {
      q: 'How are private fields different from the `_underscore` convention?',
      a: [
        '`_name` is just a naming hint; anyone can read it.',
        '`#name` is enforced by the language: access from outside the class is a SyntaxError, and it does not show up in `Object.keys` or JSON.',
      ],
    },
    {
      q: 'What are getters and setters in a class?',
      a: ['Methods that look like properties. They run code on read (`get`) or write (`set`).'],
      code: c(`
class Temp {
  #c = 0;
  get f() { return this.#c * 9 / 5 + 32; }
  set f(v) { this.#c = (v - 32) * 5 / 9; }
}`),
    },
    {
      q: 'Where do class fields live vs methods?',
      a: [
        'Fields (`count = 0`) are created on **each instance**.',
        'Methods (`inc() {}`) are on the **prototype** and shared.',
        'An arrow function field (`handle = () => {}`) is per instance, which costs memory but keeps `this` bound.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + ' makes a sound'; }
}
class Dog extends Animal {
  speak() { return super.speak() + ' (woof)'; }
}
console.log(new Dog('Rex').speak());`),
      options: ['Rex makes a sound (woof)', 'Rex (woof)', 'undefined makes a sound (woof)', 'TypeError'],
      answer: 0,
      explain: 'The inherited constructor sets `name`, and `super.speak()` calls the parent method with the same `this`.',
    },
    {
      type: 'output',
      code: c(`
class A {
  static create() { return new this(); }
  whoami() { return this.constructor.name; }
}
class B extends A {}
console.log(B.create().whoami());
console.log(typeof new A().create);`),
      options: ['B\nundefined', 'A\nundefined', 'B\nfunction', 'A\nfunction'],
      answer: 0,
      explain: 'Inside a static method called as `B.create()`, `this` is `B`. Static methods are not on instances.',
    },
    {
      type: 'output',
      code: c(`
class Parent {
  constructor() { this.kind = 'parent'; }
}
class Child extends Parent {
  constructor() {
    try { this.x = 1; } catch (e) { console.log(e.name); }
    super();
  }
}
new Child();`),
      options: ['ReferenceError', 'TypeError', 'Nothing is logged', 'SyntaxError'],
      answer: 0,
      explain: 'Using `this` before `super()` in a derived constructor throws a `ReferenceError`.',
    },
    {
      type: 'output',
      code: c(`
class Counter {
  #n = 0;
  inc() { return ++this.#n; }
}
const c = new Counter();
c.inc();
console.log(c.inc(), Object.keys(c), c.n);`),
      options: ['2 [] undefined', '2 [ \'#n\' ] undefined', '1 [] 1', '2 [] 2'],
      answer: 0,
      explain: 'Private fields are invisible to `Object.keys` and to normal property access.',
    },
    {
      type: 'output',
      code: c(`
class Person {
  constructor(first, last) { this.first = first; this.last = last; }
  get full() { return this.first + ' ' + this.last; }
  set full(v) { [this.first, this.last] = v.split(' '); }
}
const p = new Person('Ada', 'King');
p.full = 'Grace Hopper';
console.log(p.first, p.full);`),
      options: ['Grace Grace Hopper', 'Ada Grace Hopper', 'Ada Ada King', 'Grace undefined'],
      answer: 0,
      explain: 'Assigning to `full` runs the setter, which updates `first` and `last`. Reading `full` runs the getter.',
    },
    {
      type: 'output',
      code: c(`
class Foo {}
try {
  Foo();
} catch (e) {
  console.log(e.name);
}
console.log(typeof Foo);`),
      options: ['TypeError\nfunction', 'ReferenceError\nclass', 'TypeError\nclass', 'Nothing\nfunction'],
      answer: 0,
      explain: 'Classes must be called with `new`, and a class is a special kind of function.',
    },
    {
      type: 'output',
      code: c(`
class Btn {
  label = 'ok';
  arrow = () => this.label;
  method() { return this?.label; }
}
const b = new Btn();
const { arrow, method } = b;
console.log(arrow(), method());`),
      options: ['ok undefined', 'ok ok', 'undefined undefined', 'TypeError'],
      answer: 0,
      explain: 'The arrow field captured `this` when the instance was built. The detached method runs with `this` undefined (class bodies are strict).',
    },
  ],
};

export default topic;
