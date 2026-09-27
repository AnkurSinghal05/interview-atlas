/*
 * Quiz type registry. Every member of the QuizQuestion union must have an entry,
 * so adding a type to src/content/types.ts without a component here fails to compile.
 */
import type { ComponentType } from 'react';
import type { QuizQuestion, QuizType } from '@/content/types';
import { OutputQuiz } from './types/Output';
import { McqQuiz } from './types/Mcq';
import { TrueFalseQuiz } from './types/TrueFalse';

export interface QuizRenderProps<Q extends QuizQuestion> {
  question: Q;
  /** Call once, when the learner answers. The shell adds scoring and the explanation. */
  onAnswer: (correct: boolean) => void;
}

type Registry = { [K in QuizType]: { label: string; Component: ComponentType<QuizRenderProps<Extract<QuizQuestion, { type: K }>>> } };

export const quizTypes: Registry = {
  output: { label: 'Predict the output', Component: OutputQuiz },
  mcq: { label: 'Multiple choice', Component: McqQuiz },
  truefalse: { label: 'True or false', Component: TrueFalseQuiz },
};

export function QuizQuestionView({ question, onAnswer }: QuizRenderProps<QuizQuestion>) {
  const { Component } = quizTypes[question.type] as { Component: ComponentType<QuizRenderProps<QuizQuestion>> };
  return <Component question={question} onAnswer={onAnswer} />;
}
