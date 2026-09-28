import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'kadane',
  title: "Kadane's algorithm",
  level: 'intermediate',
  masteryMinutes: 120,
  tags: ['kadane', 'maximum subarray', 'max product', 'circular'],
  summary:
    'The best subarray ending here either extends the best one ending at the previous index, or starts fresh. That one decision finds the maximum subarray sum in O(n).',
  keyPoints: [
    {
      title: 'Extend or restart',
      text: '`cur = max(x, cur + x)`. If the running sum has gone negative, it can only hurt, so start again from x.',
      code: c(`
let cur = nums[0], best = nums[0];
for (let i = 1; i < nums.length; i++) {
  cur = Math.max(nums[i], cur + nums[i]);
  best = Math.max(best, cur);
}`),
    },
    {
      title: 'All negatives',
      text: 'Start `cur` and `best` at `nums[0]`, not 0. Otherwise an all-negative array wrongly returns 0 (the empty subarray).',
    },
    {
      title: 'It is DP (and carry forward)',
      text: '`dp[i]` = best sum of a subarray ending at i = `max(a[i], dp[i-1] + a[i])`. You only need `dp[i-1]`, so it collapses to one variable.',
    },
    {
      title: 'Getting the subarray too',
      text: 'Remember where the current run started (`start = i` on restart). When `best` improves, save `start..i`.',
    },
    {
      title: 'Variants',
      text: 'Max product: carry both max and min (a negative flips them). Circular: answer is `max(kadaneMax, total - kadaneMin)`, unless everything is negative.',
    },
  ],
  comparisons: [
    {
      title: 'Maximum subarray sum: brute force vs prefix min vs Kadane',
      items: ['Brute force + carry forward', 'Prefix sum − min prefix', "Kadane's algorithm"],
      rows: [
        { aspect: 'Idea', values: ['Try every start, extend the end, track the best sum', 'For each end j, best = `prefix[j]` − smallest prefix before j', '`cur = max(x, cur + x)`: extend the run or restart here'], key: true },
        { aspect: 'Time', values: ['O(n²)', 'O(n)', 'O(n)'] },
        { aspect: 'Space', values: ['O(1)', 'O(1) (carry the prefix and its min)', 'O(1)'] },
        { aspect: 'All-negative array', values: ['Works', 'Works (start the min prefix at 0)', 'Works if you start from `arr[0]`, not 0'] },
        { aspect: 'Get the indexes', values: ['Easy', 'Track where the min prefix was', 'Record the start when you restart'] },
      ],
      reveal: 'Kadane is the prefix-min idea in disguise: dropping a negative running sum is the same as subtracting the smallest prefix so far. Both just carry one value forward.',
      whenToUse: ['Only to explain the idea, or when n is tiny.', 'When you already have prefix sums, or the problem is phrased as "best difference" (like stock buy/sell).', 'The standard answer for maximum subarray sum.'],
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: 'Kadane on [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
      code: c(`
let cur = nums[0], best = nums[0];
for (let i = 1; i < nums.length; i++) {
  cur = Math.max(nums[i], cur + nums[i]);
  best = Math.max(best, cur);
}`),
      rows: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
      steps: [
        { line: 1, note: 'Start with the first element.', pointers: { i: 0 }, window: { from: 0, to: 0 }, vars: { cur: -2, best: -2 } },
        { line: 3, note: '`-2 + 1 = -1` is worse than `1` alone. Restart at index 1.', pointers: { i: 1 }, window: { from: 1, to: 1 }, vars: { cur: 1, best: 1 } },
        { line: 3, note: '`1 + -3 = -2` beats `-3`, so extend. Best stays 1.', pointers: { i: 2 }, window: { from: 1, to: 2 }, vars: { cur: -2, best: 1 } },
        { line: 3, note: 'Running sum is negative: `-2 + 4 = 2 < 4`. Restart at 4.', pointers: { i: 3 }, window: { from: 3, to: 3 }, vars: { cur: 4, best: 4 } },
        { line: 3, note: 'Extend: `4 - 1 = 3`.', pointers: { i: 4 }, window: { from: 3, to: 4 }, vars: { cur: 3, best: 4 } },
        { line: 4, note: 'Extend: `3 + 2 = 5`. New best.', pointers: { i: 5 }, window: { from: 3, to: 5 }, vars: { cur: 5, best: 5 } },
        { line: 4, note: 'Extend: `5 + 1 = 6`. New best.', pointers: { i: 6 }, window: { from: 3, to: 6 }, vars: { cur: 6, best: 6 } },
        { line: 3, note: '`6 - 5 = 1` still beats `-5` alone, so keep going even though it dropped.', pointers: { i: 7 }, window: { from: 3, to: 7 }, vars: { cur: 1, best: 6 } },
        { line: 3, note: '`1 + 4 = 5`. Not better than 6. Answer: **6**, from `[4, -1, 2, 1]`.', pointers: { i: 8 }, window: { from: 3, to: 8 }, vars: { cur: 5, best: 6 } },
      ],
    },
  ],
  qa: [
    {
      q: "Explain Kadane's algorithm in one sentence.",
      tag: 'Asked often',
      a: ['At each index keep the best sum of a subarray that ends there, which is either the element alone or the element added to the previous best, and track the overall max.'],
    },
    {
      q: "Why doesn't Kadane work directly for maximum product?",
      a: [
        'A very negative product can become the maximum after one more negative number.',
        'So carry both the largest and the smallest product ending here, and swap them when x is negative.',
      ],
    },
    {
      q: 'How does the circular version work?',
      a: [
        'Either the best subarray does not wrap (normal Kadane), or it wraps, which means it is everything except some middle part.',
        'The wrapping case = `total - (minimum subarray sum)`. If all numbers are negative, return the normal Kadane answer instead (the wrap would be empty).',
      ],
    },
  ],
  problems: [
    {
      id: 'max-subarray',
      title: 'Maximum subarray sum',
      difficulty: 'medium',
      statement: 'Return the largest sum of a non-empty contiguous subarray.',
      fn: 'maxSubArray',
      params: ['nums'],
      examples: [
        { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], output: 6 },
        { args: [[5, 4, -1, 7, 8]], output: 23 },
        { args: [[-3, -1, -2]], output: -1, note: 'all negative: pick the largest single element' },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Every start and end, sum the elements between them.'],
          code: c(`
function maxSubArray(nums) {
  let best = -Infinity;
  for (let s = 0; s < nums.length; s++)
    for (let e = s; e < nums.length; e++) {
      let sum = 0;
      for (let i = s; i <= e; i++) sum += nums[i];
      best = Math.max(best, sum);
    }
  return best;
}`),
          time: 'O(n³)',
          space: 'O(1)',
        },
        {
          name: 'Running sum per start',
          idea: ['Fix the start and grow the end, adding one element each step.'],
          code: c(`
function maxSubArray(nums) {
  let best = -Infinity;
  for (let s = 0; s < nums.length; s++) {
    let sum = 0;
    for (let e = s; e < nums.length; e++) {
      sum += nums[e];
      best = Math.max(best, sum);
    }
  }
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Kadane',
          idea: ['Best ending here = `max(x, bestEndingBefore + x)`. Track the overall max.'],
          code: c(`
function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Prefix sum minus the smallest earlier prefix',
          idea: [
            'A subarray sum is `P[j] - P[i]`. For each j, subtract the smallest prefix seen before it.',
          ],
          code: c(`
function maxSubArray(nums) {
  let prefix = 0, minPrefix = 0, best = -Infinity;
  for (const x of nums) {
    prefix += x;
    best = Math.max(best, prefix - minPrefix);
    minPrefix = Math.min(minPrefix, prefix);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'Same cost as Kadane. It is really "best time to buy and sell" on prefix sums, which some find easier to prove.',
        },
        {
          name: 'Divide and conquer',
          idea: [
            'Best of: the left half, the right half, or the best subarray crossing the middle.',
          ],
          code: c(`
function maxSubArray(nums, lo = 0, hi = nums.length - 1) {
  if (lo === hi) return nums[lo];
  const mid = (lo + hi) >> 1;
  let sum = 0, left = -Infinity, right = -Infinity;
  for (let i = mid; i >= lo; i--) { sum += nums[i]; left = Math.max(left, sum); }
  sum = 0;
  for (let i = mid + 1; i <= hi; i++) { sum += nums[i]; right = Math.max(right, sum); }
  return Math.max(maxSubArray(nums, lo, mid), maxSubArray(nums, mid + 1, hi), left + right);
}`),
          time: 'O(n log n)',
          space: 'O(log n)',
          tradeoff: 'Slower, but it is the usual follow-up ask and the idea extends to segment trees.',
        },
      ],
      notes: ['A divide-and-conquer solution in O(n log n) exists; mention it only if asked for a follow-up.'],
    },
    {
      id: 'max-product-subarray',
      title: 'Maximum product subarray',
      difficulty: 'medium',
      statement: 'Return the largest product of a non-empty contiguous subarray.',
      fn: 'maxProduct',
      params: ['nums'],
      examples: [
        { args: [[2, 3, -2, 4]], output: 6 },
        { args: [[-2, 0, -1]], output: 0 },
        { args: [[-2, 3, -4]], output: 24, note: 'two negatives make a positive' },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Fix a start, multiply as the end grows, keep the max.'],
          code: c(`
function maxProduct(nums) {
  let best = -Infinity;
  for (let s = 0; s < nums.length; s++) {
    let p = 1;
    for (let e = s; e < nums.length; e++) {
      p *= nums[e];
      best = Math.max(best, p);
    }
  }
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Carry max and min',
          idea: [
            'The largest product ending here comes from `x`, `x × prevMax` or `x × prevMin` (a negative times the smallest).',
            'Carry both the max and the min.',
          ],
          code: c(`
function maxProduct(nums) {
  let hi = nums[0], lo = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    const x = nums[i];
    const a = x * hi, b = x * lo;
    hi = Math.max(x, a, b);
    lo = Math.min(x, a, b);
    best = Math.max(best, hi);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Prefix and suffix products',
          idea: [
            'Scan from both ends at once, multiplying as you go. Reset a running product to 1 after a zero.',
            'The best product always starts at an end or right after a zero, so one of the two scans sees it.',
          ],
          code: c(`
function maxProduct(nums) {
  const n = nums.length;
  let left = 1, right = 1, best = -Infinity;
  for (let i = 0; i < n; i++) {
    left = (left === 0 ? 1 : left) * nums[i];
    right = (right === 0 ? 1 : right) * nums[n - 1 - i];
    best = Math.max(best, left, right);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'No min/max swap to reason about, but the "why it works" argument (an odd count of negatives drops one end) is harder to explain.',
        },
      ],
    },
    {
      id: 'max-circular-subarray',
      title: 'Maximum sum circular subarray',
      difficulty: 'medium',
      statement: 'The array is circular (the end wraps to the start). Return the largest sum of a non-empty subarray that uses each element at most once.',
      fn: 'maxCircular',
      params: ['nums'],
      examples: [
        { args: [[1, -2, 3, -2]], output: 3 },
        { args: [[5, -3, 5]], output: 10, note: 'wraps: [5, 5]' },
        { args: [[-3, -2, -3]], output: -2 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For each start, walk up to n steps with `% n`, keeping a running sum.'],
          code: c(`
function maxCircular(nums) {
  const n = nums.length;
  let best = -Infinity;
  for (let s = 0; s < n; s++) {
    let sum = 0;
    for (let len = 1; len <= n; len++) {
      sum += nums[(s + len - 1) % n];
      best = Math.max(best, sum);
    }
  }
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Kadane twice',
          idea: [
            'No wrap: normal Kadane max.',
            'Wrap: total minus the minimum subarray (found with Kadane on min).',
            'If every value is negative, the wrap case would be empty, so return the plain max.',
          ],
          code: c(`
function maxCircular(nums) {
  let total = 0, curMax = 0, curMin = 0;
  let best = -Infinity, worst = Infinity;
  for (const x of nums) {
    curMax = Math.max(x, curMax + x);
    curMin = Math.min(x, curMin + x);
    best = Math.max(best, curMax);
    worst = Math.min(worst, curMin);
    total += x;
  }
  return best < 0 ? best : Math.max(best, total - worst);
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const nums = [2, -3, 4, -1, 2];
let cur = nums[0], best = nums[0];
for (let i = 1; i < nums.length; i++) {
  cur = Math.max(nums[i], cur + nums[i]);
  best = Math.max(best, cur);
}
console.log(best);`),
      options: ['`4`', '`5`', '`6`', '`7`'],
      answer: 1,
      explain: '`[4, -1, 2]` sums to 5. The `2, -3` prefix is negative, so Kadane restarts at 4.',
    },
    {
      type: 'output',
      code: c(`
const nums = [-5, -2, -8];
let cur = 0, best = 0;
for (const x of nums) {
  cur = Math.max(0, cur + x);
  best = Math.max(best, cur);
}
console.log(best);`),
      options: ['`-2`', '`0`', '`-5`', '`-15`'],
      answer: 1,
      explain: 'Starting at 0 and clamping to 0 allows the empty subarray. For "non-empty", start from `nums[0]` and the answer is -2.',
    },
    {
      type: 'mcq',
      question: 'For maximum product subarray, why carry the minimum product too?',
      options: [
        'To handle zeros',
        'A negative number turns the smallest product into the largest',
        'To make it O(n log n)',
        'It is only needed for the circular version',
      ],
      answer: 1,
      explain: 'The min can be a large negative; multiplying by another negative makes it the new max.',
    },
  ],
};

export default topic;
