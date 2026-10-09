import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {act,parseRun,QUIZZES} from '../public/tower/engine.mjs';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';
import {cycleForRun,normalizeCycle,pickQuestion} from '../public/tower/quiz-cycle.mjs';
const catalog=JSON.parse(readFileSync(new URL('../public/tower/learning-catalog.json',import.meta.url))),ids=Object.keys(catalog.quizzes);
function enter(seed,cycle){const s=fixedRun(seed,catalog,cycle);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];return act(s,{type:'node',lane:0});}
function answer(s,ok=true){const id=s.quiz.ids[s.quiz.step];return act(s,{type:'quiz-answer',questionId:id,choice:ok?QUIZZES[id].answer:(QUIZZES[id].answer+1)%QUIZZES[id].options.length});}
function next(s){return act(s,{type:'quiz-next',questionId:s.quiz.ids[s.quiz.step]});}
test('250 correct answers complete each cycle with no repeats across saved adventures',()=>{
 let cycle,shown=[];for(let n=0;n<250;n++){let s=enter(n+1,cycle);for(let i=0;i<2;i++){shown.push(s.quiz.ids[s.quiz.step]);s=answer(s);s=parseRun(JSON.stringify(s));if(i===0)s=next(s);}cycle=s.quizCycle;assert.equal(cycle.round,Math.floor(n/125)+1);}
 assert.equal(new Set(shown.slice(0,250)).size,250);assert.equal(new Set(shown.slice(250)).size,250);
});
test('wrong and unanswered questions remain eligible; correct answers alone set flags and survive restart',()=>{
 let s=enter(2);assert.equal(s.quizCycle.seen.length,0);const id=s.quiz.ids[0];s=answer(s,false);assert.equal(s.quizCycle.seen.length,0);s=next(s);s=answer(s);assert.deepEqual(s.quizCycle.seen,[s.quiz.ids[1]]);
 const restored=parseRun(JSON.stringify(s)),again=enter(4,restored.quizCycle);assert.ok(again.quiz.ids.every(x=>x!==s.quiz.ids[1]));assert.ok(!restored.quizCycle.seen.includes(id));
 s=enter(9);s.hp=1;s.quiz.startHp=1;s=answer(s,false);assert.equal(s.phase,'lost');assert.equal(parseRun(JSON.stringify(s)).quizCycle.seen.length,0);
});
test('last wrong answer repeats in the same cycle, last correct answer resets on the next question',()=>{
 let s=enter(3,{mode:'correct',round:3,seen:ids.slice(0,-1)});assert.deepEqual(s.quiz.ids,[ids.at(-1),ids.at(-1)]);s=answer(s,false);s=next(s);assert.equal(s.quizCycle.round,3);assert.equal(s.quizCycle.seen.length,249);s=parseRun(JSON.stringify(s));s=answer(s);assert.equal(s.quizCycle.seen.length,250);s=next(s);assert.equal(s.quizCycle.round,3);
 s=enter(4,s.quizCycle);assert.equal(s.quizCycle.round,4);assert.equal(s.quizCycle.seen.length,0);
 let mid=enter(5,{mode:'correct',round:1,seen:ids.slice(0,-1)});mid=answer(mid);mid=next(mid);assert.equal(mid.quizCycle.round,2);assert.equal(mid.quizCycle.seen.length,0);assert.notEqual(mid.quiz.ids[0],mid.quiz.ids[1]);assert.deepEqual(parseRun(JSON.stringify(mid)),mid);
});
test('display-based saves migrate conservatively; additions are pending and invalid flags are rejected',()=>{
 let s=enter(6);s=answer(s,false);s.quizCycle={round:8,seen:ids};assert.equal(cycleForRun(s,ids,QUIZZES).seen.length,0);s=next(s);assert.equal(s.quizCycle.mode,'correct');assert.equal(s.quizCycle.round,1);
 s=enter(7);s=answer(s);delete s.quizCycle;assert.deepEqual(cycleForRun(parseRun(JSON.stringify(s)),ids,QUIZZES).seen,[s.quiz.ids[0]]);
 assert.deepEqual(normalizeCycle({mode:'correct',round:2,seen:['a','removed']},['a','b']),{mode:'correct',round:2,seen:['a']});assert.equal(pickQuestion({mode:'correct',round:2,seen:['a']},['a','new'],()=>0),'new');
 for(const cycle of [{mode:'other',round:1,seen:[]},{round:0,seen:[]},{round:1,seen:['a','a']},null]){const bad=enter(2);bad.quizCycle=cycle;assert.throws(()=>parseRun(JSON.stringify(bad)));}
});
