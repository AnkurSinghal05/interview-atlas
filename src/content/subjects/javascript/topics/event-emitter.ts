import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'event-emitter',
  title: 'Event emitter and pub/sub',
  level: 'intermediate',
  tags: ['observer pattern', 'on', 'off', 'once', 'emit', 'machine coding'],
  summary: 'An event emitter keeps a list of listeners per event name and calls them when the event is emitted. It is the **observer** pattern.',
  keyPoints: [
    {
      title: 'Four methods',
      text: '`on(event, fn)` subscribes, `off(event, fn)` unsubscribes, `once(event, fn)` fires once, `emit(event, ...args)` calls every listener.',
    },
    {
      title: 'Store listeners in a Map',
      text: '`Map<string, Set<Function>>` or arrays. Arrays keep duplicates and order; Sets prevent double subscription.',
    },
    {
      title: 'Copy before emitting',
      text: 'A listener may call `off` (e.g. `once`) while you loop. Iterate over a copy so removals do not skip other listeners.',
    },
    {
      title: 'Where you see it',
      text: 'Node\'s `EventEmitter`, DOM events, Redux store subscriptions and message buses.',
    },
  ],
  qa: [
    {
      q: 'Implement an EventEmitter with on, off, emit and once.',
      tag: 'Coding',
      a: ['Keep a map from event name to listeners; `once` wraps the listener so it removes itself.'],
      code: c(`
class Emitter {
  #events = new Map();
  on(name, fn) {
    if (!this.#events.has(name)) this.#events.set(name, []);
    this.#events.get(name).push(fn);
    return () => this.off(name, fn); // unsubscribe helper
  }
  off(name, fn) {
    const list = this.#events.get(name) ?? [];
    this.#events.set(name, list.filter((l) => l !== fn && l.original !== fn));
  }
  once(name, fn) {
    const wrapper = (...args) => { this.off(name, wrapper); fn(...args); };
    wrapper.original = fn;
    this.on(name, wrapper);
  }
  emit(name, ...args) {
    [...(this.#events.get(name) ?? [])].forEach((fn) => fn(...args));
  }
}`),
    },
    {
      q: 'What is the difference between the observer pattern and pub/sub?',
      a: [
        'Observer: subjects know their observers directly and notify them.',
        'Pub/sub: publishers and subscribers only know a broker or channel name, not each other. An event emitter sits in between.',
      ],
    },
    {
      q: 'Why should `on` return an unsubscribe function?',
      a: ['It makes cleanup easy and avoids leaks, e.g. in a React `useEffect` return. You do not have to keep a reference to the original function around.'],
    },
    {
      q: 'Should `emit` be synchronous?',
      a: ['Node\'s is: listeners run in order during `emit`. That is predictable, but a slow or throwing listener affects the emitter. Some buses queue listeners as microtasks instead.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
class Emitter {
  events = {};
  on(e, fn) { (this.events[e] ??= []).push(fn); }
  emit(e, ...a) { (this.events[e] ?? []).forEach((fn) => fn(...a)); }
}
const bus = new Emitter();
bus.on('msg', (x) => console.log('A', x));
bus.on('msg', (x) => console.log('B', x));
bus.emit('msg', 1);
bus.emit('other', 2);`),
      options: ['A 1\nB 1', 'A 1\nB 1\nA 2\nB 2', 'B 1\nA 1', 'A 1'],
      answer: 0,
      explain: 'Listeners run in subscription order. Emitting an event with no listeners does nothing.',
    },
    {
      type: 'output',
      code: c(`
const listeners = [];
const on = (fn) => listeners.push(fn);
const off = (fn) => listeners.splice(listeners.indexOf(fn), 1);
const emit = () => listeners.forEach((fn) => fn());
const a = () => { console.log('a'); off(a); };
const b = () => console.log('b');
on(a); on(b);
emit();`),
      options: ['a', 'a\nb', 'b', 'a\nb\nb'],
      answer: 0,
      explain: 'Removing `a` during `forEach` shifts `b` into index 0, which was already visited, so `b` is skipped. Iterate over a copy to avoid this.',
    },
    {
      type: 'output',
      code: c(`
const { EventEmitter } = require('events');
const e = new EventEmitter();
e.once('ping', () => console.log('pong'));
e.emit('ping');
e.emit('ping');
console.log(e.listenerCount('ping'));`),
      note: 'Runs in Node.',
      options: ['pong\n0', 'pong\npong\n1', 'pong\n1', 'pong\npong\n0'],
      answer: 0,
      explain: '`once` removes the listener after the first call.',
    },
    {
      type: 'output',
      code: c(`
const { EventEmitter } = require('events');
const e = new EventEmitter();
e.on('x', () => console.log('listener'));
console.log('before');
e.emit('x');
console.log('after');`),
      note: 'Runs in Node.',
      options: ['before\nlistener\nafter', 'before\nafter\nlistener', 'listener\nbefore\nafter', 'before\nafter'],
      answer: 0,
      explain: 'Node\'s `emit` calls listeners synchronously.',
    },
  ],
};

export default topic;
