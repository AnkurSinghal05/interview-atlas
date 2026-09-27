import { stub } from '@/content/helpers';
import type { Subject } from '@/content/types';
import meta from './meta';
import bigO from './topics/big-o';
import arrayBasics from './topics/array-basics';
import prefixSum from './topics/prefix-sum';
import carryForward from './topics/carry-forward';
import contribution from './topics/contribution';
import kadane from './topics/kadane';
import twoPointers from './topics/two-pointers';
import slidingWindow from './topics/sliding-window';
import hashMaps from './topics/hash-maps';

const subject: Subject = {
  ...meta,
  categories: [
    {
      id: 'foundations',
      name: 'Foundations',
      blurb: 'How to measure an algorithm before you write one.',
      topics: [bigO, stub('recursion', 'Recursion', 'beginner', 240)],
    },
    {
      id: 'arrays',
      name: 'Arrays',
      blurb: 'Formulas and the patterns that turn O(n²) scans into O(n): prefix sums, carry forward, two pointers, windows.',
      topics: [arrayBasics, prefixSum, carryForward, contribution, kadane, twoPointers, slidingWindow, hashMaps],
    },
    {
      id: 'trees-graphs',
      name: 'Trees & graphs',
      topics: [
        stub('binary-trees', 'Binary trees', 'intermediate', 480),
        stub('bfs-dfs', 'BFS and DFS', 'intermediate', 360),
        stub('dynamic-programming', 'Dynamic programming', 'advanced', 900),
      ],
    },
  ],
};

export default subject;
