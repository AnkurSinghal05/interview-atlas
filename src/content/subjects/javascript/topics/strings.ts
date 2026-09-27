import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'strings',
  title: 'Strings and template literals',
  level: 'beginner',
  masteryMinutes: 60,
  tags: ['immutability', 'template literals', 'slice', 'split', 'tagged templates'],
  summary: 'Strings are **immutable** sequences of UTF-16 code units. Every method returns a new string.',
  keyPoints: [
    {
      title: 'Immutable',
      text: '`str[0] = "x"` does nothing. Methods like `toUpperCase` and `replace` return new strings.',
    },
    {
      title: 'Template literals',
      text: 'Backticks allow `${expression}` interpolation and real line breaks.',
      code: c(`
const name = 'Ada';
\`Hello, \${name}! 2 + 2 = \${2 + 2}\``),
    },
    {
      title: 'Everyday methods',
      text: '`slice`, `includes`, `startsWith`, `indexOf`, `split`, `trim`, `padStart`, `replaceAll`, `at(-1)`.',
    },
    {
      title: 'Length counts code units',
      text: 'Emoji and some characters take two units, so `"😀".length` is 2. `[...str]` splits by code point.',
    },
  ],
  qa: [
    {
      q: 'How do you reverse a string?',
      tag: 'Coding',
      a: ['`str.split("").reverse().join("")`. For emoji-safe reversal use `[...str].reverse().join("")`.'],
    },
    {
      q: 'Check if a string is a palindrome.',
      tag: 'Coding',
      a: ['Normalise (lowercase, remove non-alphanumerics), then compare with its reverse or with two pointers.'],
      code: c(`
function isPalindrome(s) {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let i = 0, j = t.length - 1;
  while (i < j) if (t[i++] !== t[j--]) return false;
  return true;
}`),
    },
    {
      q: 'What is the difference between `slice`, `substring` and `substr`?',
      a: [
        '`slice(start, end)` supports negative indexes.',
        '`substring(start, end)` treats negatives as 0 and swaps arguments if start > end.',
        '`substr(start, length)` is deprecated.',
      ],
    },
    {
      q: 'What is a tagged template?',
      a: ['A function placed before a template literal. It receives the string parts and the values separately, e.g. for escaping HTML or building SQL safely.'],
      code: c(`
function tag(strings, ...values) {
  return strings.raw.join('|') + ' / ' + values.join(',');
}
tag\`a\${1}b\${2}c\`; // "a|b|c / 1,2"`),
    },
    {
      q: 'How does `replace` differ from `replaceAll`?',
      a: ['`replace` with a string pattern replaces only the first match. Use `replaceAll` or a regex with the `g` flag for all matches.'],
    },
    {
      q: 'Count character frequency in a string.',
      tag: 'Coding',
      a: ['Loop and count into an object or `Map`.'],
      code: c(`
const freq = {};
for (const ch of 'hello') freq[ch] = (freq[ch] ?? 0) + 1;
// { h: 1, e: 1, l: 2, o: 1 }`),
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const s = 'hello';
console.log(s.toUpperCase(), s);
console.log(s.at(-1), s.slice(-3));`),
      options: ['HELLO hello\no llo', 'HELLO HELLO\no llo', 'HELLO hello\nundefined llo', 'HELLO hello\no hel'],
      answer: 0,
      explain: 'Methods return new strings and never change the original. Negative indexes count from the end.',
    },
    {
      type: 'output',
      code: c(`
console.log('a-b-c'.replace('-', '+'));
console.log('a-b-c'.replaceAll('-', '+'));
console.log('a-b-c'.split('-', 2));`),
      options: ["a+b-c\na+b+c\n[ 'a', 'b' ]", "a+b+c\na+b+c\n[ 'a', 'b', 'c' ]", "a+b-c\na+b+c\n[ 'a', 'b', 'c' ]", "a+b-c\na+b-c\n[ 'a', 'b' ]"],
      answer: 0,
      explain: '`replace` with a string only changes the first match. `split`\'s second argument limits the number of pieces.',
    },
    {
      type: 'output',
      code: c(`
console.log('😀'.length, [...'😀'].length);`),
      options: ['2 1', '1 1', '2 2', '4 1'],
      answer: 0,
      explain: 'The emoji is one code point stored as two UTF-16 code units. Spreading iterates by code point.',
    },
    {
      type: 'output',
      code: c(`
const a = 5, b = 10;
console.log(\`sum: \${a + b}, \${a > b ? 'a' : 'b'} is bigger\`);`),
      options: ['sum: 15, b is bigger', 'sum: 510, b is bigger', 'sum: ${a + b}, b is bigger', 'sum: 15, a is bigger'],
      answer: 0,
      explain: 'Any expression can go inside `${}`, including maths and ternaries.',
    },
    {
      type: 'output',
      code: c(`
console.log('abc'.substring(2, 0));
console.log('abc'.slice(2, 0));`),
      options: ['ab\n', 'ab\nab', '\nab', '\n'],
      answer: 0,
      explain: '`substring` swaps the arguments when start > end. `slice` returns an empty string.',
    },
    {
      type: 'output',
      code: c(`
console.log('5'.padStart(3, '0'), 'abc'.repeat(2), '  hi  '.trim().length);`),
      options: ['005 abcabc 2', '500 abcabc 2', '005 abc,abc 6', '005 abcabc 6'],
      answer: 0,
      explain: '`padStart` pads on the left, `repeat` concatenates, `trim` removes surrounding whitespace.',
    },
  ],
};

export default topic;
