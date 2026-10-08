import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beginExam, examContext, examScore, EXAM_REVISION } from '../src/exams';
import { emptyProgress, exportBackup, parseBackup } from '../src/storage';
import { questions } from '../src/content';
test('初回の未読申告・提出結果を保存し、再開と再回答を区別する', () => {
  const p = beginExam(emptyProgress(), 'assessment1', 1000, true);
  assert.equal(p.exam!.deadline - p.exam!.startedAt, 130 * 60000);
  assert.match(examContext(p.exam!), /初回・問題と解説は未読/);
  const q = questions.find(q => q.exam === 'assessment1')!;
  p.exam!.answers[q.id] = [...q.answers]; p.exam!.submitted = true;
  assert.equal(examScore(p.exam!, questions), 1);
  const restored = parseBackup(exportBackup(p));
  assert.deepEqual(restored, p);
  const next = beginExam(restored, 'assessment1', 2000, true);
  assert.equal(next.exam!.attemptNumber, 2);
  assert.equal(next.exam!.exposure, 'seen-or-unknown');
  assert.match(examContext(next.exam!), /再回答/);
  assert.equal(examScore(next.examArchive![0], questions), 1);
  assert.deepEqual(next.examArchive![0].answers[q.id], q.answers);
});
test('中断も開始回数に含め、セット別の回数と既読成績を保持する', () => {
  let p = beginExam(emptyProgress(), 'assessment1', 1000, false);
  assert.match(examContext(p.exam!), /既読または未読未確認/);
  p = beginExam(p, 'mock1', 2000, true);
  assert.equal(p.exam!.attemptNumber, 1);
  assert.match(examContext(p.exam!), /条件変更の練習/);
  assert.equal(examScore(p.examArchive![0], questions), null);
  p = beginExam(p, 'assessment1', 3000, true);
  assert.equal(p.exam!.attemptNumber, 2);
  assert.equal(p.examArchive!.length, 2);
});
test('旧版バックアップは破壊せず読み込み、改訂前回答を現在の到達度へ再採点しない', () => {
  const p = emptyProgress();
  const q = questions.find(q => q.exam === 'mock1')!;
  p.exam = { id: 'mock1', startedAt: 1, deadline: 100, submitted: true, answers: { [q.id]: q.answers } };
  assert.deepEqual(parseBackup(exportBackup(p)), p);
  assert.equal(examScore(p.exam, questions), null);
  assert.match(examContext(p.exam), /旧版/);
  const next = beginExam(p, 'mock1', 200, false);
  assert.equal(next.exam!.attemptNumber, 2);
  assert.deepEqual(next.examArchive![0], p.exam);
  assert.equal(next.exam!.revision, EXAM_REVISION);
});
test('新履歴の破損もバックアップ復元前に拒否する', () => {
  const p = beginExam(beginExam(emptyProgress(), 'assessment1', 1, true), 'mock1', 2, false);
  for (const value of [null, {}, [null], [{ ...p.exam, attemptNumber: -1 }], [{ ...p.exam, exposure: 'guaranteed-unseen' }], [{ ...p.exam, id: 'unknown' }], [{ ...p.exam, answers: { a: ['b','b'] } }]]) {
    assert.throws(() => parseBackup(JSON.stringify({ ...p, examArchive: value })));
  }
});
test('独立セットは既存セットの選択肢一式を再利用せず、対のない65シナリオを持つ', () => {
  const fingerprint = (q: typeof questions[number]) => q.options.map(o=>o.text.replace(/\s/g,'')).sort().join('|');
  const prior = new Set(questions.filter(q=>q.exam!=='assessment1').map(fingerprint));
  const independent = questions.filter(q=>q.exam==='assessment1');
  assert.equal(independent.length,65);
  assert.equal(new Set(independent.map(fingerprint)).size,65);
  for (const q of independent) assert.ok(!prior.has(fingerprint(q)),q.id);
});
for (const priorRevision of ['2026-10-08-rereview', '2026-10-08-fr-review']) {
test(`${priorRevision}の版付き回答も保全し、改訂後の問題で再採点しない`, () => {
  const p = beginExam(emptyProgress(), 'assessment1', 1000, true);
  const q = questions.find(q => q.id === 'assessment-065')!;
  p.exam!.revision = priorRevision;
  p.exam!.answers[q.id] = [...q.answers];
  p.exam!.submitted = true;
  const restored = parseBackup(exportBackup(p));
  assert.deepEqual(restored, p);
  assert.equal(examScore(restored.exam!, questions), null);
  assert.match(examContext(restored.exam!), /旧版/);
  const next = beginExam(restored, 'assessment1', 2000, true);
  assert.deepEqual(next.examArchive![0], p.exam);
  assert.equal(examScore(next.examArchive![0], questions), null);
  assert.equal(next.exam!.attemptNumber, 2);
  assert.equal(next.exam!.exposure, 'seen-or-unknown');
  assert.equal(next.exam!.revision, EXAM_REVISION);
});
}
