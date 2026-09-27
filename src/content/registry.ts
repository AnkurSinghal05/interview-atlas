/*
 * Subjects are discovered automatically: every folder in ./subjects with a
 * meta.ts and an index.ts becomes a subject. No other file needs editing.
 */
import type { Subject, SubjectMeta, Topic, Category } from './types';

const metaModules = import.meta.glob<SubjectMeta>('./subjects/*/meta.ts', { eager: true, import: 'default' });
const loaders = import.meta.glob<Subject>('./subjects/*/index.ts', { import: 'default' });

const folderOf = (path: string) => path.split('/')[2];

export const subjectList: SubjectMeta[] = Object.values(metaModules).sort((a, b) => a.order - b.order);

const loaderById = new Map<string, () => Promise<Subject>>(
  Object.entries(loaders).map(([path, load]) => [metaModules[`./subjects/${folderOf(path)}/meta.ts`].id, load]),
);

const cache = new Map<string, Subject>();

export function getCachedSubject(id: string) {
  return cache.get(id);
}

export async function loadSubject(id: string): Promise<Subject> {
  const hit = cache.get(id);
  if (hit) return hit;
  const load = loaderById.get(id);
  if (!load) throw new Error(`Unknown subject "${id}"`);
  const subject = await load();
  cache.set(id, subject);
  return subject;
}

export type TopicWithCategory = Topic & { category: Category };

export function allTopics(subject: Subject): TopicWithCategory[] {
  return subject.categories.flatMap((category) => category.topics.map((t) => ({ ...t, category })));
}
