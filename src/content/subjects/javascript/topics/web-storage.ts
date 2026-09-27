import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'web-storage',
  title: 'Browser storage compared',
  level: 'beginner',
  masteryMinutes: 45,
  reviseMinutes: 15,
  tags: ['localStorage', 'sessionStorage', 'cookies', 'IndexedDB', 'Cache API', 'quota'],
  summary: 'Four main places to keep data in the browser: **cookies**, **localStorage**, **sessionStorage** and **IndexedDB**. Pick by size, lifetime, and whether the server needs to see it.',
  keyPoints: [
    {
      title: 'Cookies: small and sent to the server',
      text: 'About 4 KB each, attached to every matching HTTP request. Made for sessions and server-side state. Can be hidden from JS with `HttpOnly`. See the Cookies topic.',
    },
    {
      title: 'localStorage and sessionStorage: simple strings',
      text: 'About 5 MB per origin, synchronous `getItem`/`setItem`, strings only. localStorage lasts until cleared and is shared by all tabs; sessionStorage is per tab and ends when the tab closes.',
      code: c(`
localStorage.setItem('prefs', JSON.stringify({ dark: true }));
const prefs = JSON.parse(localStorage.getItem('prefs') ?? '{}');`),
    },
    {
      title: 'IndexedDB: a real database',
      text: 'Asynchronous, transactional, stores objects, Blobs and files, supports indexes, and can hold hundreds of MB or more. Works in Web Workers. See the IndexedDB topic.',
    },
    {
      title: 'All are per origin',
      text: 'Storage is isolated by scheme + host + port. `http://site.com` and `https://site.com` do not share localStorage or IndexedDB. Cookies are the exception: they are scoped by domain and path.',
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
      q: 'Compare cookies, localStorage, sessionStorage and IndexedDB.',
      tag: 'Asked often',
      a: [
        '**Size:** cookie ~4 KB each; local/session ~5 MB; IndexedDB large (a share of free disk).',
        '**Lifetime:** cookie until `Expires`/`Max-Age` (or end of session); local until cleared; session until the tab closes; IndexedDB until cleared or evicted.',
        '**Sent to server:** only cookies, automatically.',
        '**API:** cookie via a string (`document.cookie`); local/session synchronous key-value strings; IndexedDB asynchronous, transactional, stores objects.',
        '**Available in workers:** IndexedDB yes; localStorage/sessionStorage no.',
      ],
    },
    {
      q: 'Where should you store an auth token?',
      tag: 'Asked often',
      a: [
        'Safest default: an `HttpOnly; Secure; SameSite=Lax` (or `Strict`) cookie set by the server. JavaScript cannot read it, so XSS cannot steal it.',
        'localStorage and sessionStorage are readable by any script on the page, so one XSS bug leaks the token.',
        'Cookies are sent automatically, so pair them with CSRF protection (`SameSite` and/or a CSRF token).',
      ],
    },
    {
      q: 'How do other tabs find out that localStorage changed?',
      a: [
        'Every **other** tab of the same origin gets a `storage` event on `window` with `key`, `oldValue` and `newValue`. The tab that made the change does not.',
        'For richer tab-to-tab messaging, use `BroadcastChannel`.',
      ],
    },
    {
      q: 'Why is localStorage a poor choice for large data?',
      a: [
        'It is synchronous, so big reads and writes block the main thread.',
        'It only stores strings, so objects must be serialised with `JSON.stringify` every time.',
        'It has a small quota (~5 MB) and throws a `QuotaExceededError` when full. Use IndexedDB instead.',
      ],
    },
    {
      q: 'What is the Cache API?',
      a: [
        'Storage for HTTP `Request`/`Response` pairs, used mainly by service workers to serve files offline.',
        'It is for network responses, not general app data (that is IndexedDB).',
      ],
    },
    {
      q: 'Can storage be cleared without your code doing it?',
      a: [
        'Yes. Users can clear it, private windows discard it, and browsers may evict "best-effort" storage under disk pressure (Safari also clears script-written storage after 7 days without interaction).',
        '`navigator.storage.persist()` asks the browser to keep it; `navigator.storage.estimate()` shows usage and quota.',
      ],
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
console.log(localStorage.getItem('never-set'));
localStorage.flag = false;
console.log(localStorage.getItem('flag') ? 'truthy' : 'falsy');`),
      note: 'In a browser.',
      options: ['null\ntruthy', 'undefined\nfalsy', 'null\nfalsy', 'undefined\ntruthy'],
      answer: 0,
      explain: 'A missing key gives `null`. `false` is stored as the string `"false"`, which is truthy.',
    },
    {
      type: 'output',
      code: c(`
sessionStorage.setItem('a', '1');
localStorage.setItem('a', '2');
console.log(sessionStorage.getItem('a'), localStorage.getItem('a'), localStorage.length > 0);`),
      note: 'In a browser.',
      options: ['1 2 true', '2 2 true', '1 1 true', '1 2 false'],
      answer: 0,
      explain: 'The two stores are separate, even for the same key in the same tab.',
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
      question: 'An offline notes app must store 200 MB of notes and images, and sync them from a Web Worker. Which storage fits?',
      options: ['localStorage', 'Cookies', 'IndexedDB', 'sessionStorage'],
      answer: 2,
      explain: 'Only IndexedDB handles that size, stores binary data, and is available inside workers.',
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
      statement: '`https://app.com` and `http://app.com` share the same localStorage.',
      answer: false,
      explain: 'Storage is per origin, and the scheme is part of the origin.',
    },
  ],
};

export default topic;
