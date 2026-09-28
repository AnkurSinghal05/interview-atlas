import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'hash-maps',
  title: 'Hashing on arrays',
  level: 'beginner',
  masteryMinutes: 150,
  tags: ['hash map', 'set', 'frequency', 'anagram', 'two sum', 'majority element', 'consecutive sequence'],
  summary:
    'A `Map` or `Set` answers "have I seen this?" in O(1). Trading O(n) memory for that lookup is the most common way to beat an O(n²) array scan.',
  keyPoints: [
    {
      title: 'Seen-before lookup',
      text: 'Instead of searching back through the array for a partner, store what you have seen and ask the map.',
      code: c(`
const seen = new Map(); // value -> index
for (let i = 0; i < nums.length; i++) {
  if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
  seen.set(nums[i], i);
}`),
    },
    {
      title: 'Frequency count',
      text: '`count.set(x, (count.get(x) ?? 0) + 1)`. The base of anagrams, duplicates, majority and top-k questions.',
    },
    {
      title: 'Map vs object in JS',
      text: 'Prefer `Map`: keys keep their type (`1` and `"1"` differ), no prototype keys like `constructor`, and `.size` is O(1).',
    },
    {
      title: 'Costs',
      text: 'Average O(1) per insert or lookup, O(n) extra space. Worst case with many collisions is O(n) per operation, which interviews usually ignore.',
    },
    {
      title: 'Prefix sum + map',
      text: 'Store the first index (for longest) or the count (for number of) of each prefix sum. Then "subarray sum = k" becomes a lookup of `prefix - k`.',
    },
  ],
  visuals: [
    {
      type: 'arrayTrace',
      title: 'Two sum with a map (target 9)',
      code: c(`
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  const need = target - nums[i];
  if (seen.has(need)) return [seen.get(need), i];
  seen.set(nums[i], i);
}`),
      rows: { nums: [11, 2, 15, 7] },
      steps: [
        { line: 1, note: 'Target 9. The map starts empty.', vars: { target: 9, seen: '{}' } },
        { line: 5, note: 'Need `9 - 11 = -2`, not seen. Store `11 → 0`.', pointers: { i: 0 }, vars: { need: -2, seen: '{11: 0}' } },
        { line: 5, note: 'Need `9 - 2 = 7`, not seen yet. Store `2 → 1`.', pointers: { i: 1 }, vars: { need: 7, seen: '{11: 0, 2: 1}' } },
        { line: 5, note: 'Need `-6`, not seen. Store `15 → 2`.', pointers: { i: 2 }, vars: { need: -6, seen: '{11: 0, 2: 1, 15: 2}' } },
        { line: 4, note: 'Need `9 - 7 = 2`: the map has it at index 1. Answer `[1, 3]`, one pass.', pointers: { i: 3, match: 1 }, vars: { need: 2, seen: '{11: 0, 2: 1, 15: 2}' } },
      ],
    },
  ],
  qa: [
    {
      q: 'Why check the map before inserting in two sum?',
      tag: 'Asked often',
      a: ['So an element cannot pair with itself. With `[3]` and target 6, inserting first would wrongly find 3 + 3.'],
    },
    {
      q: 'Hash map vs sorting: how do you choose?',
      a: [
        'Hash map: O(n) time, O(n) space, keeps original indices.',
        'Sort + two pointers: O(n log n) time, O(1) extra space, loses indices unless you sort pairs.',
        'Say both and pick based on what the interviewer cares about (memory or speed).',
      ],
    },
    {
      q: "Explain Boyer–Moore majority vote.",
      a: [
        'Keep a candidate and a count. Same value: count up. Different: count down. At 0, take the current value as the new candidate.',
        'Every non-majority element can cancel at most one majority element, so the majority (more than n/2) survives.',
      ],
    },
  ],
  problems: [
    {
      id: 'valid-anagram',
      title: 'Valid anagram',
      difficulty: 'easy',
      statement: 'Return `true` if `t` uses exactly the same letters as `s`, the same number of times. Both are lowercase English letters.',
      fn: 'isAnagram',
      params: ['s', 't'],
      examples: [
        { args: ['anagram', 'nagaram'], output: true },
        { args: ['rat', 'car'], output: false },
        { args: ['aab', 'abb'], output: false, note: 'same letters, different counts' },
        { args: ['ab', 'abc'], output: false },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For each letter of `s`, find a matching unused letter in `t` and cross it out.'],
          code: c(`
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const rest = t.split('');
  for (const ch of s) {
    const i = rest.indexOf(ch);
    if (i === -1) return false;
    rest.splice(i, 1);
  }
  return true;
}`),
          time: 'O(n²)',
          space: 'O(n)',
        },
        {
          name: 'Sort and compare',
          idea: ['Anagrams become the same string once their letters are sorted.'],
          code: c(`
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const sort = (x) => x.split('').sort().join('');
  return sort(s) === sort(t);
}`),
          time: 'O(n log n)',
          space: 'O(n)',
        },
        {
          name: 'Count array (26 slots)',
          idea: [
            'One slot per letter: `s[i]` adds 1, `t[i]` subtracts 1, in the same loop.',
            'Anagrams leave every slot at 0. The array is always 26 long, so space is O(1).',
          ],
          code: c(`
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const arr = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    arr[s.charCodeAt(i) - 97]++;
    arr[t.charCodeAt(i) - 97]--;
  }
  return arr.every((x) => x === 0);
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Hash map count',
          idea: [
            'Same +1 / -1 idea, but the counts live in an object keyed by the character.',
            'Then check that every count is back to 0.',
          ],
          code: c(`
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const map = {};
  for (let i = 0; i < s.length; i++) {
    map[s[i]] = (map[s[i]] ?? 0) + 1;
    map[t[i]] = (map[t[i]] ?? 0) - 1;
  }
  for (const ch in map) {
    if (map[ch] !== 0) return false;
  }
  return true;
}`),
          time: 'O(n)',
          space: 'O(k)',
          tradeoff:
            'Works for any characters (Unicode, uppercase, digits), not just `a`–`z`. Space grows with the number of distinct characters k, and hashing is a bit slower than array indexing.',
        },
        {
          name: 'Two Maps, then compare',
          idea: ['Count each string into its own `Map`, then check that every key has the same count in both.'],
          code: c(`
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = (str) => {
    const m = new Map();
    for (const ch of str) m.set(ch, (m.get(ch) ?? 0) + 1);
    return m;
  };
  const a = count(s), b = count(t);
  if (a.size !== b.size) return false;
  for (const [ch, n] of a) if (b.get(ch) !== n) return false;
  return true;
}`),
          time: 'O(n)',
          space: 'O(k)',
          tradeoff: 'Easiest to explain and reuse (the `count` helper also solves "group anagrams"), but it builds two maps instead of one.',
        },
      ],
      notes: [
        'Ask what the character set is. Only lowercase letters: the 26-slot array. Anything else: a hash map.',
        'Checking the lengths first is free and lets you skip the work for obvious mismatches.',
      ],
    },
    {
      id: 'two-sum',
      title: 'Two sum (unsorted)',
      difficulty: 'easy',
      statement: 'Return indices `[i, j]` (`i < j`) of the two numbers that add up to `target`. Exactly one answer exists.',
      fn: 'twoSum',
      params: ['nums', 'target'],
      examples: [
        { args: [[2, 7, 11, 15], 9], output: [0, 1] },
        { args: [[3, 2, 4], 6], output: [1, 2] },
        { args: [[3, 3], 6], output: [0, 1] },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Try every pair.'],
          code: c(`
function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Sort + two pointers',
          idea: ['Sort `[value, index]` pairs so indices survive, then close in from both ends.'],
          code: c(`
function twoSum(nums, target) {
  const pairs = nums.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  let l = 0, r = pairs.length - 1;
  while (l < r) {
    const sum = pairs[l][0] + pairs[r][0];
    if (sum === target) return [pairs[l][1], pairs[r][1]].sort((a, b) => a - b);
    if (sum < target) l++; else r--;
  }
}`),
          time: 'O(n log n)',
          space: 'O(n)',
        },
        {
          name: 'Hash map',
          idea: ['For each value, look up `target - value` among the ones already seen.'],
          code: c(`
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
      ],
    },
    {
      id: 'majority-element',
      title: 'Majority element',
      difficulty: 'easy',
      statement: 'Return the value that appears more than `n / 2` times. It always exists.',
      fn: 'majorityElement',
      params: ['nums'],
      examples: [
        { args: [[3, 2, 3]], output: 3 },
        { args: [[2, 2, 1, 1, 1, 2, 2]], output: 2 },
        { args: [[5]], output: 5 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['For each value, count how often it appears.'],
          code: c(`
function majorityElement(nums) {
  for (const x of nums) {
    let count = 0;
    for (const y of nums) if (y === x) count++;
    if (count > nums.length / 2) return x;
  }
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Sort',
          idea: ['A value filling more than half the array must sit in the middle after sorting.'],
          code: c(`
function majorityElement(nums) {
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}`),
          time: 'O(n log n)',
          space: 'O(n)',
        },
        {
          name: 'Hash map count',
          idea: ['Count in a `Map`; return as soon as a count passes `n / 2`.'],
          code: c(`
function majorityElement(nums) {
  const count = new Map();
  for (const x of nums) {
    const c = (count.get(x) ?? 0) + 1;
    if (c > nums.length / 2) return x;
    count.set(x, c);
  }
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
        {
          name: 'Boyer–Moore vote',
          idea: ['Pair off different values so they cancel. The majority is the one left standing.'],
          code: c(`
function majorityElement(nums) {
  let candidate = null, count = 0;
  for (const x of nums) {
    if (count === 0) candidate = x;
    count += x === candidate ? 1 : -1;
  }
  return candidate;
}`),
          time: 'O(n)',
          space: 'O(1)',
        },
      ],
      alternatives: [
        {
          name: 'Bit counting',
          idea: [
            'For each of the 32 bits, the majority value decides it: set the bit if more than n/2 numbers have it.',
          ],
          code: c(`
function majorityElement(nums) {
  let result = 0;
  for (let b = 0; b < 32; b++) {
    let ones = 0;
    for (const x of nums) if ((x >> b) & 1) ones++;
    if (ones > nums.length / 2) result |= 1 << b;
  }
  return result;
}`),
          time: 'O(32·n)',
          space: 'O(1)',
          tradeoff: 'O(1) space like Boyer–Moore, but 32 passes. Mostly a bit-manipulation talking point.',
        },
      ],
      notes: ['If a majority is not guaranteed, do a second pass to confirm the candidate really appears more than n/2 times.'],
    },
    {
      id: 'longest-consecutive',
      title: 'Longest consecutive sequence',
      difficulty: 'medium',
      statement: 'Return the length of the longest run of consecutive integers that can be formed from values in `nums` (order in the array does not matter).',
      fn: 'longestConsecutive',
      params: ['nums'],
      examples: [
        { args: [[100, 4, 200, 1, 3, 2]], output: 4, note: '1, 2, 3, 4' },
        { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], output: 9 },
        { args: [[]], output: 0 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['From each value, keep checking whether `x + 1` is in the array with a linear search.'],
          code: c(`
function longestConsecutive(nums) {
  let best = 0;
  for (const x of nums) {
    let len = 1;
    while (nums.includes(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`),
          time: 'O(n³)',
          space: 'O(1)',
        },
        {
          name: 'Sort',
          idea: ['Sort, then count runs where each value is the previous + 1 (skip duplicates).'],
          code: c(`
function longestConsecutive(nums) {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  let best = 1, run = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) continue;
    run = s[i] === s[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}`),
          time: 'O(n log n)',
          space: 'O(n)',
        },
        {
          name: 'Hash set',
          idea: [
            'Put everything in a `Set`. Only start counting from a value with no `x - 1` (the start of a run).',
            'Each value is visited at most twice, so it is O(n) even with the inner loop.',
          ],
          code: c(`
function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;
    let len = 1;
    while (set.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
      ],
      alternatives: [
        {
          name: 'Map of run lengths',
          idea: [
            'When x arrives, look up the run ending at `x - 1` and the run starting at `x + 1`, join them, and store the new length at both ends.',
          ],
          code: c(`
function longestConsecutive(nums) {
  const len = new Map();
  let best = 0;
  for (const x of nums) {
    if (len.has(x)) continue;
    const left = len.get(x - 1) ?? 0, right = len.get(x + 1) ?? 0;
    const total = left + right + 1;
    len.set(x, total);
    len.set(x - left, total);
    len.set(x + right, total);
    best = Math.max(best, total);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(n)',
          tradeoff: 'Works one element at a time (good for a stream), but the boundary updates are easy to get wrong.',
        },
      ],
    },
    {
      id: 'longest-subarray-sum-k',
      title: 'Longest subarray with sum k',
      difficulty: 'medium',
      statement: 'Return the length of the longest contiguous subarray that sums to `k`. Values can be negative. Return 0 if none.',
      fn: 'longestSubarraySumK',
      params: ['nums', 'k'],
      examples: [
        { args: [[10, 5, 2, 7, 1, -10], 15], output: 6 },
        { args: [[1, -1, 5, -2, 3], 3], output: 4 },
        { args: [[-5, 8, -14, 2, 4, 12], -5], output: 5 },
      ],
      approaches: [
        {
          name: 'Brute force',
          idea: ['Every start; extend the end with a running sum.'],
          code: c(`
function longestSubarraySumK(nums, k) {
  let best = 0;
  for (let s = 0; s < nums.length; s++) {
    let sum = 0;
    for (let e = s; e < nums.length; e++) {
      sum += nums[e];
      if (sum === k) best = Math.max(best, e - s + 1);
    }
  }
  return best;
}`),
          time: 'O(n²)',
          space: 'O(1)',
        },
        {
          name: 'Prefix sum + first index',
          idea: [
            'Store the **first** index where each prefix sum appears (first = longest subarray later).',
            'At index i, if `prefix - k` was seen at j, the subarray `j+1..i` sums to k.',
          ],
          code: c(`
function longestSubarraySumK(nums, k) {
  const first = new Map([[0, -1]]);
  let prefix = 0, best = 0;
  for (let i = 0; i < nums.length; i++) {
    prefix += nums[i];
    if (first.has(prefix - k)) best = Math.max(best, i - first.get(prefix - k));
    if (!first.has(prefix)) first.set(prefix, i);
  }
  return best;
}`),
          time: 'O(n)',
          space: 'O(n)',
        },
      ],
      notes: ['If every value is positive, a sliding window does it in O(1) space. With negatives, only the prefix map is correct.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
const count = new Map();
for (const x of [3, 1, 3, 2, 3, 1]) count.set(x, (count.get(x) ?? 0) + 1);
console.log([...count]);`),
      options: ['`[ [ 3, 3 ], [ 1, 2 ], [ 2, 1 ] ]`', '`[ [ 1, 2 ], [ 2, 1 ], [ 3, 3 ] ]`', '`{ 3: 3, 1: 2, 2: 1 }`', '`[ 3, 1, 2 ]`'],
      answer: 0,
      explain: 'A `Map` keeps insertion order, and spreading it gives `[key, value]` pairs.',
    },
    {
      type: 'output',
      code: c(`
let candidate = null, count = 0;
for (const x of [1, 2, 2, 1, 1]) {
  if (count === 0) candidate = x;
  count += x === candidate ? 1 : -1;
}
console.log(candidate, count);`),
      options: ['`1 1`', '`2 1`', '`1 3`', '`2 0`'],
      answer: 0,
      explain: '1 (+1), 2 (0), 2 becomes candidate (+1), 1 (0), 1 becomes candidate (+1). Candidate 1, count 1.',
    },
    {
      type: 'mcq',
      question: 'For "longest subarray with sum k", which index should the map store for each prefix sum?',
      options: ['The last index it appears', 'The first index it appears', 'How many times it appears', 'Any index works'],
      answer: 1,
      explain: 'The earliest start gives the longest subarray, so never overwrite the first index. (For counting subarrays, store how many times instead.)',
    },
  ],
};

export default topic;
