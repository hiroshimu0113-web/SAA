import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newJourney,transition,validateJourney,offers,RELICS,HEROES} from '../public/tower/build-adventure-engine.mjs';
import {policy} from '../scripts/build-lab-balance.mjs';
const questions={a:{prompt:'A?',options:['正','誤'],answer:0,reasons:['正解','誤答']},b:{prompt:'B?',options:['正','誤'],answer:0,reasons:['正解','誤答']}};
function reward(hero='guardian'){let s=newJourney(hero,1);s=transition(s,{kind:'enter',scenario:'attack'});for(let i=0;s.screen==='battle'&&i<100;i++)s=transition(s,policy(s.combat));assert.equal(s.screen,'reward');return s;}
function camp(){return transition(reward(),{kind:'reward'});}
function room(kind){return transition(camp(),{kind:'camp',id:kind},questions);}
test('改訂3は6系統8枚・固定ボス・再現可能な分岐マップと独立保存',()=>{for(const h of Object.keys(HEROES)){const s=newJourney(h,10);assert.equal(s.combat.deck.length,8);assert.deepEqual(s.routes[7],['boss']);assert.deepEqual(s,newJourney(h,10));validateJourney(s);assert.equal(transition(s,{kind:'enter',scenario:'data'}),s);}});
test('戦闘から報酬・強化・寄り道・次階へ進み旧操作を二重実行しない',()=>{let s=reward();const uid=s.combat.deck[0].uid;s=transition(s,{kind:'upgrade',uid});assert.equal(s.combat.deck[0].up,true);const action={kind:'reward',id:s.combat.offers[0],revision:s.revision};s=transition(s,action);assert.equal(s.screen,'camp');assert.equal(s.combat.floor,2);assert.equal(transition(s,action),s);s=transition(s,{kind:'camp',id:'skip'});assert.equal(s.screen,'map');s=transition(s,{kind:'enter',scenario:s.routes[1][0]});assert.equal(s.screen,'battle');validateJourney(s);});
test('交換所はコイン支払・売切れ・削除1回、レリック100',()=>{let s=room('shop');s.combat.coins=300;const id=s.shop.cards[0],n=s.combat.deck.length;s=transition(s,{kind:'buy',id});assert.equal(s.combat.coins,265);assert.equal(s.combat.deck.length,n+1);assert.equal(transition(s,{kind:'buy',id}),s);const r=s.shop.relic;s=transition(s,{kind:'buy-relic'});assert.ok(s.relics.includes(r));assert.equal(s.combat.coins,165);s=transition(s,{kind:'remove',uid:s.combat.deck[0].uid});assert.equal(s.combat.coins,120);assert.equal(s.shop.removed,true);assert.equal(s.combat.deck.length,n);validateJourney(s);s=transition(s,{kind:'leave'});assert.equal(s.screen,'map');});
test('休憩の強化と削除は手札等も同期し、一操作で終わる',()=>{for(const kind of ['rest-upgrade','rest-remove']){let s=room('rest');const uid=s.combat.hand[0].uid;s=transition(s,{kind,uid});assert.equal(s.screen,'map');if(kind==='rest-upgrade')assert.ok(s.combat.hand.find(c=>c.uid===uid).up);else for(const p of ['deck','hand','draw','discard'])assert.ok(!s.combat[p].some(c=>c.uid===uid));validateJourney(s);}});
test('問題を保存して再開、誤答10%・1問30コイン・完答レリックのみ',()=>{for(const score of [0,1,2]){let s=room('quiz');const gold=s.combat.coins,hp=s.combat.hp;for(let step=0;step<2;step++){const a={kind:'answer',id:s.quiz.ids[step],choice:step<score?0:1,revision:s.revision};s=transition(s,a,{});assert.equal(transition(s,a,{}),s);validateJourney(JSON.parse(JSON.stringify(s)));s=transition(s,{kind:'quiz-next'},{});}assert.equal(s.quiz.result.correct,score);assert.equal(s.combat.coins,gold+(score===1?30:0));assert.equal(s.relics.length,score===2?1:0);assert.equal(s.combat.hp,hp-8*(2-score));s=transition(s,{kind:'leave'});assert.equal(s.screen,'map');}});
test('クイズ死亡後は再回答・報酬取得不可',()=>{let s=room('quiz');s.combat.hp=8;s=transition(s,{kind:'answer',id:s.quiz.ids[0],choice:1},{});assert.equal(s.screen,'lost');assert.equal(s.combat.hp,0);validateJourney(s);assert.equal(transition(s,{kind:'quiz-next'}),s);});
test('開始レリックは1回だけ適用し、初期レリックなしを維持',()=>{let s=newJourney('guardian');assert.equal(s.relics.length,0);s.relics=['blueprint','shell'];s=transition(s,{kind:'enter',scenario:'attack'});assert.equal(s.combat.hand.length,7);assert.equal(s.combat.guard,8);const after=transition(s,{kind:'enter',scenario:'attack'});assert.equal(after,s);});
test('壊れた保存の画面・レリック・ルート・クイズを拒否',()=>{for(const change of [s=>s.screen='bogus',s=>s.relics=['constructor'],s=>s.routes[7]=['attack'],s=>s.revision=-1]){const s=newJourney();change(s);assert.throws(()=>validateJourney(s));}const s=room('quiz');delete s.quiz.items;assert.throws(()=>validateJourney(s));});
test('6系統で8階層の勝敗まで到達し全操作の保存を再開できる',()=>{for(const h of Object.keys(HEROES))for(let seed=1;seed<=10;seed++){let s=newJourney(h,seed),steps=0;while(!['won','lost'].includes(s.screen)&&steps++<600){let a;if(s.screen==='map')a={kind:'enter',scenario:s.routes[s.combat.floor-1].includes('elite')?'elite':s.routes[s.combat.floor-1][0]};else if(s.screen==='battle')a=policy(s.combat);else if(s.screen==='reward')a=s.combat.upgradeAvailable?{kind:'upgrade',uid:s.combat.deck.find(c=>!c.up)?.uid}:{kind:'reward',id:s.combat.offers.find(id=>['ec2-burst','security-group','ec2-deploy'].includes(id))};else if(s.screen==='camp')a={kind:'camp',id:'rest'};else if(s.screen==='rest')a={kind:'heal'};s=transition(s,a);validateJourney(JSON.parse(JSON.stringify(s)));}assert.ok(['won','lost'].includes(s.screen),h+' seed '+seed+' stalled');}});

test('強敵は中間階のランダムな2経路、初戦と最終ボスは固定・旧保存も読める',()=>{
 const layouts=new Set();for(let seed=1;seed<=20;seed++){const s=newJourney('guardian',seed);assert.deepEqual(s.routes[0],['attack']);assert.deepEqual(s.routes[7],['boss']);assert.equal(s.routes.flat().filter(x=>x==='elite').length,2);layouts.add(JSON.stringify(s.routes));validateJourney(s);}
 assert.ok(layouts.size>1);const old=newJourney('tuner',1);old.routes=old.routes.map(r=>r.map(x=>x==='elite'?'data':x));validateJourney(old);
});

test('カード色はジャンルではなく系統で固定し、全30枚に色・所属がある',async()=>{
 const {CARDS,cardBuild,cardBuilds,BUILD_COLOURS}=await import('../public/tower/build-adventure-engine.mjs');
 for(const id of Object.keys(CARDS)){assert.ok(BUILD_COLOURS[cardBuild(id)]);assert.ok(cardBuild(id)==='common'||cardBuilds(id).includes(cardBuild(id)));}
 assert.equal(cardBuild('lambda'),cardBuild('auto-scaling'));assert.notEqual(cardBuild('lambda'),cardBuild('cloudfront'));assert.equal(cardBuild('ec2-burst'),'common');
});

test('強敵報酬は実際のデッキに追従し、上限・前提・重複を守って再現できる',async()=>{
 const {eliteOffers,cardBuilds}=await import('../public/tower/build-adventure-engine.mjs');
 for(const h of Object.keys(HEROES)){
  const s=newJourney('guardian',17);s.combat.deck=HEROES[h].dedicated.map((id,i)=>({id,uid:'test'+i,up:true,temp:false}));
  const copy=JSON.parse(JSON.stringify(s)),out=eliteOffers(s);assert.deepEqual(out,eliteOffers(copy));assert.equal(new Set(out).size,out.length);assert.equal(out.length,3);assert.ok(out.slice(0,2).every(id=>cardBuilds(id).includes(h)),h+' adapts to deck');
  for(const id of ['rds-multi-az','read-replica','spot','sqs','pilot-light','auto-scaling'])if(s.combat.deck.some(c=>c.id===id))assert.ok(!out.includes(id));
 }
 const s=newJourney('guardian',1);s.combat.deck=[];const samples=[];for(let i=0;i<100;i++)samples.push(...eliteOffers(s));for(const id of ['rds-proxy','change-set','visibility-timeout'])assert.ok(!samples.includes(id));
});

test('強敵のHP増加は一度だけ、勝利報酬は保存後・連打で再抽選されない',()=>{
 let s=camp();s=transition(s,{kind:'camp',id:'skip'});s.routes[1]=['attack','elite'];const hp=s.combat.enemy.max;
 s=transition(s,{kind:'enter',scenario:'elite'});assert.equal(s.combat.enemy.max,Math.ceil(hp*1.35));assert.equal(transition(s,{kind:'enter',scenario:'elite'}),s);s.combat.enemy.hp=1;
 s=transition(s,{kind:'end'});assert.equal(s.screen,'reward');validateJourney(s);const out=[...s.combat.offers];assert.deepEqual(validateJourney(JSON.parse(JSON.stringify(s))).combat.offers,out);assert.equal(transition(s,{kind:'end'}),s);
});
