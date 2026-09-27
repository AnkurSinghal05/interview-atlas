import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'event-propagation',
  title: 'Bubbling and capturing',
  level: 'beginner',
  tags: ['capture phase', 'bubble phase', 'stopPropagation', 'preventDefault', 'target vs currentTarget'],
  summary: 'A DOM event travels **down** from `window` to the target (capture), then back **up** (bubble). Listeners run on the way.',
  keyPoints: [
    {
      title: 'Three phases',
      text: '1. **Capture**: window → … → parent. 2. **Target**: the clicked element. 3. **Bubble**: parent → … → window.',
    },
    {
      title: 'Listeners bubble by default',
      text: '`addEventListener(type, fn)` listens in the bubble phase. Pass `{ capture: true }` (or `true`) to listen on the way down.',
    },
    {
      title: '`target` vs `currentTarget`',
      text: '`event.target` is the element that was actually clicked. `event.currentTarget` is the element whose listener is running now.',
    },
    {
      title: 'Stop vs prevent',
      text: '`stopPropagation()` stops the event travelling further. `preventDefault()` cancels the browser action (following a link, submitting a form). They are independent.',
    },
  ],
  qa: [
    {
      q: 'What is event bubbling?',
      tag: 'Asked often',
      a: ['After an event fires on the target, it travels up through each ancestor, triggering their listeners for the same event type, up to `document` and `window`.'],
    },
    {
      q: 'What is event capturing?',
      a: ['The first phase, where the event travels from `window` down to the target. Listeners registered with `{ capture: true }` run during it, before bubbling listeners.'],
    },
    {
      q: 'Difference between `stopPropagation` and `stopImmediatePropagation`?',
      a: [
        '`stopPropagation`: other listeners on the **same** element still run; ancestors do not.',
        '`stopImmediatePropagation`: also skips remaining listeners on the same element.',
      ],
    },
    {
      q: 'Difference between `preventDefault` and `return false`?',
      a: [
        'In `addEventListener`, `return false` does nothing. Use `event.preventDefault()`.',
        'In an inline `onclick` handler, `return false` prevents the default. In jQuery it also stopped propagation.',
      ],
    },
    {
      q: 'Which events do not bubble?',
      a: ['`focus`, `blur`, `mouseenter`, `mouseleave`, `load`, `scroll` (on elements). Use `focusin`/`focusout` if you need bubbling focus events.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
// <div id="outer"><button id="btn">Go</button></div>
outer.addEventListener('click', () => console.log('outer'));
btn.addEventListener('click', () => console.log('button'));
btn.click();`),
      note: 'In a browser.',
      options: ['button\nouter', 'outer\nbutton', 'button', 'outer'],
      answer: 0,
      explain: 'Bubble-phase listeners run from the target upward.',
    },
    {
      type: 'output',
      code: c(`
// <div id="outer"><button id="btn">Go</button></div>
outer.addEventListener('click', () => console.log('outer capture'), true);
outer.addEventListener('click', () => console.log('outer bubble'));
btn.addEventListener('click', () => console.log('button'));
btn.click();`),
      note: 'In a browser.',
      options: ['outer capture\nbutton\nouter bubble', 'button\nouter capture\nouter bubble', 'outer capture\nouter bubble\nbutton', 'button\nouter bubble\nouter capture'],
      answer: 0,
      explain: 'Capture runs on the way down, then the target, then bubbling on the way up.',
    },
    {
      type: 'output',
      code: c(`
// <div id="outer"><button id="btn">Go</button></div>
outer.addEventListener('click', () => console.log('outer'));
btn.addEventListener('click', (e) => { e.stopPropagation(); console.log('b1'); });
btn.addEventListener('click', () => console.log('b2'));
btn.click();`),
      note: 'In a browser.',
      options: ['b1\nb2', 'b1', 'b1\nb2\nouter', 'b1\nouter'],
      answer: 0,
      explain: '`stopPropagation` does not stop other listeners on the same element, only ancestors.',
    },
    {
      type: 'output',
      code: c(`
// <ul id="list"><li id="item">One</li></ul>
list.addEventListener('click', (e) => {
  console.log(e.target.id, e.currentTarget.id);
});
item.click();`),
      note: 'In a browser.',
      options: ['item list', 'list list', 'item item', 'list item'],
      answer: 0,
      explain: '`target` is where the click happened; `currentTarget` is the element owning the running listener.',
    },
    {
      type: 'truefalse',
      statement: 'Calling `preventDefault()` also stops the event from bubbling.',
      answer: false,
      explain: 'They are separate. `preventDefault` cancels the default browser action only.',
    },
  ],
};

export default topic;
