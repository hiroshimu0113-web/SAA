import {test} from 'node:test';import assert from 'node:assert/strict';
import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {act,CARDS,cardValues,upgradeChanges,parseRun,QUIZZES,REWARD_RELICS} from '../public/tower/engine.mjs';
import {applyDebuff,delayPaused,delayRemaining} from '../public/tower/debuffs.mjs';
import {inspectPlay} from '../public/tower/strategy.mjs';
const round=s=>{assert.deepEqual(parseRun(JSON.stringify(s)),s);return s;};
function battle(){let s=act(newRun(2),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;return s;}
function enter(hp=72,maxHp=72){const s=newRun(2);s.hp=hp;s.maxHp=maxHp;s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];return act(s,{type:'node',lane:0});}
function answer(s,correct){const id=s.quiz.ids[s.quiz.step],choice=correct?QUIZZES[id].answer:(QUIZZES[id].answer+1)%QUIZZES[id].options.length;return act(s,{type:'quiz-answer',questionId:id,choice});}
function next(s){return act(s,{type:'quiz-next',questionId:s.quiz.ids[s.quiz.step]});}
test('rules: damage is 1.5 rounded up; debuffs gain one; powers only reduce cost',()=>{
 const before=JSON.stringify(CARDS);for(const [id,d] of Object.entries(CARDS)){const v=cardValues({id,plus:true});if(d.kind==='power'){assert.equal(v.cost,Math.max(0,d.cost-1));assert.equal(v.strength,d.strength);assert.equal(v.armor,d.armor);assert.deepEqual(upgradeChanges({id}),['コスト '+d.cost+' → '+v.cost]);}else{if(d.damage)assert.equal(v.damage,Math.ceil(d.damage*1.5));if(d.debuff)assert.equal(v.debuff.amount,d.debuff.amount+1);}}
 assert.equal(JSON.stringify(CARDS),before);assert.equal(cardValues({id:'burst',plus:true}).damage,27);assert.equal(cardValues({id:'balance',plus:true}).damage,11);assert.equal(cardValues({id:'retry',plus:true}).damage,5);
 let s=battle();const c=s.deck.find(c=>s.battle.hand.includes(c.uid));c.id='optimize';c.plus=true;s.battle.energy=0;assert.ok(inspectPlay(s,c));s=round(act(s,{type:'play',uid:c.uid}));assert.equal(s.battle.playerStrength,2);assert.equal(s.battle.energy,0);
});
test('rules: upgraded delay skips two enemy turns then double action; no reapply and save rollback',()=>{
 let s=battle();const c=s.deck.find(c=>s.battle.hand.includes(c.uid));c.id='detour';c.plus=true;s=round(act(s,{type:'play',uid:c.uid}));assert.equal(delayRemaining(s.battle.enemyDebuffs.delay),2);assert.equal(applyDebuff(s.battle.enemyDebuffs,'delay',2),false);
 s=round(act(s,{type:'end'}));assert.equal(s.battle.enemyStep,0);assert.equal(delayRemaining(s.battle.enemyDebuffs.delay),1);
 s=round(act(s,{type:'end'}));assert.equal(s.battle.enemyStep,0);assert.equal(s.battle.enemyDebuffs.delay,2);
 s=round(act(s,{type:'end'}));assert.equal(s.battle.enemyStep,2);assert.equal(s.battle.enemyDebuffs.delay,0);
});
test('rules: extended player delay suppresses actions/draw until both skipped turns finish',()=>{
 let s=battle();applyDebuff(s.battle.playerDebuffs,'delay',2);s.battle.energy=0;round(s);const c=s.deck.find(c=>s.battle.hand.includes(c.uid));assert.equal(inspectPlay(s,c),null);assert.equal(act(s,{type:'play',uid:c.uid}),s);
 s=round(act(s,{type:'end'}));assert.ok(delayPaused(s.battle.playerDebuffs.delay));assert.equal(s.battle.hand.length,0);assert.equal(s.battle.energy,0);
 s=round(act(s,{type:'end'}));assert.equal(s.battle.playerDebuffs.delay,2);assert.equal(s.battle.playerActions,2);assert.equal(s.battle.hand.length,5);assert.equal(s.battle.energy,3);
 s=round(act(s,{type:'end'}));assert.equal(s.battle.playerActions,1);assert.equal(s.battle.enemyStep,2);
});
test('rules: quiz takes 10 percent immediately per wrong answer, rounded up, never twice on resume',()=>{
 for(const maxHp of [72,77,112]){let s=enter(maxHp,maxHp);const penalty=Math.ceil(maxHp*.1);s=round(answer(s,false));assert.equal(s.hp,maxHp-penalty);const id=s.quiz.ids[0];assert.equal(act(s,{type:'quiz-answer',questionId:id,choice:s.quiz.answers[0]}),s);s=round(next(s));s=round(answer(s,false));assert.equal(s.hp,maxHp-penalty*2);s=round(next(s));assert.equal(s.quiz.result.damage,penalty*2);assert.equal(s.gold,60);}
 let s=enter();s=round(next(answer(s,false)));s=round(next(answer(s,true)));assert.equal(s.gold,90);assert.equal(s.hp,64);
});
test('rules: fatal first or second mistake stops quiz with explanation data and no payout',()=>{
 for(const correctFirst of [false,true]){let s=enter(4);if(correctFirst)s=next(answer(s,true));s=round(answer(s,false));assert.equal(s.phase,'lost');assert.equal(s.hp,0);assert.equal(s.quiz.result.interrupted,true);assert.equal(s.quiz.result.correct,Number(correctFirst));assert.equal(s.gold,60);assert.equal(next(s),s);}
});
test('rules: perfect quiz grants relic only, all-owned gives nothing; old completed/pending quizzes stay valid',()=>{
 let s=enter();s.relics.push(...REWARD_RELICS);s=round(next(answer(s,true)));s=round(next(answer(s,true)));assert.equal(s.quiz.result.gold,0);assert.equal(s.quiz.result.relic,null);assert.equal(s.gold,60);
 const legacy=enter();for(const k of ['rulesVersion','startHp','penalty','damageTaken'])delete legacy.quiz[k];let old=round(answer(legacy,false));assert.equal(old.hp,72);old=round(next(old));old=round(next(answer(old,false)));assert.equal(old.hp,64);assert.equal(old.quiz.result.damage,8);
 for(const mutate of [s=>s.quiz.penalty=1,s=>s.quiz.damageTaken=0,s=>s.quiz.startHp=1,s=>s.hp=72]){let x=answer(enter(),false);mutate(x);assert.throws(()=>parseRun(JSON.stringify(x)));}
});
