import { stub } from '@/content/helpers';
import type { Subject } from '@/content/types';
import meta from './meta';
import bigO from './topics/big-o';

const subject: Subject = {
  ...meta,
  categories: [
    {
      id: 'foundations',
      name: 'Foundations',
      blurb: 'How to measure an algorithm before you write one.',
      topics: [bigO, stub('recursion', 'Recursion', 'beginner')],
    },
    {
      id: 'linear',
      name: 'Arrays & hashing',
      topics: [
        stub('two-pointers', 'Two pointers', 'beginner'),
        stub('sliding-window', 'Sliding window', 'intermediate'),
        stub('hash-maps', 'Hash maps', 'beginner'),
      ],
    },
    {
      id: 'trees-graphs',
      name: 'Trees & graphs',
      topics: [
        stub('binary-trees', 'Binary trees', 'intermediate'),
        stub('bfs-dfs', 'BFS and DFS', 'intermediate'),
        stub('dynamic-programming', 'Dynamic programming', 'advanced'),
      ],
    },
  ],
};

export default subject;
