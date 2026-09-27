import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'contribution',
  title: 'Subarrays & contribution technique',
  level: 'intermediate',
  masteryMinutes: 150,
  tags: ['subarrays', 'contribution', 'sum of subarrays', 'xor', 'counting'],
  summary:
    'Instead of listing every subarray (or pair) and adding them up, ask how much each element contributes to the total, then add those contributions.',
  keyPoints: [
    {
      title: 'Flip the question',
      text: 'Brute force: for each subarray, add its elements. Contribution: for each element, count how many subarrays include it, then multiply.',
    },
    {
      title: 'How many subarrays include a[i]?',
      text: 'Start anywhere in `0..i` (`i + 1` choices), end anywhere in `i..n-1` (`n - i` choices). Total `(i + 1) × (n - i)`.',
      code: c(`
// sum of all subarray sums
let total = 0;
for (let i = 0; i < n; i++) total += a[i] * (i + 1) * (n - i);`),
    },
    {
      title: 'Odd-length only',
      text: 'Of those `(i+1)(n-i)` subarrays, `Math.ceil(count / 2)` have odd length. That count is `Math.floor(((i+1)(n-i) + 1) / 2)`.',
    },
    {
      title: 'Pairs and bits',
      text: 'For sums over pairs, look at each bit alone. Bit b adds `2ᵇ` to `x ^ y` exactly when one of them has it set: `ones × zeros` pairs.',
    },
    {
      title: 'Generating subarrays',
      text: 'Two loops (start, end) give every subarray. Keep a running value as `end` grows so you do not re-add from scratch: O(n²) instead of O(n³).',
    },
  ],
  comparisons: [
    {
      title: 'Enumerate subarrays vs contribution technique',
      items: ['Enumerate every subarray', 'Contribution technique'],
      rows: [
        { aspect: 'Idea', values: ['Visit each subarray and add its sum', 'Each element is added `(i + 1) × (n − i)` times, so add `arr[i] × (i + 1) × (n − i)`'], key: true },
        { aspect: 'Loops', values: ['3 (2 with carry forward)', '1'] },
        { aspect: 'Time', values: ['O(n³), or O(n²) with carry forward', 'O(n)'], key: true },
        { aspect: 'Space', values: ['O(1)', 'O(1)'] },
        { aspect: 'Needs', values: ['Nothing', 'A formula for how many subarrays contain index i'] },
      ],
      reveal: 'Flip the question: instead of "what is the sum of each subarray?", ask "how many subarrays does each element appear in?". The answer is `(i + 1)` choices of start × `(n − i)` choices of end.',
      whenToUse: ['You need the subarrays themselves, or each one has a condition you must check.', 'You only need a total over all subarrays (sum, sum of odd-length ones, and similar).'],
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: 'Sum of all subarray sums of [1, 2, 3]',
      rows: { a: [1, 2, 3], count: [null, null, null], adds: [null, null, null] },
      steps: [
        {
          note: 'The 6 subarrays are `[1] [2] [3] [1,2] [2,3] [1,2,3]`. Their sums add to `1+2+3+3+5+6 = 20`. Can we get 20 without listing them?',
          vars: { n: 3 },
        },
        {
          note: 'Index 0: starts in `0..0` (1 way), ends in `0..2` (3 ways). It is in `1 × 3 = 3` subarrays, adding `1 × 3 = 3`.',
          pointers: { i: 0 },
          window: { from: 0, to: 2 },
          rows: { count: [3, null, null], adds: [3, null, null] },
          vars: { n: 3, total: 3 },
        },
        {
          note: 'Index 1: `2 × 2 = 4` subarrays, adding `2 × 4 = 8`.',
          pointers: { i: 1 },
          window: { from: 0, to: 2 },
          rows: { count: [3, 4, null], adds: [3, 8, null] },
          vars: { n: 3, total: 11 },
        },
        {
          note: 'Index 2: `3 × 1 = 3` subarrays, adding `3 × 3 = 9`. Total `3 + 8 + 9 = 20`, in O(n).',
          pointers: { i: 2 },
          window: { from: 0, to: 2 },
          rows: { count: [3, 4, 3], adds: [3, 8, 9] },
          vars: { n: 3, total: 20 },
        },
      ],
    },
  ],
  qa: [
    {
      q: 'When does contribution technique apply?',
      tag: 'Pattern spotting',
      a: [
        'The question asks for a total over all subarrays, all pairs, or all subsets.',
        'Each element’s share can be counted independently (a sum, a count, a bit), so you can add shares instead of enumerating.',
      ],
    },
    {
      q: 'Sum of all subarray minimums uses contribution too. What changes?',
      a: [
        'a[i] contributes only to subarrays where it is the minimum.',
        'Find how far it can stretch left and right before hitting a smaller value (with a monotonic stack), then count is `left × right`.',
      ],
    },
    {
      q: 'Why split XOR problems by bit?',
      a: ['XOR has no carries, so each bit behaves on its own. Count per bit, multiply by `2ᵇ`, add up.'],
    },
  ],
  problems: [
    {
      id: 'sum-subarray-sums',
      title: 'Sum of all subarray sums',
      difficulty: 'easy',
      statement: 'Return the sum of the sums of every contiguous subarray of `nums`.',
      fn: 'sumOfSubarraySums',
      params: ['nums'],
      examples: [
        { args: [[1, 2, 3]], output: 20 },
        { args: [[2, 1, 3]], output: 19 },
        { args: [[5]], output: 5 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Every start, every end, add up the elements in between.'],
          code: c(`
function sumOfSubarraySums(nums) {
  let total = 0;
  for (let s = 0; s < nums.length; s++)
    for (let e = s; e < nums.length; e++)
      for (let i = s; i <= e; i++) total += nums[i];
  return total;
}`),
          time: 'O(n³)',
          space: 'O(1)',
        },
        {
          name: 'Running sum',
          idea: ['For a fixed start, each new end just adds one element to the previous sum.'],
          code: c(`
function sumOfSubarraySums(nums) {
  let total = 0;
  for (let s = 0; s < nums.length; s++) {
    let sum = 0;
    for (let e = s; e < nums.length; e++) {
      sum += nums[e];
      total += sum;
    }
  }
  return total;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Contribution',
          idea: ['`nums[i]` is inside `(i + 1) × (n - i)` subarrays, so it adds `nums[i] × (i + 1) × (n - i)`.'],
          code: c(`
function sumOfSubarraySums(nums) {
  const n = nums.length;
  let total = 0;
  for (let i = 0; i < n; i++) total += nums[i] * (i + 1) * (n - i);
  return total;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'sum-odd-length-subarrays',
      title: 'Sum of all odd-length subarrays',
      difficulty: 'easy',
      statement: 'Return the sum of every element of every odd-length subarray.',
      fn: 'sumOddLength',
      params: ['nums'],
      examples: [
        { args: [[1, 4, 2, 5, 3]], output: 58 },
        { args: [[1, 2]], output: 3 },
        { args: [[10, 11, 12]], output: 66 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Every start, every odd length, add the elements.'],
          code: c(`
function sumOddLength(nums) {
  let total = 0;
  for (let s = 0; s < nums.length; s++)
    for (let e = s; e < nums.length; e += 2)
      for (let i = s; i <= e; i++) total += nums[i];
  return total;
}`),
          time: 'O(n³)',
          space: 'O(1)',
        },
        {
          name: 'Prefix sum',
          idea: ['Each subarray sum is `P[e+1] - P[s]`, so only the two outer loops remain.'],
          code: c(`
function sumOddLength(nums) {
  const P = [0];
  nums.forEach((x, i) => P.push(P[i] + x));
  let total = 0;
  for (let s = 0; s < nums.length; s++)
    for (let e = s; e < nums.length; e += 2) total += P[e + 1] - P[s];
  return total;
}`),
          time: 'O(n²)',
          space: 'O(n)',
        },
        {
          name: 'Contribution',
          idea: ['`nums[i]` is in `(i+1)(n-i)` subarrays; a little over half of them (rounded up) have odd length.'],
          code: c(`
function sumOddLength(nums) {
  const n = nums.length;
  let total = 0;
  for (let i = 0; i < n; i++) {
    const all = (i + 1) * (n - i);
    total += nums[i] * Math.ceil(all / 2);
  }
  return total;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'sum-pair-xor',
      title: 'Sum of XOR of all pairs',
      difficulty: 'medium',
      statement: 'Return the sum of `nums[i] ^ nums[j]` over all pairs `i < j`. Values are non-negative and below 2³⁰.',
      fn: 'pairXorSum',
      params: ['nums'],
      examples: [
        { args: [[1, 2, 3]], output: 6, note: '1^2 + 1^3 + 2^3 = 3 + 2 + 1' },
        { args: [[5, 9, 7, 6]], output: 47 },
        { args: [[4]], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['XOR every pair.'],
          code: c(`
function pairXorSum(nums) {
  let total = 0;
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++) total += nums[i] ^ nums[j];
  return total;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Contribution per bit',
          idea: [
            'Look at one bit b. A pair has it set in their XOR when exactly one of them has it: `ones × zeros` pairs.',
            'Each of those adds `2ᵇ`. Repeat for all 30 bits.',
          ],
          code: c(`
function pairXorSum(nums) {
  const n = nums.length;
  let total = 0;
  for (let b = 0; b < 30; b++) {
    let ones = 0;
    for (const x of nums) if ((x >> b) & 1) ones++;
    total += ones * (n - ones) * 2 ** b;
  }
  return total;
}`),
          time: 'O(30·n)',
          space: 'O(1)',
        },
      ],
      notes: ['O(30·n) is O(n): the bit count is a constant set by the value range.'],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'In an array of length 4, how many subarrays include index 1?',
      options: ['`4`', '`6`', '`3`', '`8`'],
      answer: 1,
      explain: '`(i + 1)(n - i) = 2 × 3 = 6`.',
    },
    {
      type: 'output',
      code: c(`
const a = [2, 2];
let total = 0;
for (let i = 0; i < a.length; i++) total += a[i] * (i + 1) * (a.length - i);
console.log(total);`),
      options: ['`4`', '`8`', '`6`', '`12`'],
      answer: 1,
      explain: 'Subarrays `[2] [2] [2,2]` sum to `2 + 2 + 4 = 8`. Each element is in 2 subarrays: `2×2 + 2×2 = 8`.',
    },
    {
      type: 'mcq',
      question: 'For the pair-XOR sum, 3 numbers have bit 2 set and 5 do not. How much does bit 2 add?',
      options: ['`15`', '`60`', '`32`', '`120`'],
      answer: 1,
      explain: '`ones × zeros × 2² = 3 × 5 × 4 = 60`.',
    },
  ],
};

export default topic;
