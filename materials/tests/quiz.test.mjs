import {test} from 'node:test';import assert from 'node:assert/strict';
import {newRun,act,parseRun,QUIZZES,RELICS} from '../public/tower/engine.mjs';
function enter(seed=1){const s=newRun(seed);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];return act(s,{type:'node',lane:0});}
function round(s){assert.deepEqual(parseRun(JSON.stringify(s)),s);return s;}
function finish(s,correct){for(let i=0;i<2;i++){const id=s.quiz.ids[i],choice=i<correct?QUIZZES[id].answer:(QUIZZES[id].answer+1)%3,a={type:'quiz-answer',questionId:id,choice};s=round(act(s,a));assert.equal(act(s,a),s);s=round(act(s,{type:'quiz-next',questionId:id}));}return s;}
test('quiz: exactly two distinct questions, correct/partial/zero payouts, no replay or duplicate rewards',()=>{
 for(const count of [0,1,2]){let s=enter();assert.equal(new Set(s.quiz.ids).size,2);assert.equal(act(s,{type:'quiz-next',questionId:s.quiz.ids[0]}),s);const old=s;s=finish(s,count);assert.equal(s.quiz.result.correct,count);assert.equal(s.hp,old.hp-(count===0?8:0));assert.equal(s.gold,old.gold+(count===1?30:0));assert.equal(s.relics.length,old.relics.length+(count===2?1:0));assert.equal(act(s,{type:'quiz-next',questionId:s.quiz.ids[1]}),s);s=round(act(s,{type:'quiz-leave'}));assert.equal(s.phase,'map');assert.equal(s.quiz,null);assert.equal(act(s,{type:'quiz-leave'}),s);}
});
test('quiz: lethal damage, all-relic fallback, partial resume and old event migration',()=>{
 let s=enter();s.hp=4;s=finish(s,0);assert.equal(s.phase,'lost');assert.equal(s.hp,0);assert.equal(s.quiz.result.damage,4);round(s);
 s=enter();s.relics=Object.keys(RELICS);const gold=s.gold;s=finish(s,2);assert.equal(s.gold,gold+60);assert.equal(s.relics.length,4);round(s);
 s=enter();const id=s.quiz.ids[0];s=act(s,{type:'quiz-answer',questionId:id,choice:QUIZZES[id].answer});const loaded=parseRun(JSON.stringify(s));assert.equal(loaded.quiz.answers.length,1);assert.deepEqual(loaded.quiz.ids,s.quiz.ids);
 const old=enter();old.version=1;delete old.quiz;const migrated=parseRun(JSON.stringify(old));assert.equal(migrated.version,4);assert.equal(migrated.quiz.answers.length,0);assert.equal(migrated.hp,old.hp);assert.deepEqual(parseRun(JSON.stringify(old)),migrated);
 const battle=act(newRun(1),{type:'node',lane:0});battle.version=1;delete battle.quiz;assert.equal(parseRun(JSON.stringify(battle )).version,4);
});
test('quiz: reject corrupt questions, answers, scores and stale question actions',()=>{
 for(const mutate of [s=>s.quiz.ids[1]=s.quiz.ids[0],s=>s.quiz.ids[0]='bad',s=>s.quiz.answers=[99],s=>s.quiz.step=2]){const s=enter();mutate(s);assert.throws(()=>parseRun(JSON.stringify(s)));}
 const result=finish(enter(),1);result.quiz.result.correct=2;assert.throws(()=>parseRun(JSON.stringify(result)));
 let s=enter();const id=s.quiz.ids[0];s=act(s,{type:'quiz-answer',questionId:id,choice:0});s=act(s,{type:'quiz-next',questionId:id});assert.equal(act(s,{type:'quiz-answer',questionId:id,choice:0}),s);
 for(const q of Object.values(QUIZZES)){assert.equal(q.options.length,3);assert.equal(q.reasons.length,3);assert.ok(q.options[q.answer]);assert.match(q.source,/^https:\/\/(docs\.aws\.amazon\.com\/|github\.com\/aws\/aws-sdk-go-v2\/blob\/[a-f0-9]{40}\/|github\.com\/awsdocs\/amazon-rds-user-guide\/blob\/[a-f0-9]{40}\/doc_source\/)/);}
});
