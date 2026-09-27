import type { CSSProperties } from 'react';

/**
 * Hues (OKLCH degrees) cycled across cards. `.tint` in index.css turns `--hue` into
 * background, border and ink colours that stay readable in light and dark themes.
 */
const HUES = [255, 165, 45, 320, 205, 285, 130, 15];

export const tintStyle = (index: number) => ({ '--hue': HUES[index % HUES.length] }) as CSSProperties;
