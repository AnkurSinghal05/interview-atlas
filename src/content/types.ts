/*
 * Content format shared by every subject.
 *
 * Subject > Category > Topic > (keyPoints, visuals, qa, quiz)
 * A topic with only { id, title, level } is shown on the map as "coming soon".
 * Inline text in any string field supports `code` and **bold**.
 */

export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface KeyPoint {
  title: string;
  text: string;
  code?: string;
}

export interface QAItem {
  q: string;
  /** One paragraph, or a list of short points (preferred). */
  a: string | string[];
  code?: string;
  /** Small label on the card, e.g. "Asked often". */
  tag?: string;
}

// ---------- Quiz questions ----------
// To add a quiz type: add an interface here, add it to the QuizQuestion union,
// then register a component for it in src/quiz/registry.tsx (TypeScript will insist).

interface QuizBase {
  /** Shown after answering. */
  explain: string;
  explainCode?: string;
}

export interface OutputQuestion extends QuizBase {
  type: 'output';
  code: string;
  note?: string;
  prompt?: string;
  /** Console output per option; use \n for multiple lines. */
  options: string[];
  answer: number;
}

export interface McqQuestion extends QuizBase {
  type: 'mcq';
  question: string;
  code?: string;
  options: string[];
  answer: number;
}

export interface TrueFalseQuestion extends QuizBase {
  type: 'truefalse';
  statement: string;
  code?: string;
  answer: boolean;
}

export type QuizQuestion = OutputQuestion | McqQuestion | TrueFalseQuestion;
export type QuizType = QuizQuestion['type'];

// ---------- Visuals ----------
// To add a visual: add an interface, add it to the Visual union, register it in src/visuals/registry.tsx.

export interface StepperStep {
  /** 1-based line(s) to highlight, or null for none. */
  line: number | number[] | null;
  note: string;
  /** Items per panel name. Panels missing here render empty. */
  state?: Record<string, string[]>;
}

export interface StepperVisual {
  type: 'stepper';
  title?: string;
  code: string;
  panels: string[];
  steps: StepperStep[];
}

export type Visual = StepperVisual;
export type VisualType = Visual['type'];

// ---------- Structure ----------

export interface Topic {
  id: string;
  title: string;
  level: Level;
  summary?: string;
  tags?: string[];
  keyPoints?: KeyPoint[];
  visuals?: Visual[];
  qa?: QAItem[];
  quiz?: QuizQuestion[];
}

export interface Category {
  id: string;
  name: string;
  blurb?: string;
  topics: Topic[];
}

/** Light metadata, loaded up front for the subject switcher. */
export interface SubjectMeta {
  id: string;
  name: string;
  /** Short badge text, e.g. "JS". */
  glyph: string;
  /** Hex colour used for highlights while this subject is open. */
  accent: string;
  tagline: string;
  /** Position in the subject switcher. */
  order: number;
}

/** Full subject, loaded on demand. */
export interface Subject extends SubjectMeta {
  categories: Category[];
}
