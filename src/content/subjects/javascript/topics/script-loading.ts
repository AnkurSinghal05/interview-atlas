import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'script-loading',
  title: 'async vs defer and page load',
  level: 'intermediate',
  tags: ['script tags', 'DOMContentLoaded', 'render blocking', 'critical rendering path'],
  summary: 'A plain `<script>` stops HTML parsing. `defer` runs after parsing, in order. `async` runs as soon as it downloads, in any order.',
  keyPoints: [
    {
      title: 'Plain `<script>`',
      text: 'Parsing pauses while the script downloads and runs. That is why scripts used to go at the end of `<body>`.',
    },
    {
      title: '`defer`',
      text: 'Downloads in parallel, runs after the HTML is parsed, **in document order**, before `DOMContentLoaded`. Best default for app code.',
    },
    {
      title: '`async`',
      text: 'Downloads in parallel, runs **as soon as it arrives**, possibly before parsing ends and in any order. Good for independent scripts like analytics.',
    },
    {
      title: 'Load events',
      text: '`DOMContentLoaded`: HTML parsed and deferred scripts run. `load`: images, styles and iframes also finished. Module scripts (`type="module"`) are deferred by default.',
    },
  ],
  qa: [
    {
      q: 'What is the difference between `async` and `defer`?',
      tag: 'Asked often',
      a: [
        'Both download without blocking the parser.',
        '`defer` executes after parsing, in order. `async` executes immediately when downloaded, in no guaranteed order.',
        'Use `defer` for scripts that need the DOM or depend on each other; `async` for independent scripts.',
      ],
    },
    {
      q: 'What is the difference between `DOMContentLoaded` and `load`?',
      a: [
        '`DOMContentLoaded` fires when the HTML is parsed and deferred scripts have run.',
        '`load` fires later, when all resources (images, stylesheets, iframes) are loaded.',
      ],
    },
    {
      q: 'What is the critical rendering path?',
      a: [
        'The steps from HTML to pixels: build the DOM, build the CSSOM, combine into the render tree, layout, paint, composite.',
        'CSS blocks rendering and sync scripts block parsing, so both affect how fast the first paint happens.',
      ],
    },
    {
      q: 'What are reflow and repaint?',
      a: [
        '**Reflow (layout):** recalculating sizes and positions after a geometry change. Expensive.',
        '**Repaint:** redrawing pixels after a visual change like colour, without layout.',
        'Reading layout values (`offsetHeight`) right after writing styles forces a synchronous reflow (layout thrashing). Batch reads and writes.',
      ],
    },
    {
      q: 'Are module scripts async or deferred?',
      a: ['`<script type="module">` is deferred by default. Add `async` to make it run as soon as it and its imports are ready.'],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'Two scripts `a.js` (large) and `b.js` (small) both use `defer`. Which runs first?',
      options: ['`a.js`, because defer keeps document order', '`b.js`, because it downloads faster', 'Random', 'They run at the same time'],
      answer: 0,
      explain: 'Deferred scripts always execute in the order they appear in the HTML.',
    },
    {
      type: 'mcq',
      question: 'Same two scripts, but with `async`. Which runs first?',
      options: ['`a.js`, always', 'Whichever finishes downloading first (likely `b.js`)', 'Neither runs until `load`', 'They run after `DOMContentLoaded`'],
      answer: 1,
      explain: 'Async scripts run as soon as they are downloaded, with no ordering guarantee.',
    },
    {
      type: 'mcq',
      question: 'Which event fires first?',
      options: ['`load`', '`DOMContentLoaded`', 'They fire together', 'It depends on script order'],
      answer: 1,
      explain: '`DOMContentLoaded` fires when parsing is done; `load` waits for images and other resources too.',
    },
    {
      type: 'truefalse',
      statement: 'A `<script type="module">` blocks HTML parsing like a classic script.',
      answer: false,
      explain: 'Module scripts are deferred by default.',
    },
    {
      type: 'mcq',
      question: 'Which code causes layout thrashing?',
      options: [
        'Reading `el.offsetHeight` for all elements, then writing all styles',
        'Alternating `el.style.height = ...` and reading `el.offsetHeight` in a loop',
        'Changing only `transform` inside `requestAnimationFrame`',
        'Adding a class once',
      ],
      answer: 1,
      explain: 'Each read after a write forces the browser to recalculate layout immediately.',
    },
  ],
};

export default topic;
