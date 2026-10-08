import type { ExamId, ExamSession, Progress, Question } from './types';
import { isCorrect } from './learning';
export const EXAM_REVISION = '2026-10-08-gr-review';
export const examNames: Record<ExamId, string> = { mock1: '条件変更演習 1', mock2: '条件変更演習 2', assessment1: '到達度確認（独立セット）' };
export function beginExam(p: Progress, id: ExamId, now: number, unseen: boolean): Progress {
  const archive = [...(p.examArchive ?? []), ...(p.exam ? [p.exam] : [])];
  const previous = archive.filter(e => e.id === id);
  const attemptNumber = Math.max(previous.length, ...previous.map(e => e.attemptNumber ?? 1), 0) + 1;
  return { ...p, examArchive: archive, exam: { id, startedAt: now, deadline: now + 130 * 60 * 1000, answers: {}, submitted: false, revision: EXAM_REVISION, attemptNumber, exposure: id === 'assessment1' && attemptNumber === 1 && unseen ? 'unseen-self-reported' : 'seen-or-unknown' } };
}
export function examContext(e: ExamSession): string {
  if (e.revision !== EXAM_REVISION) return '旧版の記録・到達度の採点対象外';
  if (e.id !== 'assessment1') return `条件変更の練習・${e.attemptNumber ?? 1}回目`;
  if ((e.attemptNumber ?? 0) > 1) return `再回答・${e.attemptNumber}回目（初回とは別の参考成績）`;
  return e.exposure === 'unseen-self-reported' ? '初回・問題と解説は未読（自己申告）' : '初回・既読または未読未確認（参考成績）';
}
export function examScore(e: ExamSession, questions: Question[]): number | null {
  if (!e.submitted || e.revision !== EXAM_REVISION) return null;
  return questions.filter(q => q.exam === e.id && isCorrect(q, e.answers[q.id] ?? [])).length;
}
