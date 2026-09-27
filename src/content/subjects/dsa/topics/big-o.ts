import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'big-o',
  title: 'Big-O notation',
  level: 'beginner',
  masteryMinutes: 90,
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
  comparisons: [
    {
      items: ['Big-O', 'Big-Θ (Theta)', 'Big-Ω (Omega)'],
      rows: [
        { aspect: 'Kind of bound', values: ['Upper: grows no faster than', 'Tight: grows exactly like', 'Lower: grows at least as fast as'], key: true },
        { aspect: 'Linear search, worst case', values: ['O(n) (O(n²) is also true, just loose)', 'Θ(n)', 'Ω(n)'] },
        { aspect: 'Comparison sorting', values: ['Merge sort is O(n log n)', 'Merge sort is Θ(n log n)', 'Any comparison sort is Ω(n log n)'] },
        { aspect: 'In interviews', values: ['What everyone says', 'What they usually mean', 'Rarely asked, except for lower bounds'] },
      ],
      reveal: 'These are bounds, not cases. "Best, average, worst case" picks which input you analyse; O, Θ and Ω describe how tightly you bound it.',
      whenToUse: ['Stating the complexity of your solution.', 'Being precise that the bound is tight.', 'Proving nothing can do better, like sorting by comparisons.'],
    },
    {
      items: ['Best case', 'Average case', 'Worst case'],
      rows: [
        { aspect: 'Quick sort', values: ['O(n log n)', 'O(n log n)', 'O(n²) with bad pivots'] },
        { aspect: 'Hash map lookup', values: ['O(1)', 'O(1)', 'O(n) if everything collides'] },
        { aspect: 'Linear search', values: ['O(1): first element', 'O(n)', 'O(n)'] },
        { aspect: 'Insertion sort', values: ['O(n): already sorted', 'O(n²)', 'O(n²)'] },
      ],
      reveal: 'Interviewers want the worst case unless they say otherwise, but mention the average when it is what makes the structure useful (hash maps, quick sort).',
      whenToUse: ['Pointing out a fast path, like insertion sort on nearly sorted data.', 'Randomised or hashing structures.', 'The default answer.'],
    },
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
