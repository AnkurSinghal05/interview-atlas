import { useMemo } from 'react';
import { highlightLines } from '@/lib/highlight';
import { cn } from '@/lib/utils';

interface Props {
  code: string;
  label?: string;
  numbered?: boolean;
  activeLines?: number[];
}

export function CodeBlock({ code, label, numbered, activeLines = [] }: Props) {
  const lines = useMemo(() => highlightLines(code), [code]);
  return (
    <div className="bg-code min-w-0 overflow-hidden rounded-lg">
      {label && <div className="text-code-muted px-3.5 pt-2 font-mono text-[11px]">{label}</div>}
      <pre className="text-code-foreground m-0 overflow-x-auto px-3.5 py-3 font-mono text-[13px] leading-[1.65]">
        {lines.map((html, i) => (
          <span
            key={i}
            className={cn(
              '-mx-1.5 block rounded-sm px-1.5 whitespace-pre transition-colors duration-200',
              activeLines.includes(i + 1) && 'bg-[#f2c94c]/20 shadow-[inset_3px_0_0_#f2c94c]',
            )}
          >
            {numbered && <span className="text-code-muted inline-block w-[2.2em] select-none">{i + 1}</span>}
            <span dangerouslySetInnerHTML={{ __html: html || ' ' }} />
          </span>
        ))}
      </pre>
    </div>
  );
}
