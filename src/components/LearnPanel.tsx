import type { Topic } from '@/content/types';
import { VisualView } from '@/visuals/registry';
import { RichText } from '@/lib/RichText';
import { Card } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';

export function LearnPanel({ topic }: { topic: Topic }) {
  return (
    <div className="flex flex-col gap-5">
      {!!topic.keyPoints?.length && (
        <div className="flex flex-wrap gap-3">
          {topic.keyPoints.map((kp) => (
            <Card key={kp.title} className="min-w-0 flex-[1_1_220px] gap-2 p-4">
              <h3 className="text-base font-bold">
                <RichText text={kp.title} />
              </h3>
              <p className="text-muted-foreground text-sm">
                <RichText text={kp.text} />
              </p>
              {kp.code && <CodeBlock code={kp.code} />}
            </Card>
          ))}
        </div>
      )}
      {topic.visuals?.map((v, i) => (
        <VisualView key={i} visual={v} />
      ))}
    </div>
  );
}
