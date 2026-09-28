import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'modules',
  title: 'ES modules vs CommonJS',
  level: 'intermediate',
  masteryMinutes: 60,
  tags: ['import', 'export', 'require', 'tree shaking', 'dynamic import'],
  summary: 'ES modules (`import`/`export`) are static and asynchronous; CommonJS (`require`/`module.exports`) is dynamic and synchronous.',
  keyPoints: [
    {
      title: 'Named vs default exports',
      text: 'A module can have many named exports and at most one default export.',
      code: c(`
// math.js
export const add = (a, b) => a + b;
export default function mul(a, b) { return a * b; }
// app.js
import mul, { add } from './math.js';`),
    },
    {
      title: 'ESM imports are live bindings',
      text: 'An imported variable always reflects the exporting module\'s current value. CommonJS gives you a copy of `module.exports` at that moment.',
    },
    {
      title: 'Static structure enables tree shaking',
      text: '`import` must be at the top level with literal paths, so bundlers can see what is unused and drop it. `require` can be called anywhere.',
    },
    {
      title: 'Modules are singletons',
      text: 'A module runs once, on first import. Every importer shares the same instance and state.',
    },
  ],
  comparisons: [
    {
      items: ['CommonJS', 'ES modules'],
      rows: [
        { aspect: 'Syntax', values: ['`require()` / `module.exports`', '`import` / `export`'] },
        { aspect: 'When imports are resolved', values: ['At run time, when `require` runs', 'Before any code runs (static)'], key: true },
        { aspect: 'Imported values', values: ['A copy: later reassignments in the module are not seen', 'Live bindings: you see updates, but cannot assign'], key: true },
        { aspect: 'Loading', values: ['Synchronous', 'Can load asynchronously'] },
        { aspect: 'Conditional import', values: ['`require` anywhere', 'Top level only; `import()` for dynamic'] },
        { aspect: 'Tree shaking', values: ['Hard', 'Yes'] },
        { aspect: 'Top-level `await`', values: ['No', 'Yes'] },
        { aspect: 'Top-level `this`', values: ['`module.exports`', '`undefined`'] },
        { aspect: 'Where', values: ['Node by default, `.cjs`', 'Browsers, bundlers, Node with `.mjs` or `"type": "module"`'] },
      ],
      reveal:
        'ESM is static: imports and exports are known before the code runs, which is what makes tree shaking, top-level `await` and live bindings possible. CommonJS is just a function call that returns an object.',
      whenToUse: ['Older Node packages and tooling that still expect `require`.', 'All new code, in the browser and in Node.'],
    },
  ],
  qa: [
    {
      q: 'What are the main differences between ESM and CommonJS?',
      tag: 'Asked often',
      a: [
        'Syntax: `import`/`export` vs `require`/`module.exports`.',
        'ESM is statically analysable and loaded asynchronously; CJS is resolved at runtime and loaded synchronously.',
        'ESM imports are live read-only bindings; CJS gives a value copy.',
        'ESM is always strict and top-level `this` is `undefined`; in CJS it is `module.exports`.',
        'ESM supports top-level `await`.',
      ],
    },
    {
      q: 'What is a dynamic import?',
      a: ['`import("./page.js")` returns a promise for the module. It is used for code splitting and lazy loading, and works anywhere in the code.'],
    },
    {
      q: 'What is tree shaking?',
      a: ['Removing unused exports during bundling. It needs ESM\'s static `import`/`export` so the bundler can prove code is unused.'],
    },
    {
      q: 'Can you reassign an imported binding?',
      a: ['No. Imports are read-only: `import { count } from "./a.js"; count = 1;` throws a `TypeError`. The exporting module can change it, and importers will see the new value.'],
    },
    {
      q: 'What happens with circular imports?',
      a: ['Both systems allow them, but one module will see the other partially initialised. In ESM, touching a not-yet-initialised `let`/`const` export throws (TDZ); in CJS you get an incomplete `exports` object.'],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'Given `export let count = 0; export const inc = () => count++;` in `counter.js`, what does the importer log?',
      code: c(`
import { count, inc } from './counter.js';
inc();
console.log(count);`),
      options: ['0', '1', 'undefined', 'TypeError'],
      answer: 1,
      explain: 'ES module imports are live bindings, so the importer sees the updated value.',
    },
    {
      type: 'mcq',
      question: 'Same counter, but with CommonJS. What is logged?',
      code: c(`
// counter.js
let count = 0;
module.exports = { count, inc: () => count++ };
// app.js
const { count: c1, inc } = require('./counter');
inc();
console.log(c1);`),
      options: ['0', '1', 'undefined', 'ReferenceError'],
      answer: 0,
      explain: 'CommonJS exported the value of `count` at that moment. Later changes to the local variable are not reflected.',
    },
    {
      type: 'mcq',
      question: 'Two files both `import "./config.js"`, which logs "loaded" at the top. How many times is "loaded" printed?',
      options: ['Once', 'Twice', 'Zero', 'Depends on import order'],
      answer: 0,
      explain: 'Modules are evaluated once and cached; later imports reuse the same instance.',
    },
    {
      type: 'truefalse',
      statement: 'In an ES module, top-level `this` is `undefined`.',
      answer: true,
      explain: 'Modules run in strict mode and have no top-level `this` object. In CommonJS it is `module.exports`.',
    },
    {
      type: 'truefalse',
      statement: 'You can write `import x from someVariable` with a path stored in a variable.',
      answer: false,
      explain: 'Static imports need a string literal. Use `await import(someVariable)` for a dynamic path.',
    },
    {
      type: 'mcq',
      question: 'Which feature makes tree shaking possible?',
      options: ['Live bindings', 'Static import/export structure', 'Top-level await', 'Strict mode'],
      answer: 1,
      explain: 'Because imports and exports are known before running, bundlers can safely drop unused code.',
    },
  ],
};

export default topic;
