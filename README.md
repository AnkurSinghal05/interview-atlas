# Interview Atlas

Interactive interview prep: a concept map per subject, and for each topic short key ideas, a step-through code visual,
Q&A cards, and quizzes (predict the output, multiple choice, true/false).

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · lucide icons. No backend.

```bash
npm install
npm run dev            # local dev server
npm run build          # production build in dist/ (deploy this, e.g. Vercel auto-detects Vite)
npm run build:preview  # single self-contained HTML file in dist-singlefile/
npm run typecheck
npm run verify         # run every problem approach against its examples
```

Routing is hash-based (`#javascript.closures`), so any static host works without rewrite rules.

## Layout

```
src/
  content/
    types.ts                 content format (Subject > Category > Topic > keyPoints / visuals / qa / problems / quiz)
    registry.ts              discovers subjects automatically, lazy-loads each one
    helpers.ts               code(), stub(), isReady()
    subjects/<id>/meta.ts    name, glyph, accent colour, order (loaded up front)
    subjects/<id>/index.ts   categories and topic outline (loaded on demand)
    subjects/<id>/topics/*.ts  one file per written topic
  quiz/                      quiz types + registry
  visuals/                   visual widgets (stepper, arrayTrace) + registry
  components/                pages and pieces; components/ui = shadcn/ui components
  lib/                       highlighter, rich text, routing, colour mode, scores
```

## Add a subject
Create `src/content/subjects/react/` with `meta.ts` and `index.ts` (copy `dsa/`). It shows up in the subject switcher
automatically. Unwritten topics are `stub('id', 'Title', 'beginner', 120)`; written ones are `Topic` objects in `topics/`.
Every topic has `masteryMinutes`, a rough time to learn it from scratch, and an optional `reviseMinutes` (defaults to about half).
The map shows both per topic and totals them per area and subject.

## Add a quiz type
1. Add an interface to the `QuizQuestion` union in `src/content/types.ts`.
2. Add a component in `src/quiz/types/` and register it in `src/quiz/registry.tsx`.
TypeScript fails the build until step 2 is done, so a type can't be half-added.

## Add a coding problem
Add a `Problem` to a topic's `problems` list. Each approach (brute force first, optimal last) has an idea, code,
and time/space complexity, and its code must define the function named in `fn`. The Problems tab shows the
approaches side by side and can run each one on the examples; `npm run verify` does the same in Node.
Other ways to solve the same problem that are not a step on that ladder (often the same Big-O with a
different trade-off) go in `alternatives`, each with a one-line `tradeoff`.

## Add a visual
Same pattern: extend the `Visual` union, then register a component in `src/visuals/registry.tsx`.

## shadcn/ui
`components.json` is set up, so `npx shadcn@latest add <component>` works for adding more components.
