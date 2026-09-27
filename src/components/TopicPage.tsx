import { useState } from 'react';
import type { Subject } from '@/content/types';
import { allTopics, type TopicWithCategory } from '@/content/registry';
import { Clock } from 'lucide-react';
import { formatMinutes, isReady } from '@/content/helpers';
import { subjectHref, topicHref } from '@/lib/useHashRoute';
import { RichText } from '@/lib/RichText';
import { scoreKey } from '@/lib/scores';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearnPanel } from './LearnPanel';
import { QAPanel } from './QAPanel';
import { PracticePanel } from './PracticePanel';
import { ProblemsPanel } from './ProblemsPanel';

const LEVEL_STYLE = {
  beginner: 'text-good border-good',
  intermediate: 'text-accent-ink border-accent-ink',
  advanced: 'text-bad border-bad',
} as const;

type Tab = 'learn' | 'qa' | 'problems' | 'practice';

export function TopicPage({ subject, topic }: { subject: Subject; topic: TopicWithCategory }) {
  const flat = allTopics(subject);
  const idx = flat.findIndex((t) => t.id === topic.id);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];

  const tabs = [
    { id: 'learn' as Tab, label: 'Learn', show: !!(topic.keyPoints?.length || topic.visuals?.length) },
    { id: 'qa' as Tab, label: 'Q&A', count: topic.qa?.length, show: !!topic.qa?.length },
    { id: 'problems' as Tab, label: 'Problems', count: topic.problems?.length, show: !!topic.problems?.length },
    { id: 'practice' as Tab, label: 'Practice', count: topic.quiz?.length, show: !!topic.quiz?.length },
  ].filter((t) => t.show);
  const [tab, setTab] = useState<Tab>(tabs[0]?.id ?? 'learn');

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2.5">
        <p className="text-muted-foreground text-[13px]">
          <a href={subjectHref(subject.id)} className="font-semibold hover:underline">
            {subject.name}
          </a>
          <span aria-hidden="true"> / </span>
          {topic.category.name}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[32px] font-extrabold tracking-[-0.025em] md:text-5xl">{topic.title}</h1>
          <Badge variant="outline" className={cn('bg-transparent', LEVEL_STYLE[topic.level])}>
            {topic.level[0].toUpperCase() + topic.level.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-muted-foreground gap-1 bg-transparent" title="Rough time to master this topic">
            <Clock className="size-3.5" aria-hidden="true" />~{formatMinutes(topic.masteryMinutes)} to master
          </Badge>
        </div>
        {topic.summary && (
          <p className="text-muted-foreground max-w-[62ch] text-[17px]">
            <RichText text={topic.summary} />
          </p>
        )}
      </header>

      {isReady(topic) ? (
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="bg-background sticky top-[calc(env(safe-area-inset-top,0px)+57px)] z-10 w-full justify-start gap-1 overflow-x-auto border-b md:top-0">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="data-[state=active]:border-subject -mb-px border-b-[3px] border-transparent px-3.5 pt-2.5 pb-3"
              >
                {t.label}
                {t.count ? <span className="bg-muted rounded-full px-1.5 text-[11px] tabular-nums">{t.count}</span> : null}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="learn">
            <LearnPanel topic={topic} />
          </TabsContent>
          {topic.qa && (
            <TabsContent value="qa">
              <QAPanel items={topic.qa} />
            </TabsContent>
          )}
          {topic.problems && (
            <TabsContent value="problems">
              <ProblemsPanel problems={topic.problems} />
            </TabsContent>
          )}
          {topic.quiz && (
            <TabsContent value="practice">
              <PracticePanel
                quiz={topic.quiz}
                topicTitle={topic.title}
                scoreId={scoreKey(subject.id, topic.id)}
                onReviewQA={topic.qa ? () => setTab('qa') : undefined}
              />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="flex flex-col gap-2.5 rounded-xl border-[1.5px] border-dashed p-6">
          <h2 className="text-xl font-bold">On the map, not written yet</h2>
          <p className="text-muted-foreground max-w-[60ch]">
            This topic gets its Q&A and output questions in the full content pass. The sample topics show the finished format.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {flat.filter(isReady).map((t) => (
              <Button key={t.id} variant="outline" size="sm" asChild>
                <a href={topicHref(subject.id, t.id)}>{t.title}</a>
              </Button>
            ))}
          </div>
        </div>
      )}

      <nav aria-label="Adjacent topics" className="mt-3 grid grid-cols-2 gap-3 border-t pt-4.5">
        {prev ? (
          <a href={topicHref(subject.id, prev.id)} className="hover:text-accent-ink flex flex-col font-semibold">
            <small className="text-muted-foreground text-xs font-medium">Previous</small>
            {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a href={topicHref(subject.id, next.id)} className="hover:text-accent-ink flex flex-col text-right font-semibold">
            <small className="text-muted-foreground text-xs font-medium">Next</small>
            {next.title}
          </a>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
