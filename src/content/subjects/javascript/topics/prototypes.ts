import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'prototypes',
  title: 'Prototypes and inheritance',
  level: 'intermediate',
  masteryMinutes: 120,
  tags: ['prototype chain', '__proto__', 'Object.create', 'constructor functions'],
  summary: 'Objects inherit by **linking** to another object, their prototype. Missing properties are looked up along that chain.',
  keyPoints: [
    {
      title: 'The lookup chain',
      text: 'Reading `obj.x` checks `obj`, then its prototype, then that object\'s prototype, until it reaches `null`.',
      code: c(`
const animal = { eats: true };
const rabbit = Object.create(animal);
rabbit.eats; // true, found on animal`),
    },
    {
      title: '`prototype` vs `[[Prototype]]`',
      text: 'Every object has a hidden `[[Prototype]]` link (read it with `Object.getPrototypeOf`). Only functions have a `.prototype` property: the object that `new` will link new instances to.',
    },
    {
      title: 'Writes stay on the object',
      text: 'Assigning `obj.x = 1` creates an own property on `obj` and shadows the prototype\'s `x`. The prototype is untouched.',
    },
    {
      title: 'Methods live on the prototype',
      text: 'Putting methods on `Constructor.prototype` means every instance shares one copy instead of each carrying its own.',
    },
  ],
  comparisons: [
    {
      items: ['`F.prototype`', '`obj.__proto__`'],
      rows: [
        { aspect: 'Found on', values: ['Functions and classes', 'Every object (an accessor from `Object.prototype`)'], key: true },
        { aspect: 'It is', values: ['The object that instances made with `new F()` will inherit from', 'The object this object inherits from right now (its `[[Prototype]]`)'], key: true },
        { aspect: 'Link between them', values: ['`new F().__proto__ === F.prototype`', '`new F().__proto__ === F.prototype`'] },
        { aspect: 'Modern API', values: ['Same', '`Object.getPrototypeOf` / `Object.setPrototypeOf`'] },
      ],
      reveal: '`prototype` is a blueprint a constructor hands out; `__proto__` is the link each object actually follows when a property lookup misses.',
      whenToUse: ['Adding shared methods to all instances of a constructor.', 'Inspecting the chain while debugging; use `Object.getPrototypeOf` in real code.'],
    },
  ],
  visuals: [
    {
      type: 'stepper',
      title: 'Follow a property lookup',
      code: c(`
function Dog(name) { this.name = name; }
Dog.prototype.bark = function () { return 'woof'; };
const rex = new Dog('Rex');
rex.name;
rex.bark();
rex.toString();
rex.fly;`),
      panels: ['Chain searched', 'Result'],
      steps: [
        { line: 3, note: '`new` makes an object whose `[[Prototype]]` is `Dog.prototype`, and sets `name` on it.', state: { 'Chain searched': ['rex { name }', '→ Dog.prototype { bark }', '→ Object.prototype { toString, … }', '→ null'] } },
        { line: 4, note: '`name` is an own property of `rex`. Found immediately.', state: { 'Chain searched': ['rex ✓'], Result: ['"Rex"'] } },
        { line: 5, note: '`bark` is not on `rex`, so JS follows the link to `Dog.prototype`.', state: { 'Chain searched': ['rex ✗', 'Dog.prototype ✓'], Result: ['"woof"'] } },
        { line: 6, note: '`toString` comes from one level further up.', state: { 'Chain searched': ['rex ✗', 'Dog.prototype ✗', 'Object.prototype ✓'], Result: ['"[object Object]"'] } },
        { line: 7, note: 'The chain ends at `null` without a match, so the result is `undefined` (no error).', state: { 'Chain searched': ['rex ✗', 'Dog.prototype ✗', 'Object.prototype ✗', 'null'], Result: ['undefined'] } },
      ],
    },
  ],
  qa: [
    {
      q: 'What is the prototype chain?',
      tag: 'Asked often',
      a: [
        'Each object has an internal link to another object, its prototype.',
        'When a property is not found on the object, JS searches the prototype, then its prototype, up to `Object.prototype` and finally `null`.',
        'This is how JS implements inheritance.',
      ],
    },
    {
      q: 'What is the difference between `__proto__` and `prototype`?',
      tag: 'Asked often',
      a: [
        '`obj.__proto__` (legacy accessor) is the object\'s actual prototype link. Prefer `Object.getPrototypeOf(obj)`.',
        '`Fn.prototype` exists on functions and becomes the `__proto__` of objects created with `new Fn()`.',
        'So `new Fn().__proto__ === Fn.prototype`.',
      ],
    },
    {
      q: 'How do you create an object with a specific prototype?',
      a: [
        '`Object.create(proto)`.',
        '`Object.create(null)` makes an object with no prototype at all, handy for plain dictionaries.',
      ],
    },
    {
      q: 'How do you implement inheritance with constructor functions?',
      a: ['Call the parent constructor for fields, and link the prototypes for methods.'],
      code: c(`
function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + ' makes a sound'; };

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;`),
    },
    {
      q: 'What is the difference between `hasOwnProperty` and `in`?',
      a: [
        '`obj.hasOwnProperty("x")` (or `Object.hasOwn(obj, "x")`) checks only the object itself.',
        '`"x" in obj` also checks the prototype chain.',
      ],
    },
    {
      q: 'How does `instanceof` work?',
      a: ['`a instanceof B` walks `a`\'s prototype chain looking for `B.prototype`. It returns `true` if it finds it.'],
    },
    {
      q: 'Why is extending built-in prototypes like `Array.prototype` discouraged?',
      a: ['It changes behaviour for all code on the page and can clash with future built-ins or other libraries (the `Array.prototype.flatten` → `flat` story).'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const parent = { greet() { return 'hi from ' + this.name; } };
const child = Object.create(parent);
child.name = 'child';
console.log(child.greet());
console.log(child.hasOwnProperty('greet'), 'greet' in child);`),
      options: ['hi from child\nfalse true', 'hi from undefined\nfalse true', 'hi from child\ntrue true', 'TypeError'],
      answer: 0,
      explain: '`greet` is inherited, but `this` is still the object it was called on. It is not an own property, yet `in` finds it on the chain.',
    },
    {
      type: 'output',
      code: c(`
function Car() {}
Car.prototype.wheels = 4;
const a = new Car();
const b = new Car();
a.wheels = 3;
console.log(a.wheels, b.wheels);
Car.prototype.wheels = 6;
console.log(a.wheels, b.wheels);`),
      options: ['3 4\n3 6', '3 3\n6 6', '3 4\n6 6', '3 4\n3 4'],
      answer: 0,
      explain: '`a.wheels = 3` creates an own property that shadows the prototype. `b` still reads the prototype, so it sees the change.',
    },
    {
      type: 'output',
      code: c(`
function Foo() {}
const f = new Foo();
console.log(Object.getPrototypeOf(f) === Foo.prototype);
console.log(Foo.prototype.constructor === Foo);
console.log(Object.getPrototypeOf(Foo.prototype) === Object.prototype);`),
      options: ['true\ntrue\ntrue', 'true\nfalse\ntrue', 'false\ntrue\ntrue', 'true\ntrue\nfalse'],
      answer: 0,
      explain: 'Instances link to `Foo.prototype`, which has a `constructor` pointing back, and itself links to `Object.prototype`.',
    },
    {
      type: 'output',
      code: c(`
const dict = Object.create(null);
dict.a = 1;
console.log('toString' in dict);
console.log(typeof dict.hasOwnProperty);`),
      options: ['false\nundefined', 'true\nfunction', 'false\nfunction', 'true\nundefined'],
      answer: 0,
      explain: '`Object.create(null)` has no prototype, so it inherits nothing, not even `toString` or `hasOwnProperty`.',
    },
    {
      type: 'output',
      code: c(`
function Animal() {}
function Dog() {}
Dog.prototype = Object.create(Animal.prototype);
const d = new Dog();
console.log(d instanceof Dog, d instanceof Animal, d instanceof Object);
console.log(d.constructor === Dog);`),
      options: ['true true true\nfalse', 'true true true\ntrue', 'true false true\nfalse', 'true true false\nfalse'],
      answer: 0,
      explain: 'The chain includes both prototypes. But replacing `Dog.prototype` lost its `constructor`, so `d.constructor` is found on `Animal.prototype` and is `Animal`.',
    },
    {
      type: 'output',
      code: c(`
const base = { list: [] };
const x = Object.create(base);
const y = Object.create(base);
x.list.push(1);
console.log(y.list);`),
      options: ['[ 1 ]', '[]', 'undefined', 'TypeError'],
      answer: 0,
      explain: '`x.list.push` reads `list` (found on `base`) and mutates it. Both objects share that one array.',
    },
    {
      type: 'truefalse',
      statement: 'Every object in JavaScript has a `prototype` property.',
      answer: false,
      explain: 'Every object has an internal `[[Prototype]]` link, but the `.prototype` property exists mainly on functions.',
    },
  ],
};

export default topic;
