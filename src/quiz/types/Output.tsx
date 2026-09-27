import type { OutputQuestion } from '@/content/types';
import { CodeBlock } from '@/components/CodeBlock';
import { RichText } from '@/lib/RichText';
import { Choices } from '../Choices';
import type { QuizRenderProps } from '../registry';

export function OutputQuiz({ question: q, onAnswer }: QuizRenderProps<OutputQuestion>) {
  return (
    <div className="flex flex-col gap-3">
      <CodeBlock code={q.code} label="script.js" />
      {q.note && (
        <p className="text-muted-foreground text-sm">
          <RichText text={q.note} />
        </p>
      )}
      <p className="font-semibold">{q.prompt ?? 'What does the console show?'}</p>
      <Choices
        consoleStyle
        answer={q.answer}
        onAnswer={onAnswer}
        options={q.options.map((opt) => (
          <span className="flex flex-col font-mono text-[13px] leading-relaxed">
            {opt.split('\n').map((line, k) => (
              <span key={k} className="whitespace-pre-wrap">
                <span className="text-code-muted">› </span>
                {line}
              </span>
            ))}
          </span>
        ))}
      />
    </div>
  );
}
