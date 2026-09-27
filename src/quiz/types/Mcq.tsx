import type { McqQuestion } from '@/content/types';
import { CodeBlock } from '@/components/CodeBlock';
import { RichText } from '@/lib/RichText';
import { Choices } from '../Choices';
import type { QuizRenderProps } from '../registry';

export function McqQuiz({ question: q, onAnswer }: QuizRenderProps<McqQuestion>) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-semibold">
        <RichText text={q.question} />
      </p>
      {q.code && <CodeBlock code={q.code} />}
      <Choices
        answer={q.answer}
        onAnswer={onAnswer}
        options={q.options.map((o) => (
          <RichText text={o} />
        ))}
      />
    </div>
  );
}
