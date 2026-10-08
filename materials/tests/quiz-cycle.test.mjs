import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,parseRun,QUIZZES} from '../public/tower/engine.mjs';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';
import {cycleForRun,normalizeCycle,markQuestion,pickQuestion} from '../public/tower/quiz-cycle.mjs';
const catalog=JSON.parse(readFileSync(new URL('../public/tower/learning-catalog.json',import.meta.url)));
function enter(seed,cycle){const s=fixedRun(seed,catalog,cycle);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];return act(s,{type:'node',lane:0});}
function next(s){const id=s.quiz.ids[0];s=act(s,{type:'quiz-answer',questionId:id,choice:QUIZZES[id].answer});return act(s,{type:'quiz-next',questionId:id});}
test('all 250 room questions appear exactly once per cycle across saved adventures',()=>{
 let cycle,shown=[];
 for(let n=0;n<250;n++){
  let s=enter(n+1,cycle);shown.push(s.quiz.ids[0]);assert.equal(s.quizCycle.seen.length,(n*2)%250+1);
  const original=JSON.stringify(s);s=parseRun(original);assert.equal(JSON.stringify(s),original);
  s=next(s);shown.push(s.quiz.ids[1]);cycle=cycleForRun(s,Object.keys(QUIZZES));
  assert.equal(cycle.round,Math.floor(n/125)+1);
 }
 assert.equal(new Set(shown.slice(0,250)).size,250);assert.equal(new Set(shown.slice(250)).size,250);
});
test('last unseen question completes a cycle; next question resets without a room duplicate',()=>{
 const ids=Object.keys(catalog.quizzes),cycle={round:3,seen:ids.slice(0,-1)};let s=enter(51,cycle);
 assert.equal(s.quiz.ids[0],ids.at(-1));assert.equal(s.quizCycle.seen.length,250);assert.equal(s.quizCycle.round,3);
 assert.notEqual(s.quiz.ids[0],s.quiz.ids[1]);s=next(s);assert.deepEqual(s.quizCycle,{round:4,seen:[s.quiz.ids[1]]});
});
test('unshown second question stays eligible after restart or lethal answer; reload is idempotent',()=>{
 let s=enter(8);const second=s.quiz.ids[1];assert.deepEqual(s.quizCycle.seen,[s.quiz.ids[0]]);
 s.hp=1;s.quiz.startHp=1;s=act(s,{type:'quiz-answer',questionId:s.quiz.ids[0],choice:(QUIZZES[s.quiz.ids[0]].answer+1)%3});assert.equal(s.phase,'lost');
 assert.ok(!s.quizCycle.seen.includes(second));const recovered=parseRun(JSON.stringify(s));assert.deepEqual(recovered.quizCycle,s.quizCycle);
 const again=enter(9,cycleForRun(recovered,Object.keys(QUIZZES)));assert.notEqual(again.quiz.ids[0],s.quiz.ids[0]);
});
test('catalog additions are unseen, removals do not block a cycle, and old saves remain usable',()=>{
 assert.deepEqual(normalizeCycle({round:2,seen:['a','removed']},['a','b']),{round:2,seen:['a']});
 assert.equal(pickQuestion({round:2,seen:['a']},['a','new'],()=>0),'new');
 assert.deepEqual(markQuestion({round:2,seen:['a']},'a',['a']),{round:3,seen:['a']});
 let s=enter(6);delete s.quizCycle;s=parseRun(JSON.stringify(s));assert.equal(s.quizCycle,undefined);
 assert.deepEqual(cycleForRun(s,Object.keys(QUIZZES)).seen,[s.quiz.ids[0]]);s=next(s);assert.deepEqual(s.quizCycle.seen,s.quiz.ids);
 for(const cycle of [{round:0,seen:[]},{round:1,seen:['a','a']},{round:1,seen:[123]},null]){const bad=enter(2);bad.quizCycle=cycle;assert.throws(()=>parseRun(JSON.stringify(bad)));}
});
