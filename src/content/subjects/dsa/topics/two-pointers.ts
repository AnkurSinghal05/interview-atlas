import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'two-pointers',
  title: 'Two pointers',
  level: 'beginner',
  masteryMinutes: 180,
  tags: ['two pointers', 'sorted array', 'pair sum', '3sum', 'container', 'dutch national flag', 'merge'],
  summary:
    'Two indices walk through the array, and every comparison lets you throw away a whole row of pairs. On sorted data it turns O(n²) pair searches into O(n).',
  keyPoints: [
    {
      title: 'Opposite ends',
      text: 'Start at `0` and `n - 1` and move inward. Works when the array is sorted (or the problem has a similar order), like pair sum or container with most water.',
      code: c(`
let l = 0, r = nums.length - 1;
while (l < r) {
  const sum = nums[l] + nums[r];
  if (sum === target) return [l, r];
  if (sum < target) l++; else r--;
}`),
    },
    {
      title: 'Why it is safe to skip',
      text: 'If `nums[l] + nums[r]` is too small, pairing `nums[l]` with anything left of r is even smaller. So `l` can never be in the answer: move it.',
    },
    {
      title: 'Same direction (read / write)',
      text: 'A slow `write` pointer and a fast `read` pointer. Used for in-place filtering: remove duplicates, move zeros, remove an element.',
    },
    {
      title: 'Two arrays',
      text: 'One pointer per sorted array, always advance the smaller side. Merge, intersection and union of sorted arrays all work this way.',
    },
    {
      title: 'Three pointers',
      text: 'Dutch national flag (sort 0s, 1s, 2s) keeps `low`, `mid`, `high`. 3Sum fixes one index and runs two pointers on the rest.',
    },
    {
      title: 'Sort first?',
      text: 'Sorting costs O(n log n) and loses original indices. Fine for "does a pair exist" or "return values"; use a hash map when you need original indices.',
    },
  ],
  comparisons: [
    {
      items: ['Opposite ends', 'Same direction (slow/fast)'],
      rows: [
        { aspect: 'Start', values: ['`i = 0`, `j = n − 1`', 'Both at the start (fast leads)'] },
        { aspect: 'Move', values: ['Towards each other until they meet', 'Both forward; slow only moves when something is kept'], key: true },
        { aspect: 'Needs sorted input', values: ['Usually (pair sums)', 'No'] },
        { aspect: 'Time / space', values: ['O(n) / O(1)', 'O(n) / O(1)'] },
        { aspect: 'Classic problems', values: ['Pair with sum k, reverse, palindrome check, container with most water', 'Remove duplicates in place, move zeros, partition, merge two sorted arrays'] },
      ],
      reveal: 'Opposite ends works because each step can safely discard one end (sortedness tells you which). Same direction is a read pointer and a write pointer. A sliding window is the same-direction kind with a range between them.',
      whenToUse: ['The answer is a pair or depends on both ends of a sorted array.', 'You filter or rearrange an array in place.'],
    },
    {
      title: 'Two Sum: hash map vs sort + two pointers',
      items: ['Hash map', 'Sort + two pointers'],
      rows: [
        { aspect: 'Time', values: ['O(n)', 'O(n log n), or O(n) if already sorted'], key: true },
        { aspect: 'Space', values: ['O(n)', 'O(1) extra (plus the sort)'], key: true },
        { aspect: 'Returns original indexes', values: ['Yes', 'No, sorting moves them (sort `[value, index]` pairs to keep them)'] },
        { aspect: 'Extends to 3Sum / all pairs', values: ['Awkward with duplicates', 'Natural: fix one, two-pointer the rest'] },
      ],
      reveal: 'A hash map trades memory for time; two pointers trades time (the sort) for memory. If the input is already sorted, two pointers wins on both.',
      whenToUse: ['Unsorted input and you need indexes (the classic LeetCode Two Sum).', 'Sorted input, tight memory, or 3Sum/4Sum style problems.'],
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: 'Pair with sum 12 in a sorted array',
      code: c(`
let l = 0, r = nums.length - 1;
while (l < r) {
  const sum = nums[l] + nums[r];
  if (sum === target) return [l, r];
  if (sum < target) l++;
  else r--;
}`),
      rows: { nums: [1, 3, 4, 6, 8, 10, 13] },
      steps: [
        { line: 1, note: 'Target 12. Start at both ends.', pointers: { l: 0, r: 6 }, vars: { target: 12 } },
        { line: 6, note: '`1 + 13 = 14` is too big. 13 is too big with the smallest partner, so it is too big with all of them. Move r.', pointers: { l: 0, r: 6 }, vars: { target: 12, sum: 14 } },
        { line: 5, note: '`1 + 10 = 11` is too small. 1 is too small even with the largest partner left. Move l.', pointers: { l: 0, r: 5 }, vars: { target: 12, sum: 11 } },
        { line: 5, note: '`3 + 10 = 13` is too big. Move r.', pointers: { l: 1, r: 5 }, vars: { target: 12, sum: 13 } },
        { line: 5, note: '`3 + 8 = 11` is too small. Move l.', pointers: { l: 1, r: 4 }, vars: { target: 12, sum: 11 } },
        { line: 4, note: '`4 + 8 = 12`. Found `[2, 4]` after 5 checks instead of up to 21 pairs.', pointers: { l: 2, r: 4 }, window: { from: 2, to: 4 }, vars: { target: 12, sum: 12 } },
      ],
    },
  ],
  qa: [
    {
      q: 'When does two pointers work?',
      tag: 'Pattern spotting',
      a: [
        'The input is sorted, or you can sort it without losing what you need.',
        'Moving a pointer changes the quantity in a predictable direction (sum goes up when l moves right, down when r moves left).',
        'Or you need in-place filtering / partitioning with O(1) extra space.',
      ],
    },
    {
      q: 'How do you avoid duplicate triplets in 3Sum?',
      a: [
        'Sort first. Skip an anchor `i` when `nums[i] === nums[i-1]`.',
        'After finding a triplet, move `l` past equal values and `r` past equal values before continuing.',
      ],
    },
    {
      q: 'In container with most water, why move the shorter line?',
      a: [
        'Area = `min(h[l], h[r]) × width`. Moving the taller line only shrinks width and cannot raise the min.',
        'Moving the shorter one is the only move that might find a bigger area.',
      ],
    },
  ],
  problems: [
    {
      id: 'pair-sum-sorted',
      title: 'Pair with target sum (sorted array)',
      difficulty: 'easy',
      statement: '`nums` is sorted ascending. Return indices `[i, j]` with `i < j` and `nums[i] + nums[j] === target`, or `[]` if none.',
      fn: 'pairSum',
      params: ['nums', 'target'],
      examples: [
        { args: [[1, 3, 4, 6, 8, 10, 13], 12], output: [2, 4] },
        { args: [[2, 7, 11, 15], 9], output: [0, 1] },
        { args: [[1, 2, 3], 7], output: [] },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Check every pair.'],
          code: c(`
function pairSum(nums, target) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
  return [];
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Binary search',
          idea: ['For each `i`, binary search the rest of the array for `target - nums[i]`.'],
          code: c(`
function pairSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    const want = target - nums[i];
    let lo = i + 1, hi = nums.length - 1;
    while (lo <= hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (nums[mid] === want) return [i, mid];
      if (nums[mid] < want) lo = mid + 1; else hi = mid - 1;
    }
  }
  return [];
}`),
          time: 'O(n log n)',
          space: 'O(1)',
        },
        {
          name: 'Two pointers',
          idea: ['Start at both ends. Too small: move l right. Too big: move r left.'],
          code: c(`
function pairSum(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const sum = nums[l] + nums[r];
    if (sum === target) return [l, r];
    if (sum < target) l++; else r--;
  }
  return [];
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'three-sum',
      title: '3Sum',
      difficulty: 'medium',
      statement: 'Return all unique triplets `[a, b, c]` from `nums` with `a + b + c === 0`. Each triplet is sorted ascending; the list can be in any order.',
      fn: 'threeSum',
      params: ['nums'],
      anyOrder: true,
      examples: [
        { args: [[-1, 0, 1, 2, -1, -4]], output: [[-1, -1, 2], [-1, 0, 1]] },
        { args: [[0, 0, 0, 0]], output: [[0, 0, 0]] },
        { args: [[1, 2, -2, -1]], output: [] },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Try every triple. Sort each hit and store it as a string in a `Set` to drop duplicates.'],
          code: c(`
function threeSum(nums) {
  const seen = new Set(), out = [];
  const n = nums.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      for (let k = j + 1; k < n; k++)
        if (nums[i] + nums[j] + nums[k] === 0) {
          const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = t.join(',');
          if (!seen.has(key)) { seen.add(key); out.push(t); }
        }
  return out;
}`),
          time: 'O(n³)',
          space: 'O(k) for results',
        },
        {
          name: 'Hash set per anchor',
          idea: ['Fix `i`; the rest is two-sum on `-nums[i]`, answered with a set of seen values.'],
          code: c(`
function threeSum(nums) {
  const seen = new Set(), out = [];
  for (let i = 0; i < nums.length; i++) {
    const inner = new Set();
    for (let j = i + 1; j < nums.length; j++) {
      const need = -nums[i] - nums[j];
      if (inner.has(need)) {
        const t = [nums[i], nums[j], need].sort((a, b) => a - b);
        const key = t.join(',');
        if (!seen.has(key)) { seen.add(key); out.push(t); }
      }
      inner.add(nums[j]);
    }
  }
  return out;
}`),
          time: 'O(n²)',
          space: 'O(n)',
        },
        {
          name: 'Sort + two pointers',
          idea: [
            'Sort. Fix `i`, then run two pointers on `i+1..n-1` for sum `-nums[i]`.',
            'Skip equal anchors and equal neighbours so no duplicates are produced at all.',
          ],
          code: c(`
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        out.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      }
    }
  }
  return out;
}`),
          time: 'O(n²)',
          space: 'O(1) extra',
        },
      ],
      notes: ['Early exit: once `nums[i] > 0` after sorting, no triplet can sum to 0.'],
    },
    {
      id: 'container-most-water',
      title: 'Container with most water',
      difficulty: 'medium',
      statement: 'Pick two lines `i < j`. The water they hold is `min(h[i], h[j]) × (j - i)`. Return the maximum.',
      fn: 'maxArea',
      params: ['height'],
      examples: [
        { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], output: 49 },
        { args: [[1, 1]], output: 1 },
        { args: [[4, 3, 2, 1, 4]], output: 16 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Every pair of lines.'],
          code: c(`
function maxArea(height) {
  let best = 0;
  for (let i = 0; i < height.length; i++)
    for (let j = i + 1; j < height.length; j++)
      best = Math.max(best, Math.min(height[i], height[j]) * (j - i));
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Two pointers',
          idea: ['Start with the widest container. Always move the shorter line inward; moving the taller one can never help.'],
          code: c(`
function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'sort-colors',
      title: "Sort 0s, 1s and 2s (Dutch national flag)",
      difficulty: 'medium',
      statement: '`nums` holds only 0, 1 and 2. Sort it in place without a library sort and return it.',
      fn: 'sortColors',
      params: ['nums'],
      examples: [
        { args: [[2, 0, 2, 1, 1, 0]], output: [0, 0, 1, 1, 2, 2] },
        { args: [[2, 0, 1]], output: [0, 1, 2] },
        { args: [[1]], output: [1] },
      ],
      approaches: [
        {
          name: 'Built-in sort',
          idea: ['Works, but it is what the interviewer asked you not to do.'],
          code: c(`
function sortColors(nums) {
  return nums.sort((a, b) => a - b);
}`),
          time: 'O(n log n)',
          space: 'O(log n)',
        },
        {
          name: 'Counting (two passes)',
          idea: ['Count the 0s, 1s and 2s, then overwrite the array.'],
          code: c(`
function sortColors(nums) {
  const count = [0, 0, 0];
  for (const x of nums) count[x]++;
  let i = 0;
  for (let v = 0; v < 3; v++)
    for (let k = 0; k < count[v]; k++) nums[i++] = v;
  return nums;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
        {
          name: 'Dutch national flag (one pass)',
          idea: [
            '`0..low-1` are 0s, `low..mid-1` are 1s, `high+1..` are 2s, `mid..high` is unknown.',
            '0: swap to `low`, advance both. 1: advance `mid`. 2: swap to `high`, shrink `high` (do not advance `mid`: the swapped-in value is unchecked).',
          ],
          code: c(`
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
  return nums;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'merge-sorted',
      title: 'Merge two sorted arrays',
      difficulty: 'easy',
      statement: 'Return one sorted array containing every element of sorted arrays `a` and `b`.',
      fn: 'mergeSorted',
      params: ['a', 'b'],
      examples: [
        { args: [[1, 3, 5], [2, 4, 6, 8]], output: [1, 2, 3, 4, 5, 6, 8] },
        { args: [[], [1]], output: [1] },
        { args: [[1, 1], [1]], output: [1, 1, 1] },
      ],
      approaches: [
        {
          name: 'Concat and sort',
          idea: ['Ignores that the inputs are already sorted.'],
          code: c(`
function mergeSorted(a, b) {
  return [...a, ...b].sort((x, y) => x - y);
}`),
          time: 'O((n+m) log(n+m))',
          space: 'O(n+m)',
        },
        {
          name: 'Two pointers',
          idea: ['Take the smaller head each step. When one array runs out, copy the rest of the other.'],
          code: c(`
function mergeSorted(a, b) {
  const out = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) out.push(a[i] <= b[j] ? a[i++] : b[j++]);
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}`),
          time: 'O(n + m)',
          space: 'O(n + m)',
        },
      ],
      notes: ['In-place variant (LeetCode 88): fill from the back of the larger array so nothing is overwritten before it is read.'],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'Sorted array, looking for a pair with sum 20. `nums[l] + nums[r]` is 23. What next?',
      options: ['`l++`', '`r--`', 'Both', 'Restart with `l = 0`'],
      answer: 1,
      explain: 'Too big: the only way to shrink the sum is to replace the larger value, so move r left.',
    },
    {
      type: 'output',
      code: c(`
const nums = [2, 0, 1];
let low = 0, mid = 0, high = nums.length - 1, steps = 0;
while (mid <= high) {
  steps++;
  if (nums[mid] === 0) { [nums[low], nums[mid]] = [nums[mid], nums[low]]; low++; mid++; }
  else if (nums[mid] === 1) mid++;
  else { [nums[mid], nums[high]] = [nums[high], nums[mid]]; high--; }
}
console.log(nums, steps);`),
      options: ['`[ 0, 1, 2 ] 3`', '`[ 0, 1, 2 ] 2`', '`[ 1, 0, 2 ] 3`', '`[ 0, 1, 2 ] 4`'],
      answer: 0,
      explain: 'Step 1 swaps 2 to the end (`[1,0,2]`, mid stays). Step 2 sees 1, mid moves. Step 3 sees 0 and swaps it to the front.',
    },
    {
      type: 'truefalse',
      statement: 'Two pointers from both ends works for pair sum on an unsorted array.',
      answer: false,
      explain: 'The "too small, move l" logic relies on order. Unsorted: sort first (losing indices) or use a hash map.',
    },
  ],
};

export default topic;
