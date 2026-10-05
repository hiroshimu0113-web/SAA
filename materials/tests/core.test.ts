import { test } from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { emptyProgress, exportBackup, parseBackup, loadProgress, saveProgress } from '../src/storage';
import { isCorrect, reviewQuestions } from '../src/learning';
import type { Question } from '../src/types';
const q: Question = { id: 'q1', chapterId: 'ch01', domain: 1, conceptIds: ['iam'], prompt: 'test', options: [], answers: ['a', 'c'], explanation: 'test', sources: [] };
test('複数選択は順序によらず集合一致、重複・過不足は誤答', () => {
  assert.equal(isCorrect(q, ['c', 'a']), true);
  for (const selected of [[], ['a'], ['a', 'a'], ['a', 'b', 'c']]) assert.equal(isCorrect(q, selected), false);
});
test('復習は最新の通常問題の誤答・自信なしのみ', () => {
  const attempts = [{ questionId: 'q1', selected: [], correct: false, unsure: false, at: '2026-10-05T00:00:00Z' }];
  assert.equal(reviewQuestions([q, { ...q, exam: 'mock1' }], attempts).length, 1);
  assert.equal(reviewQuestions([q], [...attempts, { ...attempts[0], correct: true }]).length, 0);
  assert.equal(reviewQuestions([q], [{ ...attempts[0], correct: true, unsure: true }]).length, 1);
});
test('バックアップは全履歴と途中試験を往復できる', () => {
  const p = emptyProgress(); p.bookmarks = ['ch01-l01']; p.exam = { id: 'mock1', startedAt: 1000, deadline: 2000, answers: { 'm1-001': ['a'] }, submitted: false };
  assert.deepEqual(parseBackup(exportBackup(p)), p);
});
test('破損・未知版・不正試験・不正履歴を拒否', () => {
  for (const p of [{}, { ...emptyProgress(), version: 2 }, { ...emptyProgress(), attempts: [{}] }, { ...emptyProgress(), exam: { id: 'mock3' } }, { ...emptyProgress(), bookmarks: [1] }, { ...emptyProgress(), game: [] }]) assert.throws(() => parseBackup(JSON.stringify(p)));
});
test('IndexedDBに保存し再読込できる・不正保存は既存状態を壊さない', async () => {
  const p = emptyProgress(); p.readLessons.push('ch01-l01');
  await saveProgress(p); assert.deepEqual(await loadProgress(), p);
  await assert.rejects(() => saveProgress({ ...p, version: 2 } as never));
  assert.deepEqual(await loadProgress(), p);
});
