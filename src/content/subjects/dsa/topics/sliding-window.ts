import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'sliding-window',
  title: 'Sliding window',
  level: 'intermediate',
  tags: ['sliding window', 'fixed window', 'variable window', 'substring', 'subarray'],
  summary:
    'Keep a contiguous window and update its answer as it moves: add what enters, remove what leaves. Each element enters and leaves once, so the scan is O(n).',
  keyPoints: [
    {
      title: 'Fixed size k',
      text: 'Build the first window, then slide: add `a[i]`, subtract `a[i - k]`. No inner loop.',
      code: c(`
let sum = 0;
for (let i = 0; i < k; i++) sum += a[i];
let best = sum;
for (let i = k; i < a.length; i++) {
  sum += a[i] - a[i - k];
  best = Math.max(best, sum);
}`),
    },
    {
      title: 'Variable size',
      text: 'Grow the right edge every step. While the window breaks the rule, shrink from the left. Record the answer when the window is valid.',
      code: c(`
let l = 0;
for (let r = 0; r < a.length; r++) {
  add(a[r]);
  while (!valid()) remove(a[l++]);
  best = Math.max(best, r - l + 1);
}`),
    },
    {
      title: 'Why it is O(n)',
      text: 'It looks like a nested loop, but `l` only moves forward and never passes `r`. Across the whole run, `l` moves at most n times.',
    },
    {
      title: 'Window count',
      text: 'An array of length n has `n - k + 1` windows of size k.',
    },
    {
      title: 'When it breaks',
      text: 'Shrinking must make the window "more valid". With negative numbers a sum can grow when you drop an element, so use prefix sums + a hash map instead.',
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: 'Max sum of a window of size 3',
      code: c(`
let sum = a[0] + a[1] + a[2];
let best = sum;
for (let i = 3; i < a.length; i++) {
  sum += a[i] - a[i - 3];
  best = Math.max(best, sum);
}`),
      rows: { a: [2, 1, 5, 1, 3, 2, 6] },
      steps: [
        { line: 1, note: 'First window `[2, 1, 5]` sums to 8.', window: { from: 0, to: 2 }, vars: { sum: 8, best: 8 } },
        { line: 4, note: '1 enters, 2 leaves: `8 + 1 - 2 = 7`.', window: { from: 1, to: 3 }, pointers: { in: 3, out: 0 }, vars: { sum: 7, best: 8 } },
        { line: 4, note: '3 enters, 1 leaves: `7 + 3 - 1 = 9`. New best.', window: { from: 2, to: 4 }, pointers: { in: 4, out: 1 }, vars: { sum: 9, best: 9 } },
        { line: 4, note: '2 enters, 5 leaves: `9 + 2 - 5 = 6`.', window: { from: 3, to: 5 }, pointers: { in: 5, out: 2 }, vars: { sum: 6, best: 9 } },
        { line: 5, note: '6 enters, 1 leaves: `6 + 6 - 1 = 11`. Best is **11** from `[3, 2, 6]`, with 2 operations per slide.', window: { from: 4, to: 6 }, pointers: { in: 6, out: 3 }, vars: { sum: 11, best: 11 } },
      ],
    },
  ],
  qa: [
    {
      q: 'How do you spot a sliding window problem?',
      tag: 'Pattern spotting',
      a: [
        'The words "contiguous subarray" or "substring".',
        'Asked for the longest / shortest / count of windows meeting a condition, or a best value over windows of size k.',
        'The condition changes in one direction as the window grows (sum of positives only goes up, distinct count only goes up).',
      ],
    },
    {
      q: 'Longest vs shortest window: what changes in the template?',
      a: [
        '**Longest valid**: shrink while invalid, then record `r - l + 1` (window is valid after the loop).',
        '**Shortest valid**: shrink while valid, recording the length inside the loop before each shrink.',
      ],
    },
    {
      q: 'What do you keep inside the window?',
      a: ['Whatever the rule needs in O(1): a running sum, a count of zeros, a `Map` of character counts, or a deque for window max.'],
    },
  ],
  problems: [
    {
      id: 'max-sum-window-k',
      title: 'Maximum sum of a subarray of size k',
      difficulty: 'easy',
      statement: 'Return the largest sum of any contiguous subarray of exactly `k` elements.',
      fn: 'maxSumK',
      params: ['nums', 'k'],
      examples: [
        { args: [[2, 1, 5, 1, 3, 2, 6], 3], output: 11 },
        { args: [[1, 4, 2, 10, 23, 3, 1, 0, 20], 4], output: 39 },
        { args: [[-1, -2, -3], 2], output: -3 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Sum each of the `n - k + 1` windows from scratch.'],
          code: c(`
function maxSumK(nums, k) {
  let best = -Infinity;
  for (let s = 0; s + k <= nums.length; s++) {
    let sum = 0;
    for (let i = s; i < s + k; i++) sum += nums[i];
    best = Math.max(best, sum);
  }
  return best;
}`),
          time: 'O(n·k)',
          space: 'O(1)',
        },
        {
          name: 'Prefix sum',
          idea: ['Each window is `P[s + k] - P[s]`.'],
          code: c(`
function maxSumK(nums, k) {
  const P = [0];
  nums.forEach((x, i) => P.push(P[i] + x));
  let best = -Infinity;
  for (let s = 0; s + k <= nums.length; s++) best = Math.max(best, P[s + k] - P[s]);
  return best;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Sliding window',
          idea: ['Add the element entering, subtract the one leaving.'],
          code: c(`
function maxSumK(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'longest-no-repeat',
      title: 'Longest substring without repeating characters',
      difficulty: 'medium',
      statement: 'Return the length of the longest substring of `s` with all distinct characters.',
      fn: 'lengthOfLongestSubstring',
      params: ['s'],
      examples: [
        { args: ['abcabcbb'], output: 3 },
        { args: ['bbbbb'], output: 1 },
        { args: ['pwwkew'], output: 3 },
        { args: [''], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['From every start, extend with a `Set` until a character repeats.'],
          code: c(`
function lengthOfLongestSubstring(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const seen = new Set();
    for (let j = i; j < s.length && !seen.has(s[j]); j++) seen.add(s[j]);
    best = Math.max(best, seen.size);
  }
  return best;
}`),
          time: 'O(n²)',
          space: 'O(k) alphabet',
        },
        {
          name: 'Window + set',
          idea: ['Grow right. While the new character is already in the window, remove from the left.'],
          code: c(`
function lengthOfLongestSubstring(s) {
  const inWin = new Set();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    while (inWin.has(s[r])) inWin.delete(s[l++]);
    inWin.add(s[r]);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(k)',
        },
        {
          name: 'Window + last index',
          idea: ['Remember where each character was last seen and jump `l` straight past it.'],
          code: c(`
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let l = 0, best = 0;
  for (let r = 0; r < s.length; r++) {
    if (last.has(s[r]) && last.get(s[r]) >= l) l = last.get(s[r]) + 1;
    last.set(s[r], r);
    best = Math.max(best, r - l + 1);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(k)',
        },
      ],
      notes: ['The `>= l` check matters: a character seen before the window started must not move `l` backwards.'],
    },
    {
      id: 'min-size-subarray-sum',
      title: 'Minimum size subarray sum',
      difficulty: 'medium',
      statement: 'All values are positive. Return the length of the shortest subarray whose sum is at least `target`, or 0 if none.',
      fn: 'minSubArrayLen',
      params: ['target', 'nums'],
      examples: [
        { args: [7, [2, 3, 1, 2, 4, 3]], output: 2 },
        { args: [4, [1, 4, 4]], output: 1 },
        { args: [11, [1, 1, 1, 1, 1]], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['From each start, extend until the sum reaches target.'],
          code: c(`
function minSubArrayLen(target, nums) {
  let best = Infinity;
  for (let s = 0; s < nums.length; s++) {
    let sum = 0;
    for (let e = s; e < nums.length; e++) {
      sum += nums[e];
      if (sum >= target) { best = Math.min(best, e - s + 1); break; }
    }
  }
  return best === Infinity ? 0 : best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Prefix sum + binary search',
          idea: ['Prefix sums are increasing (positives only). For each start, binary search the first end where `P[e] - P[s] >= target`.'],
          code: c(`
function minSubArrayLen(target, nums) {
  const P = [0];
  nums.forEach((x, i) => P.push(P[i] + x));
  let best = Infinity;
  for (let s = 0; s < nums.length; s++) {
    let lo = s + 1, hi = nums.length;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (P[mid] - P[s] >= target) { best = Math.min(best, mid - s); hi = mid - 1; }
      else lo = mid + 1;
    }
  }
  return best === Infinity ? 0 : best;
}`),
          time: 'O(n log n)',
          space: 'O(n)',
        },
        {
          name: 'Sliding window',
          idea: ['Grow right. While the sum is big enough, record the length and shrink from the left.'],
          code: c(`
function minSubArrayLen(target, nums) {
  let l = 0, sum = 0, best = Infinity;
  for (let r = 0; r < nums.length; r++) {
    sum += nums[r];
    while (sum >= target) {
      best = Math.min(best, r - l + 1);
      sum -= nums[l++];
    }
  }
  return best === Infinity ? 0 : best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'max-consecutive-ones-k',
      title: 'Max consecutive ones with k flips',
      difficulty: 'medium',
      statement: '`nums` holds 0s and 1s. You may flip at most `k` zeros to ones. Return the longest run of 1s you can get.',
      fn: 'longestOnes',
      params: ['nums', 'k'],
      examples: [
        { args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], output: 6 },
        { args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], output: 10 },
        { args: [[0, 0], 0], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['From each start, extend while the number of zeros stays within k.'],
          code: c(`
function longestOnes(nums, k) {
  let best = 0;
  for (let s = 0; s < nums.length; s++) {
    let zeros = 0;
    for (let e = s; e < nums.length; e++) {
      if (nums[e] === 0) zeros++;
      if (zeros > k) break;
      best = Math.max(best, e - s + 1);
    }
  }
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Sliding window',
          idea: ['Reframe: longest window with at most k zeros. Shrink while zeros exceed k.'],
          code: c(`
function longestOnes(nums, k) {
  let l = 0, zeros = 0, best = 0;
  for (let r = 0; r < nums.length; r++) {
    if (nums[r] === 0) zeros++;
    while (zeros > k) if (nums[l++] === 0) zeros--;
    best = Math.max(best, r - l + 1);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      notes: ['Reframing "flip k zeros" as "window with at most k zeros" is the whole trick. Say it out loud.'],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'How many windows of size 4 does an array of length 10 have?',
      options: ['`6`', '`7`', '`10`', '`40`'],
      answer: 1,
      explain: '`n - k + 1 = 10 - 4 + 1 = 7`.',
    },
    {
      type: 'output',
      code: c(`
const a = [4, 2, 1, 7, 8];
let sum = a[0] + a[1];
let best = sum;
for (let i = 2; i < a.length; i++) {
  sum += a[i] - a[i - 2];
  best = Math.max(best, sum);
}
console.log(best);`),
      options: ['`6`', '`8`', '`15`', '`22`'],
      answer: 2,
      explain: 'Windows of size 2: `6, 3, 8, 15`. Best is `7 + 8 = 15`.',
    },
    {
      type: 'truefalse',
      statement: 'A variable-size window with an inner `while` loop is O(n²).',
      answer: false,
      explain: 'The left pointer only moves forward, at most n times over the whole run. Total work is O(n).',
    },
    {
      type: 'mcq',
      question: 'Which problem should NOT use a plain sliding window?',
      options: [
        'Longest substring with at most 2 distinct characters',
        'Count subarrays with sum exactly k, values can be negative',
        'Max sum of a window of size k',
        'Shortest subarray with sum ≥ target, values positive',
      ],
      answer: 1,
      explain: 'With negatives, removing an element can raise the sum, so shrinking does not reliably fix the window. Use prefix sums + a hash map.',
    },
  ],
};

export default topic;
