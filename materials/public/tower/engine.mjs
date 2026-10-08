import {DEBUFFS,delayPaused,delayRemaining,advanceDelay,emptyDebuffs,applyDebuff,attackAmount,blockAmount,decayDebuffs} from './debuffs.mjs';
import {COMBOS} from './combos.mjs';
import {QUIZZES,QUIZ_RULES,LEGACY_QUIZ_RULES,quizScore} from './quiz.mjs';
export {QUIZZES,QUIZ_RULES,quizScore} from './quiz.mjs';

import {CARDS,activateCatalog,getActiveCatalog,activeVersion} from './catalog.mjs';
export {CARDS,activateCatalog} from './catalog.mjs';
import {ENEMIES} from './enemy-definitions.mjs';
export {ENEMIES} from './enemy-definitions.mjs';
export const ENEMY_POOLS=Object.fromEntries(['battle','elite','boss'].map(tier=>[tier,Object.keys(ENEMIES).filter(id=>ENEMIES[id].tier===tier)]));
export const enemyDebuffTypes=id=>[...new Set(ENEMIES[id].pattern.filter(a=>a[0]==='debuff').map(a=>a[2]))];
import {HEROES,RELICS,REWARD_RELICS} from './relics.mjs';
export {HEROES,RELICS,REWARD_RELICS} from './relics.mjs';
export const ROUTES=[['battle','battle'],['event','battle'],['elite','shop'],['rest','battle'],['battle','event'],['elite','shop'],['rest','rest'],['boss']];
export const NODE_NAMES={battle:'戦闘',elite:'強敵',rest:'休息',shop:'交換所',event:'クイズ',boss:'ボス'};
const rewardPool=()=>Object.keys(CARDS).filter(x=>!['strike','guard','junk'].includes(x));
const clone=x=>JSON.parse(JSON.stringify(x));
const owns=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function rnd(s){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296;}
function shuffle(s,arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const routesFor=s=>s.routes||ROUTES;
export function generateRoutes(seed){
 const r={rng:(seed^0x9e3779b9)>>>0},pool=['battle','battle','battle','event','event','shop','rest','elite'];
 const pick=except=>{const choices=pool.filter(t=>t!==except);return choices[Math.floor(rnd(r)*choices.length)];};
 const middle=Array.from({length:5},()=>{const first=pick();return [first,pick(first)];});
 // Guarantee useful choices without fixing the room counts or their floors.
 const anchors=shuffle(r,[0,1,2,3,4]);
 for(const [i,type] of ['event','shop','elite'].entries())middle[anchors[i]]=shuffle(r,[type,pick(type)]);
 return [['battle','battle'],...middle,shuffle(r,['rest',pick('rest')]),['boss']];
}
const has=(s,id)=>s.relics.includes(id);
export const defenseBonus=s=>(has(s,'plating')?1:0)-(has(s,'escalation')?2:0);
export const playerBlockGain=(s,n)=>n>0?blockAmount(Math.max(0,n+defenseBonus(s)),s.battle.playerDebuffs):0;
const hardFight=s=>['elite','boss'].includes(ENEMIES[s.battle.enemy].tier);
const turnEnergy=s=>3+(has(s,'elite_energy')&&hardFight(s)?1:0);
const turnDraw=s=>5+(has(s,'insight')?1:0);
export const shopPrice=(s,kind)=>kind==='card'&&has(s,'coupon')&&(s.cardPurchases??0)===0?0:Math.ceil(({card:35,remove:45,relic:100}[kind])*(has(s,'discount')?.75:1));
function turnStart(s){const b=s.battle;if(has(s,'escalation')){b.playerStrength+=3;b.strength+=1;emit(b,'player','power',3,'攻撃力 ＋3');emit(b,'enemy','power',1,'攻撃力 ＋1');}if(has(s,'escalation')){const before=s.hp;heal(s,4);if(s.hp>before)emit(b,'player','heal',s.hp-before,'回復 ＋'+(s.hp-before));}}
function log(s,t){s.log=[...s.log,t].slice(-5);}
function heal(s,n){s.hp=Math.min(s.maxHp,s.hp+n);}
function add(s,id){s.deck.push({uid:s.nextId++,id,plus:false});}
export function newRun(seed=Date.now(),catalog=null){
 activateCatalog(catalog);
 const s={version:4,seed:seed>>>0,rng:seed>>>0,nextId:0,hp:72,maxHp:72,gold:60,floor:0,phase:'map',deck:[],relics:['lantern'],history:[],log:['観測灯を携えて、尖塔へ。'],battle:null,reward:[],stock:[],removed:false,quiz:null};
 const heroIds=Object.keys(HEROES);s.hero=heroIds[(seed>>>0)%heroIds.length];s.relics=[HEROES[s.hero].relic];s.log=[HEROES[s.hero].name+'として、尖塔へ。'];
 s.routes=generateRoutes(s.seed);s.cardPurchases=0;s.shopRelic=null;s.rewardPicks=0;
 if(catalog)s.learningCatalog=JSON.parse(JSON.stringify(catalog));
 for(let i=0;i<3;i++)add(s,'strike');for(let i=0;i<3;i++)add(s,'guard');add(s,'probe');return s;
}
export function cardValues(card){const d=CARDS[card.id],v={...d,...(d.debuff?{debuff:{...d.debuff}}:{})};if(card.plus){if(d.kind==='power'){v.cost=Math.max(0,d.cost-1);}else{for(const k of ['block','heal','draw','energy','armor','strength'])v[k]=(v[k]||0)+(v['up'+k[0].toUpperCase()+k.slice(1)]||0);if(d.damage)v.damage=Math.ceil(d.damage*1.5);if(d.debuff)v.debuff.amount=d.debuff.amount+1;}}return v;}
export function describe(card){const d=cardValues(card),parts=[];if(d.battleOnly)return d.text;if(d.damage)parts.push(d.damage+(d.perBlock?'＋ブロック分':'')+'ダメージ'+(d.hits?' × '+d.hits:''));if(d.block)parts.push(d.block+'ブロック');if(d.draw)parts.push(d.draw+'枚引く');if(d.heal)parts.push('HPを'+d.heal+'回復');if(d.debuff)parts.push('敵に'+DEBUFFS[d.debuff.id].name+(d.debuff.id==='delay'?'（休止'+d.debuff.amount+'ターン）':d.debuff.amount));if(d.strength)parts.push('強化＋'+d.strength);if(d.armor)parts.push('毎ターン'+d.armor+'ブロック');if(d.energy)parts.push('エナジー＋'+d.energy);if(d.self)parts.push('HPを'+d.self+'失う');if(d.exhaust)parts.push('戦闘中除外');return parts.join('。')+'。';}
export function upgradeChanges(card){
 const before=cardValues({...card,plus:false}),after=cardValues({...card,plus:true}),labels={cost:'コスト',damage:before.hits?'1回のダメージ':'ダメージ',block:'ブロック',heal:'HP回復',draw:'ドロー枚数',energy:'獲得エナジー',armor:'毎ターン防御',strength:'強化'};
 const changes=Object.keys(labels).filter(k=>(before[k]||0)!==(after[k]||0)).map(k=>labels[k]+' '+(before[k]||0)+' → '+(after[k]||0));if(before.debuff&&after.debuff.amount!==before.debuff.amount)changes.push(DEBUFFS[before.debuff.id].name+' '+before.debuff.amount+' → '+after.debuff.amount);return changes;
}
function draw(s,n){const b=s.battle;for(let i=0;i<n;i++){if(!b.draw.length){b.draw=shuffle(s,b.discard);b.discard=[];}if(!b.draw.length||b.hand.length>=10)break;b.hand.push(b.draw.pop());}}
function startBattle(s,id){
 const e=ENEMIES[id];s.phase='battle';s.battle={enemy:id,hp:e.hp,maxHp:e.hp,block:0,strength:0,enemyDebuffs:emptyDebuffs(),playerDebuffs:emptyDebuffs(),enemyStep:0,playerActions:1,events:[],turn:1,playerBlock:s.relics.includes('shell')?8:0,playerStrength:s.relics.includes('ember')?1:0,armor:0,energy:3+(s.relics.includes('capacity')?1:0),comboPlayed:[],comboDone:[],hand:[],draw:shuffle(s,s.deck.map(c=>c.uid)),discard:[],exhaust:[]};if(has(s,'opener'))s.battle.openerVersion=1;s.battle.playerStrength+=(has(s,'edge')?1:0)+(has(s,'opener')?5:0)+(has(s,'elite_edge')&&e.tier==='elite'?2:0);
 s.battle.playerBlock=playerBlockGain(s,s.battle.playerBlock);s.battle.energy=turnEnergy(s)+(has(s,'capacity')?1:0)+(has(s,'battery')?1:0);turnStart(s);
 draw(s,turnDraw(s)+(has(s,'lantern')?1:0)+(has(s,'blueprint')?2:0));log(s,e.name+'が現れた。');
}
export function intentActions(s){
 if(!s.battle)return [];
 const b=s.battle;if(delayPaused(b.enemyDebuffs.delay))return [{type:'wait',value:0}];
 let strength=b.strength;const actions=[],target={...b.playerDebuffs};
 for(let n=0;n<(b.enemyDebuffs.delay===2?2:1);n++){
  const [type,base,status,damage]=ENEMIES[b.enemy].pattern[(b.enemyStep+n)%ENEMIES[b.enemy].pattern.length];
  const value=type==='attack'?attackAmount(base+strength,b.enemyDebuffs,target):type==='guard'?blockAmount(base,b.enemyDebuffs):base;
  actions.push({type,value,...(status?{status}:{}),...(damage?{damage:attackAmount(damage+strength,b.enemyDebuffs,target)}:{})});if(type==='buff')strength+=base;if(type==='debuff')applyDebuff(target,status,base);
 }
 return actions;
}
export function intent(s){const a=intentActions(s);return a.length===2?{type:'double',actions:a}:a[0]||null;}
function emit(b,side,kind,value,label){b.events.push({side,kind,value,label});}
function burn(s,side){
 const b=s.battle,d=side==='enemy'?b.enemyDebuffs:b.playerDebuffs;
 if(!d.burn)return;
 const loss=Math.min(side==='enemy'?b.hp:s.hp,d.burn);
 if(side==='enemy')b.hp-=loss;else s.hp-=loss;
 d.burn--;emit(b,side,'hit',loss,'炎上 −'+loss);log(s,(side==='enemy'?'敵':'自分')+'の炎上：HP −'+loss+'。');
}
function clearJunk(s){const ids=new Set(s.deck.filter(c=>c.id==='junk').map(c=>c.uid));s.deck=s.deck.filter(c=>!ids.has(c.uid));if(s.battle){for(const pile of ['hand','draw','discard','exhaust'])s.battle[pile]=s.battle[pile].filter(id=>!ids.has(id));s.battle.comboPlayed=s.battle.comboPlayed.filter(id=>id!=='junk');}}
function lose(s){clearJunk(s);s.phase='lost';log(s,'冒険はここまで。');}

function offers(s,count=3){const pool=rewardPool(),study=pool.filter(id=>id.startsWith('study-'));if(!study.length)return shuffle(s,pool).slice(0,count);return shuffle(s,[...shuffle(s,pool.filter(id=>!id.startsWith('study-'))).slice(0,count-1),shuffle(s,study)[0]]);}
function win(s){
 clearJunk(s);
 const tier=ENEMIES[s.battle.enemy].tier,elite=tier==='elite',boss=tier==='boss';
 s.gold+=(elite?40:22)+(has(s,'bounty')?30:0);
 if(has(s,'growth'))s.maxHp+=5;
 const before=s.hp;if(has(s,'spring'))heal(s,4);if(has(s,'runbook'))heal(s,6);if(has(s,'renewal'))heal(s,Math.ceil(s.maxHp*.02));
 if(s.hp>before)emit(s.battle,'player','heal',s.hp-before,'回復 ＋'+(s.hp-before));
 // Resolve benefits owned at victory before granting this battle's new relic.
 s.reward=boss?[]:offers(s,has(s,'choice')?4:3);s.rewardPicks=boss?0:has(s,'double')?2:1;
 if(boss){s.phase='won';log(s,ENEMIES[s.battle.enemy].name+'を乗り越えた。登頂成功！');return;}
 if(elite){const relic=shuffle(s,REWARD_RELICS.filter(x=>!has(s,x)))[0];if(relic){s.relics.push(relic);log(s,'遺物「'+RELICS[relic].name+'」を獲得。');}else{s.gold+=30;log(s,'遺物収集済み：30コインを獲得。');}}
 s.phase='reward';log(s,'勝利。カードを'+s.rewardPicks+'枚まで選ぶか、見送れます。');
}
function startQuiz(s){s.quiz={ids:shuffle(s,Object.keys(QUIZZES)).slice(0,2),answers:[],step:0,result:null,rulesVersion:2,startHp:s.hp,penalty:Math.ceil(s.maxHp*QUIZ_RULES.wrongRate),damageTaken:0};const orderRng={rng:(s.rng^0x9e3779b9)>>>0};s.quiz.orders=s.quiz.ids.map(id=>shuffle(orderRng,QUIZZES[id].options.map((_,i)=>i)));}
function complete(s){s.quiz=null;s.phase='map';s.battle=null;s.reward=[];s.stock=[];s.rewardPicks=0;s.shopRelic=null;}
export function act(state,action){
 if(activeVersion()!==(state.learningCatalog?.version||null))activateCatalog(state.learningCatalog||null);
 const s=clone(state),a=action,b=s.battle;
 if(a.type==='node'&&s.phase==='map'&&Number.isInteger(a.lane)&&routesFor(s)[s.floor]?.[a.lane]){
  const type=routesFor(s)[s.floor][a.lane];s.history.push({floor:s.floor,lane:a.lane,type});s.floor++;log(s,s.floor+'階：'+NODE_NAMES[type]);
  if(['battle','elite','boss'].includes(type)){const pool=ENEMY_POOLS[type],id=pool[Math.floor(rnd(s)*pool.length)];startBattle(s,id);}
  else{s.phase=type;s.battle=null;s.removed=false;if(type==='event')startQuiz(s);if(type==='shop'){s.stock=offers(s);s.shopRelic=shuffle(s,REWARD_RELICS.filter(id=>!has(s,id)))[0]||null;}}return s;
 }
 if(a.type==='play'&&s.phase==='battle'){
  const index=b.hand.indexOf(a.uid),card=s.deck.find(c=>c.uid===a.uid);if(index<0||!card||delayPaused(b.playerDebuffs.delay))return state;const d=cardValues(card);if(d.cost>b.energy)return state;
  b.events=[];
  b.hand.splice(index,1);b.energy-=d.cost;(d.exhaust?b.exhaust:b.discard).push(card.uid);
  b.playerBlock+=playerBlockGain(s,d.block||0);b.playerStrength+=d.strength||0;b.armor+=d.armor||0;b.energy+=d.energy||0;
  if(d.debuff)applyDebuff(b.enemyDebuffs,d.debuff.id,d.debuff.amount);
  if(d.heal)heal(s,d.heal);if(d.self)s.hp=Math.max(0,s.hp-d.self);
  for(let hit=0;hit<(d.damage?(d.hits||1):0);hit++){const amount=attackAmount(d.damage+b.playerStrength+(d.perBlock?b.playerBlock:0),b.playerDebuffs,b.enemyDebuffs),absorbed=Math.min(b.block,amount);b.block-=absorbed;b.hp=Math.max(0,b.hp-amount+absorbed);}
  log(s,d.name+(card.plus?'＋':'')+'を使用。');
  b.comboPlayed??=[];b.comboDone??=[];
  if(!b.comboPlayed.includes(card.id))b.comboPlayed.push(card.id);
  // Self-inflicted defeat takes priority. Resolve each role once, before victory.
  if(s.hp>0)for(const [id,r] of Object.entries(COMBOS))if(!b.comboDone.includes(id)&&r.cards.every(c=>b.comboPlayed.includes(c))){
   b.comboDone.push(id);b.playerBlock+=playerBlockGain(s,r.block||0);b.energy+=r.energy||0;
   if(r.damage){const amount=attackAmount(r.damage,b.playerDebuffs,b.enemyDebuffs),absorbed=Math.min(b.block,amount);b.block-=absorbed;b.hp=Math.max(0,b.hp-amount+absorbed);}
   log(s,'役「'+r.name+'」成立：'+r.label+'。');
  }
  if(s.hp===0){lose(s);log(s,'力尽きた。デッキを見直して次の冒険へ。');}
  else if(b.hp===0)win(s);else if(d.draw)draw(s,d.draw);return s;
 }
 if(a.type==='end'&&s.phase==='battle'){
  b.events=[];b.discard.push(...b.hand);b.hand=[];
  // The two player action windows belong to one turn: block and combo usage persist.
  if(b.playerDebuffs.delay===2&&b.playerActions===2){
   b.playerActions=1;b.energy=3;draw(s,5);log(s,'2回行動：後半へ。敵はまだ行動しない。');return s;
  }
  if(delayPaused(b.playerDebuffs.delay)){b.playerDebuffs.delay=advanceDelay(b.playerDebuffs.delay);log(s,delayPaused(b.playerDebuffs.delay)?'遅延：残り'+delayRemaining(b.playerDebuffs.delay)+'ターン休止。':'遅延で休止。次は2回行動。');}
  else if(b.playerDebuffs.delay===2)b.playerDebuffs.delay=0;
  if(has(s,'dusk')){const value=playerBlockGain(s,3);b.playerBlock+=value;emit(b,'player','shield',value,RELICS.dusk.name+' ＋'+value);}
  burn(s,'player');if(s.hp===0){lose(s);return s;}
  b.block=0;
  const refreshed=[];
  if(delayPaused(b.enemyDebuffs.delay)){
   b.enemyDebuffs.delay=advanceDelay(b.enemyDebuffs.delay);emit(b,'enemy','debuff',0,'遅延：行動休止');log(s,delayPaused(b.enemyDebuffs.delay)?'敵は遅延：残り'+delayRemaining(b.enemyDebuffs.delay)+'ターン休止。':'敵は遅延で休止。次は2回行動。');
  }else{
   const count=b.enemyDebuffs.delay===2?2:1;
   for(let n=0;n<count&&s.hp>0;n++){
    // Recompute each action after prior buffs/debuffs; the cursor advances only on action.
    const [type,base,status,damage]=ENEMIES[b.enemy].pattern[b.enemyStep%ENEMIES[b.enemy].pattern.length];b.enemyStep++;
    if(type==='attack'||damage){
     const value=attackAmount((damage||base)+b.strength,b.enemyDebuffs,b.playerDebuffs),blocked=Math.min(value,b.playerBlock),loss=Math.min(s.hp,value-blocked);
     b.playerBlock-=blocked;s.hp-=loss;
     if(blocked)emit(b,'player','guard',blocked,(blocked===value?'完全ガード ':'防御 ')+blocked);
     if(loss)emit(b,'player','hit',loss,'−'+loss);
     log(s,'敵の攻撃'+value+'。HPダメージ '+loss+'。');
    }
    if(type==='junk'&&s.hp>0){
     for(let i=0;i<base;i++){const uid=s.nextId;add(s,'junk');b.draw.splice(Math.floor(rnd(s)*(b.draw.length+1)),0,uid);}
     emit(b,'player','debuff',base,CARDS.junk.name+' ＋'+base);log(s,'山札に'+CARDS.junk.name+'を'+base+'枚混ぜられた。');
    }
    if(type==='guard'){const value=blockAmount(base,b.enemyDebuffs);b.block+=value;emit(b,'enemy','shield',value,'◇ ＋'+value);log(s,'敵は'+value+'ブロック。');}
    if(type==='buff'){b.strength+=base;emit(b,'enemy','power',base,'攻撃力 ＋'+base);log(s,'敵の強化＋'+base+'。');}
    if(type==='debuff'&&s.hp>0){
     if(applyDebuff(b.playerDebuffs,status,base)){refreshed.push(status);emit(b,'player','debuff',base,DEBUFFS[status].name+(status==='delay'?' 付与':' ＋'+base));log(s,'自分に'+DEBUFFS[status].name+'。');}
    }
   }
   if(b.enemyDebuffs.delay===2)b.enemyDebuffs.delay=0;
  }
  if(s.hp===0){lose(s);return s;}
  burn(s,'enemy');decayDebuffs(b.enemyDebuffs);decayDebuffs(b.playerDebuffs,refreshed);
  if(b.hp===0){win(s);return s;}
  if(b.turn===1&&has(s,'opener'))b.playerStrength=Math.max(0,b.playerStrength-5);
  b.turn++;b.energy=delayPaused(b.playerDebuffs.delay)?0:turnEnergy(s);b.playerActions=b.playerDebuffs.delay===2?2:1;
  b.comboPlayed=[];b.comboDone=[];b.playerBlock=playerBlockGain(s,b.armor);turnStart(s);
  if(b.playerBlock)emit(b,'player','shield',b.playerBlock,'◇ ＋'+b.playerBlock);
  if(!delayPaused(b.playerDebuffs.delay))draw(s,turnDraw(s));return s;
 }
 if(a.type==='reward'&&s.phase==='reward'&&(a.id===null||s.reward.includes(a.id))){if(a.id){add(s,a.id);s.battle.discard.push(s.deck[s.deck.length-1].uid);s.reward=s.reward.filter(id=>id!==a.id);s.rewardPicks=(s.rewardPicks??1)-1;log(s,CARDS[a.id].name+'をデッキに追加。');if(s.rewardPicks>0&&s.reward.length)return s;}complete(s);return s;}
 if(s.phase==='rest'){
  if(a.type==='rest-remove'&&has(s,'prune')&&s.deck.length>5){const ix=s.deck.findIndex(c=>c.uid===a.uid);if(ix<0)return state;s.deck.splice(ix,1);log(s,'休息でカードを1枚削除。');complete(s);return s;}
  if(a.type==='heal'){heal(s,22);log(s,'休息でHPを22回復。');complete(s);return s;}
  if(a.type==='upgrade'){const c=s.deck.find(c=>c.uid===a.uid&&!c.plus);if(!c)return state;c.plus=true;log(s,CARDS[c.id].name+'を強化：'+upgradeChanges(c).join(' / ')+'。');complete(s);return s;}
 }
 if(s.phase==='event'){
  const q=s.quiz;
  if(!q)return state;
  if(a.type==='quiz-answer'&&q.step<2&&q.answers.length===q.step&&a.questionId===q.ids[q.step]&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<QUIZZES[q.ids[q.step]].options.length){if(q.answerTimes!==undefined||Number.isFinite(a.answeredAt))q.answerTimes=[...(q.answerTimes||q.answers.map(()=>0)),Number.isFinite(a.answeredAt)&&a.answeredAt>=0?a.answeredAt:0];q.answers.push(a.choice);if(q.rulesVersion===2&&a.choice!==QUIZZES[a.questionId].answer){const loss=Math.min(s.hp,q.penalty);s.hp-=loss;q.damageTaken+=loss;log(s,'誤答：HP −'+loss+'（最大HPの10％）。');if(s.hp===0){q.step=q.answers.length;q.result={correct:quizScore(q),relic:null,gold:0,damage:q.damageTaken,interrupted:true};s.phase='lost';log(s,'クイズのダメージで力尽きた。');}}return s;}
  if(a.type==='quiz-next'&&q.step<2&&q.answers.length===q.step+1&&a.questionId===q.ids[q.step]){
   q.step++;
   if(q.step===2){
    const correct=quizScore(q);q.result={correct,relic:null,gold:0,damage:q.rulesVersion===2?q.damageTaken:0};
    if(correct===2){const relic=shuffle(s,REWARD_RELICS.filter(r=>!s.relics.includes(r)))[0];if(relic){q.result.relic=relic;s.relics.push(relic);}else if(q.rulesVersion!==2){q.result.gold=LEGACY_QUIZ_RULES.allRelicsCoins;s.gold+=q.result.gold;}}
    if(correct===1){q.result.gold=QUIZ_RULES.coins;s.gold+=q.result.gold;}
    if(correct===0&&q.rulesVersion!==2){q.result.damage=Math.min(s.hp,LEGACY_QUIZ_RULES.damage);s.hp-=q.result.damage;}
    log(s,'クイズ '+correct+'/2問正解。'+(q.result.relic?'遺物「'+RELICS[q.result.relic].name+'」を獲得。':q.result.gold?q.result.gold+'コイン獲得。':'HP −'+q.result.damage+'。'));
    if(s.hp===0){s.phase='lost';log(s,'クイズのダメージで力尽きた。');}
   }return s;
  }
  if(a.type==='quiz-leave'&&q.result){complete(s);return s;}
 }
 if(s.phase==='shop'){
  if(a.type==='buy-relic'&&a.id===s.shopRelic&&REWARD_RELICS.includes(a.id)&&!has(s,a.id)&&s.gold>=shopPrice(s,'relic')){s.gold-=shopPrice(s,'relic');s.relics.push(a.id);s.shopRelic=null;log(s,'遺物「'+RELICS[a.id].name+'」を購入。');return s;}
  if(a.type==='buy'&&s.stock.includes(a.id)&&s.gold>=shopPrice(s,'card')){s.gold-=shopPrice(s,'card');s.cardPurchases=(s.cardPurchases??0)+1;add(s,a.id);s.stock=s.stock.filter(x=>x!==a.id);log(s,CARDS[a.id].name+'を購入。');return s;}
  if(a.type==='remove'&&!s.removed&&s.gold>=shopPrice(s,'remove')&&s.deck.length>5){const ix=s.deck.findIndex(c=>c.uid===a.uid);if(ix<0)return state;s.gold-=shopPrice(s,'remove');s.deck.splice(ix,1);s.removed=true;log(s,'カードを1枚削除。');return s;}
  if(a.type==='leave'){complete(s);return s;}
 }
 return state;
}
export function parseRun(raw){
 const previous=getActiveCatalog();
 try{const candidate=JSON.parse(raw);
 // Merge the mistakenly split relic in old backups without doubling its effects.
 if(candidate&&Array.isArray(candidate.relics)&&candidate.relics.includes('regeneration'))candidate.relics=candidate.relics.map(id=>id==='regeneration'?'escalation':id).filter((id,i,ids)=>id!=='escalation'||ids.indexOf(id)===i);
 if(candidate?.quiz?.result?.relic==='regeneration')candidate.quiz.result.relic='escalation';
 if(candidate?.shopRelic==='regeneration')candidate.shopRelic='escalation';
 if(candidate?.shopRelic==='escalation'&&candidate.relics?.includes('escalation'))candidate.shopRelic=null;
 activateCatalog(candidate&&Object.prototype.hasOwnProperty.call(candidate,'learningCatalog')?candidate.learningCatalog:null);return validateRun(JSON.stringify(candidate));}catch(error){activateCatalog(previous);throw error;}
}
function validateRun(raw){
 const s=JSON.parse(raw),num=(x,max=100000)=>Number.isSafeInteger(x)&&x>=0&&x<=max;
 if(!s||![1,2,3,4].includes(s.version)||!num(s.seed,4294967295)||!num(s.rng,4294967295)||!num(s.floor,8)||!num(s.maxHp,112)||s.maxHp<72||(s.maxHp-72)%5!==0||!num(s.hp,s.maxHp)||!num(s.gold)||!num(s.nextId,100000)||!['map','battle','reward','rest','event','shop','won','lost'].includes(s.phase))throw Error('保存データの形式が不正です。');
 if(!Array.isArray(s.deck)||s.deck.filter(c=>c.id!=='junk').length<5||s.deck.length>100000||s.deck.filter(c=>c.id!=='junk').length>100||!s.deck.every(c=>num(c.uid,99999)&&c.uid<s.nextId&&owns(CARDS,c.id)&&typeof c.plus==='boolean'&&(c.id!=='junk'||s.phase==='battle'&&!c.plus))||new Set(s.deck.map(c=>c.uid)).size!==s.deck.length)throw Error('デッキが不正です。');
 for(const [name,allowed,max] of [['relics',Object.keys(RELICS),Object.keys(RELICS).length],['reward',rewardPool(),4],['stock',rewardPool(),3]])if(!Array.isArray(s[name])||s[name].length>max||!s[name].every(x=>allowed.includes(x))||new Set(s[name]).size!==s[name].length)throw Error('報酬が不正です。');
 if(owns(s,'hero')&&(!owns(HEROES,s.hero)||!s.relics.includes(HEROES[s.hero].relic)||s.relics.some(r=>!REWARD_RELICS.includes(r)&&r!==HEROES[s.hero].relic)))throw Error('主人公の記録が不正です。');
 if(owns(s,'routes')&&(!Array.isArray(s.routes)||s.routes.length!==8||!s.routes.every((row,i)=>Array.isArray(row)&&row.length===(i===7?1:2)&&row.every(t=>i===7?t==='boss':i===0?t==='battle':['battle','elite','event','rest','shop'].includes(t)))))throw Error('マップが不正です。');
 if(owns(s,'rewardPicks')&&(!num(s.rewardPicks,2)||(s.phase==='reward'?(s.rewardPicks<1||s.reward.length<s.rewardPicks):s.rewardPicks!==0)))throw Error('獲得回数が不正です。');
 if(owns(s,'shopRelic')&&s.shopRelic!==null&&(s.phase!=='shop'||!REWARD_RELICS.includes(s.shopRelic)||s.relics.includes(s.shopRelic)))throw Error('交換所の遺物が不正です。');
 if(owns(s,'cardPurchases')&&!num(s.cardPurchases,1000))throw Error('購入記録が不正です。');
 if(!Array.isArray(s.history)||s.history.length!==s.floor||!s.history.every((h,i)=>h.floor===i&&num(h.lane,1)&&routesFor(s)[i]?.[h.lane]===h.type)||!Array.isArray(s.log)||s.log.length>5||!s.log.every(t=>typeof t==='string'&&t.length<200)||typeof s.removed!=='boolean')throw Error('進行記録が不正です。');
 if(s.phase==='map'&&s.floor>=8)throw Error('ルートが不正です。');
 if(s.phase==='lost'&&s.hp!==0||s.phase!=='lost'&&s.hp===0)throw Error('HPが不正です。');
 if(s.quiz===undefined){if(s.version!==1)throw Error('クイズ保存形式が不正です。');s.quiz=null;if(s.phase==='event')startQuiz(s);}
 const q=s.quiz;
 if(q!==null){
  if(!['event','lost'].includes(s.phase)||s.history[s.history.length-1]?.type!=='event'||!Array.isArray(q.ids)||q.ids.length!==2||new Set(q.ids).size!==2||!q.ids.every(id=>owns(QUIZZES,id))||!Array.isArray(q.answers)||!num(q.step,2)||q.answers.length<q.step||q.answers.length>Math.min(2,q.step+1)||!q.answers.every((v,i)=>num(v,QUIZZES[q.ids[i]].options.length-1)))throw Error('クイズの記録が不正です。');
  if(q.answerTimes!==undefined&&(!Array.isArray(q.answerTimes)||q.answerTimes.length!==q.answers.length||!q.answerTimes.every(t=>Number.isFinite(t)&&t>=0)))throw Error('回答日時が不正です。');
  if(q.orders!==undefined&&(!Array.isArray(q.orders)||q.orders.length!==2||!q.orders.every((order,i)=>Array.isArray(order)&&order.length===QUIZZES[q.ids[i]].options.length&&new Set(order).size===order.length&&order.every(n=>Number.isInteger(n)&&n>=0&&n<order.length))))throw Error('選択肢の表示順が不正です。');
  if(q.rulesVersion===2){
   const wrong=q.answers.filter((v,i)=>v!==QUIZZES[q.ids[i]].answer).length,damage=Math.min(q.startHp,wrong*q.penalty);
   if(!num(q.startHp,s.maxHp)||q.startHp<1||q.penalty!==Math.ceil(s.maxHp*QUIZ_RULES.wrongRate)||q.damageTaken!==damage||s.hp!==q.startHp-damage)throw Error('クイズのダメージ記録が不正です。');
   if(q.result){const r=q.result,n=quizScore(q);if(r.correct!==n||r.damage!==damage)throw Error('クイズ採点が不正です。');
    if(r.interrupted){if(r.interrupted!==true||s.phase!=='lost'||s.hp!==0||q.step!==q.answers.length||q.step<1||r.gold!==0||r.relic!==null)throw Error('中断クイズが不正です。');}
    else if(s.hp===0||q.step!==2||q.answers.length!==2||r.gold!==(n===1?30:0)||(n===2?(r.relic!==null&&(!REWARD_RELICS.includes(r.relic)||!s.relics.includes(r.relic))):r.relic!==null))throw Error('クイズ報酬が不正です。');
   }else if(q.step===2||s.hp===0)throw Error('クイズ結果がありません。');
  }else{
   if(q.rulesVersion!==undefined)throw Error('未対応のクイズ形式です。');
  if(q.step<2&&q.result!==null||q.step===2&&!q.result)throw Error('クイズ結果が不正です。');
  if(q.result){const r=q.result,n=quizScore(q);if(r.correct!==n||!num(r.gold)||!num(r.damage,8))throw Error('クイズ採点が不正です。');if(n===2?(r.damage!==0||(r.relic===null?r.gold!==60:!owns(RELICS,r.relic)||!s.relics.includes(r.relic)||r.gold!==0)):n===1?(r.relic!==null||r.gold!==30||r.damage!==0):(r.relic!==null||r.gold!==0||r.damage<1))throw Error('クイズ報酬が不正です。');}

  }
 }else if(s.phase==='event')throw Error('クイズがありません。');
 const quizLost=s.phase==='lost'&&(q?.result?.interrupted===true||q?.result?.correct===0&&q.step===2)&&s.battle===null;
 const b=s.battle;
 if(['battle','reward','won','lost'].includes(s.phase)&&!quizLost){
  if(!b||!owns(ENEMIES,b.enemy)||b.maxHp!==ENEMIES[b.enemy].hp||!num(b.hp,b.maxHp))throw Error('敵が不正です。');
  for(const k of ['block','strength','turn','playerBlock','playerStrength','armor','energy'])if(!num(b[k]))throw Error('戦闘の数値が不正です。');
  if(b.openerVersion!==undefined&&b.openerVersion!==1)throw Error('開始時強化の形式が不正です。');
  if(s.phase==='battle'&&has(s,'opener')&&b.openerVersion===undefined){if(b.turn>1)b.playerStrength=Math.max(0,b.playerStrength-5);b.openerVersion=1;}
  if(s.version<3){b.comboPlayed=[];b.comboDone=[];}
  if(s.version<4){
   if(b.weak!==undefined&&!num(b.weak))throw Error('旧状態異常の数値が不正です。');
   b.enemyDebuffs=emptyDebuffs();b.enemyDebuffs.overload=Math.min(999,b.weak||0);b.playerDebuffs=emptyDebuffs();
   b.enemyStep=b.turn-1;b.playerActions=1;b.events=[];delete b.weak;
  }
  for(const side of ['enemyDebuffs','playerDebuffs']){
   const d=b[side];if(!d||typeof d!=='object'||Object.keys(d).length!==5||!Object.keys(DEBUFFS).every(k=>num(d[k],999)))throw Error('デバフの記録が不正です。');
  }
  if(!num(b.enemyStep)||![1,2].includes(b.playerActions)||b.playerActions===2&&b.playerDebuffs.delay!==2||s.phase==='battle'&&delayPaused(b.playerDebuffs.delay)&&b.energy!==0||owns(b,'weak'))throw Error('行動順の記録が不正です。');
  // Only newly resolved actions can produce effects; saved UI events are not replayed.
  if(!Array.isArray(b.events)||b.events.length>30||!b.events.every(e=>e&&['player','enemy'].includes(e.side)&&['hit','guard','shield','power','debuff','heal'].includes(e.kind)&&num(e.value)&&typeof e.label==='string'&&e.label.length<100))throw Error('演出記録が不正です。');

  if(!Array.isArray(b.comboPlayed)||b.comboPlayed.length>Object.keys(CARDS).length||new Set(b.comboPlayed).size!==b.comboPlayed.length||!b.comboPlayed.every(id=>owns(CARDS,id)&&s.deck.some(c=>c.id===id))||!Array.isArray(b.comboDone)||b.comboDone.length>Object.keys(COMBOS).length||new Set(b.comboDone).size!==b.comboDone.length||!b.comboDone.every(id=>owns(COMBOS,id)&&COMBOS[id].cards.every(c=>b.comboPlayed.includes(c))))throw Error('役の記録が不正です。');
  if(b.turn<1)throw Error('ターンが不正です。');
  const piles=['hand','draw','discard','exhaust'];if(!piles.every(p=>Array.isArray(b[p])))throw Error('山札が不正です。');
  const ids=piles.flatMap(p=>b[p]);if(ids.length!==s.deck.length||new Set(ids).size!==ids.length||!ids.every(id=>s.deck.some(c=>c.uid===id))||b.hand.length>10)throw Error('カードの所在が不正です。');
  if(s.phase==='battle'&&b.hp===0||['reward','won'].includes(s.phase)&&b.hp!==0)throw Error('敵HPが不正です。');
  if(s.phase==='won'&&(ENEMIES[b.enemy].tier!=='boss'||s.floor!==8))throw Error('クリア状態が不正です。');
 } else if(b!==null)throw Error('戦闘外の記録が不正です。');
 s.version=4;return s;
}
