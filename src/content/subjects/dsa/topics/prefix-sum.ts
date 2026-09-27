import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'prefix-sum',
  title: 'Prefix sum',
  level: 'beginner',
  masteryMinutes: 150,
  tags: ['prefix sum', 'presum', 'range sum', 'difference array', '2D prefix', 'subarray sum'],
  summary:
    'Precompute running totals once, then answer any range sum in O(1). The same idea works for counts, XOR, products and 2D grids.',
  keyPoints: [
    {
      title: 'Build it',
      text: '`pf[i]` is the sum of `a[0..i]`. Each entry reuses the previous one: `pf[i] = pf[i-1] + a[i]`.',
      code: c(`
const pf = [a[0]];
for (let i = 1; i < a.length; i++) pf[i] = pf[i - 1] + a[i];`),
    },
    {
      title: 'Range sum formula',
      text: 'Sum of `a[l..r]` = `pf[r] - pf[l-1]`, or just `pf[r]` when `l = 0`.',
      code: c(`
const rangeSum = (l, r) => (l === 0 ? pf[r] : pf[r] - pf[l - 1]);`),
    },
    {
      title: 'The n + 1 version',
      text: 'Many people prefer `P` of length `n + 1` with `P[0] = 0`. Then sum of `a[l..r]` = `P[r+1] - P[l]`, with no special case.',
    },
    {
      title: 'Suffix sums',
      text: 'Same idea from the right: `sf[i] = sf[i+1] + a[i]`. Left total + right total = whole total, so `sf[i] = total - pf[i-1]`.',
    },
    {
      title: 'Not just sums',
      text: 'Prefix counts (how many evens up to i), prefix XOR (`x[l..r] = X[r] ^ X[l-1]`), prefix max and min all follow the same build step.',
    },
    {
      title: 'Subarray sum = k',
      text: '`sum(l..r) = P[r+1] - P[l]`. So a subarray ending here sums to k when some earlier prefix equals `current - k`. Keep a map of prefix counts.',
    },
    {
      title: 'Difference array for range updates',
      text: 'To add `v` to `a[l..r]`: `diff[l] += v`, `diff[r+1] -= v`. After all updates, one prefix pass over `diff` gives the final array.',
    },
    {
      title: '2D prefix sum',
      text: 'Build: `S[r+1][c+1] = a[r][c] + S[r][c+1] + S[r+1][c] - S[r][c]`. Rectangle `(r1,c1)..(r2,c2)`: `S[r2+1][c2+1] - S[r1][c2+1] - S[r2+1][c1] + S[r1][c1]`.',
    },
  ],
  comparisons: [
    {
      title: 'Brute force vs prefix sum for Q range-sum queries',
      items: ['Loop over the range', 'Prefix sum'],
      rows: [
        { aspect: 'Setup', values: ['None', 'O(n) to build `pf`'] },
        { aspect: 'Each query', values: ['O(n)', 'O(1): `pf[r] - pf[l - 1]`'], key: true },
        { aspect: 'Q queries in total', values: ['O(n·Q)', 'O(n + Q)'], key: true },
        { aspect: 'Extra space', values: ['O(1)', 'O(n) (or O(1) if you overwrite the input)'] },
        { aspect: 'Array changes between queries', values: ['Fine', 'Rebuild in O(n); use a Fenwick or segment tree instead'] },
      ],
      reveal: 'Prefix sum moves the work from every query to one pass up front. It only pays off when there is more than a handful of queries and the array does not change.',
      whenToUse: ['One or two queries, or an array that keeps changing.', 'Many queries on a fixed array; also the base for "count subarrays with sum k" (with a hash map).'],
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: 'Build a prefix array, then answer sum(2..5) in one step',
      code: c(`
const pf = [a[0]];
for (let i = 1; i < a.length; i++) {
  pf[i] = pf[i - 1] + a[i];
}
// sum of a[l..r]
const sum = pf[r] - pf[l - 1];`),
      rows: { a: [3, 1, 4, 1, 5, 9, 2], pf: [null, null, null, null, null, null, null] },
      steps: [
        { line: 1, note: 'Start with `pf[0] = a[0] = 3`.', rows: { pf: [3, null, null, null, null, null, null] }, pointers: { i: { row: 'pf', index: 0 } } },
        { line: 3, note: '`pf[1] = pf[0] + a[1] = 3 + 1 = 4`.', rows: { pf: [3, 4, null, null, null, null, null] }, pointers: { i: 1 } },
        { line: 3, note: '`pf[2] = 4 + 4 = 8`. Each step reuses the total so far.', rows: { pf: [3, 4, 8, null, null, null, null] }, pointers: { i: 2 } },
        { line: 3, note: '`pf[3] = 8 + 1 = 9`.', rows: { pf: [3, 4, 8, 9, null, null, null] }, pointers: { i: 3 } },
        { line: 3, note: '`pf[4] = 9 + 5 = 14`.', rows: { pf: [3, 4, 8, 9, 14, null, null] }, pointers: { i: 4 } },
        { line: 3, note: '`pf[5] = 14 + 9 = 23`.', rows: { pf: [3, 4, 8, 9, 14, 23, null] }, pointers: { i: 5 } },
        { line: 3, note: '`pf[6] = 23 + 2 = 25`. Built in one O(n) pass.', rows: { pf: [3, 4, 8, 9, 14, 23, 25] }, pointers: { i: 6 } },
        {
          line: 6,
          note: 'Query `sum(2..5)`: take `pf[5]` (everything up to 5) and remove `pf[1]` (everything before 2).',
          window: { from: 2, to: 5 },
          pointers: { 'l-1': { row: 'pf', index: 1 }, r: { row: 'pf', index: 5 } },
          vars: { l: 2, r: 5 },
        },
        {
          line: 6,
          note: '`23 - 4 = 19`, which is `4 + 1 + 5 + 9`. Any query is O(1) now.',
          window: { from: 2, to: 5 },
          pointers: { 'l-1': { row: 'pf', index: 1 }, r: { row: 'pf', index: 5 } },
          vars: { l: 2, r: 5, sum: 19 },
        },
      ],
    },
  ],
  qa: [
    {
      q: 'When should you reach for a prefix sum?',
      tag: 'Pattern spotting',
      a: [
        'Many range-sum queries on an array that does not change.',
        '"Count subarrays with sum k" or "longest subarray with sum k", especially when values can be negative (sliding window breaks there).',
        'Comparing left side vs right side of every index (equilibrium, product except self).',
        'Not needed if you only walk subarrays in order (like summing every subarray): carry forward gives the same O(n²) with O(1) space. See the side-by-side on the Carry forward topic.',
      ],
    },
    {
      q: 'Why does sliding window fail for "subarray sum = k" with negative numbers, while prefix sum + hash map works?',
      a: [
        'A window grows or shrinks assuming the sum moves one way. Negatives break that: adding an element can lower the sum.',
        'Prefix sums do not care about direction. They only need `P[j] - P[i] = k`, which a map answers in O(1).',
      ],
    },
    {
      q: 'What if the array changes between queries?',
      a: [
        'Rebuilding the prefix array costs O(n) per update.',
        'Many point updates + range queries: use a Fenwick tree or segment tree (O(log n) each).',
        'Many range updates then queries at the end: use a difference array.',
      ],
    },
    {
      q: 'Can you build the prefix sum in place?',
      a: ['Yes, `a[i] += a[i-1]` for i from 1. Mention that it destroys the input, and only do it if that is allowed.'],
    },
  ],
  problems: [
    {
      id: 'range-sum-queries',
      title: 'Range sum queries',
      difficulty: 'easy',
      statement: 'For each query `[l, r]`, return the sum of `nums[l..r]` (inclusive).',
      fn: 'rangeSums',
      params: ['nums', 'queries'],
      examples: [
        { args: [[-2, 0, 3, -5, 2, -1], [[0, 2], [2, 5], [0, 5]]], output: [1, -1, -3] },
        { args: [[1, 2, 3, 4, 5], [[1, 3], [0, 0], [4, 4]]], output: [9, 1, 5] },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Loop from l to r for every query.', 'With q queries of length up to n that is `O(n·q)`.'],
          code: c(`
function rangeSums(nums, queries) {
  return queries.map(([l, r]) => {
    let sum = 0;
    for (let i = l; i <= r; i++) sum += nums[i];
    return sum;
  });
}`),
          time: 'O(n·q)',
          space: 'O(1)',
        },
        {
          name: 'Prefix sum',
          idea: ['Build `P` of length n + 1 once. Each query is `P[r+1] - P[l]`.'],
          code: c(`
function rangeSums(nums, queries) {
  const P = [0];
  for (let i = 0; i < nums.length; i++) P.push(P[i] + nums[i]);
  return queries.map(([l, r]) => P[r + 1] - P[l]);
}`),
          time: 'O(n + q)',
          space: 'O(n)',
        },
      ],
    },
    {
      id: 'equilibrium-index',
      title: 'Equilibrium (pivot) index',
      difficulty: 'easy',
      statement: 'Return the leftmost index where the sum of elements to its left equals the sum to its right (the element itself is in neither). Return `-1` if none.',
      fn: 'pivotIndex',
      params: ['nums'],
      examples: [
        { args: [[1, 7, 3, 6, 5, 6]], output: 3, note: '1+7+3 = 5+6' },
        { args: [[1, 2, 3]], output: -1 },
        { args: [[2, 1, -1]], output: 0, note: 'left of index 0 is empty (0)' },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For every index, add up the left side and the right side separately.'],
          code: c(`
function pivotIndex(nums) {
  for (let i = 0; i < nums.length; i++) {
    let left = 0, right = 0;
    for (let j = 0; j < i; j++) left += nums[j];
    for (let j = i + 1; j < nums.length; j++) right += nums[j];
    if (left === right) return i;
  }
  return -1;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Prefix array',
          idea: ['Build prefix sums. Left of i is `P[i]`; right of i is `total - P[i+1]`.'],
          code: c(`
function pivotIndex(nums) {
  const P = [0];
  for (let i = 0; i < nums.length; i++) P.push(P[i] + nums[i]);
  const total = P[nums.length];
  for (let i = 0; i < nums.length; i++) {
    if (P[i] === total - P[i + 1]) return i;
  }
  return -1;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Running left sum',
          idea: ['You only ever need the prefix at i, so carry it in one variable.', 'Right side = `total - left - nums[i]`.'],
          code: c(`
function pivotIndex(nums) {
  const total = nums.reduce((s, x) => s + x, 0);
  let left = 0;
  for (let i = 0; i < nums.length; i++) {
    if (left === total - left - nums[i]) return i;
    left += nums[i];
  }
  return -1;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'special-index',
      title: 'Count special indices (even sum = odd sum after removal)',
      difficulty: 'medium',
      statement:
        'Removing an element shifts everything after it, so their even and odd positions swap. Count the indices whose removal makes the sum at even positions equal the sum at odd positions.',
      fn: 'countSpecial',
      params: ['nums'],
      examples: [
        { args: [[2, 1, 6, 4]], output: 1, note: 'remove index 1 → [2,6,4]: 2+4 = 6' },
        { args: [[1, 1, 1]], output: 3 },
        { args: [[1, 2, 3]], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Actually remove each index, then add up even and odd positions of what is left.'],
          code: c(`
function countSpecial(nums) {
  let count = 0;
  for (let skip = 0; skip < nums.length; skip++) {
    let even = 0, odd = 0, pos = 0;
    for (let j = 0; j < nums.length; j++) {
      if (j === skip) continue;
      if (pos % 2 === 0) even += nums[j]; else odd += nums[j];
      pos++;
    }
    if (even === odd) count++;
  }
  return count;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Even and odd prefix sums',
          idea: [
            'Keep two prefix arrays: sum of even-index values and sum of odd-index values.',
            'After removing i: new even sum = `evenBefore(i) + oddAfter(i)`; new odd sum = `oddBefore(i) + evenAfter(i)`.',
          ],
          code: c(`
function countSpecial(nums) {
  const n = nums.length;
  const E = [0], O = [0]; // E[i] = even-index sum of nums[0..i-1]
  for (let i = 0; i < n; i++) {
    E.push(E[i] + (i % 2 === 0 ? nums[i] : 0));
    O.push(O[i] + (i % 2 === 1 ? nums[i] : 0));
  }
  let count = 0;
  for (let i = 0; i < n; i++) {
    const even = E[i] + (O[n] - O[i + 1]);
    const odd = O[i] + (E[n] - E[i + 1]);
    if (even === odd) count++;
  }
  return count;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
      ],
      notes: ['The key observation to say: everything after the removed index changes parity, so its even and odd totals swap.'],
    },
    {
      id: 'subarray-sum-k',
      title: 'Count subarrays with sum k',
      difficulty: 'medium',
      statement: 'Return how many contiguous subarrays of `nums` sum to `k`. Values can be negative.',
      fn: 'subarraySum',
      params: ['nums', 'k'],
      examples: [
        { args: [[1, 1, 1], 2], output: 2 },
        { args: [[1, 2, 3], 3], output: 2 },
        { args: [[3, 4, -7, 1, 3, 3, 1, -4], 7], output: 4 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Try every start and end, and add up the elements between them.'],
          code: c(`
function subarraySum(nums, k) {
  let count = 0;
  for (let s = 0; s < nums.length; s++)
    for (let e = s; e < nums.length; e++) {
      let sum = 0;
      for (let i = s; i <= e; i++) sum += nums[i];
      if (sum === k) count++;
    }
  return count;
}`),
          time: 'O(n³)',
          space: 'O(1)',
        },
        {
          name: 'Running sum per start',
          idea: ['Fix the start and extend the end; keep adding instead of re-summing (carry forward).'],
          code: c(`
function subarraySum(nums, k) {
  let count = 0;
  for (let s = 0; s < nums.length; s++) {
    let sum = 0;
    for (let e = s; e < nums.length; e++) {
      sum += nums[e];
      if (sum === k) count++;
    }
  }
  return count;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Prefix sum + hash map',
          idea: [
            'A subarray ending at i sums to k when an earlier prefix equals `prefix - k`.',
            'Count how many times each prefix has appeared. Start with `{0: 1}` for subarrays that begin at index 0.',
          ],
          code: c(`
function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let prefix = 0, count = 0;
  for (const x of nums) {
    prefix += x;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
      ],
      notes: ['Forgetting the `{0: 1}` seed is the classic bug: it misses subarrays that start at index 0.'],
    },
    {
      id: 'product-except-self',
      title: 'Product of array except self',
      difficulty: 'medium',
      statement: 'Return an array where `out[i]` is the product of every element except `nums[i]`, without using division.',
      fn: 'productExceptSelf',
      params: ['nums'],
      examples: [
        { args: [[1, 2, 3, 4]], output: [24, 12, 8, 6] },
        { args: [[-1, 1, 0, -3, 3]], output: [0, 0, 9, 0, 0] },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For each i, multiply every other element.'],
          code: c(`
function productExceptSelf(nums) {
  return nums.map((_, i) => {
    let p = 1;
    for (let j = 0; j < nums.length; j++) if (j !== i) p *= nums[j];
    return p;
  });
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Prefix and suffix products',
          idea: ['`left[i]` = product of everything before i, `right[i]` = product of everything after i.', 'Answer is `left[i] * right[i]`.'],
          code: c(`
function productExceptSelf(nums) {
  const n = nums.length;
  const left = Array(n).fill(1), right = Array(n).fill(1);
  for (let i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];
  for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];
  return nums.map((_, i) => left[i] * right[i]);
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'One output array',
          idea: ['Store left products in the output, then sweep from the right carrying the suffix product in one variable.'],
          code: c(`
function productExceptSelf(nums) {
  const n = nums.length;
  const out = Array(n).fill(1);
  for (let i = 1; i < n; i++) out[i] = out[i - 1] * nums[i - 1];
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= right;
    right *= nums[i];
  }
  return out;
}`),
          time: 'O(n)',
          space: 'O(1) extra',
        },
      ],
      notes: ['Why not divide the total by `nums[i]`? Zeros break it, and interviewers usually forbid it.'],
    },
    {
      id: 'range-updates',
      title: 'Apply range updates (difference array)',
      difficulty: 'medium',
      statement: 'Start with `n` zeros. Each update `[l, r, v]` adds `v` to every index in `l..r`. Return the final array.',
      fn: 'applyUpdates',
      params: ['n', 'updates'],
      examples: [
        { args: [5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]], output: [-2, 0, 3, 5, 3] },
        { args: [3, [[0, 2, 1]]], output: [1, 1, 1] },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Loop over `l..r` for every update.'],
          code: c(`
function applyUpdates(n, updates) {
  const a = Array(n).fill(0);
  for (const [l, r, v] of updates)
    for (let i = l; i <= r; i++) a[i] += v;
  return a;
}`),
          time: 'O(n·q)',
          space: 'O(n)',
        },
        {
          name: 'Difference array',
          idea: [
            'Mark only the edges: `+v` at `l`, `-v` just after `r`.',
            'A prefix sum over the marks spreads each `v` across exactly `l..r`.',
          ],
          code: c(`
function applyUpdates(n, updates) {
  const diff = Array(n + 1).fill(0);
  for (const [l, r, v] of updates) {
    diff[l] += v;
    diff[r + 1] -= v;
  }
  const a = Array(n).fill(0);
  let run = 0;
  for (let i = 0; i < n; i++) a[i] = run += diff[i];
  return a;
}`),
          time: 'O(n + q)',
          space: 'O(n)',
        },
      ],
    },
    {
      id: 'matrix-region-sum',
      title: '2D range sum queries',
      difficulty: 'medium',
      statement: 'For each query `[r1, c1, r2, c2]`, return the sum of the rectangle with those corners (inclusive).',
      fn: 'regionSums',
      params: ['grid', 'queries'],
      examples: [
        {
          args: [
            [
              [3, 0, 1, 4],
              [5, 6, 3, 2],
              [1, 2, 0, 1],
            ],
            [[1, 1, 2, 2], [0, 0, 2, 3], [0, 3, 1, 3]],
          ],
          output: [11, 28, 6],
        },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Add up every cell of the rectangle for each query.'],
          code: c(`
function regionSums(grid, queries) {
  return queries.map(([r1, c1, r2, c2]) => {
    let s = 0;
    for (let r = r1; r <= r2; r++)
      for (let c = c1; c <= c2; c++) s += grid[r][c];
    return s;
  });
}`),
          time: 'O(q·n·m)',
          space: 'O(1)',
        },
        {
          name: 'Row prefix sums',
          idea: ['Prefix-sum each row. A query adds one O(1) row range per row.'],
          code: c(`
function regionSums(grid, queries) {
  const P = grid.map((row) => {
    const p = [0];
    row.forEach((x, j) => p.push(p[j] + x));
    return p;
  });
  return queries.map(([r1, c1, r2, c2]) => {
    let s = 0;
    for (let r = r1; r <= r2; r++) s += P[r][c2 + 1] - P[r][c1];
    return s;
  });
}`),
          time: 'O(n·m + q·n)',
          space: 'O(n·m)',
        },
        {
          name: '2D prefix sum',
          idea: [
            '`S[r+1][c+1]` = sum of the rectangle from `(0,0)` to `(r,c)`.',
            'A query is the big rectangle minus the strip above, minus the strip on the left, plus the corner that was removed twice.',
          ],
          code: c(`
function regionSums(grid, queries) {
  const n = grid.length, m = grid[0].length;
  const S = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let r = 0; r < n; r++)
    for (let c = 0; c < m; c++)
      S[r + 1][c + 1] = grid[r][c] + S[r][c + 1] + S[r + 1][c] - S[r][c];
  return queries.map(([r1, c1, r2, c2]) =>
    S[r2 + 1][c2 + 1] - S[r1][c2 + 1] - S[r2 + 1][c1] + S[r1][c1]);
}`),
          time: 'O(n·m + q)',
          space: 'O(n·m)',
        },
      ],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const a = [2, 4, 1, 3];
const P = [0];
for (const x of a) P.push(P[P.length - 1] + x);
console.log(P, P[3] - P[1]);`),
      options: ['`[ 0, 2, 6, 7, 10 ] 5`', '`[ 2, 6, 7, 10 ] 5`', '`[ 0, 2, 6, 7, 10 ] 4`', '`[ 0, 2, 6, 7, 10 ] 7`'],
      answer: 0,
      explain: '`P[3] - P[1]` is the sum of `a[1..2]` = `4 + 1 = 5`.',
    },
    {
      type: 'mcq',
      question: 'With an inclusive prefix array `pf`, what is the sum of `a[l..r]` when `l > 0`?',
      options: ['`pf[r] - pf[l]`', '`pf[r] - pf[l - 1]`', '`pf[r + 1] - pf[l]`', '`pf[r - 1] - pf[l - 1]`'],
      answer: 1,
      explain: '`pf[r]` covers `0..r`; `pf[l-1]` covers `0..l-1`. The difference is exactly `l..r`. (`P[r+1] - P[l]` is the n + 1 version.)',
    },
    {
      type: 'output',
      code: c(`
const diff = [0, 0, 0, 0, 0, 0];
const add = (l, r, v) => { diff[l] += v; diff[r + 1] -= v; };
add(0, 2, 5);
add(1, 4, 1);
let run = 0;
console.log(diff.slice(0, 5).map((d) => (run += d)));`),
      options: ['`[ 5, 6, 6, 1, 1 ]`', '`[ 5, 1, 0, -5, 0 ]`', '`[ 5, 6, 6, 6, 1 ]`', '`[ 5, 5, 5, 1, 1 ]`'],
      answer: 0,
      explain: 'Index 0 gets 5, indices 1–2 get 5 + 1, indices 3–4 get only 1.',
    },
    {
      type: 'mcq',
      question: 'In "count subarrays with sum k" using a prefix map, why start the map with `{0: 1}`?',
      options: [
        'To avoid dividing by zero',
        'So subarrays that start at index 0 are counted',
        'Because k is never 0',
        'It is only needed for negative numbers',
      ],
      answer: 1,
      explain: 'When the prefix itself equals k, you need a "prefix before the array" of 0 to subtract.',
    },
    {
      type: 'truefalse',
      statement: 'Prefix sums still give O(1) range queries if the array is updated after every query.',
      answer: false,
      explain: 'An update invalidates every prefix after it, costing O(n) to rebuild. Use a Fenwick or segment tree instead.',
    },
  ],
};

export default topic;
