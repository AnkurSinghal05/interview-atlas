import { useState } from 'react';
import { ArrowRight, Check, Play, X } from 'lucide-react';
import type { Approach, Problem } from '@/content/types';
import { RichText } from '@/lib/RichText';
import { runExample, show, type RunResult } from '@/lib/runProblem';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from './CodeBlock';

const DIFFICULTY = {
  easy: 'text-good border-good',
  medium: 'text-accent-ink border-accent-ink',
  hard: 'text-bad border-bad',
} as const;

/** Rough growth rank of a Big-O string, used to size and colour the bars. */
export function growthRank(bigO: string): number {
  const s = bigO.replace(/\s+/g, '');
  if (/2\^|2ⁿ|n!/.test(s)) return 6;
  if (/n³|n\^3/.test(s)) return 5;
  if (/n²|n\^2|n\*m|n·m|m·n/.test(s)) return 4;
  if (/n·k|n\*k|k·n/.test(s)) return 3.5;
  if (/nlogn|n·logn/.test(s)) return 3;
  if (/\(n\)|\(n\+|\(m\+n\)|\(n\+m\)/.test(s)) return 2;
  if (/\(k\)|\(m\)/.test(s)) return 1.5;
  if (/log/.test(s)) return 1;
  return 0;
}

const rankTone = (r: number) => (r <= 2 ? 'bg-good' : r <= 3.5 ? 'bg-subject' : 'bg-bad');

function ComplexityBar({ label, value }: { label: string; value: string }) {
  const r = growthRank(value);
  return (
    <div className="grid grid-cols-[42px_1fr_auto] items-center gap-2 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="bg-muted h-1.5 overflow-hidden rounded-full">
        <span className={cn('block h-full rounded-full transition-[width] duration-300', rankTone(r))} style={{ width: `${12 + (r / 6) * 88}%` }} />
      </span>
      <code className="font-mono font-semibold">{value}</code>
    </div>
  );
}

function ApproachCard({ approach, label, selected, onSelect }: { approach: Approach; label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full cursor-pointer flex-col gap-1.5 rounded-lg border-[1.5px] px-3 py-2.5 text-left transition-colors',
        selected ? 'border-subject bg-subject/10' : 'hover:bg-muted/60',
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold">{approach.name}</span>
        <span className="text-muted-foreground font-mono text-[11px]">{label}</span>
      </span>
      <ComplexityBar label="Time" value={approach.time} />
      <ComplexityBar label="Space" value={approach.space} />
    </button>
  );
}

function ProblemBody({ problem }: { problem: Problem }) {
  const alternatives = problem.alternatives ?? [];
  const all = [...problem.approaches, ...alternatives];
  const [sel, setSel] = useState(problem.approaches.length - 1);
  const [runs, setRuns] = useState<Record<number, RunResult[]>>({});
  const approach = all[sel];
  const results = runs[sel];

  const run = () =>
    setRuns((r) => ({
      ...r,
      [sel]: problem.examples.map((ex) => runExample(approach.code, problem.fn, ex.args, ex.output, problem.anyOrder)),
    }));

  return (
    <div className="flex flex-col gap-4">
      <p className="max-w-[70ch]">
        <RichText text={problem.statement} />
      </p>

      <div className="flex flex-col gap-1.5">
        {problem.examples.map((ex, k) => (
          <div key={k} className="bg-muted/60 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md px-3 py-2 font-mono text-[12.5px]">
            <span>
              {problem.params.map((p, i) => (
                <span key={p}>
                  {i > 0 && ', '}
                  <span className="text-muted-foreground">{p} = </span>
                  {show(ex.args[i])}
                </span>
              ))}
            </span>
            <ArrowRight className="text-muted-foreground size-3.5" aria-label="returns" />
            <span className="font-semibold">{show(ex.output)}</span>
            {ex.note && <span className="text-muted-foreground font-sans text-xs">· {ex.note}</span>}
          </div>
        ))}
      </div>

      {/* Approach ladder: brute force → optimal */}
      <div role="tablist" aria-label="Approaches" className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {problem.approaches.map((a, k) => (
          <div key={a.name} className="flex flex-1 items-center gap-2 sm:min-w-0">
            {k > 0 && <ArrowRight className="text-muted-foreground hidden size-4 flex-none sm:block" aria-hidden="true" />}
            <ApproachCard approach={a} label={`${k + 1}/${problem.approaches.length}`} selected={k === sel} onSelect={() => setSel(k)} />
          </div>
        ))}
      </div>

      {alternatives.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-bold tracking-[0.07em] uppercase">Alternative solutions</p>
          <div role="tablist" aria-label="Alternative solutions" className="grid grid-cols-1 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {alternatives.map((a, k) => {
              const idx = problem.approaches.length + k;
              return <ApproachCard key={a.name} approach={a} label="alt" selected={idx === sel} onSelect={() => setSel(idx)} />;
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <div className="flex flex-col gap-3">
          <h4 className="text-base font-bold">{approach.name}</h4>
          {approach.tradeoff && (
            <p className="bg-subject/10 rounded-md px-3 py-2 text-sm">
              <span className="font-semibold">Trade-off: </span>
              <RichText text={approach.tradeoff} />
            </p>
          )}
          <ul className="marker:text-subject flex list-disc flex-col gap-1.5 pl-[18px] text-sm">
            {approach.idea.map((p, k) => (
              <li key={k}>
                <RichText text={p} />
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="outline" className="self-start" onClick={run}>
              <Play /> Run on examples
            </Button>
            {results && (
              <ul className="flex flex-col gap-1 font-mono text-xs" aria-live="polite">
                {results.map((r, k) => (
                  <li key={k} className={cn('flex items-start gap-1.5 rounded-sm px-2 py-1', r.ok ? 'bg-good-soft' : 'bg-bad-soft')}>
                    {r.ok ? <Check className="text-good mt-px size-3.5 flex-none" /> : <X className="text-bad mt-px size-3.5 flex-none" />}
                    <span className="[overflow-wrap:anywhere]">
                      Example {k + 1}: {r.error ? `Error: ${r.error}` : show(r.got)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <CodeBlock code={approach.code} label={`${approach.name} · time ${approach.time} · space ${approach.space}`} />
      </div>

      {problem.notes && (
        <div className="bg-subject/10 rounded-md px-3.5 py-2.5 text-sm">
          <p className="mb-1 text-xs font-bold tracking-[0.07em] uppercase">Say this in the interview</p>
          <ul className="marker:text-subject flex list-disc flex-col gap-1 pl-[18px]">
            {problem.notes.map((n, k) => (
              <li key={k}>
                <RichText text={n} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ProblemsPanel({ problems }: { problems: Problem[] }) {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-muted-foreground text-sm">
        Each problem climbs from brute force to optimal, and some also list alternative solutions with their own trade-offs. Try the next step yourself before you open it, then run it on the examples.
      </p>
      <Accordion type="multiple" value={open} onValueChange={setOpen} className="flex flex-col gap-2">
        {problems.map((p, i) => {
          const best = p.approaches[p.approaches.length - 1];
          return (
            <AccordionItem key={p.id} value={p.id} className="bg-card data-[state=open]:border-subject/70 rounded-lg border">
              <AccordionTrigger className="px-4 py-3.5 text-[15.5px]">
                <span className="text-muted-foreground flex-none font-mono text-xs leading-[1.9]">P{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <RichText text={p.title} />
                  <span className="text-muted-foreground block font-mono text-xs font-normal sm:ml-2 sm:inline sm:whitespace-nowrap">
                    {p.approaches.length} approaches
                    {p.alternatives?.length ? ` · ${p.alternatives.length} alternative${p.alternatives.length > 1 ? 's' : ''}` : ''} · best {best.time}
                  </span>
                </span>
                <Badge variant="outline" className={cn('mt-0.5 bg-transparent capitalize', DIFFICULTY[p.difficulty])}>
                  {p.difficulty}
                </Badge>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 sm:pl-[52px]">
                {open.includes(p.id) && <ProblemBody problem={p} />}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
