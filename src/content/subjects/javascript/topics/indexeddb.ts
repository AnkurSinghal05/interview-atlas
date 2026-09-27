import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'indexeddb',
  title: 'IndexedDB',
  level: 'intermediate',
  masteryMinutes: 75,
  reviseMinutes: 25,
  tags: ['object stores', 'transactions', 'indexes', 'versioning', 'offline', 'idb'],
  summary: 'IndexedDB is the browser\'s built-in **asynchronous database**: it stores structured objects and files, supports indexes and transactions, and handles far more data than localStorage.',
  keyPoints: [
    {
      title: 'Database → object stores → records',
      text: 'A database (per origin) holds **object stores** (like tables). Each store holds records under a key, taken from a `keyPath` property or generated with `autoIncrement`. **Indexes** let you look records up by other properties.',
    },
    {
      title: 'Schema changes happen in `onupgradeneeded`',
      text: '`indexedDB.open(name, version)`. When the version number goes up, `upgradeneeded` fires, and that is the only place you can create or delete stores and indexes.',
      code: c(`
const req = indexedDB.open('notes-db', 1);
req.onupgradeneeded = () => {
  const db = req.result;
  const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
  store.createIndex('byTag', 'tag');
};
req.onsuccess = () => { const db = req.result; /* use it */ };`),
    },
    {
      title: 'Everything goes through a transaction',
      text: '`db.transaction(stores, "readonly" | "readwrite")`. A transaction **auto-commits** once no requests are pending, so you cannot `await` unrelated work (like `fetch`) in the middle of one.',
    },
    {
      title: 'Event-based API, usually wrapped',
      text: 'Each operation returns an `IDBRequest` with `onsuccess`/`onerror`. Most apps wrap it in promises or use a small library such as `idb` or Dexie.',
    },
  ],
  qa: [
    {
      q: 'What is IndexedDB and when would you use it?',
      tag: 'Asked often',
      a: [
        'A transactional, asynchronous, NoSQL database built into the browser, scoped to the origin.',
        'Use it for large or structured data, files and Blobs, offline-first apps, caching API data, and anything a Web Worker or service worker needs to read.',
        'Use localStorage only for a few small settings.',
      ],
    },
    {
      q: 'How is IndexedDB different from localStorage?',
      tag: 'Asked often',
      a: [
        '**Async** (does not block the main thread) vs **sync**.',
        'Stores **structured clones** (objects, Dates, Blobs, typed arrays) vs **strings only**.',
        '**Large** quota vs ~5 MB.',
        'Has **indexes, cursors and transactions**; localStorage is a flat key-value map.',
        'Available in **workers**; localStorage is not.',
      ],
    },
    {
      q: 'Wrap an IndexedDB request in a promise and save and read a record.',
      tag: 'Coding',
      a: ['Turn `onsuccess`/`onerror` into `resolve`/`reject`, then use `async/await` for the rest.'],
      code: c(`
const promisify = (req) =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

async function openDb() {
  const req = indexedDB.open('app', 1);
  req.onupgradeneeded = () => req.result.createObjectStore('users', { keyPath: 'id' });
  return promisify(req);
}

const db = await openDb();
const tx = db.transaction('users', 'readwrite');
tx.objectStore('users').put({ id: 1, name: 'Ada' });
const user = await promisify(db.transaction('users').objectStore('users').get(1));`),
    },
    {
      q: 'What are object stores, keys and indexes?',
      a: [
        '**Object store:** a named collection of records, like a table.',
        '**Key:** identifies a record. Either in-line (`keyPath: "id"`), generated (`autoIncrement: true`), or passed separately to `put(value, key)`.',
        '**Index:** a secondary lookup on another property, e.g. `store.index("byEmail").get("a@b.com")`. It can be `unique`.',
      ],
    },
    {
      q: 'What is the difference between `add` and `put`?',
      a: ['`add` inserts and fails with a `ConstraintError` if the key already exists. `put` inserts or overwrites.'],
    },
    {
      q: 'How do you change the schema of an existing database?',
      a: [
        'Open it with a **higher version** number. `onupgradeneeded` runs with `event.oldVersion`, where you create or delete stores and indexes step by step.',
        'If another tab still has the old version open, it receives `versionchange` and should close its connection, or the upgrade stays **blocked**.',
      ],
    },
    {
      q: 'Why can a transaction commit before you expect?',
      a: [
        'A transaction closes automatically once it has no pending requests at the end of a task.',
        'If you `await fetch(...)` in the middle, the transaction is already finished when you come back, and the next request throws `TransactionInactiveError`. Fetch first, then open the transaction.',
      ],
    },
    {
      q: 'How do you iterate over many records?',
      a: [
        '`store.getAll()` (optionally with a key range and a count) returns everything at once.',
        'A **cursor** (`store.openCursor()`) walks records one at a time, which suits large stores and paging. `IDBKeyRange.bound(a, b)` limits the range.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const req = indexedDB.open('quiz-db-1', 1);
console.log('requested');
req.onupgradeneeded = () => {
  console.log('upgrade');
  req.result.createObjectStore('items', { keyPath: 'id' });
};
req.onsuccess = () => console.log('success');`),
      note: 'In a browser, the first time this database is opened.',
      options: ['requested\nupgrade\nsuccess', 'upgrade\nsuccess\nrequested', 'requested\nsuccess', 'requested\nsuccess\nupgrade'],
      answer: 0,
      explain: 'The API is async, so the sync log comes first. A new database triggers `upgradeneeded` before `success`.',
    },
    {
      type: 'output',
      code: c(`
const req = indexedDB.open('quiz-db-2', 1);
req.onupgradeneeded = () => req.result.createObjectStore('users', { keyPath: 'id' });
req.onsuccess = () => {
  const db = req.result;
  const tx = db.transaction('users', 'readwrite');
  const store = tx.objectStore('users');
  store.put({ id: 1, joined: new Date(0), tags: ['a'] });
  tx.oncomplete = () => {
    const get = db.transaction('users').objectStore('users').get(1);
    get.onsuccess = () => {
      const user = get.result;
      console.log(user.joined instanceof Date, Array.isArray(user.tags));
    };
  };
};`),
      note: 'In a browser.',
      options: ['true true', 'false true', 'false false', 'true false'],
      answer: 0,
      explain: 'IndexedDB stores structured clones, so Dates and arrays come back as real Dates and arrays, unlike JSON in localStorage.',
    },
    {
      type: 'output',
      code: c(`
const req = indexedDB.open('quiz-db-3', 1);
req.onupgradeneeded = () => req.result.createObjectStore('s', { keyPath: 'id' });
req.onsuccess = () => {
  const store = req.result.transaction('s', 'readwrite').objectStore('s');
  store.add({ id: 1, v: 'first' });
  const second = store.add({ id: 1, v: 'second' });
  second.onerror = (e) => {
    e.preventDefault();
    console.log(second.error.name);
  };
};`),
      note: 'In a browser.',
      options: ['ConstraintError', 'Nothing is logged', 'DataError', 'TypeError'],
      answer: 0,
      explain: '`add` refuses to overwrite an existing key. `put` would have replaced the record.',
    },
    {
      type: 'output',
      code: c(`
const req = indexedDB.open('quiz-db-4', 1);
req.onupgradeneeded = () => req.result.createObjectStore('n', { autoIncrement: true });
req.onsuccess = () => {
  const store = req.result.transaction('n', 'readwrite').objectStore('n');
  const a = store.add('x');
  const b = store.add('y');
  b.onsuccess = () => console.log(a.result, b.result);
};`),
      note: 'In a browser, the first time this database is opened.',
      options: ['1 2', '0 1', 'x y', 'undefined undefined'],
      answer: 0,
      explain: 'With `autoIncrement`, the generated keys start at 1. The result of `add` is the new key.',
    },
    {
      type: 'mcq',
      question: 'Where can you call `db.createObjectStore()`?',
      options: ['Anywhere after `open` succeeds', 'Only inside `onupgradeneeded`', 'Inside any `readwrite` transaction', 'Only in a service worker'],
      answer: 1,
      explain: 'Schema changes are only allowed during a version-change transaction, which runs in `onupgradeneeded`.',
    },
    {
      type: 'mcq',
      question: 'Inside a readwrite transaction you `await fetch(url)` and then call `store.put(data)`. What happens?',
      options: ['It works', 'It throws `TransactionInactiveError`', 'The put is queued until the fetch ends', 'The fetch is cancelled'],
      answer: 1,
      explain: 'The transaction auto-committed while you were waiting for the network. Fetch first, then open a new transaction.',
    },
    {
      type: 'truefalse',
      statement: 'IndexedDB can be used inside a Web Worker, but localStorage cannot.',
      answer: true,
      explain: 'Workers have `indexedDB` but no `localStorage` or `sessionStorage`.',
    },
  ],
};

export default topic;
