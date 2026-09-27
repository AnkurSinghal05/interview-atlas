import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'big-o',
  title: 'Big-O notation',
  level: 'beginner',
  tags: ['complexity', 'time', 'space'],
  summary: 'Big-O describes how the work grows as the input grows, ignoring constants and small terms.',
  keyPoints: [
    { title: 'Growth, not speed', text: 'O(n) means doubling the input roughly doubles the work. It says nothing about milliseconds.' },
    { title: 'Drop constants and small terms', text: '`O(2n + 10)` is just `O(n)`. `O(n² + n)` is `O(n²)`.' },
    {
      title: 'Nested loops multiply',
      text: 'A loop over n inside another loop over n is `O(n²)`. Loops one after another add up to `O(n)`.',
    },
    { title: 'Halving means log', text: 'Each step cutting the input in half, like binary search, gives `O(log n)`.' },
  ],
  qa: [
    {
      q: 'What does Big-O measure?',
      a: ['The upper bound on how running time or memory grows with input size n, usually for the worst case.'],
    },
    { q: 'Why do we drop constants?', a: ['For large n, the growth rate dominates. `100n` still beats `n²` once n passes 100.'] },
    {
      q: 'What is amortized O(1), like `array.push`?',
      a: ['Most pushes are O(1). Occasionally the array resizes in O(n), but spread across all pushes the average stays O(1).'],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'What is the time complexity?',
      code: c(`
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) sum += i * j;
}`),
      options: ['`O(n)`', '`O(n log n)`', '`O(n²)`', '`O(2n)`'],
      answer: 2,
      explain: 'n iterations inside n iterations: n × n.',
    },
    {
      type: 'mcq',
      question: 'Binary search on a sorted array of n items runs in…',
      options: ['`O(1)`', '`O(log n)`', '`O(n)`', '`O(n log n)`'],
      answer: 1,
      explain: 'Each comparison halves the remaining range.',
    },
    {
      type: 'mcq',
      question: 'What is the time complexity?',
      code: c(`
for (let i = 1; i < n; i *= 2) {
  for (let j = 0; j < n; j++) work();
}`),
      options: ['`O(n)`', '`O(log n)`', '`O(n log n)`', '`O(n²)`'],
      answer: 2,
      explain: 'The outer loop runs log n times because `i` doubles. Each pass does n work.',
    },
  ],
};

export default topic;
