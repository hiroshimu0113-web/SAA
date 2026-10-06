
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {QUIZZES,CARDS,ENEMIES,ROUTES,newRun,act,intent,parseRun,cardValues} from '../public/tower/engine.mjs';
function start(seed=1){return act(newRun(seed),{type:'node',lane:0});}
function roundTrip(s){assert.deepEqual(parseRun(JSON.stringify(s)),s);}
test('tower: deterministic draw, card conservation, invalid actions and energy',()=>{
 let s=start();roundTrip(s);assert.deepEqual(s,start());assert.equal(s.battle.hand.length,6);
 assert.equal(act(s,{type:'node',lane:0}),s);assert.equal(act(s,{type:'play',uid:999}),s);
 for(let t=0;t<12&&s.phase==='battle';t++){
  for(const uid of [...s.battle.hand]){s=act(s,{type:'play',uid});roundTrip(s);if(s.phase!=='battle')break;assert.ok(s.battle.energy>=0);}
  if(s.phase==='battle'){s=act(s,{type:'end'});roundTrip(s);}
 }assert.ok(['reward','lost'].includes(s.phase));
});
test('tower: enemy intent, block lifetime and weakness have exact numerical effects',()=>{
 let s=start();s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=ENEMIES.noise.hp;s.battle.playerBlock=5;
 assert.deepEqual(intent(s),{type:'attack',value:7});s=act(s,{type:'end'});assert.equal(s.hp,70);assert.equal(s.battle.playerBlock,0);
 assert.deepEqual(intent(s),{type:'guard',value:7});s=act(s,{type:'end'});assert.equal(s.battle.block,7);
 s.battle.enemyDebuffs.overload=2;assert.equal(intent(s).value,7);s=act(s,{type:'end'});assert.equal(s.hp,63);assert.equal(s.battle.enemyDebuffs.overload,1);assert.equal(s.battle.block,0);
});
test('tower: all 20 cards execute, upgrades, exhaustion and self-damage defeat',()=>{
 assert.equal(Object.keys(CARDS).length,20);
 for(const id of Object.keys(CARDS)){
  let s=start();s.deck[0]={uid:0,id,plus:true};s.battle.hand=s.deck.map(c=>c.uid);s.battle.draw=[];s.battle.energy=3;
  const d=cardValues(s.deck[0]);s=act(s,{type:'play',uid:0});roundTrip(s);
  assert.ok(d.damage||d.block||d.draw||d.heal||d.energy||d.armor||d.strength||d.debuff);
  if(d.exhaust)assert.ok(s.battle.exhaust.includes(0));assert.ok(s.battle.hand.length<=10);
 }
 let s=start();s.deck[0].id='overload';s.battle.hand=[0];s.battle.draw=s.deck.slice(1).map(c=>c.uid);s.hp=3;s=act(s,{type:'play',uid:0});assert.equal(s.phase,'lost');roundTrip(s);
});
test('tower: save rejects corrupt piles and forged result; invalid JSON cannot replace a run',()=>{
 const s=start();for(const mutate of [
  x=>x.battle.hand.push(x.battle.hand[0]),x=>x.deck[0].id='unknown',x=>x.hp=-1,x=>x.floor=8,
  x=>x.phase='won',x=>x.battle.energy=-1,x=>x.rng='bad'
 ]){const broken=structuredClone(s);mutate(broken);assert.throws(()=>parseRun(JSON.stringify(broken)));}
 assert.throws(()=>parseRun('{'));roundTrip(s);
});
function take(s,a){const next=act(s,a);roundTrip(next);return next;}
function choice(s){
 const b=s.battle,hit=intent(s).type==='attack'?intent(s).value:0;
 return b.hand.map(uid=>{const card=s.deck.find(c=>c.uid===uid),v=cardValues(card);let score=(v.damage||0)*(v.hits||1)+(v.block?Math.min(v.block,Math.max(0,hit-b.playerBlock))*1.2:0)+(v.draw||0)*3+(v.energy||0)*9+(v.strength||0)*7+(v.armor||0)*7+(v.debuff?.amount||0)*2+Math.min(v.heal||0,72-s.hp)-(v.self||0)*1.5;
 if((v.damage||0)+b.playerStrength>=b.hp+b.block)score+=100;
 return {uid,score,cost:v.cost};}).filter(x=>x.cost<=b.energy).sort((a,b)=>b.score-a.score)[0];
}
test('tower: complete seeded runs cover rewards, routes, rests, shop, events, win and loss',()=>{
 let wins=0,losses=0;const seen=new Set();
 for(let seed=1;seed<=40;seed++){
  let s=newRun(seed);for(let moves=0;moves<800&&!['won','lost'].includes(s.phase);moves++){
   seen.add(s.phase);
   if(s.phase==='map'){const safe=[0,0,1,0,1,1,0,0],lane=seed%3===0?0:safe[s.floor];s=take(s,{type:'node',lane});}
   else if(s.phase==='battle'){const c=choice(s);s=take(s,c?{type:'play',uid:c.uid}:{type:'end'});}
   else if(s.phase==='reward'){const rank=['optimize','redundant','balance','burst','restore','reserve','quarantine','parallel','reversal','cache','isolate','detour','overload','foresight','analysis','probe','patch','retry'];s=take(s,{type:'reward',id:[...s.reward].sort((a,b)=>rank.indexOf(a)-rank.indexOf(b))[0]});}
   else if(s.phase==='rest'){const c=s.deck.find(c=>!c.plus&&['burst','optimize','redundant','balance'].includes(c.id))||s.deck.find(c=>!c.plus&&c.id==='strike');s=take(s,s.hp<44||!c?{type:'heal'}:{type:'upgrade',uid:c.uid});}
   else if(s.phase==='shop'){if(s.gold>=35&&s.stock.length)s=take(s,{type:'buy',id:s.stock[0]});else s=take(s,{type:'leave'});}
   else if(s.phase==='event'){const q=s.quiz,id=q.ids[q.step];s=take(s,q.result?{type:'quiz-leave'}:q.answers.length>q.step?{type:'quiz-next',questionId:id}:{type:'quiz-answer',questionId:id,choice:seed%3===0?(QUIZZES[id].answer+1)%3:QUIZZES[id].answer});}
  }
  assert.ok(['won','lost'].includes(s.phase),'run did not terminate');
  if(s.phase==='won')wins++;else losses++;
 }
 console.log('Seeded policy results:',{wins,losses,seen:[...seen]});assert.ok(wins>0,'No winning seeded runs');assert.ok(losses>0);for(const p of ['map','battle','reward','rest','shop','event'])assert.ok(seen.has(p));
});

test('tower: purchases, one-time removal, rest upgrades and elite rewards survive restore',()=>{
 let s=newRun(99);s.floor=3;s.history=[{floor:0,lane:0,type:'battle'},{floor:1,lane:0,type:'event'},{floor:2,lane:1,type:'shop'}];s.phase='shop';s.gold=100;s.stock=['burst','reserve','cache'];
 const n=s.deck.length;s=take(s,{type:'buy',id:'burst'});assert.equal(s.gold,65);assert.equal(s.deck.length,n+1);assert.equal(act(s,{type:'buy',id:'burst'}),s);
 s=take(s,{type:'remove',uid:0});assert.equal(s.gold,20);assert.equal(s.deck.length,n);assert.equal(act(s,{type:'remove',uid:1}),s);
 s=take(s,{type:'leave'});s=take(s,{type:'node',lane:0});const uid=s.deck.find(c=>c.id==='burst').uid;s=take(s,{type:'upgrade',uid});assert.equal(cardValues(s.deck.find(c=>c.uid===uid)).damage,25);assert.equal(s.phase,'map');
 let e=newRun(7);e.floor=2;e.history=[{floor:0,lane:0,type:'battle'},{floor:1,lane:0,type:'event'}];e=take(e,{type:'node',lane:0});e.battle.hp=1;const attack=e.deck.find(c=>e.battle.hand.includes(c.uid)&&CARDS[c.id].damage);const before=e.gold;e=take(e,{type:'play',uid:attack.uid});assert.equal(e.phase,'reward');assert.equal(e.relics.length,2);assert.equal(e.gold,before+40);e=take(e,{type:'reward',id:null});assert.equal(act(e,{type:'reward',id:null}),e);
});
