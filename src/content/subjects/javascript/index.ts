import { stub } from '@/content/helpers';
import type { Subject } from '@/content/types';
import meta from './meta';
import closures from './topics/closures';
import thisKeyword from './topics/this-keyword';
import eventLoop from './topics/event-loop';

const subject: Subject = {
  ...meta,
  categories: [
    {
      id: 'basics',
      name: 'Language basics',
      blurb: 'Values, types and the rules that trip people up.',
      topics: [
        stub('var-let-const', 'var, let and const', 'beginner'),
        stub('data-types', 'Data types', 'beginner'),
        stub('type-coercion', 'Type coercion', 'intermediate'),
        stub('equality', '== vs ===', 'beginner'),
        stub('truthy-falsy', 'Truthy and falsy', 'beginner'),
      ],
    },
    {
      id: 'functions-scope',
      name: 'Functions & scope',
      blurb: 'Where variables live and how functions remember them.',
      topics: [
        stub('scope-hoisting', 'Scope and hoisting', 'beginner'),
        stub('tdz', 'Temporal dead zone', 'intermediate'),
        closures,
        stub('higher-order', 'Higher-order functions', 'beginner'),
        stub('iife', 'IIFE', 'beginner'),
        stub('arrow-functions', 'Arrow functions', 'beginner'),
      ],
    },
    {
      id: 'objects-this',
      name: 'Objects & this',
      blurb: 'How objects link together and what `this` points to.',
      topics: [
        thisKeyword,
        stub('call-apply-bind', 'call, apply and bind', 'intermediate'),
        stub('prototypes', 'Prototypes and inheritance', 'intermediate'),
        stub('classes', 'Classes', 'intermediate'),
        stub('property-descriptors', 'Property descriptors', 'advanced'),
      ],
    },
    {
      id: 'async',
      name: 'Asynchronous JS',
      blurb: 'How one thread juggles timers, network and promises.',
      topics: [
        eventLoop,
        stub('callbacks', 'Callbacks', 'beginner'),
        stub('promises', 'Promises', 'intermediate'),
        stub('async-await', 'async / await', 'intermediate'),
        stub('promise-combinators', 'Promise.all, race, any, allSettled', 'intermediate'),
      ],
    },
    {
      id: 'collections',
      name: 'Arrays & collections',
      blurb: 'Built-in data structures and ways to walk through them.',
      topics: [
        stub('array-methods', 'Array methods', 'beginner'),
        stub('destructuring-spread', 'Destructuring and spread', 'beginner'),
        stub('map-set', 'Map and Set', 'intermediate'),
        stub('weakmap-weakset', 'WeakMap and WeakSet', 'advanced'),
        stub('iterators-generators', 'Iterators and generators', 'advanced'),
      ],
    },
    {
      id: 'patterns',
      name: 'Patterns & internals',
      blurb: 'The utilities interviewers ask you to write by hand.',
      topics: [
        stub('currying', 'Currying', 'intermediate'),
        stub('debounce-throttle', 'Debounce and throttle', 'intermediate'),
        stub('memoization', 'Memoization', 'intermediate'),
        stub('deep-copy', 'Shallow vs deep copy', 'intermediate'),
        stub('proxy-reflect', 'Proxy and Reflect', 'advanced'),
        stub('modules', 'ES modules vs CommonJS', 'intermediate'),
        stub('garbage-collection', 'Memory and garbage collection', 'advanced'),
      ],
    },
    {
      id: 'browser',
      name: 'Browser & DOM',
      blurb: 'JavaScript where it meets the page.',
      topics: [
        stub('event-propagation', 'Bubbling and capturing', 'beginner'),
        stub('event-delegation', 'Event delegation', 'intermediate'),
        stub('web-storage', 'localStorage, sessionStorage, cookies', 'beginner'),
        stub('fetch', 'fetch and AbortController', 'intermediate'),
      ],
    },
  ],
};

export default subject;
