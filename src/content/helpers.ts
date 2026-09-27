import type { Level, Topic } from './types';

/** Strip the leading newline and trailing whitespace of a template-literal code sample. */
export const code = (s: string) => s.replace(/^\n/, '').replace(/\s+$/, '');

/** A topic that is on the map but not written yet. */
export const stub = (id: string, title: string, level: Level): Topic => ({ id, title, level });

export const isReady = (t: Topic) => Boolean(t.qa?.length || t.quiz?.length);
