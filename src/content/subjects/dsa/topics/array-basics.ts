import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'array-basics',
  title: 'Array basics & formulas',
  level: 'beginner',
  masteryMinutes: 120,
  tags: ['arrays', 'formulas', 'subarrays', 'rotation', 'reverse', 'in place'],
  summary:
    'The counting formulas and index tricks that every array question leans on, plus the warm-up problems interviewers open with.',
  keyPoints: [
    {
      title: 'Sum of 1 to n',
      text: '`n(n+1)/2`. Same count as pairs with repeats allowed, and the number of subarrays of an array of length n.',
      code: c(`
const sumToN = (n) => (n * (n + 1)) / 2; // sumToN(5) = 15`),
    },
    {
      title: 'Counting subarrays, pairs, subsequences',
      text: 'Subarrays (contiguous): `n(n+1)/2`. Pairs `i < j`: `n(n-1)/2`. Subsequences or subsets: `2ⁿ` (each element is in or out).',
    },
    {
      title: 'Subarrays that contain index i',
      text: 'Pick a start in `0..i` and an end in `i..n-1`: `(i+1) × (n-i)`. This is the heart of the contribution technique.',
    },
    {
      title: 'Length of a range',
      text: 'Subarray `[l..r]` has `r - l + 1` elements. A window of size k starting at i ends at `i + k - 1`.',
    },
    {
      title: 'Other sums worth knowing',
      text: 'Arithmetic series: `count × (first + last) / 2`. Squares `1²..n²`: `n(n+1)(2n+1)/6`. Powers of two `1 + 2 + … + 2ᵏ⁻¹ = 2ᵏ - 1`.',
    },
    {
      title: 'Rotation and wrap-around',
      text: 'Rotating right by k sends index i to `(i + k) % n`. Always reduce `k %= n` first. JavaScript `%` can be negative, so use `((x % n) + n) % n`.',
    },
    {
      title: 'Mirror index and safe middle',
      text: 'The mirror of i is `n - 1 - i`. The middle of `lo..hi` is `lo + Math.floor((hi - lo) / 2)`, which never overflows in languages with fixed-size ints.',
    },
    {
      title: '2D ↔ 1D',
      text: 'In a grid with `cols` columns, cell `(r, c)` is index `r * cols + c`. Back again: `r = Math.floor(i / cols)`, `c = i % cols`.',
    },
    {
      title: 'Ceil without floats',
      text: '`Math.ceil(a / b)` equals `Math.floor((a + b - 1) / b)` for positive integers. Handy for "how many groups of size b".',
    },
  ],
  comparisons: [
    {
      title: 'Cost of array operations in JavaScript',
      items: ['`arr[i]`', '`push` / `pop`', '`shift` / `unshift`', '`splice(i, …)`'],
      rows: [
        { aspect: 'Time', values: ['O(1)', 'O(1) amortised', 'O(n)', 'O(n)'], key: true },
        { aspect: 'Why', values: ['Direct index lookup', 'Nothing else moves', 'Every element shifts one index', 'Everything after `i` shifts'] },
        { aspect: 'Inside a loop of n', values: ['O(n)', 'O(n)', 'O(n²)', 'O(n²)'] },
      ],
      reveal: 'Work at the **end** of an array is cheap, work at the **front or middle** moves elements. That is why a queue built on `shift` is O(n) per dequeue.',
      whenToUse: ['Always fine.', 'Stacks and building results.', 'Avoid in loops; for a queue, keep a head index instead.', 'One-off edits; in loops, build a new array or use two pointers.'],
    },
    {
      items: ['Static array', 'Dynamic array'],
      rows: [
        { aspect: 'Size', values: ['Fixed when created', 'Grows as needed'], key: true },
        { aspect: 'Append', values: ['Not possible without a new array', 'O(1) amortised; occasionally O(n) to copy into a bigger block'] },
        { aspect: 'Memory', values: ['Exactly what you asked for', 'Some spare capacity'] },
        { aspect: 'Examples', values: ['C arrays, Java `int[]`, JS `Int32Array`', 'JS `Array`, Java `ArrayList`, Python `list`'] },
      ],
      reveal: 'A dynamic array is a static array that doubles its capacity when full. Copying is rare enough that appends average out to O(1).',
      whenToUse: ['Known size and raw speed: typed arrays, buffers, grids.', 'Almost everything in interview JS.'],
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: 'Rotate right by k with three reversals',
      code: c(`
function rotate(nums, k) {
  k %= nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
  return nums;
}`),
      rows: { nums: [1, 2, 3, 4, 5, 6, 7] },
      steps: [
        { line: 1, note: 'Rotate `[1..7]` right by `k = 3`. The answer should be `[5,6,7,1,2,3,4]`.', vars: { k: 3 } },
        { line: 2, note: '`k %= 7` keeps k = 3. If k were 10, rotating by 10 is the same as rotating by 3.', vars: { k: 3 } },
        {
          line: 3,
          note: 'Reverse the whole array. The last k elements are now at the front, but backwards.',
          rows: { nums: [7, 6, 5, 4, 3, 2, 1] },
          window: { from: 0, to: 6 },
          vars: { k: 3 },
        },
        {
          line: 4,
          note: 'Reverse the first k elements to put `5, 6, 7` back in order.',
          rows: { nums: [5, 6, 7, 4, 3, 2, 1] },
          window: { from: 0, to: 2 },
          vars: { k: 3 },
        },
        {
          line: 5,
          note: 'Reverse the rest. Done in O(n) time and O(1) extra space.',
          rows: { nums: [5, 6, 7, 1, 2, 3, 4] },
          window: { from: 3, to: 6 },
          vars: { k: 3 },
        },
      ],
    },
  ],
  qa: [
    {
      q: 'Which array pattern fits which question?',
      tag: 'Cheat sheet',
      a: [
        'Many range sums, or "subarray sum = k" with negatives → **prefix sum** (+ hash map).',
        'Brute force looks back for a count / max / min → **carry forward**.',
        'Total over all subarrays or pairs → **contribution technique**.',
        'Best contiguous sum → **Kadane**.',
        'Sorted input, pairs or partitioning in place → **two pointers**.',
        'Longest / shortest contiguous window meeting a condition → **sliding window**.',
        '"Have I seen this before?" or frequencies → **hash map / set**.',
      ],
    },
    {
      q: 'Subarray vs subsequence vs subset?',
      tag: 'Asked often',
      a: [
        '**Subarray**: contiguous, order kept. `n(n+1)/2` of them.',
        '**Subsequence**: any elements, order kept, gaps allowed. `2ⁿ` of them (including empty).',
        '**Subset**: any elements, order does not matter. Also `2ⁿ`.',
      ],
    },
    {
      q: 'What does "in place" mean, and why do interviewers ask for it?',
      a: [
        'You change the input array itself and use only O(1) extra space (a few variables).',
        'It shows you can reason with indices instead of reaching for a copy. Say out loud whether you are allowed to mutate the input.',
      ],
    },
    {
      q: 'How do you print every subarray, and what does it cost?',
      a: ['Two loops pick start and end; a third walks between them. O(n³) to print, O(n²) if you only need the ranges.'],
      code: c(`
for (let s = 0; s < n; s++)
  for (let e = s; e < n; e++)
    console.log(arr.slice(s, e + 1));`),
    },
    {
      q: 'What is the time complexity of common JS array operations?',
      a: [
        '`arr[i]`, `push`, `pop`, `length`: O(1).',
        '`shift`, `unshift`, `splice` in the middle: O(n), because elements move.',
        '`slice`, `indexOf`, `includes`, `concat`, spread: O(n). `sort`: O(n log n).',
      ],
    },
    {
      q: 'How do you find a missing number in `0..n` without extra space?',
      a: [
        'Expected sum minus actual sum: `n(n+1)/2 - sum(nums)`.',
        'Or XOR every index and every value: pairs cancel, the missing one is left. XOR avoids overflow in other languages.',
      ],
    },
  ],
  problems: [
    {
      id: 'reverse-array',
      title: 'Reverse an array',
      difficulty: 'easy',
      statement: 'Reverse `nums` and return it.',
      fn: 'reverseArray',
      params: ['nums'],
      examples: [
        { args: [[1, 2, 3, 4, 5]], output: [5, 4, 3, 2, 1] },
        { args: [[7, 8]], output: [8, 7] },
        { args: [[]], output: [] },
      ],
      approaches: [
        {
          name: 'Extra array',
          idea: ['Walk from the back and push into a new array.'],
          code: c(`
function reverseArray(nums) {
  const out = [];
  for (let i = nums.length - 1; i >= 0; i--) out.push(nums[i]);
  return out;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Two pointers, in place',
          idea: ['Swap `nums[l]` and `nums[r]`, then move both inward until they meet.', 'Only `n/2` swaps.'],
          code: c(`
function reverseArray(nums) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l++; r--;
  }
  return nums;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Built-in reverse',
          idea: [
            '`Array.prototype.reverse()` swaps in place, exactly like the two-pointer version.',
          ],
          code: c(`
function reverseArray(nums) {
  return nums.reverse();
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'Best in real code. In an interview, write the two-pointer loop first, then mention it. Use `toReversed()` if you must not mutate.',
        },
        {
          name: 'Recursive swap',
          idea: [
            'Swap the ends, then reverse the inside with a recursive call.',
          ],
          code: c(`
function reverseArray(nums, l = 0, r = nums.length - 1) {
  if (l >= r) return nums;
  [nums[l], nums[r]] = [nums[r], nums[l]];
  return reverseArray(nums, l + 1, r - 1);
}`),
          time: 'O(n)',
          space: 'O(n) stack',
          tradeoff: 'Shows recursion, but uses n/2 stack frames and can overflow the stack on huge arrays.',
        },
      ],
    },
    {
      id: 'rotate-array',
      title: 'Rotate array right by k',
      difficulty: 'medium',
      statement: 'Rotate `nums` to the right by `k` steps and return it. `k` can be larger than the length.',
      fn: 'rotate',
      params: ['nums', 'k'],
      examples: [
        { args: [[1, 2, 3, 4, 5, 6, 7], 3], output: [5, 6, 7, 1, 2, 3, 4] },
        { args: [[-1, -100, 3, 99], 2], output: [3, 99, -1, -100] },
        { args: [[1, 2], 5], output: [2, 1], note: 'k = 5 is the same as k = 1' },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Rotate by one step, k times: save the last element, shift everything right, put it at the front.'],
          code: c(`
function rotate(nums, k) {
  const n = nums.length;
  for (let step = 0; step < k % n; step++) {
    const last = nums[n - 1];
    for (let i = n - 1; i > 0; i--) nums[i] = nums[i - 1];
    nums[0] = last;
  }
  return nums;
}`),
          time: 'O(n·k)',
          space: 'O(1)',
        },
        {
          name: 'Extra array',
          idea: ['Each element goes straight to its final spot: index `i` moves to `(i + k) % n`.'],
          code: c(`
function rotate(nums, k) {
  const n = nums.length;
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[(i + k) % n] = nums[i];
  for (let i = 0; i < n; i++) nums[i] = out[i];
  return nums;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Three reversals',
          idea: ['Reverse all, then reverse the first k, then reverse the rest.', 'See the trace on the Learn tab.'],
          code: c(`
function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  const reverse = (l, r) => {
    while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
  };
  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
  return nums;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Cyclic replacements',
          idea: [
            'Move each element straight to `(i + k) % n`, carrying the displaced one onward until the cycle closes.',
            'Repeat from the next start until all n elements have moved.',
          ],
          code: c(`
function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  let moved = 0;
  for (let start = 0; moved < n; start++) {
    let i = start, carry = nums[start];
    do {
      const next = (i + k) % n;
      [nums[next], carry] = [carry, nums[next]];
      i = next;
      moved++;
    } while (i !== start);
  }
  return nums;
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'Each element moves exactly once, but the cycle logic is easy to get wrong. The three reversals are simpler to write and explain.',
        },
        {
          name: 'Slice and join',
          idea: [
            'The last k elements go in front of the first n - k.',
          ],
          code: c(`
function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  const rotated = nums.slice(n - k).concat(nums.slice(0, n - k));
  for (let i = 0; i < n; i++) nums[i] = rotated[i];
  return nums;
}`),
          time: 'O(n)',
          space: 'O(n)',
          tradeoff: 'Short and readable, but it builds a copy. Fine in real code, not what an "in place" question wants.',
        },
      ],
      notes: ['Always reduce `k %= n` first. Rotating left by k is the same as rotating right by `n - k`.'],
    },
    {
      id: 'second-largest',
      title: 'Second largest element',
      difficulty: 'easy',
      statement: 'Return the second largest **distinct** value in `nums`, or `-1` if there is none.',
      fn: 'secondLargest',
      params: ['nums'],
      examples: [
        { args: [[12, 35, 1, 10, 34, 1]], output: 34 },
        { args: [[10, 10, 10]], output: -1 },
        { args: [[5, 9, 9, 7]], output: 7 },
      ],
      approaches: [
        {
          name: 'Sort',
          idea: ['Sort descending and return the first value that differs from the largest.'],
          code: c(`
function secondLargest(nums) {
  const s = [...nums].sort((a, b) => b - a);
  for (let i = 1; i < s.length; i++) if (s[i] !== s[0]) return s[i];
  return -1;
}`),
          time: 'O(n log n)',
          space: 'O(n)',
        },
        {
          name: 'Two passes',
          idea: ['Pass 1 finds the max. Pass 2 finds the largest value that is less than the max.'],
          code: c(`
function secondLargest(nums) {
  const max = Math.max(...nums);
  let second = -1;
  for (const x of nums) if (x < max && x > second) second = x;
  return second;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
        {
          name: 'One pass',
          idea: ['Keep `first` and `second`. A bigger value pushes `first` down into `second`.', 'A value between them only replaces `second`.'],
          code: c(`
function secondLargest(nums) {
  let first = -Infinity, second = -Infinity;
  for (const x of nums) {
    if (x > first) { second = first; first = x; }
    else if (x < first && x > second) second = x;
  }
  return second === -Infinity ? -1 : second;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      notes: ['Ask whether values can be negative and whether duplicates count. Returning -1 is ambiguous when -1 is a valid value.'],
    },
    {
      id: 'missing-number',
      title: 'Missing number in 0..n',
      difficulty: 'easy',
      statement: '`nums` holds `n` distinct numbers from the range `0..n`. Return the one that is missing.',
      fn: 'missingNumber',
      params: ['nums'],
      examples: [
        { args: [[3, 0, 1]], output: 2 },
        { args: [[0, 1]], output: 2 },
        { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], output: 8 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For each candidate `0..n`, search the array for it.'],
          code: c(`
function missingNumber(nums) {
  for (let x = 0; x <= nums.length; x++) {
    if (!nums.includes(x)) return x;
  }
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Hash set',
          idea: ['Put every value in a `Set`, then check `0..n` in O(1) each.'],
          code: c(`
function missingNumber(nums) {
  const seen = new Set(nums);
  for (let x = 0; x <= nums.length; x++) if (!seen.has(x)) return x;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Sum formula',
          idea: ['The full range sums to `n(n+1)/2`. Subtract what is there; the gap is the answer.'],
          code: c(`
function missingNumber(nums) {
  const n = nums.length;
  let sum = 0;
  for (const x of nums) sum += x;
  return (n * (n + 1)) / 2 - sum;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'XOR',
          idea: [
            '`x ^ x = 0` and `x ^ 0 = x`. XOR every index `0..n` with every value: the pairs cancel and the missing number is left.',
          ],
          code: c(`
function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
  return x;
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'Same Big-O as the sum formula, but it can never overflow. Matters in Java/C++, not really in JS.',
        },
        {
          name: 'Sort and find the gap',
          idea: [
            'After sorting, the first index where `nums[i] !== i` is the missing number (or n if none).',
          ],
          code: c(`
function missingNumber(nums) {
  const s = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < s.length; i++) if (s[i] !== i) return i;
  return s.length;
}`),
          time: 'O(n log n)',
          space: 'O(n)',
          tradeoff: 'Slower, but the same scan finds several missing numbers or duplicates too.',
        },
      ],
      notes: ['XOR alternative: `x ^ x = 0`, so XOR-ing every index `0..n` and every value leaves only the missing number, with no overflow risk.'],
    },
    {
      id: 'remove-duplicates-sorted',
      title: 'Remove duplicates from a sorted array',
      difficulty: 'easy',
      statement: 'Remove duplicates from sorted `nums` in place so each value appears once at the front. Return how many unique values there are.',
      fn: 'removeDuplicates',
      params: ['nums'],
      examples: [
        { args: [[1, 1, 2]], output: 2 },
        { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], output: 5 },
        { args: [[]], output: 0 },
      ],
      approaches: [
        {
          name: 'Set',
          idea: ['A `Set` keeps insertion order, so write its values back to the front.'],
          code: c(`
function removeDuplicates(nums) {
  const unique = [...new Set(nums)];
  unique.forEach((x, i) => (nums[i] = x));
  return unique.length;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Two pointers',
          idea: ['`k` is where the next unique value goes. Scan with `i`; copy only when `nums[i]` differs from the last kept value.'],
          code: c(`
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) nums[k++] = nums[i];
  }
  return k;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
    },
    {
      id: 'move-zeroes',
      title: 'Move zeroes to the end',
      difficulty: 'easy',
      statement: 'Move every `0` to the end of `nums`, keeping the order of the other values. Do it in place and return `nums`.',
      fn: 'moveZeroes',
      params: ['nums'],
      examples: [
        { args: [[0, 1, 0, 3, 12]], output: [1, 3, 12, 0, 0] },
        { args: [[0]], output: [0] },
        { args: [[4, 2, 0, 0, 7]], output: [4, 2, 7, 0, 0] },
      ],
      approaches: [
        {
          name: 'Extra array',
          idea: ['Copy non-zeros into a new array, pad with zeros, copy back.'],
          code: c(`
function moveZeroes(nums) {
  const kept = nums.filter((x) => x !== 0);
  for (let i = 0; i < nums.length; i++) nums[i] = i < kept.length ? kept[i] : 0;
  return nums;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Two pointers (swap)',
          idea: ['`w` marks where the next non-zero belongs. Each non-zero swaps into `w`, pushing zeros back.'],
          code: c(`
function moveZeroes(nums) {
  let w = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[w], nums[i]] = [nums[i], nums[w]];
      w++;
    }
  }
  return nums;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Overwrite, then fill zeros',
          idea: [
            'First pass copies every non-zero forward to `w`.',
            'Second pass writes zeros from `w` to the end.',
          ],
          code: c(`
function moveZeroes(nums) {
  let w = 0;
  for (const x of nums) if (x !== 0) nums[w++] = x;
  while (w < nums.length) nums[w++] = 0;
  return nums;
}`),
          time: 'O(n)',
          space: 'O(1)',
          tradeoff: 'No swaps, so fewer writes when there are few zeros. Two passes instead of one.',
        },
      ],
    },
  ],
  quiz: [
    {
      type: 'mcq',
      question: 'How many subarrays does an array of length 6 have?',
      options: ['`6`', '`21`', '`36`', '`64`'],
      answer: 1,
      explain: '`n(n+1)/2 = 6 × 7 / 2 = 21`. `64 = 2⁶` counts subsequences, not subarrays.',
    },
    {
      type: 'mcq',
      question: 'In an array of length 5, how many subarrays contain index 2?',
      options: ['`5`', '`6`', '`9`', '`15`'],
      answer: 2,
      explain: 'Starts can be 0, 1 or 2 (3 choices) and ends 2, 3 or 4 (3 choices): `(i+1)(n-i) = 3 × 3 = 9`.',
    },
    {
      type: 'output',
      code: c(`
const n = 5, i = 7;
console.log(i % n, -3 % n, ((-3 % n) + n) % n);`),
      options: ['`2 2 2`', '`2 -3 2`', '`2 3 2`', '`2 -3 -3`'],
      answer: 1,
      explain: "JavaScript's `%` keeps the sign of the left side, so `-3 % 5` is `-3`. Add n and take `% n` again to wrap into `0..n-1`.",
    },
    {
      type: 'mcq',
      question: 'A 3 × 4 grid is stored in one array row by row. Which index holds cell (row 2, col 1)?',
      options: ['`7`', '`9`', '`6`', '`11`'],
      answer: 1,
      explain: '`r * cols + c = 2 × 4 + 1 = 9`.',
    },
    {
      type: 'truefalse',
      statement: '`arr.shift()` is O(1) like `arr.pop()`.',
      answer: false,
      explain: 'Removing from the front moves every remaining element down one slot, so it is O(n).',
    },
  ],
};

export default topic;
