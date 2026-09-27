import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'strict-mode',
  title: 'Strict mode',
  level: 'intermediate',
  masteryMinutes: 45,
  tags: ['"use strict"', 'silent errors', 'modules'],
  summary: '`"use strict"` turns silent mistakes into errors and removes a few confusing features. Modules and classes are strict automatically.',
  keyPoints: [
    {
      title: 'How to turn it on',
      text: 'Put `"use strict";` at the top of a file or function. ES modules and `class` bodies are always strict.',
    },
    {
      title: 'Silent failures become errors',
      text: 'Assigning to an undeclared variable, a read-only property or a frozen object throws instead of doing nothing.',
      code: c(`
'use strict';
total = 5; // ReferenceError: total is not defined`),
    },
    {
      title: '`this` is not replaced with the global object',
      text: 'In a plain function call, `this` stays `undefined` instead of becoming `window`/`globalThis`.',
    },
    {
      title: 'Other changes',
      text: 'Duplicate parameter names are banned, `with` is banned, `delete` on a plain variable is a SyntaxError, and `arguments` no longer tracks parameter changes.',
    },
  ],
  comparisons: [
    {
      items: ['Sloppy mode', 'Strict mode'],
      rows: [
        { aspect: '`this` in a plain function call', values: ['`globalThis` (`window`)', '`undefined`'], key: true },
        { aspect: 'Assign to an undeclared variable', values: ['Creates a global', '`ReferenceError`'], key: true },
        { aspect: 'Write to a read-only property', values: ['Silently ignored', '`TypeError`'] },
        { aspect: 'Delete a non-configurable property', values: ['Returns `false`', '`TypeError`'] },
        { aspect: 'Duplicate parameter names', values: ['Allowed', '`SyntaxError`'] },
        { aspect: '`with`, octal `010`', values: ['Allowed', '`SyntaxError`'] },
        { aspect: '`arguments` tracks parameters', values: ['Yes', 'No'] },
        { aspect: 'Turned on by', values: ['Default for classic scripts', "`'use strict'`, classes, ES modules"] },
      ],
      reveal: 'Strict mode mostly turns silent failures into errors. Modules and classes are already strict, so most modern code runs strict without saying so.',
      whenToUse: ['Only old scripts that rely on it.', 'Everything; you get it for free in modules and classes.'],
    },
  ],
  qa: [
    {
      q: 'What is strict mode and why use it?',
      tag: 'Asked often',
      a: [
        'An opt-in, safer variant of JS.',
        'It catches common bugs early (accidental globals, writing to read-only properties) and makes `this` more predictable.',
        'It also lets engines optimise some code better.',
      ],
    },
    {
      q: 'Is code inside ES modules strict?',
      a: ['Yes. Modules and class bodies are strict whether or not you write `"use strict"`.'],
    },
    {
      q: 'What is `this` in a plain function call in strict mode?',
      a: ['`undefined`. In sloppy mode it would be the global object.'],
      code: c(`
function show() { 'use strict'; return this; }
show(); // undefined`),
    },
    {
      q: 'Can you enable strict mode for only one function?',
      a: ['Yes, by putting `"use strict";` as the first statement in that function body. It cannot be switched off once on.'],
    },
    {
      q: 'Name some things that throw only in strict mode.',
      a: [
        'Assigning to an undeclared variable.',
        'Writing to a non-writable or getter-only property.',
        'Adding a property to a frozen or non-extensible object.',
        'Deleting a non-configurable property.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
'use strict';
function f() {
  return this;
}
console.log(f());`),
      options: ['undefined', 'window', '{}', 'null'],
      answer: 0,
      explain: 'Strict mode does not substitute the global object for a missing `this`.',
    },
    {
      type: 'output',
      code: c(`
'use strict';
const cfg = Object.freeze({ debug: false });
try {
  cfg.debug = true;
} catch (e) {
  console.log(e.name);
}
console.log(cfg.debug);`),
      options: ['TypeError\nfalse', 'true', 'false', 'ReferenceError\nfalse'],
      answer: 0,
      explain: 'Writing to a frozen object throws a `TypeError` in strict mode (and is silently ignored in sloppy mode).',
    },
    {
      type: 'output',
      code: c(`
function sloppy() {
  leaked = 1;
}
sloppy();
console.log(typeof leaked);`),
      options: ['number', 'undefined', 'ReferenceError', 'object'],
      answer: 0,
      explain: 'Without strict mode, assigning to an undeclared name silently creates a global.',
    },
    {
      type: 'output',
      code: c(`
function strictOne() {
  'use strict';
  oops = 1;
}
try {
  strictOne();
} catch (e) {
  console.log(e.name);
}`),
      options: ['ReferenceError', 'TypeError', 'SyntaxError', 'Nothing is logged'],
      answer: 0,
      explain: 'In strict mode, assigning to an undeclared variable throws a `ReferenceError`.',
    },
    {
      type: 'output',
      code: c(`
function f(a) {
  'use strict';
  a = 2;
  return arguments[0];
}
function g(a) {
  a = 2;
  return arguments[0];
}
console.log(f(1), g(1));`),
      options: ['1 2', '2 2', '1 1', '2 1'],
      answer: 0,
      explain: 'In sloppy mode `arguments` stays linked to the parameters. Strict mode breaks that link.',
    },
    {
      type: 'truefalse',
      statement: 'You need `"use strict"` at the top of every ES module file.',
      answer: false,
      explain: 'Modules are strict automatically.',
    },
  ],
};

export default topic;
