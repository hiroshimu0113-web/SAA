import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newRun,act,parseRun,QUIZZES} from '../public/tower/engine.mjs';
import {QUIZ_CASE_PAIRS,LEGACY_QUIZ_IDS} from '../public/tower/quiz.mjs';
import {runtimeQuestion} from '../scripts/game-content-lib.mjs';
const cases=JSON.parse(readFileSync(new URL('../knowledge/game-cases.json',import.meta.url))).cases;
function enter(seed){const s=newRun(seed);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];return act(s,{type:'node',lane:0});}
test('cases: fixed option IDs preserve runtime answers when source choices reorder, reject broken IDs',()=>{
 for(const c of cases)for(const q of c.questions){
  const reordered=structuredClone(q);reordered.options.reverse();assert.deepEqual(runtimeQuestion(c,reordered),QUIZZES[q.id]);
  const bad=structuredClone(q);bad.correct_option_id='missing';assert.throws(()=>runtimeQuestion(c,bad),/correct option/);
  bad.correct_option_id=q.correct_option_id;bad.runtime_option_order[1]=bad.runtime_option_order[0];assert.throws(()=>runtimeQuestion(c,bad),/runtime option order/);
 }
});
test('cases: export only reviewed pairs, choose in order, resume after every answer without duplicate payout',()=>{
 assert.deepEqual(QUIZ_CASE_PAIRS,cases.filter(c=>c.content_status==='reviewed').map(c=>c.questions.map(q=>q.id)));
 const seen=new Set();
 for(let seed=1;seed<=120;seed++){
  // Spread deterministic seeds across the 32-bit space; small consecutive seeds
  // can share the same early xorshift/shuffle choices as the case pool grows.
  let s=enter((seed*2654435761)>>>0);const pair=s.quiz.ids.join(',');seen.add(pair);
  assert.ok(s.quiz.ids.every(id=>LEGACY_QUIZ_IDS.includes(id))||QUIZ_CASE_PAIRS.some(p=>p.join(',')===pair),'mixed or reordered case');
  for(const id of s.quiz.ids){
   s=act(s,{type:'quiz-answer',questionId:id,choice:QUIZZES[id].answer});assert.deepEqual(parseRun(JSON.stringify(s)),s);
   s=act(s,{type:'quiz-next',questionId:id});assert.deepEqual(parseRun(JSON.stringify(s)),s);
  }
  assert.equal(s.quiz.result.correct,2);const saved=JSON.stringify(s);
  assert.equal(JSON.stringify(act(s,{type:'quiz-next',questionId:s.quiz.ids[1]})),saved);
 }
 for(const pair of QUIZ_CASE_PAIRS)assert.ok(seen.has(pair.join(',')),'unreachable case');
});
test('cases: old in-progress and completed quiz records retain IDs, answer ordering and scores',()=>{
 let s=enter(1);s.quiz.ids=['az','routing'];
 s=act(s,{type:'quiz-answer',questionId:'az',choice:1});assert.deepEqual(parseRun(JSON.stringify(s)),s);
 s=act(s,{type:'quiz-next',questionId:'az'});s=act(s,{type:'quiz-answer',questionId:'routing',choice:0});s=act(s,{type:'quiz-next',questionId:'routing'});
 assert.equal(s.quiz.result.correct,2);assert.deepEqual(parseRun(JSON.stringify(s)),s);
 assert.deepEqual(LEGACY_QUIZ_IDS.map(id=>QUIZZES[id].answer),[1,2,0,1]);
});
