import { createContext, useContext, useState, type ReactNode } from 'react';

// Quiz results for this visit. Persisting them is part of the mastery-tracking step.
export interface TopicScore {
  answered: number;
  correct: number;
  total: number;
}
type Scores = Record<string, TopicScore>;

const Ctx = createContext<{ scores: Scores; setScore: (key: string, s: TopicScore) => void } | null>(null);

export function ScoresProvider({ children }: { children: ReactNode }) {
  const [scores, setScores] = useState<Scores>({});
  const setScore = (key: string, s: TopicScore) => setScores((prev) => ({ ...prev, [key]: s }));
  return <Ctx.Provider value={{ scores, setScore }}>{children}</Ctx.Provider>;
}

export function useScores() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useScores must be used inside ScoresProvider');
  return ctx;
}

export const scoreKey = (subjectId: string, topicId: string) => `${subjectId}.${topicId}`;
