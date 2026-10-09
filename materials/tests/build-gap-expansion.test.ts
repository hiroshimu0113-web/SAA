import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chapters,terms} from '../src/content';
import expansion from '../knowledge/build-gap-expansion.json';
const read=(name:string)=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url),'utf8'));
test('不足補足の全用語が本文・出典・2軸・説明と適用の確認へ接続される',()=>{
 const units=read('knowledge/units.json').units,supplement=read('knowledge/game-supplement.json'),allocation=supplement.characterCardAllocation,ledger=read('knowledge/game-classifications.json').items;
 assert.equal(expansion.items.length,12);
 for(const item of expansion.items){
  assert.equal(terms.filter(t=>t.id===item.id).length,1);
  assert.equal(terms.find(t=>t.id===item.id)?.meaning,item.meaning);
  const lesson=chapters.flatMap(c=>c.lessons).find(l=>l.id===item.lessonId)!;
  assert.ok(lesson.conceptIds.includes(item.id));assert.ok(lesson.explanation.includes(item.caution));assert.ok(lesson.explanation.includes(item.scenario));assert.ok(lesson.sources.some(s=>s.url===item.source&&s.checked===item.checkedOn));
  const u=units.find((u:any)=>u.id===item.id);assert.equal(u.review.status,'draft');assert.equal(u.learner_state,'unassessed');assert.deepEqual(u.checks.map((c:any)=>c.level),['explain','apply']);assert.equal(u.checks[1].prompt,item.scenario);
  const c=allocation.candidates.find((c:any)=>c.termId===item.id);assert.deepEqual(c.lessonDetails,item);assert.deepEqual(c.memberships.map((m:any)=>({buildId:m.buildId,role:m.role,usage:m.usage})),item.memberships);
  const record=ledger.find((r:any)=>r.id==='term-build-gap-'+item.id);assert.equal(record.content_status,'draft');assert.equal(record.import_status,'candidate');assert.equal(record.sources[0].checked_on,item.checkedOn);
 }
 assert.ok(allocation.builds.find((b:any)=>b.id==='iac').cards.some((c:any)=>c.termId==='cloudformation'&&c.role==='キー'));
 assert.ok(allocation.builds.find((b:any)=>b.id==='isolation').cards.some((c:any)=>c.termId==='circuit-breaker'&&c.role==='キー'));
});
