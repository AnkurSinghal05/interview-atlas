import { cn } from '@/lib/utils';

export type DotState = 'ready' | 'stub' | 'done';

export function StatusDot({ state }: { state: DotState }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-2 flex-none rounded-full',
        state === 'ready' && 'bg-subject',
        state === 'done' && 'bg-good',
        state === 'stub' && 'border-[1.5px] border-border',
      )}
    />
  );
}
