// Small JS/TS syntax highlighter. Returns escaped HTML, one string per line.

const KEYWORDS =
  'const|let|var|function|return|if|else|for|while|new|this|class|extends|async|await|typeof|instanceof|in|of|null|undefined|true|false|try|catch|finally|throw|super|static|get|set|delete|void|yield|break|continue|switch|case|default|do|import|export|from';

const TOKEN = new RegExp(
  [
    String.raw`(\/\/.*$|\/\*[\s\S]*?\*\/)`, // 1 comment
    String.raw`(\`(?:\\[\s\S]|[^\`\\])*\`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")`, // 2 string
    String.raw`\b(\d+(?:\.\d+)?)\b`, // 3 number
    String.raw`\b(${KEYWORDS})\b`, // 4 keyword
    String.raw`\b([A-Za-z_$][\w$]*)(?=\s*\()`, // 5 call
  ].join('|'),
  'gm',
);
const TOKEN_CLASS = ['', 'tk-com', 'tk-str', 'tk-num', 'tk-kw', 'tk-fn'];

export const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);

export function highlightLines(src: string): string[] {
  let out = '';
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const kind = m.slice(1, 6).findIndex((g) => g !== undefined) + 1;
    const start = m.index!;
    // A multi-line token (block comment, template string) is wrapped per line so lines stay splittable.
    const wrapped = escapeHtml(m[0])
      .split('\n')
      .map((part) => `<span class="${TOKEN_CLASS[kind]}">${part}</span>`)
      .join('\n');
    out += escapeHtml(src.slice(last, start)) + wrapped;
    last = start + m[0].length;
  }
  out += escapeHtml(src.slice(last));
  return out.split('\n');
}
