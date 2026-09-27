import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'default-rest-params',
  title: 'Default and rest parameters',
  level: 'beginner',
  masteryMinutes: 30,
  tags: ['defaults', '...rest', 'arguments', 'function.length'],
  summary: 'Defaults fill in parameters that are `undefined`. Rest parameters collect the remaining arguments into a real array.',
  keyPoints: [
    {
      title: 'Defaults kick in only for `undefined`',
      text: 'Passing `null`, `0` or `""` keeps that value. Passing nothing or `undefined` uses the default.',
      code: c(`
function greet(name = 'Guest') { return name; }
greet();          // "Guest"
greet(undefined); // "Guest"
greet(null);      // null`),
    },
    {
      title: 'Defaults are evaluated at call time',
      text: 'A default like `list = []` creates a new array on every call, and can refer to earlier parameters.',
    },
    {
      title: 'Rest collects the tail',
      text: '`function f(a, ...rest)` puts all extra arguments in an array. It must be the last parameter.',
    },
    {
      title: '`arguments` is the old way',
      text: '`arguments` is array-like (no `map`), does not exist in arrows, and is best replaced with rest parameters.',
    },
  ],
  qa: [
    {
      q: 'When is a default parameter used?',
      tag: 'Asked often',
      a: ['Only when the argument is missing or explicitly `undefined`. `null` does not trigger it.'],
    },
    {
      q: 'What is the difference between rest parameters and `arguments`?',
      a: [
        'Rest is a real `Array`; `arguments` is array-like.',
        'Rest only holds the parameters you did not name; `arguments` holds all of them.',
        'Arrow functions have rest but no own `arguments`.',
      ],
    },
    {
      q: 'What is the difference between rest and spread?',
      a: [
        'Same `...` syntax, opposite jobs.',
        '**Rest** gathers many values into one array (in parameters or destructuring).',
        '**Spread** expands an array or object into separate values (in calls, array or object literals).',
      ],
    },
    {
      q: 'What does `function.length` report?',
      a: ['The number of parameters before the first one with a default or a rest parameter. `((a, b = 1, ...c) => {}).length` is 1.'],
    },
    {
      q: 'How do you make a parameter required?',
      a: ['Use a default that throws.'],
      code: c(`
const required = (name) => { throw new Error(\`\${name} is required\`); };
function connect(url = required('url')) {}`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
function f(x = 10) {
  return x;
}
console.log(f(), f(undefined), f(null), f(0));`),
      options: ['10 10 null 0', '10 10 10 10', '10 undefined null 0', 'undefined undefined null 0'],
      answer: 0,
      explain: 'Only a missing or `undefined` argument uses the default.',
    },
    {
      type: 'output',
      code: c(`
function add(list = []) {
  list.push(1);
  return list.length;
}
console.log(add(), add(), add());`),
      options: ['1 1 1', '1 2 3', '0 0 0', '3 3 3'],
      answer: 0,
      explain: 'The default expression runs on every call, so each call gets a fresh array (unlike Python).',
    },
    {
      type: 'output',
      code: c(`
function f(first, ...rest) {
  return [first, rest, arguments.length];
}
console.log(f(1, 2, 3));`),
      options: ['[ 1, [ 2, 3 ], 3 ]', '[ 1, 2, 3 ]', '[ 1, [ 2, 3 ], 2 ]', '[ [ 1, 2, 3 ], [], 3 ]'],
      answer: 0,
      explain: '`rest` holds only the unnamed tail. `arguments` still counts every argument.',
    },
    {
      type: 'output',
      code: c(`
console.log(((a, b) => {}).length);
console.log(((a, b = 2, c) => {}).length);
console.log(((...args) => {}).length);`),
      options: ['2\n1\n0', '2\n3\n1', '2\n2\n0', '2\n1\n1'],
      answer: 0,
      explain: '`length` counts parameters up to the first default or rest parameter.',
    },
    {
      type: 'output',
      code: c(`
function sum() {
  return Array.isArray(arguments);
}
const sum2 = (...nums) => Array.isArray(nums);
console.log(sum(1, 2), sum2(1, 2));`),
      options: ['false true', 'true true', 'false false', 'true false'],
      answer: 0,
      explain: '`arguments` is array-like, not an `Array`. Rest parameters give a real array.',
    },
    {
      type: 'output',
      code: c(`
function greet(greeting, name = greeting.toUpperCase()) {
  return \`\${greeting} \${name}\`;
}
console.log(greet('hi'));`),
      options: ['hi HI', 'hi undefined', 'ReferenceError', 'HI hi'],
      answer: 0,
      explain: 'A default can use parameters that come before it.',
    },
  ],
};

export default topic;
