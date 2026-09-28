import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'carry-forward',
  title: 'Carry forward',
  level: 'beginner',
  masteryMinutes: 120,
  tags: ['carry forward', 'running count', 'running max', 'leaders', 'stock', 'trapping rain water'],
  summary:
    'Instead of looking back over everything you have seen, carry one value (a count, a max, a min, a last index) as you scan. It turns an inner loop into a variable.',
  keyPoints: [
    {
      title: 'The pattern',
      text: 'If the inner loop of a brute force only asks "what was the best / how many so far?", keep that answer in a variable and update it each step.',
    },
    {
      title: 'Pick the direction',
      text: 'Scan left to right when the answer depends on what came before (min price so far). Scan right to left when it depends on what comes after (leaders, max to the right).',
    },
    {
      title: 'Update order matters',
      text: 'Use the carried value first, then update it with the current element. Swapping these two lines is the most common bug (pairing an element with itself).',
      code: c(`
for (const ch of s) {
  if (ch === 'g') pairs += countA; // use
  if (ch === 'a') countA++;        // then update
}`),
    },
    {
      title: 'Prefix arrays are carry forward saved',
      text: 'Prefix sums, prefix max and suffix max arrays store every carried value. If you only need the current one, drop the array and keep a variable for O(1) space.',
    },
    {
      title: 'Carry an index, not a value',
      text: 'Some problems need "where did I last see X?". Carry `lastIndex` and compute distances like `i - lastIndex + 1`.',
    },
  ],
  comparisons: [
    {
      title: 'Prefix sum vs carry forward (sum of every subarray)',
      items: ['Prefix sum', 'Carry forward'],
      rows: [
        { aspect: 'Nested loops', values: ['2', '2'] },
        { aspect: 'Time complexity', values: ['O(n²)', 'O(n²)'] },
        { aspect: 'Space complexity', values: ['**O(n)**: the prefix array', '**O(1)**: just `currSum`'], key: true },
        { aspect: 'Preprocessing', values: ['O(n) to build the prefix array', 'None'] },
        { aspect: 'How sum(i, j) is computed', values: ['`prefix[j] - prefix[i - 1]`', '`currSum += arr[j]`'], key: true },
        { aspect: 'Random range queries', values: ['O(1) each, in any order', 'Not possible without re-scanning'] },
      ],
      reveal:
        'Both solutions share the **same 2-loop skeleton**. The only thing that changes is **how the inner sum is kept**: stored values (prefix) vs an incremental update (carry forward). A prefix array is carry forward with every running value saved.',
      whenToUse: [
        'You need **many** sums over different, arbitrary ranges: build once, answer each in O(1).',
        'You walk subarrays in order and never jump to a random range: it saves the O(n) array.',
      ],
      code: [
        c(`
// prefix[k] = arr[0] + ... + arr[k]
const prefix = [arr[0]];
for (let k = 1; k < n; k++)
  prefix[k] = prefix[k - 1] + arr[k];

for (let i = 0; i < n; i++)
  for (let j = i; j < n; j++) {
    const sum = prefix[j] - (i ? prefix[i - 1] : 0);
  }`),
        c(`
for (let i = 0; i < n; i++) {
  let currSum = 0;
  for (let j = i; j < n; j++) {
    currSum += arr[j];
    const sum = currSum;
  }
}`),
      ],
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: "Count pairs (i < j) where s[i] = 'a' and s[j] = 'g'",
      code: c(`
let countA = 0, pairs = 0;
for (const ch of s) {
  if (ch === 'g') pairs += countA;
  if (ch === 'a') countA++;
}`),
      rows: { s: ['a', 'b', 'e', 'g', 'a', 'g'] },
      steps: [
        { line: 1, note: 'Every `g` pairs with every `a` before it. Carry how many `a`s we have seen.', vars: { countA: 0, pairs: 0 } },
        { line: 5, note: "`'a'`: nothing to pair yet. `countA` becomes 1.", pointers: { i: 0 }, vars: { countA: 1, pairs: 0 } },
        { line: 3, note: "`'b'` and `'e'` change nothing.", pointers: { i: 2 }, window: { from: 1, to: 2 }, vars: { countA: 1, pairs: 0 } },
        { line: 4, note: "`'g'`: it pairs with the 1 `a` before it. `pairs += 1`.", pointers: { i: 3 }, window: { from: 0, to: 3 }, vars: { countA: 1, pairs: 1 } },
        { line: 5, note: "Another `'a'`: `countA` becomes 2.", pointers: { i: 4 }, vars: { countA: 2, pairs: 1 } },
        { line: 4, note: "`'g'`: pairs with both `a`s. `pairs += 2`. Answer: 3, in one pass.", pointers: { i: 5 }, window: { from: 0, to: 5 }, vars: { countA: 2, pairs: 3 } },
      ],
    },
  ],
  qa: [
    {
      q: 'How do you recognise a carry-forward problem?',
      tag: 'Pattern spotting',
      a: [
        'The brute force has an inner loop that looks back (or ahead) to count, sum, or find a max/min.',
        'Ask: "does this inner loop redo work the previous iteration already did?" If yes, carry the result instead.',
      ],
    },
    {
      q: 'Prefix sum vs carry forward: what is the difference?',
      tag: 'Asked often',
      a: [
        'Same two-loop skeleton and the same O(n²) for "sum of every subarray". Only the space differs: O(n) prefix array vs O(1) `currSum`.',
        'Prefix sum answers any range in O(1); carry forward only knows the running value. The full table is on the Learn tab.',
      ],
    },
    {
      q: 'Why does trapping rain water need both directions?',
      a: [
        'Water above bar i is `min(maxLeft, maxRight) - height[i]`.',
        '`maxLeft` is carried from the left and `maxRight` from the right. Two pointers combine both scans into one.',
      ],
    },
  ],
  problems: [
    {
      id: 'count-ag-pairs',
      title: "Count 'a'–'g' pairs",
      difficulty: 'easy',
      statement: "Count pairs `(i, j)` with `i < j`, `s[i] === 'a'` and `s[j] === 'g'`.",
      fn: 'countPairs',
      params: ['s'],
      examples: [
        { args: ['abegag'], output: 3 },
        { args: ['bcaggaag'], output: 5 },
        { args: ['gga'], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ["For every `'a'`, scan everything after it and count the `'g'`s."],
          code: c(`
function countPairs(s) {
  let pairs = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== 'a') continue;
    for (let j = i + 1; j < s.length; j++) if (s[j] === 'g') pairs++;
  }
  return pairs;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: "Carry the count of 'a'",
          idea: ["Each `'g'` pairs with every `'a'` seen before it. Carry that count."],
          code: c(`
function countPairs(s) {
  let countA = 0, pairs = 0;
  for (const ch of s) {
    if (ch === 'g') pairs += countA;
    if (ch === 'a') countA++;
  }
  return pairs;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Carry the count of \'g\' from the right',
          idea: [
            'Scan right to left counting `\'g\'`s. Each `\'a\'` pairs with every `\'g\'` after it.',
          ],
          code: c(`
function countPairs(s) {
  let countG = 0, pairs = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] === 'a') pairs += countG;
    if (s[i] === 'g') countG++;
  }
  return pairs;
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'Same cost. Handy to show you can carry from either side.',
        },
      ],
      notes: ["Scanning from the right works too: carry the count of `'g'` and add it at each `'a'`."],
    },
    {
      id: 'leaders',
      title: 'Leaders in an array',
      difficulty: 'easy',
      statement: 'A leader is strictly greater than every element to its right. The last element is always a leader. Return the leaders in their original order.',
      fn: 'leaders',
      params: ['nums'],
      examples: [
        { args: [[16, 17, 4, 3, 5, 2]], output: [17, 5, 2] },
        { args: [[1, 2, 3, 4]], output: [4] },
        { args: [[7, 7, 1]], output: [7, 1], note: 'only the second 7 is strictly greater than what follows' },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For each element, check everything to its right.'],
          code: c(`
function leaders(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    let isLeader = true;
    for (let j = i + 1; j < nums.length; j++)
      if (nums[j] >= nums[i]) { isLeader = false; break; }
    if (isLeader) out.push(nums[i]);
  }
  return out;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Carry max from the right',
          idea: ['Walk right to left carrying the max seen so far. An element above that max is a leader.', 'Reverse at the end to restore order.'],
          code: c(`
function leaders(nums) {
  const out = [];
  let maxRight = -Infinity;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i] > maxRight) {
      out.push(nums[i]);
      maxRight = nums[i];
    }
  }
  return out.reverse();
}`),
          time: 'O(n)',
          space: 'O(1) extra',
        },
      ],
      alternatives: [
        {
          name: 'Suffix max array',
          idea: [
            'Store the max to the right of every index, then keep elements greater than it.',
          ],
          code: c(`
function leaders(nums) {
  const n = nums.length;
  const maxRight = Array(n).fill(-Infinity);
  for (let i = n - 2; i >= 0; i--) maxRight[i] = Math.max(maxRight[i + 1], nums[i + 1]);
  return nums.filter((x, i) => x > maxRight[i]);
}`),
          time: 'O(n)',
          space: 'O(n)',
          tradeoff: 'Keeps the original order without reversing, at the cost of an extra array.',
        },
      ],
    },
    {
      id: 'best-time-stock',
      title: 'Best time to buy and sell stock',
      difficulty: 'easy',
      statement: '`prices[i]` is the price on day i. Buy once and sell once later. Return the maximum profit, or 0.',
      fn: 'maxProfit',
      params: ['prices'],
      examples: [
        { args: [[7, 1, 5, 3, 6, 4]], output: 5, note: 'buy at 1, sell at 6' },
        { args: [[7, 6, 4, 3, 1]], output: 0 },
        { args: [[2, 4, 1]], output: 2 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Try every buy day with every later sell day.'],
          code: c(`
function maxProfit(prices) {
  let best = 0;
  for (let b = 0; b < prices.length; b++)
    for (let s = b + 1; s < prices.length; s++)
      best = Math.max(best, prices[s] - prices[b]);
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Carry the minimum',
          idea: ['Selling today, the best buy was the lowest price so far. Carry that min.'],
          code: c(`
function maxProfit(prices) {
  let minPrice = Infinity, best = 0;
  for (const p of prices) {
    best = Math.max(best, p - minPrice);
    minPrice = Math.min(minPrice, p);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Kadane on daily changes',
          idea: [
            'Profit from buy day to sell day = sum of the daily price changes in between.',
            'So it is the maximum subarray sum of `prices[i] - prices[i-1]`, floored at 0.',
          ],
          code: c(`
function maxProfit(prices) {
  let cur = 0, best = 0;
  for (let i = 1; i < prices.length; i++) {
    cur = Math.max(0, cur + prices[i] - prices[i - 1]);
    best = Math.max(best, cur);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'Same cost. Worth saying because it links two famous problems.',
        },
      ],
    },
    {
      id: 'closest-min-max',
      title: 'Smallest subarray with both min and max',
      difficulty: 'medium',
      statement: 'Return the length of the smallest subarray that contains both the minimum and the maximum value of the whole array.',
      fn: 'minMaxSubarray',
      params: ['nums'],
      examples: [
        { args: [[1, 3, 2]], output: 2 },
        { args: [[2, 6, 1, 6, 9]], output: 3, note: '[6, 1, 6, 9] has both, but [1, 6, 9] is shorter' },
        { args: [[4, 4, 4]], output: 1 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['From every min position, walk right to the nearest max (and from every max to the nearest min). Keep the shortest.'],
          code: c(`
function minMaxSubarray(nums) {
  const min = Math.min(...nums), max = Math.max(...nums);
  if (min === max) return 1;
  let best = Infinity;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== min && nums[i] !== max) continue;
    const want = nums[i] === min ? max : min;
    for (let j = i + 1; j < nums.length; j++)
      if (nums[j] === want) { best = Math.min(best, j - i + 1); break; }
  }
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Carry last positions',
          idea: [
            'Carry the last index where you saw the min and the max.',
            'Each time you hit one, the nearest partner on the left is the other last index.',
          ],
          code: c(`
function minMaxSubarray(nums) {
  const min = Math.min(...nums), max = Math.max(...nums);
  if (min === max) return 1;
  let lastMin = -1, lastMax = -1, best = Infinity;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === min) {
      lastMin = i;
      if (lastMax !== -1) best = Math.min(best, i - lastMax + 1);
    } else if (nums[i] === max) {
      lastMax = i;
      if (lastMin !== -1) best = Math.min(best, i - lastMin + 1);
    }
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'trapping-rain-water',
      title: 'Trapping rain water',
      difficulty: 'hard',
      statement: '`height[i]` is the height of a bar of width 1. Return how much water is trapped after rain.',
      fn: 'trap',
      params: ['height'],
      examples: [
        { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], output: 6 },
        { args: [[4, 2, 0, 3, 2, 5]], output: 9 },
        { args: [[3, 2]], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For each bar, scan left for the tallest bar and right for the tallest bar.', 'Water = `min(maxLeft, maxRight) - height[i]`.'],
          code: c(`
function trap(height) {
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    let left = 0, right = 0;
    for (let j = 0; j <= i; j++) left = Math.max(left, height[j]);
    for (let j = i; j < height.length; j++) right = Math.max(right, height[j]);
    water += Math.min(left, right) - height[i];
  }
  return water;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Prefix max + suffix max',
          idea: ['Carry the max from the left into an array, and the max from the right into another.'],
          code: c(`
function trap(height) {
  const n = height.length;
  const L = Array(n), R = Array(n);
  for (let i = 0; i < n; i++) L[i] = Math.max(height[i], i ? L[i - 1] : 0);
  for (let i = n - 1; i >= 0; i--) R[i] = Math.max(height[i], i < n - 1 ? R[i + 1] : 0);
  let water = 0;
  for (let i = 0; i < n; i++) water += Math.min(L[i], R[i]) - height[i];
  return water;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Two pointers',
          idea: [
            'Move the side with the lower max inward: its water level is fixed by its own max, because the other side is at least as tall.',
            'Carry `leftMax` and `rightMax` in two variables.',
          ],
          code: c(`
function trap(height) {
  let l = 0, r = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (l < r) {
    leftMax = Math.max(leftMax, height[l]);
    rightMax = Math.max(rightMax, height[r]);
    if (leftMax < rightMax) water += leftMax - height[l++];
    else water += rightMax - height[r--];
  }
  return water;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Monotonic stack',
          idea: [
            'Keep indices of decreasing heights. A taller bar closes a "basin" with the bar under it.',
            'Water added = `(min(left, right) - bottom) × width`.',
          ],
          code: c(`
function trap(height) {
  const stack = [];
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    while (stack.length && height[i] > height[stack[stack.length - 1]]) {
      const bottom = stack.pop();
      if (!stack.length) break;
      const left = stack[stack.length - 1];
      const h = Math.min(height[left], height[i]) - height[bottom];
      water += h * (i - left - 1);
    }
    stack.push(i);
  }
  return water;
}`),
          time: 'O(n)',
          space: 'O(n)',
          tradeoff: 'Fills water layer by layer instead of column by column. More code than two pointers, but the same stack idea solves "largest rectangle in histogram".',
        },
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
let countA = 0, pairs = 0;
for (const ch of 'agag') {
  if (ch === 'a') countA++;
  if (ch === 'g') pairs += countA;
}
console.log(pairs);`),
      options: ['`2`', '`3`', '`4`', '`1`'],
      answer: 1,
      explain: 'First `g` sees 1 `a`, second `g` sees 2. Total 3.',
    },
    {
      type: 'mcq',
      question: 'To find leaders (greater than everything to the right) in O(n), which direction do you scan?',
      options: ['Left to right, carrying the max', 'Right to left, carrying the max', 'Right to left, carrying the min', 'Both directions are required'],
      answer: 1,
      explain: 'Whether an element is a leader depends only on what is to its right, so carry the max from the right.',
    },
    {
      type: 'output',
      code: c(`
const prices = [3, 8, 1, 4];
let min = Infinity, best = 0;
for (const p of prices) {
  min = Math.min(min, p);
  best = Math.max(best, p - min);
}
console.log(best, min);`),
      options: ['`5 1`', '`3 1`', '`7 1`', '`5 3`'],
      answer: 0,
      explain: 'Buy at 3, sell at 8 for 5. Later, buying at 1 and selling at 4 only makes 3. Updating min first is fine here because `p - p = 0`.',
    },
    {
      type: 'truefalse',
      statement: 'Carry forward usually changes the time from O(n²) to O(n) while keeping O(1) extra space.',
      answer: true,
      explain: 'The inner loop becomes a variable update, and a variable is O(1) space.',
    },
  ],
};

export default topic;
