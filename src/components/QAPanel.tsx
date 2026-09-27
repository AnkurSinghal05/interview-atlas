import { useState } from 'react';
import type { QAItem } from '@/content/types';
import { RichText } from '@/lib/RichText';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from './CodeBlock';

export function QAPanel({ items }: { items: QAItem[] }) {
  const [open, setOpen] = useState<string[]>([]);
  const allOpen = open.length === items.length;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-sm">
        <p>Try answering out loud first, then open the card to check.</p>
        <Button variant="outline" size="sm" onClick={() => setOpen(allOpen ? [] : items.map((_, i) => `q${i}`))}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </Button>
      </div>
      <Accordion type="multiple" value={open} onValueChange={setOpen} className="flex flex-col gap-2">
        {items.map((item, i) => (
          <AccordionItem key={i} value={`q${i}`} className="bg-card data-[state=open]:border-subject/70 rounded-lg border">
            <AccordionTrigger className="px-4 py-3.5 text-[15.5px]">
              <span className="text-muted-foreground flex-none font-mono text-xs leading-[1.9]">Q{i + 1}</span>
              <span className="flex-1">
                <RichText text={item.q} />
              </span>
              {item.tag && <Badge className="bg-subject/20 text-accent-ink mt-0.5 border-transparent">{item.tag}</Badge>}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3 px-4 pb-4 sm:pl-[52px]">
              <ul className="marker:text-subject flex list-disc flex-col gap-1.5 pl-[18px]">
                {([] as string[]).concat(item.a).map((p, k) => (
                  <li key={k}>
                    <RichText text={p} />
                  </li>
                ))}
              </ul>
              {item.code && <CodeBlock code={item.code} />}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
