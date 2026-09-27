import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { QAItem } from '@/content/types';
import { RichText } from '@/lib/RichText';
import { tintStyle } from '@/lib/tint';
import { useExpandOrigin } from '@/lib/useExpandOrigin';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { CodeBlock } from './CodeBlock';
import { PopupNav } from './PopupNav';

export function QAPanel({ items }: { items: QAItem[] }) {
  const [open, setOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState(0);
  const origin = useExpandOrigin();
  const item = items[openIdx];

  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-muted-foreground text-sm">Try answering out loud first, then open the card to check.</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            style={tintStyle(i)}
            onClick={(e) => {
              origin.from(e.currentTarget);
              setOpenIdx(i);
              setOpen(true);
            }}
            className="tint group bg-tint border-tint-border hover:bg-tint-hover focus-visible:ring-ring/50 relative flex min-h-[112px] flex-col gap-2.5 rounded-xl border border-l-4 border-l-tint-strong px-4 py-3.5 text-left transition-[transform,box-shadow,background-color] duration-200 outline-none hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-[3px]"
          >
            <span className="flex items-center gap-2">
              <span className="text-tint-ink font-mono text-xs font-bold">Q{i + 1}</span>
              {item.tag && <Badge className="bg-tint-strong/20 text-tint-ink border-transparent">{item.tag}</Badge>}
              <Maximize2
                className="text-tint-ink ml-auto size-3.5 opacity-40 transition-opacity group-hover:opacity-80"
                aria-hidden="true"
              />
            </span>
            <span className="text-[15.5px] leading-snug font-semibold">
              <RichText text={item.q} />
            </span>
          </button>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {item && (
          <DialogContent style={{ ...origin.style, ...tintStyle(openIdx) }} className="tint bg-tint border-tint-border border-t-tint-strong border-t-4">
            <p className="flex items-center gap-2">
              <span className="text-tint-ink font-mono text-xs font-bold">Q{openIdx + 1}</span>
              {item.tag && <Badge className="bg-tint-strong/20 text-tint-ink border-transparent">{item.tag}</Badge>}
            </p>
            <DialogTitle className="font-display -mt-1 pr-8 text-xl font-bold tracking-[-0.015em] md:text-2xl">
              <RichText text={item.q} />
            </DialogTitle>
            <DialogDescription asChild>
              <ul className="marker:text-tint-strong flex list-disc flex-col gap-2 pl-5 text-[16px] leading-relaxed">
                {([] as string[]).concat(item.a).map((p, k) => (
                  <li key={k}>
                    <RichText text={p} />
                  </li>
                ))}
              </ul>
            </DialogDescription>
            {item.code && <CodeBlock code={item.code} />}
            <PopupNav index={openIdx} count={items.length} onGo={setOpenIdx} label="Question" />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
