import type { Subject } from '@/content/types';
import meta from './meta';

// Language basics
import varLetConst from './topics/var-let-const';
import dataTypes from './topics/data-types';
import numbers from './topics/numbers';
import typeCoercion from './topics/type-coercion';
import equality from './topics/equality';
import truthyFalsy from './topics/truthy-falsy';
import optionalChaining from './topics/optional-chaining';
import strictMode from './topics/strict-mode';
// Functions & scope
import executionContext from './topics/execution-context';
import scopeHoisting from './topics/scope-hoisting';
import tdz from './topics/tdz';
import closures from './topics/closures';
import higherOrder from './topics/higher-order';
import defaultRestParams from './topics/default-rest-params';
import iife from './topics/iife';
import arrowFunctions from './topics/arrow-functions';
// Objects & this
import objectMethods from './topics/object-methods';
import thisKeyword from './topics/this-keyword';
import callApplyBind from './topics/call-apply-bind';
import newKeyword from './topics/new-keyword';
import prototypes from './topics/prototypes';
import classes from './topics/classes';
import propertyDescriptors from './topics/property-descriptors';
import symbols from './topics/symbols';
// Asynchronous JS
import callbacks from './topics/callbacks';
import eventLoop from './topics/event-loop';
import timers from './topics/timers';
import promises from './topics/promises';
import asyncAwait from './topics/async-await';
import promiseCombinators from './topics/promise-combinators';
import errorHandling from './topics/error-handling';
// Arrays & collections
import arrayMethods from './topics/array-methods';
import strings from './topics/strings';
import destructuringSpread from './topics/destructuring-spread';
import json from './topics/json';
import mapSet from './topics/map-set';
import weakmapWeakset from './topics/weakmap-weakset';
import iteratorsGenerators from './topics/iterators-generators';
// Patterns & internals
import currying from './topics/currying';
import debounceThrottle from './topics/debounce-throttle';
import memoization from './topics/memoization';
import deepCopy from './topics/deep-copy';
import polyfills from './topics/polyfills';
import eventEmitter from './topics/event-emitter';
import proxyReflect from './topics/proxy-reflect';
import modules from './topics/modules';
import garbageCollection from './topics/garbage-collection';
import trickyOutputs from './topics/tricky-outputs';
// Browser & DOM
import eventPropagation from './topics/event-propagation';
import eventDelegation from './topics/event-delegation';
import webStorage from './topics/web-storage';
import fetchTopic from './topics/fetch';
import scriptLoading from './topics/script-loading';
import webWorkers from './topics/web-workers';

const subject: Subject = {
  ...meta,
  categories: [
    {
      id: 'basics',
      name: 'Language basics',
      blurb: 'Values, types and the rules that trip people up.',
      topics: [varLetConst, dataTypes, numbers, typeCoercion, equality, truthyFalsy, optionalChaining, strictMode],
    },
    {
      id: 'functions-scope',
      name: 'Functions & scope',
      blurb: 'Where variables live and how functions remember them.',
      topics: [executionContext, scopeHoisting, tdz, closures, higherOrder, defaultRestParams, iife, arrowFunctions],
    },
    {
      id: 'objects-this',
      name: 'Objects & this',
      blurb: 'How objects link together and what `this` points to.',
      topics: [objectMethods, thisKeyword, callApplyBind, newKeyword, prototypes, classes, propertyDescriptors, symbols],
    },
    {
      id: 'async',
      name: 'Asynchronous JS',
      blurb: 'How one thread juggles timers, network and promises.',
      topics: [callbacks, eventLoop, timers, promises, asyncAwait, promiseCombinators, errorHandling],
    },
    {
      id: 'collections',
      name: 'Arrays & collections',
      blurb: 'Built-in data structures and ways to walk through them.',
      topics: [arrayMethods, strings, destructuringSpread, json, mapSet, weakmapWeakset, iteratorsGenerators],
    },
    {
      id: 'patterns',
      name: 'Patterns & internals',
      blurb: 'The utilities interviewers ask you to write by hand, and how the engine works.',
      topics: [currying, debounceThrottle, memoization, deepCopy, polyfills, eventEmitter, proxyReflect, modules, garbageCollection, trickyOutputs],
    },
    {
      id: 'browser',
      name: 'Browser & DOM',
      blurb: 'JavaScript where it meets the page.',
      topics: [eventPropagation, eventDelegation, webStorage, fetchTopic, scriptLoading, webWorkers],
    },
  ],
};

export default subject;
