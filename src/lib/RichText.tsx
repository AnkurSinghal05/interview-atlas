import { Fragment } from 'react';

/** Renders content strings with `code` and **bold** support. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*.+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 1 && part.startsWith('`') && part.endsWith('`'))
          return (
            <code key={i} className="font-mono rounded bg-muted px-[0.35em] py-[0.1em] text-[0.88em]">
              {part.slice(1, -1)}
            </code>
          );
        if (part.length > 3 && part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
