import type { Subject, Topic } from '@/content/types';
import { allTopics } from '@/content/registry';
import { formatMinutes, formatTimes, isReady, totalMinutes, totalReviseMinutes } from '@/content/helpers';
import { topicHref } from '@/lib/useHashRoute';
import { RichText } from '@/lib/RichText';
import { scoreKey, useScores } from '@/lib/scores';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { StatusDot } from './StatusDot';

function topicCounts(t: Topic) {
  const parts: string[] = [];
  if (t.qa?.length) parts.push(`${t.qa.length} Q&A`);
  if (t.problems?.length) parts.push(`${t.problems.length} problems`);
  if (t.quiz?.length) parts.push(`${t.quiz.length} quiz`);
  return parts.join(' · ');
}

export function SubjectOverview({ subject }: { subject: Subject }) {
  const { scores } = useScores();
  const topics = allTopics(subject);
  const ready = topics.filter(isReady);
  const questions = ready.reduce((n, t) => n + (t.qa?.length ?? 0) + (t.problems?.length ?? 0) + (t.quiz?.length ?? 0), 0);
  const stats: [number | string, string][] = [
    [subject.categories.length, 'areas'],
    [topics.length, 'topics'],
    [ready.length, 'ready to study'],
    [questions, 'questions'],
    [formatMinutes(totalMinutes(topics)), 'to learn'],
    [formatMinutes(totalReviseMinutes(topics)), 'to revise'],
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[560px] flex-col gap-2.5">
          <p className="text-accent-ink text-xs font-bold tracking-[0.1em] uppercase">Subject</p>
          <h1 className="text-[40px] leading-none font-extrabold tracking-[-0.03em] md:text-[64px]">{subject.name}</h1>
          <p className="text-muted-foreground text-[17px]">
            <RichText text={subject.tagline} />
          </p>
        </div>
        <dl className="m-0 grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-3 lg:grid-cols-6">
          {stats.map(([n, label]) => (
            <Card key={label} className="min-w-[92px] flex-col-reverse rounded-lg px-3.5 py-2.5">
              <dt className="text-muted-foreground text-xs">{label}</dt>
              <dd className="font-display m-0 text-2xl leading-tight font-bold tabular-nums">{n}</dd>
            </Card>
          ))}
        </dl>
      </header>

      <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
        <span className="inline-flex items-center gap-1.5">
          <StatusDot state="ready" /> Ready
        </span>
        <span className="inline-flex items-center gap-1.5">
          <StatusDot state="stub" /> Coming in the content pass
        </span>
        <span className="inline-flex items-center gap-1.5">
          <StatusDot state="done" /> Practised this visit
        </span>
        <span>Times read learn · revise: learning a topic from scratch, then revising it before an interview.</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-3.5">
        {subject.categories.map((cat, ci) => (
          <Card key={cat.id} className="gap-1.5 px-3.5 pt-4 pb-3">
            <div className="flex items-baseline gap-2.5 px-1.5">
              <span className="text-muted-foreground font-mono text-xs font-semibold">{String(ci + 1).padStart(2, '0')}</span>
              <h2 className="text-[19px] font-bold">{cat.name}</h2>
              <span className="text-muted-foreground ml-auto text-xs font-semibold whitespace-nowrap tabular-nums" title="Time to learn · time to revise this area">
                {formatMinutes(totalMinutes(cat.topics))} · {formatMinutes(totalReviseMinutes(cat.topics))}
              </span>
            </div>
            {cat.blurb && (
              <p className="text-muted-foreground px-1.5 pb-1.5 text-[13px]">
                <RichText text={cat.blurb} />
              </p>
            )}
            <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
              {cat.topics.map((t) => {
                const sc = scores[scoreKey(subject.id, t.id)];
                const r = isReady(t);
                return (
                  <li key={t.id}>
                    <a
                      href={topicHref(subject.id, t.id)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm',
                        r ? 'bg-subject/15 hover:bg-subject/25 font-semibold' : 'text-muted-foreground hover:bg-muted',
                      )}
                    >
                      <StatusDot state={sc && sc.answered === sc.total ? 'done' : r ? 'ready' : 'stub'} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        {t.title}
                        <span className="text-muted-foreground text-xs font-medium tabular-nums">
                          {sc ? `${sc.correct}/${sc.total} correct` : r ? topicCounts(t) : 'soon'}
                        </span>
                      </span>
                      <span
                        className="text-muted-foreground text-right text-xs font-semibold whitespace-nowrap tabular-nums"
                        title="Time to learn · time to revise"
                      >
                        {formatTimes(t)}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
