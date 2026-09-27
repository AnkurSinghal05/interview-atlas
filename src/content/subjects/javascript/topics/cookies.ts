import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'cookies',
  title: 'Cookies in depth',
  level: 'intermediate',
  masteryMinutes: 75,
  reviseMinutes: 25,
  tags: ['document.cookie', 'Set-Cookie', 'HttpOnly', 'Secure', 'SameSite', 'CSRF', 'XSS', 'third-party cookies'],
  summary: 'A cookie is a small name=value pair the browser stores and **sends back to the server** on matching requests. Its attributes decide who can read it and when it is sent.',
  keyPoints: [
    {
      title: 'How cookies are set',
      text: 'The server sends a `Set-Cookie` response header (one per cookie), or JavaScript writes `document.cookie`. The browser then adds a `Cookie` header to matching requests.',
      code: c(`
HTTP/1.1 200 OK
Set-Cookie: session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600

GET /account HTTP/1.1
Cookie: session=abc123; theme=dark`),
    },
    {
      title: 'The attributes',
      text: '`Expires`/`Max-Age`: lifetime (none = session cookie). `Domain`/`Path`: which URLs get it. `Secure`: HTTPS only. `HttpOnly`: hidden from JS. `SameSite`: whether cross-site requests carry it. `Partitioned`: separate jar per top-level site (CHIPS).',
    },
    {
      title: '`document.cookie` is a strange API',
      text: 'Reading returns **all** visible cookies as one `"a=1; b=2"` string, without attributes. Assigning **adds or updates one** cookie; it does not replace the others. Delete by setting an expiry in the past.',
      code: c(`
document.cookie = 'theme=dark; path=/; max-age=31536000; samesite=lax';
document.cookie = 'lang=en';
document.cookie;       // "theme=dark; lang=en"
document.cookie = 'lang=; max-age=0'; // delete`),
    },
    {
      title: 'Limits',
      text: 'About 4 KB per cookie (name + value + attributes) and a per-domain count limit (browsers allow at least 50). Every cookie adds bytes to every request, so keep them small.',
    },
  ],
  qa: [
    {
      q: 'What is a cookie and what is it used for?',
      tag: 'Asked often',
      a: [
        'A small piece of data the server asks the browser to store and send back with later requests.',
        'Uses: **session management** (logins, carts), **personalisation** (theme, language), and **tracking** (analytics, ads).',
        'HTTP is stateless; cookies are how a server recognises the same browser across requests.',
      ],
    },
    {
      q: 'Explain the cookie attributes.',
      tag: 'Asked often',
      a: [
        '`Expires=<date>` or `Max-Age=<seconds>`: when it expires. With neither, it is a **session cookie** that ends when the browser session ends. `Max-Age` wins if both are set.',
        '`Domain=example.com`: also sent to subdomains. Without it, the cookie is **host-only** (exact host only).',
        '`Path=/app`: only sent for URLs under that path.',
        '`Secure`: only sent over HTTPS.',
        '`HttpOnly`: not readable from JavaScript (`document.cookie`).',
        '`SameSite=Strict | Lax | None`: controls sending on cross-site requests.',
      ],
    },
    {
      q: 'What is the difference between `SameSite=Strict`, `Lax` and `None`?',
      tag: 'Asked often',
      a: [
        '**Strict:** never sent on cross-site requests, not even when following a link from another site. Safest, but users arriving from a link appear logged out.',
        '**Lax** (the browser default when missing): sent on top-level `GET` navigations from other sites (clicking a link), but not on cross-site `POST`s, iframes, images or `fetch`.',
        '**None:** sent on all requests, including cross-site. Requires `Secure`. Needed for embedded widgets and third-party cookies.',
      ],
    },
    {
      q: 'What is the difference between session and persistent cookies?',
      a: [
        'A **session cookie** has no `Expires`/`Max-Age` and is deleted when the browser session ends (some browsers restore sessions, so do not rely on it).',
        'A **persistent cookie** lives until its expiry date or until cleared.',
      ],
    },
    {
      q: 'What is the difference between first-party and third-party cookies?',
      a: [
        '**First-party:** set by the site in the address bar.',
        '**Third-party:** set by another site whose content is embedded (an ad, a widget, a tracking pixel). Used for cross-site tracking.',
        'Safari and Firefox block third-party cookies by default; Chrome restricts them. `Partitioned` cookies (CHIPS) give embeds a separate cookie jar per top-level site.',
      ],
    },
    {
      q: 'How do you read, write and delete a cookie in JavaScript?',
      tag: 'Coding',
      a: [
        'Write: assign one `name=value; attributes` string to `document.cookie`. Encode values with `encodeURIComponent`.',
        'Read: split `document.cookie` on `"; "` and find the name.',
        'Delete: set the same name, **path and domain** with `max-age=0` (or a past `expires`). A different path creates a new cookie instead of deleting.',
      ],
      code: c(`
function setCookie(name, value, days = 7) {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = \`\${name}=\${encodeURIComponent(value)}; max-age=\${maxAge}; path=/; samesite=lax\`;
}

function getCookie(name) {
  const pair = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return pair ? decodeURIComponent(pair.slice(name.length + 1)) : null;
}

function deleteCookie(name) {
  document.cookie = \`\${name}=; max-age=0; path=/\`;
}`),
    },
    {
      q: 'How do cookies relate to XSS and CSRF?',
      tag: 'Asked often',
      a: [
        '**XSS** (injected script runs on your page): it can read any cookie that is not `HttpOnly` and send it to an attacker. Defence: `HttpOnly` for session cookies, plus escaping output and a Content Security Policy.',
        '**CSRF** (another site makes the browser send a request to yours): the browser attaches your cookies automatically, so the request is authenticated. Defence: `SameSite=Lax/Strict`, CSRF tokens, and checking the `Origin` header.',
        '`HttpOnly` does **not** stop CSRF, and `SameSite` does **not** stop XSS. You need both.',
      ],
    },
    {
      q: 'What are the `__Host-` and `__Secure-` cookie prefixes?',
      a: [
        '`__Secure-name`: the browser only accepts it if it has `Secure`.',
        '`__Host-name`: must have `Secure`, `Path=/`, and **no** `Domain`, so it is locked to one exact host and subdomains cannot overwrite it. The strongest choice for session cookies.',
      ],
    },
    {
      q: 'Does `fetch` send cookies?',
      a: [
        'Same-origin requests: yes, by default (`credentials: "same-origin"`).',
        'Cross-origin: only with `credentials: "include"`, and the server must reply with `Access-Control-Allow-Credentials: true` and a specific (non-`*`) `Access-Control-Allow-Origin`. `SameSite` rules still apply.',
      ],
    },
    {
      q: 'When would you choose a cookie over localStorage?',
      a: [
        'When the **server** needs the value on every request (session id, server-rendered language/theme).',
        'When the value must be hidden from JavaScript (`HttpOnly`).',
        'Otherwise use localStorage or IndexedDB, so you do not add bytes to every request.',
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
document.cookie = 'a=1';
document.cookie = 'b=2';
console.log(document.cookie);`),
      note: 'In a browser, on a page with no other cookies.',
      options: ['a=1; b=2', 'b=2', 'a=1b=2', 'a=1'],
      answer: 0,
      explain: 'Each assignment adds or updates one cookie. Reading returns all of them joined with `"; "`.',
    },
    {
      type: 'output',
      code: c(`
document.cookie = 'theme=light';
document.cookie = 'theme=dark';
document.cookie = 'size=l; max-age=0';
console.log(document.cookie);`),
      note: 'In a browser, on a page with no other cookies.',
      options: ['theme=dark', 'theme=light; theme=dark', 'theme=dark; size=l', 'theme=light'],
      answer: 0,
      explain: 'Same name, path and domain overwrites. `max-age=0` expires the cookie immediately, so `size` is never stored.',
    },
    {
      type: 'output',
      code: c(`
document.cookie = 'user=ada; max-age=3600; samesite=lax; path=/';
console.log(document.cookie);`),
      note: 'In a browser, on a page with no other cookies.',
      options: ['user=ada', 'user=ada; max-age=3600; samesite=lax; path=/', '', 'user=ada; path=/'],
      answer: 0,
      explain: 'Attributes are instructions to the browser. Reading `document.cookie` only ever returns `name=value` pairs.',
    },
    {
      type: 'output',
      code: c(`
document.cookie = 'greeting=' + encodeURIComponent('hi; there');
const raw = document.cookie;
const value = decodeURIComponent(raw.split('=')[1]);
console.log(raw);
console.log(value);`),
      note: 'In a browser, on a page with no other cookies.',
      options: ['greeting=hi%3B%20there\nhi; there', 'greeting=hi; there\nhi', 'greeting=hi\nhi', 'greeting=hi%3B%20there\nhi%3B%20there'],
      answer: 0,
      explain: 'A raw `;` would end the cookie value, so values are encoded before writing and decoded after reading.',
    },
    {
      type: 'output',
      code: c(`
document.cookie = 'count=' + 1;
document.cookie = 'count=' + 2 + '; path=/nowhere';
console.log(document.cookie);`),
      note: 'In a browser at the root path `/`, with no other cookies.',
      options: ['count=1', 'count=2', 'count=1; count=2', ''],
      answer: 0,
      explain: 'The second write creates a **separate** cookie scoped to `/nowhere`, which this page cannot see. Name, path and domain together identify a cookie.',
    },
    {
      type: 'mcq',
      question: 'An attacker injects a script into your page. Which session cookie can the script NOT read?',
      options: ['`session=x; Secure`', '`session=x; SameSite=Strict`', '`session=x; HttpOnly`', '`session=x; Path=/`'],
      answer: 2,
      explain: 'Only `HttpOnly` hides a cookie from JavaScript. `Secure` and `SameSite` control when it is sent, not who can read it.',
    },
    {
      type: 'mcq',
      question: 'Your session cookie is `SameSite=Lax`. A user on evil.com submits a hidden form that POSTs to your site. Is the cookie sent?',
      options: ['Yes', 'No', 'Only over HTTPS', 'Only if the user clicked a link first'],
      answer: 1,
      explain: '`Lax` blocks cookies on cross-site POSTs (and iframes, images, fetch), which is exactly the classic CSRF attack.',
    },
    {
      type: 'mcq',
      question: 'Which cookie will the browser reject?',
      options: ['`a=1; SameSite=None; Secure`', '`a=1; SameSite=None`', '`a=1; SameSite=Lax`', '`a=1; SameSite=Strict; HttpOnly`'],
      answer: 1,
      explain: 'Modern browsers require `Secure` whenever `SameSite=None` is used.',
    },
    {
      type: 'mcq',
      question: 'A cookie is set on `app.example.com` with `Domain=example.com`. Where is it sent?',
      options: ['Only to app.example.com', 'To example.com and all its subdomains', 'To every site', 'Nowhere until the user logs in'],
      answer: 1,
      explain: 'Setting `Domain` widens the scope to that domain and all subdomains. Omit it to keep a host-only cookie.',
    },
    {
      type: 'truefalse',
      statement: '`HttpOnly` protects a session cookie against CSRF attacks.',
      answer: false,
      explain: '`HttpOnly` stops scripts reading the cookie (XSS theft). CSRF works because the browser **sends** the cookie automatically; `SameSite` and CSRF tokens defend against that.',
    },
    {
      type: 'truefalse',
      statement: 'A cookie with neither `Expires` nor `Max-Age` is deleted when the browser session ends.',
      answer: true,
      explain: 'That makes it a session cookie. Note that some browsers restore session cookies when they restore tabs.',
    },
  ],
};

export default topic;
