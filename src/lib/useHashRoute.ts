import { useEffect, useState } from 'react';

/**
 * Hash routes:  #<subjectId>            subject overview
 *               #<subjectId>.<topicId>  topic page
 * Hash routing works on any static host (Vercel, S3, GitHub Pages) with no rewrite rules.
 */
export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash.slice(1));
  useEffect(() => {
    const onChange = () => setHash(window.location.hash.slice(1));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  const [subjectId, topicId] = decodeURIComponent(hash).split('.');
  return { subjectId: subjectId || undefined, topicId: topicId || undefined };
}

export const subjectHref = (subjectId: string) => `#${subjectId}`;
export const topicHref = (subjectId: string, topicId: string) => `#${subjectId}.${topicId}`;
