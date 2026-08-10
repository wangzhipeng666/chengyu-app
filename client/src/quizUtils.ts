import type { Quiz } from './types';

export function isGradableQuiz(quiz: Quiz): boolean {
  return Boolean(
    quiz.answer &&
    quiz.options.length >= 4 &&
    quiz.options.every(option => option.label && option.text) &&
    quiz.options.some(option => option.label === quiz.answer)
  );
}
