import { Search } from 'lucide-react';
import type { Subject, Topic } from '@/content/types';
import { subjectList } from '@/content/registry';
import { formatTimes, isReady } from '@/content/helpers';
import { subjectHref, topicHref } from '@/lib/useHashRoute';
import { scoreKey, useScores } from '@/lib/scores';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { StatusDot } from './StatusDot';
import { ColorModeToggle } from './ColorModeToggle';
import { Brand } from './Brand';

interface Props {
  subject: Subject;
  topicId?: string;
  query: string;
  onQueryChange: (q: string) => void;
  onNavigate?: () => void;
}

export function Sidebar({ subject, topicId, query, onQueryChange, onNavigate }: Props) {
  const { scores } = useScores();
  const q = query.trim().toLowerCase();
  const matches = (t: Topic) =>
    !q ||
    t.title.toLowerCase().includes(q) ||
    (t.tags ?? []).some((tag) => tag.toLowerCase().includes(q)) ||
    (t.qa ?? []).some((x) => x.q.toLowerCase().includes(q)) ||
    (t.problems ?? []).some((p) => p.title.toLowerCase().includes(q));
  const groups = subject.categories.map((c) => ({ ...c, topics: c.topics.filter(matches) })).filter((c) => c.topics.length);

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-5">
      <Brand href={subjectHref(subject.id)} onClick={onNavigate} />

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Subjects">
        {subjectList.map((s) => {
          const current = s.id === subject.id;
          return (
            <a
              key={s.id}
              href={subjectHref(s.id)}
              role="tab"
              aria-selected={current}
              onClick={() => {
                onQueryChange('');
                onNavigate?.();
              }}
              style={current ? { borderColor: s.accent, boxShadow: `inset 0 0 0 1px ${s.accent}` } : undefined}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border py-1 pr-2.5 pl-1 text-[13px] font-semibold',
                current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                style={{ background: s.accent }}
                className="text-on-subject rounded-full px-1.5 py-1 font-mono text-[10px] leading-none font-bold"
              >
                {s.glyph}
              </span>
              {s.name}
            </a>
          );
        })}
      </div>

      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id="topic-search"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search topics"
          aria-label="Search topics and questions"
          className="bg-background pl-9"
        />
      </div>

      <nav aria-label={`${subject.name} topics`} className="flex flex-1 flex-col gap-3.5">
        {groups.length === 0 && <p className="text-muted-foreground px-2 text-xs">No topics match “{query}”.</p>}
        {groups.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-px">
            <div className="text-muted-foreground px-2 pb-1 text-[11px] font-bold tracking-[0.08em] uppercase">{cat.name}</div>
            {cat.topics.map((t) => {
              const sc = scores[scoreKey(subject.id, t.id)];
              const ready = isReady(t);
              const current = t.id === topicId;
              return (
                <a
                  key={t.id}
                  href={topicHref(subject.id, t.id)}
                  onClick={onNavigate}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    'hover:bg-muted flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm',
                    current && 'bg-muted font-semibold',
                    !ready && 'text-muted-foreground',
                  )}
                >
                  <StatusDot state={sc && sc.answered === sc.total ? 'done' : ready ? 'ready' : 'stub'} />
                  <span className="min-w-0 flex-1">{t.title}</span>
                  <span className="text-muted-foreground text-[11px] tabular-nums" title="Time to learn · time to revise">
                    {ready ? formatTimes(t) : 'soon'}
                  </span>
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-2 border-t pt-3">
        <ColorModeToggle />
        <p className="text-muted-foreground text-xs">
          {subjectList.length} subjects. Add one by adding a folder under src/content/subjects.
        </p>
      </div>
    </div>
  );
}
