/*
 * Runs every approach of every problem against its examples. In topics that have
 * problems, it also runs each synchronous "predict the output" quiz against its marked answer.
 * Usage: npm run verify [subjectId]   (default: all subjects)
 */
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { format } from 'node:util';
import { createJiti } from 'jiti';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(root, 'src') } });
const { runExample, show } = await jiti.import(path.join(root, 'src/lib/runProblem.ts'));

const only = process.argv[2];
const subjects = readdirSync(path.join(root, 'src/content/subjects')).filter((s) => !only || s === only);
let checked = 0;
const failures = [];

function captureConsole(code) {
  const lines = [];
  const fakeConsole = { log: (...a) => lines.push(format(...a)) };
  new Function('console', code)(fakeConsole);
  return lines.join('\n');
}

for (const id of subjects) {
  const subject = await jiti.import(path.join(root, `src/content/subjects/${id}/index.ts`), { default: true });
  for (const cat of subject.categories) {
    for (const topic of cat.topics) {
      for (const p of topic.problems ?? []) {
        for (const a of p.approaches) {
          p.examples.forEach((ex, k) => {
            checked++;
            const r = runExample(a.code, p.fn, ex.args, ex.output, p.anyOrder);
            if (!r.ok)
              failures.push(`${topic.id} / ${p.id} / ${a.name} / example ${k + 1}: expected ${show(ex.output)}, got ${r.error ?? show(r.got)}`);
          });
        }
      }
      for (const q of topic.problems ? (topic.quiz ?? []) : []) {
        if (q.type !== 'output' || /setTimeout|Promise|await|document|window/.test(q.code)) continue;
        checked++;
        const want = q.options[q.answer].replace(/^`|`$/g, '').replace(/\\n/g, '\n');
        let got;
        try { got = captureConsole(q.code); } catch (e) { got = `throws ${e.message}`; }
        if (got !== want) failures.push(`${topic.id} / quiz "${q.code.slice(0, 40)}…": marked ${JSON.stringify(want)}, ran ${JSON.stringify(got)}`);
      }
    }
  }
}

console.log(`${checked} checks, ${failures.length} failures`);
for (const f of failures) console.log('  ✗ ' + f);
process.exit(failures.length ? 1 : 0);
