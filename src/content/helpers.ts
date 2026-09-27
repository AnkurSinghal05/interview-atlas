import type { Level, Topic } from './types';

/** Strip the leading newline and trailing whitespace of a template-literal code sample. */
export const code = (s: string) => s.replace(/^\n/, '').replace(/\s+$/, '');

/** A topic that is on the map but not written yet. */
export const stub = (id: string, title: string, level: Level, masteryMinutes: number): Topic => ({ id, title, level, masteryMinutes });

export const isReady = (t: Topic) => Boolean(t.qa?.length || t.quiz?.length || t.problems?.length);

/** Total mastery time of a list of topics, in minutes. */
export const totalMinutes = (topics: Topic[]) => topics.reduce((n, t) => n + t.masteryMinutes, 0);

/** 45 → "45m", 90 → "1.5h", 480 → "8h". */
export const formatMinutes = (min: number) => {
  if (min < 60) return `${min}m`;
  const h = Math.round((min / 60) * 2) / 2;
  return `${h}h`;
};
