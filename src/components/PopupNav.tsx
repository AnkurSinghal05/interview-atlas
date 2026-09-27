import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/** Previous / next buttons at the foot of a card pop-up; the arrow keys work too. */
export function PopupNav({ index, count, onGo, label }: { index: number; count: number; onGo: (i: number) => void; label: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && index > 0) onGo(index - 1);
      if (e.key === 'ArrowRight' && index < count - 1) onGo(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, count, onGo]);

  if (count < 2) return null;
  return (
    <div className="mt-1 flex items-center justify-between gap-3 border-t pt-4">
      <Button variant="outline" size="sm" disabled={index === 0} onClick={() => onGo(index - 1)}>
        <ChevronLeft /> Previous
      </Button>
      <span className="text-muted-foreground text-xs tabular-nums">
        {label} {index + 1} of {count}
      </span>
      <Button variant="outline" size="sm" disabled={index === count - 1} onClick={() => onGo(index + 1)}>
        Next <ChevronRight />
      </Button>
    </div>
  );
}
