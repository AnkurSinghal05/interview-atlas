/*
 * Content format shared by every subject.
 *
 * Subject > Category > Topic > (keyPoints, comparisons, visuals, qa, problems, quiz)
 * A topic with only { id, title, level, masteryMinutes } is shown on the map as "coming soon".
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

export interface ArrayTraceStep {
  note: string;
  /** 1-based line(s) of `code` to highlight. */
  line?: number | number[] | null;
  /** Replace a row's cells from this step on (rows keep their last values otherwise). */
  rows?: Record<string, (number | string | null)[]>;
  /** Named pointers under cells, e.g. { i: 2, j: 5 } or { i: { row: 'prefix', index: 2 } }. */
  pointers?: Record<string, number | { row: string; index: number }>;
  /** Shade a window of cells (inclusive), in the first row unless `row` is given. */
  window?: { from: number; to: number; row?: string };
  /** Variables shown beside the array, e.g. { sum: 7, best: 9 }. */
  vars?: Record<string, string | number>;
}

/** Array cells with moving pointers and windows: two pointers, sliding window, prefix sums… */
export interface ArrayTraceVisual {
  type: 'arrayTrace';
  title?: string;
  code?: string;
  /** Row name → starting cells. `null` renders an empty cell. */
  rows: Record<string, (number | string | null)[]>;
  steps: ArrayTraceStep[];
}

export type Visual = StepperVisual | ArrayTraceVisual;
export type VisualType = Visual['type'];

// ---------- Coding problems ----------
// A problem shows its approaches side by side, from brute force to optimal.
// Each approach's code defines the function named `fn`, so the app (and scripts/verify-problems)
// can run it against the examples.

export interface Approach {
  /** e.g. "Brute force", "Better", "Optimal". */
  name: string;
  /** How it works, one short point per line. */
  idea: string[];
  code: string;
  /** Big-O strings, e.g. "O(n²)". */
  time: string;
  space: string;
}

export interface ProblemExample {
  /** Arguments, in the order of `params`. */
  args: unknown[];
  output: unknown;
  note?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  statement: string;
  /** Name of the function every approach defines. */
  fn: string;
  params: string[];
  examples: ProblemExample[];
  /** Compare array outputs ignoring order (e.g. "return all pairs"). */
  anyOrder?: boolean;
  approaches: Approach[];
  /** Extra interview talking points. */
  notes?: string[];
}

// ---------- Comparisons ----------
// "X vs Y" tables shown on the Learn tab: one column per thing compared, one row per aspect.

export interface ComparisonRow {
  /** e.g. "Time complexity", "Scope", "Hoisted?". */
  aspect: string;
  /** One cell per item, in the order of `Comparison.items`. Supports `code` and **bold**. */
  values: string[];
  /** Emphasise the row that holds the real difference. */
  key?: boolean;
}

export interface Comparison {
  /** e.g. "Prefix sum vs carry forward". Defaults to the items joined with "vs". */
  title?: string;
  /** Column headers: the things being compared. */
  items: string[];
  rows: ComparisonRow[];
  /** What actually differs, in one or two sentences. */
  reveal?: string;
  /** "When to use which": one line per item, in the order of `items`. */
  whenToUse?: string[];
  /** Optional side-by-side code, one snippet per item. */
  code?: string[];
}

// ---------- Structure ----------

export interface Topic {
  id: string;
  title: string;
  level: Level;
  /**
   * Rough time to learn the topic from scratch to interview-ready, in minutes: read it, work through
   * the Q&A, practise until the quiz/problems come easily. Shown on the map and summed per category and subject.
   */
  masteryMinutes: number;
  /** Time to revise it when you already know it. Defaults to about half of `masteryMinutes` (see reviseMinutes()). */
  reviseMinutes?: number;
  summary?: string;
  tags?: string[];
  keyPoints?: KeyPoint[];
  comparisons?: Comparison[];
  visuals?: Visual[];
  qa?: QAItem[];
  problems?: Problem[];
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
