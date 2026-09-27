import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'fetch',
  title: 'fetch and AbortController',
  level: 'intermediate',
  tags: ['HTTP', 'response.ok', 'cancel requests', 'timeouts', 'CORS'],
  summary: '`fetch` returns a promise for a `Response`. It only rejects on **network** failure, so you must check `response.ok` yourself.',
  keyPoints: [
    {
      title: 'Two awaits',
      text: 'The first `await` gives headers and status. Reading the body (`.json()`, `.text()`) is a second async step.',
      code: c(`
const res = await fetch('/api/user');
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const user = await res.json();`),
    },
    {
      title: '404 and 500 do not reject',
      text: 'A server that answers with an error status is still a successful fetch. `res.ok` is `true` only for 200–299.',
    },
    {
      title: 'Cancel with AbortController',
      text: 'Pass `signal` to `fetch`; calling `controller.abort()` rejects the promise with an `AbortError`.',
      code: c(`
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort();
// or a timeout:
fetch(url, { signal: AbortSignal.timeout(5000) });`),
    },
    {
      title: 'Sending data',
      text: 'Set `method`, `headers` and `body`. For JSON, stringify the body and set `Content-Type: application/json`.',
    },
  ],
  qa: [
    {
      q: 'Does `fetch` reject on a 404 or 500 response?',
      tag: 'Asked often',
      a: ['No. It only rejects on network errors, CORS failures or aborts. Check `response.ok` or `response.status` and throw yourself.'],
    },
    {
      q: 'How do you cancel a fetch request?',
      tag: 'Asked often',
      a: [
        'Create an `AbortController`, pass `controller.signal` in the options, and call `controller.abort()`.',
        'Common use: cancel the previous search request when the user types again, or on component unmount.',
      ],
    },
    {
      q: 'How do you add a timeout to fetch?',
      a: ['`AbortSignal.timeout(ms)`, or `Promise.race` with a timer promise (which does not cancel the request itself).'],
    },
    {
      q: 'How do you avoid race conditions with fast-changing requests?',
      a: ['Abort the previous request when starting a new one, or ignore responses that are not from the latest request (compare a request id).'],
    },
    {
      q: 'What is CORS in one line?',
      a: ['A browser rule that blocks reading responses from another origin unless that server sends headers like `Access-Control-Allow-Origin` allowing it.'],
    },
    {
      q: 'Write a fetch wrapper with retries.',
      tag: 'Coding',
      a: ['Retry on network errors or 5xx with a delay that grows each time.'],
      code: c(`
async function fetchWithRetry(url, opts = {}, retries = 3, delay = 500) {
  try {
    const res = await fetch(url, opts);
    if (res.status >= 500 && retries > 0) throw new Error(String(res.status));
    return res;
  } catch (err) {
    if (retries === 0 || err.name === 'AbortError') throw err;
    await new Promise((r) => setTimeout(r, delay));
    return fetchWithRetry(url, opts, retries - 1, delay * 2);
  }
}`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const controller = new AbortController();
controller.abort();
fetch('https://example.com', { signal: controller.signal })
  .then(() => console.log('done'))
  .catch((e) => console.log(e.name));`),
      note: 'Runs in a browser or Node 18+.',
      options: ['AbortError', 'done', 'TypeError', 'Nothing is logged'],
      answer: 0,
      explain: 'Passing an already-aborted signal rejects the fetch immediately with an `AbortError`.',
    },
    {
      type: 'mcq',
      question: 'The server replies with status 404. What happens?',
      code: c(`
fetch('/missing')
  .then((res) => console.log('then', res.ok))
  .catch(() => console.log('catch'));`),
      options: ['`then false` is logged', '`catch` is logged', '`then true` is logged', 'Nothing is logged'],
      answer: 0,
      explain: 'An HTTP error status is still a completed request, so the promise fulfils with `ok: false`.',
    },
    {
      type: 'mcq',
      question: 'What does `await res.json()` do if the body is not valid JSON?',
      options: ['Returns `null`', 'Returns the raw text', 'Rejects with a `SyntaxError`', 'Returns `undefined`'],
      answer: 2,
      explain: 'Body parsing is async and rejects when the JSON is invalid.',
    },
    {
      type: 'truefalse',
      statement: 'You can call `res.json()` twice on the same response.',
      answer: false,
      explain: 'The body is a stream that can only be read once. The second call rejects with "body used already". Use `res.clone()` if you need it twice.',
    },
    {
      type: 'mcq',
      question: 'Which fetch option is required to send a JSON body correctly?',
      options: ['`mode: "cors"`', '`headers: { "Content-Type": "application/json" }` with a stringified body', '`credentials: "include"`', '`cache: "no-store"`'],
      answer: 1,
      explain: 'Fetch does not serialise objects; stringify them and tell the server the content type.',
    },
  ],
};

export default topic;
