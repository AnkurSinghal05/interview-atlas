import { code as c } from '@/content/helpers';
import type { Topic } from '@/content/types';

const topic: Topic = {
  id: 'event-delegation',
  title: 'Event delegation',
  level: 'intermediate',
  masteryMinutes: 45,
  tags: ['bubbling', 'closest', 'dynamic elements', 'performance'],
  summary: 'Put **one** listener on a parent and use `event.target` to work out which child was clicked. It relies on bubbling.',
  keyPoints: [
    {
      title: 'One listener for many children',
      text: 'Instead of 1,000 listeners on 1,000 rows, attach one to the table.',
      code: c(`
list.addEventListener('click', (e) => {
  const item = e.target.closest('li');
  if (!item || !list.contains(item)) return;
  console.log('clicked', item.dataset.id);
});`),
    },
    {
      title: 'Works for elements added later',
      text: 'New children need no new listeners, because the parent listener is already there.',
    },
    {
      title: 'Use `closest()`',
      text: 'The click may land on a child (an icon inside a button). `e.target.closest(selector)` walks up to the element you care about.',
    },
    {
      title: 'Limits',
      text: 'Only works for events that bubble, and a child calling `stopPropagation` blocks it.',
    },
  ],
  qa: [
    {
      q: 'What is event delegation and why use it?',
      tag: 'Asked often',
      a: [
        'Handling events for many child elements with one listener on a common ancestor, using `event.target` to identify the child.',
        'Benefits: less memory, less setup, and it works for elements added dynamically.',
      ],
    },
    {
      q: 'Why use `closest` instead of checking `e.target` directly?',
      a: ['`e.target` might be a nested element (a `<span>` inside the `<li>`). `closest("li")` finds the nearest matching ancestor, including the element itself.'],
    },
    {
      q: 'Which events can you not delegate easily?',
      a: ['Events that do not bubble, like `focus`, `blur`, `mouseenter`. Use bubbling alternatives (`focusin`, `mouseover`) or capture-phase listeners.'],
    },
    {
      q: 'How do frameworks like React relate to delegation?',
      a: ['React attaches a small number of listeners at the root and dispatches to components itself, which is delegation at framework scale.'],
    },
  ],
  quiz: [
    {
      type: 'output',
      code: c(`
// <ul id="list"><li data-id="1"><span>One</span></li></ul>
list.addEventListener('click', (e) => {
  console.log(e.target.tagName, e.target.closest('li').dataset.id);
});
list.querySelector('span').click();`),
      note: 'In a browser.',
      options: ['SPAN 1', 'LI 1', 'UL undefined', 'SPAN undefined'],
      answer: 0,
      explain: 'The target is the innermost element clicked. `closest` climbs to the `<li>`.',
    },
    {
      type: 'output',
      code: c(`
// <ul id="list"></ul>
list.addEventListener('click', (e) => console.log('clicked', e.target.textContent));
const li = document.createElement('li');
li.textContent = 'New';
list.append(li);
li.click();`),
      note: 'In a browser.',
      options: ['clicked New', 'Nothing is logged', 'clicked ', 'TypeError'],
      answer: 0,
      explain: 'The parent listener catches clicks on children added after it was attached.',
    },
    {
      type: 'mcq',
      question: 'A table has 5,000 rows, each with a Delete button. What is the best way to handle clicks?',
      options: ['A listener on each button', 'One listener on the table using `closest("button")`', 'An inline `onclick` on each row', 'Polling the buttons with `setInterval`'],
      answer: 1,
      explain: 'Delegation handles all rows with one listener, including rows added later.',
    },
    {
      type: 'truefalse',
      statement: 'Event delegation works with the `focus` event out of the box.',
      answer: false,
      explain: '`focus` does not bubble. Use `focusin` or a capture listener.',
    },
  ],
};

export default topic;
