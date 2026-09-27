import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { ArrayTraceVisual } from '@/content/types';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RichText } from '@/lib/RichText';
import { cn } from '@/lib/utils';

type Rows = Record<string, (number | string | null)[]>;

/** Array cells with pointers and a shaded window, stepped through one move at a time. */
export function ArrayTrace({ visual }: { visual: ArrayTraceVisual }) {
  const [i, setI] = useState(0);
  const total = visual.steps.length;
  const go = (n: number) => setI(Math.max(0, Math.min(total - 1, n)));

  // Rows carry forward: each step only lists the rows it changes.
  const rowsAt = useMemo(() => {
    const out: Rows[] = [];
    let cur: Rows = visual.rows;
    for (const s of visual.steps) {
      cur = { ...cur, ...s.rows };
      out.push(cur);
    }
    return out;
  }, [visual]);

  const step = visual.steps[i];
  const rows = rowsAt[i];
  const prevRows = i > 0 ? rowsAt[i - 1] : visual.rows;
  const rowNames = Object.keys(rows);
  const firstRow = rowNames[0];
  const active = step.line == null ? [] : ([] as number[]).concat(step.line);

  const pointersFor = (row: string, idx: number) =>
    Object.entries(step.pointers ?? {})
      .filter(([, p]) => (typeof p === 'number' ? row === firstRow && p === idx : p.row === row && p.index === idx))
      .map(([name]) => name);
  const inWindow = (row: string, idx: number) =>
    !!step.window && (step.window.row ?? firstRow) === row && idx >= step.window.from && idx <= step.window.to;

  const board = (
    <div className="flex min-w-0 flex-col gap-3">
      <p aria-live="polite" className="bg-subject/15 min-h-[3.6em] rounded-md px-3 py-2.5 text-sm">
        <RichText text={step.note} />
      </p>
      <div className="overflow-x-auto pb-1">
        <table className="border-separate border-spacing-x-1 border-spacing-y-0">
          <tbody>
            <tr>
              <td />
              {rows[firstRow].map((_, k) => (
                <td key={k} className="text-muted-foreground text-center font-mono text-[10px]">
                  {k}
                </td>
              ))}
            </tr>
            {rowNames.map((name) => (
              <tr key={name}>
                <th scope="row" className="text-muted-foreground pr-1.5 text-right text-[11px] font-bold tracking-[0.05em] whitespace-nowrap uppercase">
                  {name}
                </th>
                {rows[name].map((v, k) => {
                  const changed = prevRows[name]?.[k] !== v;
                  const ptrs = pointersFor(name, k);
                  return (
                    <td key={k} className="p-0 pb-1 align-top">
                      <div
                        key={`${i}-${changed}`}
                        className={cn(
                          'flex h-10 min-w-10 items-center justify-center rounded-md border-[1.5px] px-1.5 font-mono text-sm font-semibold tabular-nums',
                          v === null && 'text-muted-foreground border-dashed',
                          inWindow(name, k) ? 'border-subject bg-subject/25' : 'bg-card',
                          ptrs.length > 0 && 'border-foreground',
                          changed && i > 0 && 'animate-pop',
                        )}
                      >
                        {v === null ? '·' : v}
                      </div>
                      <div className="flex min-h-[18px] flex-col items-center font-mono text-[10.5px] leading-tight font-bold">
                        {ptrs.map((p) => (
                          <span key={p} className="text-accent-ink">
                            ↑{p}
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {step.vars && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(step.vars).map(([k, v]) => (
            <span key={k} className="bg-muted rounded-md px-2 py-1 font-mono text-xs">
              <span className="text-muted-foreground">{k} = </span>
              <span className="font-semibold">{v}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="gap-4 p-3.5 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold">{visual.title ?? 'Trace it'}</h3>
        <span className="text-muted-foreground font-mono text-xs">
          Step {i + 1} / {total}
        </span>
      </div>

      {visual.code ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <CodeBlock code={visual.code} numbered activeLines={active} />
          {board}
        </div>
      ) : (
        board
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {visual.steps.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`Step ${k + 1}`}
              onClick={() => go(k)}
              className={cn('h-1.5 w-[22px] cursor-pointer rounded-full', k === i ? 'bg-subject' : k < i ? 'bg-subject/50' : 'bg-muted')}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => go(0)}>
            <RotateCcw /> Restart
          </Button>
          <Button variant="outline" size="sm" onClick={() => go(i - 1)} disabled={i === 0}>
            <ChevronLeft /> Back
          </Button>
          <Button size="sm" onClick={() => go(i + 1)} disabled={i === total - 1}>
            Next step <ChevronRight />
          </Button>
        </div>
      </div>
    </Card>
  );
}
