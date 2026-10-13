// Revision 3 uses the tested 30-card combat engine, with an independent saved journey.
import {CARDS,HEROES,ROLES,newRun as combatRun,act as combatAct,legalActions,random,validate as validateCombat} from './build-lab-engine.mjs';
export {CARDS,HEROES,ROLES,forecast,cost,legalActions} from './build-lab-engine.mjs';
export const SAVE_KEY='saa-build-adventure-v1';
export const RELICS={blueprint:{text:'戦闘開始時、2枚追加で引く。'},runbook:{text:'戦闘勝利時、HPを6回復。'},shell:{text:'戦闘開始時、通信防御8。'},bounty:{text:'戦闘勝利時、コインを30追加。'}};
const owns=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const clone=x=>JSON.parse(JSON.stringify(x));
const shuffle=(s,a)=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export function newJourney(hero,seed=1){
 const ids=Object.keys(HEROES);if(!hero)hero=ids[(seed>>>0)%ids.length];
 const combat=combatRun(hero,seed,'attack');
 const routes=Array.from({length:8},(_,i)=>i===0?['attack']:i===7?['boss']:shuffle(combat,['attack','equipment','data']).slice(0,2));
 return {version:1,screen:'map',combat,routes,relics:[],path:[],campUsed:false,shop:null,quiz:null,quizSeen:[],catalogVersion:null,rewardPaid:0,revision:0};
}
export function offers(s){
 const c=s.combat;return [...new Set(['ec2-burst','ec2-deploy','security-group','cloudwatch',...HEROES[c.hero].dedicated,...HEROES[c.hero].support])].filter(id=>c.deck.filter(x=>x.id===id).length<(['rds-multi-az','read-replica','spot','sqs','pilot-light','auto-scaling'].includes(id)?1:2)).filter(id=>id!=='rds-proxy'||c.deck.some(x=>['rds-multi-az','read-replica'].includes(x.id))).filter(id=>id!=='change-set'||c.deck.some(x=>x.id==='cloudformation'));
}
function addCard(c,id){const card={id,uid:'c'+(++c.serial),up:false,temp:false};c.deck.push(card);c.draw.push({...card});}
function upgrade(c,uid){for(const pile of ['deck','hand','draw','discard'])for(const card of c[pile])if(card.uid===uid)card.up=true;}
function remove(c,uid){for(const pile of ['deck','hand','draw','discard'])c[pile]=c[pile].filter(x=>x.uid!==uid);}
function finishCamp(s){s.campUsed=true;s.screen='map';}
function grantRelic(s){const pool=Object.keys(RELICS).filter(x=>!s.relics.includes(x));if(pool.length){const id=pool[Math.floor(random(s.combat)*pool.length)];s.relics.push(id);return id;}return null;}
function syncBattle(s,before){const c=s.combat;if(c.phase==='lost')s.screen='lost';if(['reward','won'].includes(c.phase)&&s.rewardPaid!==c.floor){s.rewardPaid=c.floor;if(s.relics.includes('runbook'))c.hp=Math.min(72,c.hp+6);if(s.relics.includes('bounty'))c.coins+=30;s.screen=c.phase;}return s;}
export function transition(input,a,questions={}){
 // Revision guards reject stale taps, repeated quiz answers, and repeated purchases.
 if(a.revision!==undefined&&a.revision!==input.revision)return input;
 const s=clone(input),c=s.combat;
 if(s.screen==='map'&&a.kind==='enter'&&s.routes[c.floor-1].includes(a.scenario)){
  c.scenario=a.scenario==='boss'?'equipment':a.scenario;
  if(s.relics.includes('shell'))c.guard+=8;
  if(s.relics.includes('blueprint'))for(let i=0;i<2&&c.hand.length<10;i++){if(!c.draw.length)c.draw=shuffle(c,c.discard.splice(0));if(c.draw.length)c.hand.push(c.draw.pop());}
  s.path.push({floor:c.floor,scenario:a.scenario});s.screen='battle';
 }else if(s.screen==='battle'){
  // Retire is optional; a free dismantle action should not force the player to end manually every turn.
  s.combat=combatAct(c,a);
  if(JSON.stringify(s.combat)===JSON.stringify(c))return input;
  if(s.combat.phase==='battle'&&s.combat.turn===c.turn&&!legalActions(s.combat).some(x=>x.kind!=='retire'))s.combat=combatAct(s.combat,{kind:'end'});
  syncBattle(s,c);
 }else if(s.screen==='reward'&&a.kind==='upgrade'){
  s.combat=combatAct(c,a);
 }else if(s.screen==='reward'&&a.kind==='reward'&&(!a.id||c.offers.includes(a.id))){
  s.combat=combatAct(c,a);s.screen='camp';s.campUsed=false;s.shop=null;s.quiz=null;
 }else if(s.screen==='camp'&&a.kind==='camp'){
  if(a.id==='skip')finishCamp(s);
  if(a.id==='rest')s.screen='rest';
  if(a.id==='shop'){
   s.shop={cards:shuffle(c,offers(s)).slice(0,3),sold:[],relic:shuffle(c,Object.keys(RELICS).filter(id=>!s.relics.includes(id)))[0]||null,relicSold:false,removed:false};s.screen='shop';
  }
  if(a.id==='quiz'){
   const all=Object.keys(questions);let unseen=all.filter(id=>!s.quizSeen.includes(id));if(unseen.length<2){s.quizSeen=[];unseen=all;}
   if(unseen.length>=2){const ids=shuffle(c,unseen).slice(0,2);s.quiz={ids,items:Object.fromEntries(ids.map(id=>[id,clone(questions[id])])),answers:[],step:0,result:null};s.screen='quiz';}
  }
 }else if(s.screen==='rest'){
  if(a.kind==='heal'){c.hp=Math.min(72,c.hp+22);finishCamp(s);}
  if(a.kind==='rest-upgrade'&&c.deck.some(x=>x.uid===a.uid&&!x.up)){upgrade(c,a.uid);finishCamp(s);}
  if(a.kind==='rest-remove'&&c.deck.length>3&&c.deck.some(x=>x.uid===a.uid)){remove(c,a.uid);finishCamp(s);}
 }else if(s.screen==='shop'){
  if(a.kind==='buy'&&s.shop.cards.includes(a.id)&&!s.shop.sold.includes(a.id)&&c.coins>=35){c.coins-=35;s.shop.sold.push(a.id);addCard(c,a.id);}
  if(a.kind==='buy-relic'&&s.shop.relic&&!s.shop.relicSold&&c.coins>=100){c.coins-=100;s.relics.push(s.shop.relic);s.shop.relicSold=true;}
  if(a.kind==='remove'&&!s.shop.removed&&c.coins>=45&&c.deck.length>3&&c.deck.some(x=>x.uid===a.uid)){c.coins-=45;remove(c,a.uid);s.shop.removed=true;}
  if(a.kind==='leave')finishCamp(s);
 }else if(s.screen==='quiz'){
  const q=s.quiz,id=q.ids[q.step],item=q.items[id];
  if(a.kind==='answer'&&!q.result&&q.answers.length===q.step&&a.id===id&&Number.isInteger(a.choice)&&item&&a.choice>=0&&a.choice<item.options.length){
   q.answers.push(a.choice);if(a.choice===item.answer)s.quizSeen.push(id);else c.hp=Math.max(0,c.hp-8);
   if(c.hp===0){s.screen='lost';c.phase='lost';}
  }
  if(a.kind==='quiz-next'&&!q.result&&q.answers.length===q.step+1){
   if(q.step===0)q.step=1;else{const correct=q.ids.reduce((n,id,i)=>n+Number(q.answers[i]===q.items[id]?.answer),0);q.result={correct,relic:correct===2?grantRelic(s):null,coins:correct===1?30:0};c.coins+=q.result.coins;}
  }
  if(a.kind==='leave'&&q.result)finishCamp(s);
 }
 if(JSON.stringify(s)===JSON.stringify(input))return input;
 s.revision=input.revision+1;return s;
}
export function validateJourney(s){
 const fail=()=>{throw Error('改訂3の保存形式を確認できません');};
 if(!s||s.version!==1||!Number.isSafeInteger(s.revision)||s.revision<0||!['map','battle','reward','camp','rest','shop','quiz','won','lost'].includes(s.screen))fail();
 validateCombat(s.combat);
 if(!Array.isArray(s.routes)||s.routes.length!==8||s.routes.some((r,i)=>!Array.isArray(r)||!r.length||r.length>2||r.some(x=>!(i===0?['attack']:i===7?['boss']:['attack','equipment','data']).includes(x))))fail();
 if(!Array.isArray(s.relics)||new Set(s.relics).size!==s.relics.length||s.relics.some(x=>!owns(RELICS,x)))fail();
 if(!Array.isArray(s.path)||s.path.length>8||!Array.isArray(s.quizSeen)||s.quizSeen.some(x=>typeof x!=='string'))fail();
 if(typeof s.campUsed!=='boolean'||!Number.isInteger(s.rewardPaid)||s.rewardPaid<0||s.rewardPaid>8)fail();
 const expected={map:'battle',battle:'battle',camp:'battle',rest:'battle',shop:'battle',quiz:'battle',reward:'reward',won:'won',lost:'lost'};
 if(s.combat.phase!==expected[s.screen])fail();
 const cardIds=s.combat.deck.map(x=>x.uid);if(new Set(cardIds).size!==cardIds.length)fail();
 if(s.screen==='shop'&&(!s.shop||!Array.isArray(s.shop.cards)||s.shop.cards.length>3||s.shop.cards.some(x=>!owns(CARDS,x))||!Array.isArray(s.shop.sold)||s.shop.sold.some(x=>!s.shop.cards.includes(x))||(s.shop.relic&&!owns(RELICS,s.shop.relic))))fail();
 if(s.screen==='quiz'&&(!s.quiz||!Array.isArray(s.quiz.ids)||s.quiz.ids.length!==2||![0,1].includes(s.quiz.step)||!Array.isArray(s.quiz.answers)||s.quiz.answers.length<s.quiz.step||s.quiz.answers.length>s.quiz.step+1))fail();
 if(s.screen==='quiz'&&(!s.quiz.items||s.quiz.ids.some(id=>{const q=s.quiz.items[id];return !q||typeof q.prompt!=='string'||!Array.isArray(q.options)||!Array.isArray(q.reasons)||q.options.length!==q.reasons.length||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length;})))fail();
 return s;
}
