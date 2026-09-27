import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import type { StepperVisual } from '@/content/types';
import { CodeBlock } from '@/components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RichText } from '@/lib/RichText';
import { cn } from '@/lib/utils';

/** Walk through code one step at a time while panels (call stack, queues, console…) update. */
export function Stepper({ visual }: { visual: StepperVisual }) {
  const [i, setI] = useState(0);
  const total = visual.steps.length;
  const step = visual.steps[i];
  const prevState = i > 0 ? (visual.steps[i - 1].state ?? {}) : {};
  const go = (n: number) => setI(Math.max(0, Math.min(total - 1, n)));
  const active = step.line == null ? [] : ([] as number[]).concat(step.line);

  return (
    <Card className="gap-4 p-3.5 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold">{visual.title ?? 'Step through it'}</h3>
        <span className="text-muted-foreground font-mono text-xs">
          Step {i + 1} / {total}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <CodeBlock code={visual.code} numbered activeLines={active} />
        <div className="flex min-w-0 flex-col gap-3">
          <p aria-live="polite" className="bg-subject/15 min-h-[3.6em] rounded-md px-3 py-2.5 text-sm">
            <RichText text={step.note} />
          </p>
          <div className="grid grid-cols-2 gap-2">
            {visual.panels.map((name) => {
              const items = step.state?.[name] ?? [];
              const before = prevState[name] ?? [];
              const isConsole = /console/i.test(name);
              return (
                <div key={name} className="flex min-h-[84px] flex-col gap-1.5 rounded-md border p-2">
                  <div className="text-muted-foreground text-[11px] font-bold tracking-[0.07em] uppercase">{name}</div>
                  <div className={cn('flex gap-1', isConsole ? 'flex-col' : 'flex-col-reverse')}>
                    {items.length === 0 ? (
                      <span className="text-muted-foreground text-xs italic">empty</span>
                    ) : (
                      items.map((item, k) => {
                        const isNew = before[k] !== item;
                        return (
                          <div
                            key={`${i}-${k}`}
                            className={cn(
                              'rounded-sm px-1.5 py-1 font-mono text-xs leading-snug [overflow-wrap:anywhere]',
                              isNew && 'animate-pop',
                              isConsole ? 'bg-code text-code-foreground' : isNew ? 'bg-subject/45' : 'bg-muted',
                              isConsole && isNew && 'ring-subject ring-1 ring-inset',
                            )}
                          >
                            {isConsole && <span className="text-code-muted">› </span>}
                            {item}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
