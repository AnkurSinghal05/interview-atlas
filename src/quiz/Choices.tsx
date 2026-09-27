import { useState, type ReactNode } from 'react';
import { shuffle } from '@/lib/shuffle';
import { cn } from '@/lib/utils';

interface Props {
  options: ReactNode[];
  answer: number;
  onAnswer: (correct: boolean) => void;
  /** Dark console-style options (for output questions). */
  consoleStyle?: boolean;
  keepOrder?: boolean;
  className?: string;
}

/** Shared single-choice mechanics: shuffled options, locks after the first pick, marks right and wrong. */
export function Choices({ options, answer, onAnswer, consoleStyle, keepOrder, className }: Props) {
  // Shuffle once per mount; the quiz runner remounts this for each new question.
  const [order] = useState(() => (keepOrder ? options.map((_, i) => i) : shuffle(options.map((_, i) => i))));
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className={cn('grid grid-cols-1 gap-2 sm:grid-cols-2', className)}>
      {order.map((i) => {
        const state =
          picked === null ? 'idle' : picked === i && i === answer ? 'right' : picked === i ? 'wrong' : i === answer ? 'answer' : 'dim';
        return (
          <button
            key={i}
            type="button"
            disabled={picked !== null}
            onClick={() => {
              setPicked(i);
              onAnswer(i === answer);
            }}
            className={cn(
              'rounded-lg border-[1.5px] px-3.5 py-2.5 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              consoleStyle ? 'bg-code text-code-foreground border-code-border' : 'bg-card border-border',
              state === 'idle' && 'cursor-pointer ' + (consoleStyle ? 'hover:border-subject' : 'hover:border-foreground'),
              state === 'right' && (consoleStyle ? 'border-good ring-1 ring-good' : 'border-good bg-good-soft'),
              state === 'wrong' && (consoleStyle ? 'border-bad ring-1 ring-bad' : 'border-bad bg-bad-soft'),
              state === 'answer' && 'border-good border-dashed',
              state === 'dim' && 'opacity-55',
            )}
          >
            {options[i]}
          </button>
        );
      })}
    </div>
  );
}
