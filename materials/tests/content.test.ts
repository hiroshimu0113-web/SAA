import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chapters, questions, terms, release } from '../src/content';
test('先行学習版は確認済み2章・20問、未制作の模試を提供しない', () => {
  assert.equal(chapters.length, 2);
  assert.equal(questions.filter(q => !q.exam).length, 20);
  assert.equal(questions.filter(q => q.exam).length, 0);
  assert.equal(release.mocksReady, false);
});
test('問題ID・文章の重複がなく、選択肢・正解・解説・出典が有効', () => {
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  assert.equal(new Set(questions.map(q => q.prompt.replace(/\s/g, ''))).size, questions.length);
  for (const q of questions) {
    assert.ok(chapters.some(c => c.id === q.chapterId), q.id);
    assert.ok(q.prompt.length > 20, q.id);
    assert.ok(q.options.length >= (q.answers.length > 1 ? 5 : 4), q.id);
    assert.equal(new Set(q.options.map(o => o.id)).size, q.options.length, q.id);
    assert.ok(q.answers.length > 0 && q.answers.length < q.options.length, q.id);
    assert.equal(new Set(q.answers).size, q.answers.length, q.id);
    assert.ok(q.answers.every(a => q.options.some(o => o.id === a)), q.id);
    assert.ok(q.options.every(o => o.text && o.explanation.length >= 8), q.id);
    assert.ok(q.explanation.length >= 10 && q.conceptIds.length > 0, q.id);
    assert.ok(q.sources.length > 0 && q.sources.every(s => /^https:\/\/(docs\.)?aws\.amazon\.com\//.test(s.url) && s.checked === '2026-10-05'), q.id);
  }
});
test('教材に図・比較・根拠があり用語参照が有効', () => {
  const lessons = chapters.flatMap(c => c.lessons);
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  for (const c of chapters) {
    assert.ok(c.lessons.length >= 3, c.id);
    for (const l of c.lessons) assert.ok(l.analogy && l.explanation && l.diagram.length && l.points.length && l.comparison.length && l.sources.length, l.id);
  }
  assert.ok(terms.length >= 20);
  for (const t of terms) assert.ok(chapters.some(c => c.id === t.chapterId) && t.meaning, t.id);
  for (const q of questions) assert.ok(chapters.find(c => c.id === q.chapterId)!.lessons.some(l => q.conceptIds.some(id => l.conceptIds.includes(id))), `missing concept link: ${q.id}`);
});
test('用語に重複がなく、単一と複数選択の両方がある', () => {
  assert.equal(new Set(terms.map(t => t.id)).size, terms.length);
  assert.equal(new Set(terms.map(t => t.name)).size, terms.length);
  assert.ok(questions.some(q => q.answers.length > 1));
  assert.ok(questions.some(q => q.answers.length === 1));
});
