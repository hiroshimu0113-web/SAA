import type { Attempt, Question } from './types';
export function isCorrect(q: Question, selected: string[]): boolean {
  return selected.length === q.answers.length && new Set(selected).size === selected.length && q.answers.every(a => selected.includes(a));
}
export function reviewQuestions(questions: Question[], attempts: Attempt[]): Question[] {
  const latest = new Map<string, Attempt>();
  for (const a of attempts) latest.set(a.questionId, a);
  return questions.filter(q => !q.exam && latest.has(q.id) && (!latest.get(q.id)!.correct || latest.get(q.id)!.unsure));
}
