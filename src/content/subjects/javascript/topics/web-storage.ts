import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'web-storage',
  title: 'localStorage, sessionStorage, cookies',
  level: 'beginner',
  masteryMinutes: 30,
  tags: ['persistence', 'cookies', 'HttpOnly', 'IndexedDB'],
  summary: 'Three ways to keep data in the browser. They differ in **lifetime**, **size**, and whether they are **sent to the server**.',
  keyPoints: [
    {
      title: 'localStorage',
      text: 'About 5 MB per origin, persists until cleared, shared across tabs of the same origin. Never sent to the server.',
    },
    {
      title: 'sessionStorage',
      text: 'Same API, but scoped to one tab and cleared when the tab closes.',
    },
    {
      title: 'Cookies',
      text: 'About 4 KB each, sent with every request to the matching domain. Can have an expiry and flags like `HttpOnly`, `Secure`, `SameSite`.',
    },
    {
      title: 'Strings only',
      text: 'Web Storage stores strings. Use `JSON.stringify`/`JSON.parse` for objects. The API is synchronous, so avoid large data; use IndexedDB for that.',
      code: c(`
localStorage.setItem('prefs', JSON.stringify({ dark: true }));
const prefs = JSON.parse(localStorage.getItem('prefs') ?? '{}');`),
    },
  ],
  comparisons: [
    {
      title: 'Cookies vs localStorage vs sessionStorage vs IndexedDB',
      items: ['Cookies', '`localStorage`', '`sessionStorage`', 'IndexedDB'],
      rows: [
        { aspect: 'Size', values: ['About 4 KB per cookie', 'About 5 MB per origin', 'About 5 MB per origin', 'Large: a share of free disk, often hundreds of MB or more'] },
        { aspect: 'Sent to the server', values: ['On every matching request', 'Never', 'Never', 'Never'], key: true },
        { aspect: 'Lasts until', values: ['`Expires`/`Max-Age`, or the browser session', 'Cleared by code or the user', 'The tab closes', 'Cleared by code or the user'], key: true },
        { aspect: 'Shared between', values: ['Domain and path (can include subdomains)', 'All tabs of the origin', 'One tab only (a duplicated tab gets a copy)', 'All tabs of the origin'] },
        { aspect: 'API', values: ['`document.cookie` string, sync', 'Sync, `getItem`/`setItem`', 'Sync, `getItem`/`setItem`', 'Async, transactions and indexes'] },
        { aspect: 'Stores', values: ['Strings', 'Strings (use `JSON.stringify`)', 'Strings (use `JSON.stringify`)', 'Objects, arrays, Blobs, Files (structured clone)'] },
        { aspect: 'Hidden from JS', values: ['Yes, with `HttpOnly`', 'No', 'No', 'No'] },
        { aspect: 'Set by the server', values: ['Yes, `Set-Cookie`', 'No', 'No', 'No'] },
        { aspect: 'Usable in workers', values: ['No `document.cookie`', 'No', 'No', 'Yes'] },
      ],
      reveal:
        'Only cookies travel to the server; the other three stay in the browser. Among those three the real split is lifetime and scope (`sessionStorage` dies with the tab) and size plus data shape (IndexedDB is the only async one and stores real objects).',
      whenToUse: [
        'Session IDs and anything the server must read, with `HttpOnly`, `Secure` and `SameSite` set.',
        'Small preferences that should survive a restart: theme, language, a dismissed banner.',
        'Per-tab state: a form draft, a wizard step, a filter that should not leak into other tabs.',
        'Large or structured data: offline apps, cached API responses, files and images, anything you query by a key or index.',
      ],
    },
  ],
  qa: [
    {
      q: 'Compare localStorage, sessionStorage and cookies.',
      tag: 'Asked often',
      a: [
        '**Lifetime:** local = until cleared; session = until the tab closes; cookie = until its expiry (or session).',
        '**Size:** ~5 MB, ~5 MB, ~4 KB.',
        '**Sent to server:** only cookies.',
        '**Access:** Web Storage from JS only; cookies from JS (unless `HttpOnly`) and the server.',
      ],
    },
    {
      q: 'Where should you store an auth token?',
      a: [
        'An `HttpOnly`, `Secure`, `SameSite` cookie is safest against XSS, because JS cannot read it.',
        'localStorage is readable by any script on the page, so an XSS bug can steal it.',
        'Cookies need CSRF protection (`SameSite`, CSRF tokens).',
      ],
    },
    {
      q: 'How do tabs find out that localStorage changed?',
      a: ['Other tabs of the same origin receive a `storage` event on `window`. The tab that made the change does not.'],
    },
    {
      q: 'What does `HttpOnly` do?',
      a: ['It hides the cookie from `document.cookie`, so JavaScript (including injected scripts) cannot read it. The browser still sends it with requests.'],
    },
    {
      q: 'When would you use IndexedDB?',
      a: ['For larger or structured data, binary blobs, or offline apps. It is asynchronous and transactional, unlike Web Storage.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
localStorage.setItem('n', 5);
localStorage.setItem('obj', { a: 1 });
console.log(typeof localStorage.getItem('n'));
console.log(localStorage.getItem('obj'));`),
      note: 'In a browser.',
      options: ['string\n[object Object]', 'number\n{"a":1}', 'string\n{"a":1}', 'number\n[object Object]'],
      answer: 0,
      explain: 'Web Storage converts every value to a string. An object becomes `"[object Object]"` unless you stringify it yourself.',
    },
    {
      type: 'output',
      code: c(`
console.log(localStorage.getItem('never-set'));`),
      note: 'In a browser.',
      options: ['null', 'undefined', '""', 'Error'],
      answer: 0,
      explain: '`getItem` returns `null` for a missing key.',
    },
    {
      type: 'mcq',
      question: 'Which storage is automatically sent to the server with each HTTP request?',
      options: ['localStorage', 'sessionStorage', 'Cookies', 'IndexedDB'],
      answer: 2,
      explain: 'Cookies for the matching domain and path are attached to requests automatically.',
    },
    {
      type: 'mcq',
      question: 'A user opens your site in two tabs and saves a draft in tab A with sessionStorage. What does tab B see?',
      options: ['The same draft', 'Nothing: sessionStorage is per tab', 'The draft after a refresh', 'An error'],
      answer: 1,
      explain: 'sessionStorage is scoped to a single tab (browsing context).',
    },
    {
      type: 'truefalse',
      statement: 'JavaScript can read a cookie that has the `HttpOnly` flag.',
      answer: false,
      explain: '`HttpOnly` cookies are hidden from `document.cookie`, which protects them from XSS.',
    },
  ],
};

export default topic;
