import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateUnits, validateGraph, type Unit, type Relation } from '../scripts/knowledge-lib';
import { chapters as published, questions as publishedQuestions } from '../src/content';
import { chapters1 } from '../src/content/part1';
import { chapters2 } from '../src/content/part2';
const root=new URL('../',import.meta.url);
const units:Unit[]=JSON.parse(readFileSync(new URL('knowledge/units.json',root),'utf8')).units;
const relations:Relation[]=JSON.parse(readFileSync(new URL('knowledge/relations.json',root),'utf8'));
const graph=JSON.parse(readFileSync(new URL('public/knowledge/graph.json',root),'utf8'));
const lessons=new Set([...chapters1,...chapters2].flatMap(c=>c.lessons.map(l=>l.id)));
test('知識単位の参照と評価基準が有効で、生成グラフに孤立参照がない',()=>{validateUnits(units,relations,lessons);validateGraph(graph);assert.equal(graph.counts.detailed_units,units.length);assert.equal(graph.counts.rubric_checks,units.reduce((n,u)=>n+u.checks.length,0));});
test('前提の循環・重複ID・存在しない教材や概念への参照を拒否',()=>{
  const cycle=structuredClone(units);cycle[0].prerequisites=[cycle[1].id];cycle[1].prerequisites=[cycle[0].id];assert.throws(()=>validateUnits(cycle,relations,lessons),/cycle/);
  assert.throws(()=>validateUnits([...units,units[0]],relations,lessons),/duplicate/);
  const broken=structuredClone(units);broken[0].lesson_ids=['missing'];assert.throws(()=>validateUnits(broken,relations,lessons),/unknown lesson/);
  assert.throws(()=>validateGraph({nodes:[{id:'a'}],edges:[{from:'a',to:'missing',type:'learn_before'}]}),/dangling/);
});
test('本人の理解済み判定と根拠のない監査済み判定を共有教材へ混入させない',()=>{
  const fakeMastery=structuredClone(units);fakeMastery[0].learner_state='mastered';assert.throws(()=>validateUnits(fakeMastery,relations,lessons),/mastery/);
  const fakeReview=structuredClone(units);fakeReview[0].review.status='reviewed';assert.throws(()=>validateUnits(fakeReview,relations,lessons),/evidence/);
  const missingCheck=structuredClone(units);missingCheck[0].checks=missingCheck[0].checks.filter(c=>c.level==='explain');assert.throws(()=>validateUnits(missingCheck,relations,lessons),/application/);
});
test('公開済み教材と原稿を正確に分け、全体原稿の存在を公開と混同しない',()=>{
  const released=graph.nodes.filter((n:any)=>n.kind==='lesson'&&n.release==='published').map((n:any)=>n.id).sort();
  assert.deepEqual(released,published.flatMap(c=>c.lessons.map(l=>'lesson:'+l.id)).sort());
  assert.deepEqual(graph.nodes.filter((n:any)=>n.kind==='question'&&n.release==='published').map((n:any)=>n.id).sort(),publishedQuestions.map(q=>'question:'+q.id).sort());
  assert.equal(graph.nodes.filter((n:any)=>n.kind==='lesson'&&n.release==='draft').length, 0); // All 12 chapters are now released; unit audit state remains separate.
  for(const u of units)assert.equal(graph.nodes.find((n:any)=>n.id==='concept:'+u.id).unit.learner_state,'unassessed');
});
