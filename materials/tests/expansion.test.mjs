import {test} from 'node:test';import assert from 'node:assert/strict';
import {newRun,act,parseRun,ROUTES,REWARD_RELICS,RELICS,ENEMIES,shopPrice,playerBlockGain,cardValues,QUIZZES} from '../public/tower/engine.mjs';
const copy=x=>JSON.parse(JSON.stringify(x));
function round(s){assert.deepEqual(parseRun(JSON.stringify(s)),s);return s;}
function enter(type='battle',relics=[]){let s=newRun(2);s.routes[1]=[type,'battle'];s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];s.relics.push(...relics);s.hp=40;return round(act(s,{type:'node',lane:0}));}
function force(s,id){const c=s.deck.find(c=>c.id===id);s.battle.hand=[c.uid];s.battle.draw=s.deck.filter(x=>x.uid!==c.uid).map(x=>x.uid);s.battle.discard=[];s.battle.exhaust=[];return c.uid;}
function win(s){s.battle.hp=1;return round(act(s,{type:'play',uid:force(s,'strike')}));}
function quiet(s){s.battle.enemy='noise';s.battle.maxHp=32;s.battle.hp=32;s.battle.enemyStep=1;return s;}
test('expansion: seeded random maps vary, preserve guaranteed endpoints and legacy fixed maps',()=>{
 const maps=new Set();for(let seed=0;seed<80;seed++){const s=newRun(seed);round(s);maps.add(JSON.stringify(s.routes));assert.deepEqual(s,newRun(seed));assert.deepEqual(s.routes[0],['battle','battle']);assert.ok(s.routes[6].includes('rest'));assert.notEqual(s.routes[6][0],s.routes[6][1]);assert.deepEqual(s.routes[7],['boss']);for(const t of ['shop','elite','event'])assert.ok(s.routes.flat().includes(t));}
 assert.ok(maps.size>30);const old=newRun(1);delete old.routes;old.floor=1;old.history=[{floor:0,lane:0,type:'battle'}];assert.equal(act(round(old),{type:'node',lane:0}).phase,'event');
 for(const routes of [[],[['constructor']],Array(8).fill(['boss'])]){const s=newRun(1);s.routes=routes;assert.throws(()=>round(s));}
});
test('expansion: static attack bonuses apply by enemy tier and never accumulate by turn',()=>{
 for(const [tier,extra] of [['battle',0],['elite',2],['boss',0]]){let s=enter(tier==='boss'?'elite':tier,['edge','ember','opener','elite_edge']);if(tier==='boss'){s=newRun(2);s.relics.push('edge','ember','opener','elite_edge');s.floor=7;s.history=s.routes.slice(0,7).map((r,i)=>({floor:i,lane:0,type:r[0]}));s=act(s,{type:'node',lane:0});}assert.equal(s.battle.playerStrength,7+extra);const before=s.battle.playerStrength;s=act(s,{type:'end'});assert.equal(s.battle.playerStrength,before);round(s);}
});
test('expansion: first turn energy stacks; hard-fight energy and extra draw apply each real turn',()=>{
 for(const [type,energy] of [['battle',5],['elite',6]]){let s=quiet(enter(type,['battery','elite_energy','insight']));if(type==='elite'){s.battle.enemy='elite';s.battle.hp=s.battle.maxHp=65;s.battle.enemyStep=3;}assert.equal(s.battle.energy,energy);assert.equal(s.battle.hand.length,6);s=act(s,{type:'end'});assert.equal(s.battle.energy,type==='elite'?4:3);assert.equal(s.battle.hand.length,6);round(s);}
 let boss=newRun(2);boss.relics.push('elite_energy');boss.floor=7;boss.history=boss.routes.slice(0,7).map((row,i)=>({floor:i,lane:0,type:row[0]}));boss=act(boss,{type:'node',lane:0});assert.equal(boss.battle.energy,5);boss.battle.enemyStep=3;boss=act(boss,{type:'end'});assert.equal(boss.battle.energy,4);round(boss);
 let s=enter('elite',['elite_energy','insight','escalation']);s.battle.playerDebuffs.delay=2;s.battle.playerActions=2;const strength=s.battle.playerStrength;s=act(s,{type:'end'});assert.equal(s.battle.energy,3);assert.equal(s.battle.hand.length,5);assert.equal(s.battle.playerStrength,strength);round(s);
});
test('expansion: defense modifiers clamp at zero, affect block only and precede depletion',()=>{
 let s=enter('battle',['plating']);assert.equal(playerBlockGain(s,5),6);assert.equal(playerBlockGain(s,0),0);s=act(s,{type:'play',uid:force(s,'guard')});assert.equal(s.battle.playerBlock,6);
 s=enter('battle',['escalation']);assert.equal(s.hp,44);assert.equal(playerBlockGain(s,5),3);assert.equal(playerBlockGain(s,1),0);s.battle.playerDebuffs.depletion=2;assert.equal(playerBlockGain(s,5),1);
 s=enter('battle',['escalation','plating','shell']);assert.equal(s.battle.playerBlock,7);assert.equal(playerBlockGain(s,5),4);round(s);
});
test('expansion: end-turn guard protects before enemy attack; double action triggers it only once',()=>{
 let s=enter('battle',['dusk']);s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.enemyStep=0;const hp=s.hp;s=act(s,{type:'end'});assert.equal(s.hp,hp-4);assert.equal(s.battle.playerBlock,0);round(s);
 s=enter('battle',['dusk']);s.battle.playerDebuffs.delay=2;s.battle.playerActions=2;s=act(s,{type:'end'});assert.equal(s.battle.playerBlock,0);assert.equal(s.battle.events.length,0);
});
test('expansion: escalating attack and healing start once per turn; reload is inert; defense penalty is fixed',()=>{
 let s=quiet(enter('battle',['escalation']));assert.equal(s.hp,44);assert.equal(s.battle.playerStrength,3);assert.equal(s.battle.strength,1);round(s);
 s=act(s,{type:'end'});assert.equal(s.hp,48);assert.equal(s.battle.playerStrength,6);assert.equal(s.battle.strength,2);assert.equal(playerBlockGain(s,5),3);round(s);
 s.hp=s.maxHp;s=quiet(s);s=act(s,{type:'end'});assert.equal(s.hp,s.maxHp);
});
test('expansion: winning grows max HP, heals rounded percent and grants coins once, including boss',()=>{
 for(const type of ['battle','elite','boss']){let s=enter(type==='boss'?'elite':type,['growth','renewal','bounty']);if(type==='boss'){s.floor=8;s.routes[7]=['boss'];s.history=s.routes.map((r,i)=>({floor:i,lane:0,type:r[0]}));s.battle.enemy='boss';s.battle.maxHp=125;}const gold=s.gold;s=win(s);assert.equal(s.maxHp,77);assert.equal(s.hp,42);assert.equal(s.gold,gold+(type==='elite'?40:22)+30);assert.equal(act(s,{type:'end'}),s);}
 let s=win(enter('battle',['growth']));assert.equal(s.hp,40);assert.equal(s.maxHp,77);
});
test('expansion: four candidates and two distinct picks survive partial backup; skip and repeated picks safe',()=>{
 let s=win(enter('battle',['choice','double']));assert.equal(s.reward.length,4);assert.equal(s.rewardPicks,2);const first=s.reward[0];s=round(act(s,{type:'reward',id:first}));assert.equal(s.deck.length,8);assert.equal(s.reward.length,3);assert.equal(s.rewardPicks,1);assert.equal(s.phase,'reward');assert.equal(act(s,{type:'reward',id:first}),s);s=round(act(s,{type:'reward',id:s.reward[0]}));assert.equal(s.phase,'map');assert.equal(s.deck.length,9);
 s=win(enter('battle',['double']));assert.equal(s.reward.length,3);s=act(s,{type:'reward',id:s.reward[0]});s=round(act(s,{type:'reward',id:null}));assert.equal(s.deck.length,8);
});
test('expansion: rest removal is free, mutually exclusive with heal/upgrade and enforces five-card minimum',()=>{
 let s=enter('rest',['prune']);const gold=s.gold;s=round(act(s,{type:'rest-remove',uid:s.deck[0].uid}));assert.equal(s.deck.length,6);assert.equal(s.gold,gold);assert.equal(s.phase,'map');assert.equal(act(s,{type:'heal'}),s);
 s=enter('rest');assert.equal(act(s,{type:'rest-remove',uid:s.deck[0].uid}),s);s=enter('rest',['prune']);s.deck=s.deck.slice(0,5);assert.equal(act(s,{type:'rest-remove',uid:s.deck[0].uid}),s);
});
test('expansion: shop has one unowned reward relic at 100; sale is once and prices recalculate',()=>{
 let s=enter('shop');assert.ok(REWARD_RELICS.includes(s.shopRelic));assert.ok(!s.relics.includes(s.shopRelic));const id=s.shopRelic;assert.equal(act(s,{type:'buy-relic',id}),s);s.gold=100;s=round(act(s,{type:'buy-relic',id}));assert.equal(s.gold,0);assert.equal(s.shopRelic,null);assert.ok(s.relics.includes(id));assert.equal(act(s,{type:'buy-relic',id}),s);
 s=enter('shop');s.shopRelic='discount';s.gold=200;s=act(s,{type:'buy-relic',id:'discount'});assert.equal(s.gold,100);assert.equal(shopPrice(s,'card'),27);assert.equal(shopPrice(s,'remove'),34);assert.equal(shopPrice(s,'relic'),75);
 s=enter('shop',['discount']);s.gold=75;s=round(act(s,{type:'buy-relic',id:s.shopRelic}));assert.equal(s.gold,0);
});
test('expansion: journey-wide free first card never resets on revisit or reload, relic/removal are not free',()=>{
 let s=enter('shop',['coupon','discount']);assert.equal(shopPrice(s,'card'),0);assert.equal(shopPrice(s,'remove'),34);assert.equal(shopPrice(s,'relic'),75);s.gold=0;s=round(act(s,{type:'buy',id:s.stock[0]}));assert.equal(s.gold,0);assert.equal(s.cardPurchases,1);assert.equal(shopPrice(s,'card'),27);assert.equal(act(s,{type:'buy',id:s.stock[0]}),s);
 s=act(s,{type:'leave'});s.routes[s.floor]=['shop','battle'];s=round(act(s,{type:'node',lane:0}));assert.equal(shopPrice(s,'card'),27);
 s=enter('shop');s=act(s,{type:'buy',id:s.stock[0]});s.relics.push('coupon');assert.equal(shopPrice(s,'card'),35);
 s=enter('shop',['coupon']);delete s.cardPurchases;round(s);assert.equal(shopPrice(s,'card'),0);s=round(act(s,{type:'buy',id:s.stock[0]}));assert.equal(s.cardPurchases,1);assert.equal(shopPrice(s,'card'),35);
});
test('expansion: save validates expanded limits, inventory, prices and partial reward progress',()=>{
 const s=newRun(3);s.relics.push(...REWARD_RELICS);round(s);assert.equal(Object.keys(RELICS).length,24);
 for(const mutate of [s=>s.routes[0]=['shop','battle'],s=>s.cardPurchases=-1,s=>s.shopRelic='edge',s=>s.rewardPicks=2,s=>s.maxHp=100000]){const x=newRun(1);mutate(x);assert.throws(()=>round(x));}
 let reward=win(enter('battle',['double']));reward.rewardPicks=3;assert.throws(()=>round(reward));
});

test('expansion: randomized complete journeys with all regular relics remain playable and serializable',()=>{
 const outcomes=new Set();for(let seed=0;seed<20;seed++){
  let s=newRun(seed);s.relics.push(...REWARD_RELICS);
  for(let move=0;move<800&&!['won','lost'].includes(s.phase);move++){
   let action;
   if(s.phase==='map')action={type:'node',lane:0};
   if(s.phase==='battle'){const cards=s.battle.hand.map(uid=>({uid,v:cardValues(s.deck.find(c=>c.uid===uid))})).filter(c=>c.v.cost<=s.battle.energy);cards.sort((a,b)=>(b.v.damage||0)-(a.v.damage||0));action=cards.length&&s.battle.playerDebuffs.delay!==1?{type:'play',uid:cards[0].uid}:{type:'end'};}
   if(s.phase==='reward')action={type:'reward',id:s.reward[0]};
   if(s.phase==='rest')action={type:'heal'};
   if(s.phase==='shop')action={type:'leave'};
   if(s.phase==='event'){const q=s.quiz,id=q.ids[q.step];action=q.result?{type:'quiz-leave'}:q.answers.length>q.step?{type:'quiz-next',questionId:id}:{type:'quiz-answer',questionId:id,choice:QUIZZES[id].answer};}
   const next=act(s,action);assert.notEqual(next,s);s=round(next);
  }
  assert.ok(['won','lost'].includes(s.phase));outcomes.add(s.phase);
 }
 assert.ok(outcomes.has('won'));
});

test('combined relic: either old id migrates, both collapse into one, four effects fire only once',()=>{
 for(const ids of [['escalation'],['regeneration'],['escalation','regeneration']]){
  const old=newRun(2);old.relics.push(...ids);old.hp=40;
  let s=parseRun(JSON.stringify(old));assert.equal(s.relics.filter(id=>id==='escalation').length,1);assert.ok(!s.relics.includes('regeneration'));
  s=act(s,{type:'node',lane:0});assert.equal(s.hp,44);assert.equal(s.battle.playerStrength,3);assert.equal(s.battle.strength,1);assert.equal(playerBlockGain(s,5),3);round(s);
 }
 let shop=enter('shop',[]);shop.shopRelic='regeneration';assert.equal(parseRun(JSON.stringify(shop)).shopRelic,'escalation');shop.relics.push('escalation');assert.equal(parseRun(JSON.stringify(shop)).shopRelic,null);
 let quiz=enter('event',[]);for(let i=0;i<2;i++){const id=quiz.quiz.ids[i];quiz=act(quiz,{type:'quiz-answer',questionId:id,choice:QUIZZES[id].answer});quiz=act(quiz,{type:'quiz-next',questionId:id});}
 quiz.relics=quiz.relics.map(id=>id===quiz.quiz.result.relic?'regeneration':id);quiz.quiz.result.relic='regeneration';const migrated=parseRun(JSON.stringify(quiz));assert.equal(migrated.quiz.result.relic,'escalation');round(migrated);
 assert.ok(!REWARD_RELICS.includes('regeneration'));
});
