import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { KeyPoint, Topic } from '@/content/types';
import { VisualView } from '@/visuals/registry';
import { RichText } from '@/lib/RichText';
import { tintStyle } from '@/lib/tint';
import { useExpandOrigin } from '@/lib/useExpandOrigin';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { CodeBlock } from './CodeBlock';
import { PopupNav } from './PopupNav';

export function LearnPanel({ topic }: { topic: Topic }) {
  const points = topic.keyPoints ?? [];
  const [open, setOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState(0);
  const origin = useExpandOrigin();
  const kp = points[openIdx];

  return (
    <div className="flex flex-col gap-5">
      {!!points.length && (
        <div className="flex flex-wrap gap-3">
          {points.map((kp, i) => (
            <button
              key={kp.title}
              type="button"
              style={tintStyle(i)}
              onClick={(e) => {
                origin.from(e.currentTarget);
                setOpenIdx(i);
                setOpen(true);
              }}
              className="tint group bg-tint border-tint-border hover:bg-tint-hover focus-visible:ring-ring/50 relative flex min-w-0 flex-[1_1_220px] flex-col gap-2 rounded-xl border border-t-4 border-t-tint-strong p-4 text-left transition-[transform,box-shadow,background-color] duration-200 outline-none hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-[3px]"
            >
              <Maximize2
                className="text-tint-ink absolute top-3 right-3 size-3.5 opacity-0 transition-opacity group-hover:opacity-70 group-focus-visible:opacity-70"
                aria-hidden="true"
              />
              <h3 className="text-tint-ink pr-5 text-base font-bold">
                <RichText text={kp.title} />
              </h3>
              <p className="text-muted-foreground line-clamp-4 text-sm">
                <RichText text={kp.text} />
              </p>
              {kp.code && (
                <div className="pointer-events-none max-h-32 overflow-hidden [mask-image:linear-gradient(black_65%,transparent)]">
                  <CodeBlock code={kp.code} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      {topic.visuals?.map((v, i) => (
        <VisualView key={i} visual={v} />
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        {kp && (
          <DialogContent style={{ ...origin.style, ...tintStyle(openIdx) }} className="tint bg-tint border-tint-border border-t-tint-strong border-t-4">
            <KeyPointBody kp={kp} />
            <PopupNav index={openIdx} count={points.length} onGo={setOpenIdx} label="Key idea" />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function KeyPointBody({ kp }: { kp: KeyPoint }) {
  return (
    <>
      <p className="text-tint-ink text-xs font-bold tracking-[0.1em] uppercase">Key idea</p>
      <DialogTitle className="font-display -mt-2 pr-8 text-2xl font-extrabold tracking-[-0.02em] md:text-3xl">
        <RichText text={kp.title} />
      </DialogTitle>
      <DialogDescription asChild>
        <p className="text-[16.5px] leading-relaxed">
          <RichText text={kp.text} />
        </p>
      </DialogDescription>
      {kp.code && <CodeBlock code={kp.code} numbered />}
    </>
  );
}
