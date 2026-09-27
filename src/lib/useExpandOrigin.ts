import { useState, type CSSProperties } from 'react';

/** Width the dialog opens at; keep in step with DialogContent's max-w. */
const DIALOG_WIDTH = 720;

/**
 * Remembers where a clicked card sits so the dialog can grow out of it and shrink back into it.
 * Spread `style` on DialogContent and call `from(event)` in the card's click handler.
 */
export function useExpandOrigin() {
  const [style, setStyle] = useState<CSSProperties>();
  const from = (el: Element) => {
    const r = el.getBoundingClientRect();
    const width = Math.min(DIALOG_WIDTH, window.innerWidth - 32);
    setStyle({
      '--from-x': `${r.left + r.width / 2 - window.innerWidth / 2}px`,
      '--from-y': `${r.top + r.height / 2 - window.innerHeight / 2}px`,
      '--from-s': Math.min(1, Math.max(0.3, r.width / width)),
    } as CSSProperties);
  };
  return { style, from };
}
