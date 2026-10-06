import {DEBUFFS,emptyDebuffs,applyDebuff,attackAmount,blockAmount,decayDebuffs} from './debuffs.mjs';
import {COMBOS} from './combos.mjs';
import {QUIZZES,QUIZ_RULES,quizScore,LEGACY_QUIZ_IDS,QUIZ_CASE_PAIRS} from './quiz.mjs';
export {QUIZZES,QUIZ_RULES,quizScore} from './quiz.mjs';

export const CARDS={
 strike:{name:'切り分け',cost:1,kind:'attack',damage:6,upDamage:3,text:'6ダメージ。'},
 guard:{name:'防壁',cost:1,kind:'skill',block:5,upBlock:3,text:'5ブロック。'},
 probe:{name:'観測',cost:1,kind:'attack',damage:4,upDamage:2,draw:1,text:'4ダメージ。1枚引く。'},
 burst:{name:'集中処理',cost:2,kind:'attack',damage:18,upDamage:7,debuff:{id:'burn',amount:3},text:'18ダメージ。炎上3。'},
 parallel:{name:'並列処理',cost:1,kind:'attack',damage:4,hits:2,upDamage:2,text:'4ダメージを2回。強化の効果も2回。'},
 retry:{name:'再試行',cost:0,kind:'attack',damage:3,upDamage:2,text:'3ダメージ。'},
 reserve:{name:'予備容量',cost:2,kind:'skill',block:14,upBlock:6,text:'14ブロック。'},
 restore:{name:'復旧手順',cost:1,kind:'skill',heal:7,upHeal:4,exhaust:true,text:'HPを7回復。この戦闘中は除外。'},
 foresight:{name:'先読み',cost:1,kind:'skill',draw:3,upDraw:1,text:'3枚引く。'},
 isolate:{name:'隔離',cost:1,kind:'skill',debuff:{id:'overload',amount:2},block:3,upBlock:4,text:'3ブロック。敵に過負荷2。'},
 detour:{name:'迂回',cost:1,kind:'skill',debuff:{id:'delay',amount:1},exhaust:true,block:4,draw:1,upBlock:4,text:'4ブロック。1枚引く。遅延。この戦闘中は除外。'},
 analysis:{name:'ログ分析',cost:0,kind:'skill',debuff:{id:'misconfig',amount:2},draw:2,upDraw:1,exhaust:true,text:'2枚引く。設定不備2。この戦闘中は除外。'},
 overload:{name:'過負荷試験',cost:1,kind:'attack',damage:16,self:3,debuff:{id:'depletion',amount:2},upDamage:5,text:'16ダメージ。枯渇2。自分のHPを3失う。'},
 redundant:{name:'冗長構成',cost:2,kind:'power',armor:3,upArmor:2,exhaust:true,text:'毎ターン開始時3ブロック。この戦闘中持続。'},
 optimize:{name:'最適化',cost:1,kind:'power',strength:2,upStrength:1,exhaust:true,text:'この戦闘中、攻撃のダメージ＋2。'},
 cache:{name:'キャッシュ',cost:0,kind:'skill',energy:2,upEnergy:1,exhaust:true,text:'エナジーを2得る。この戦闘中は除外。'},
 patch:{name:'緊急パッチ',cost:0,kind:'skill',block:4,upBlock:3,exhaust:true,text:'4ブロック。この戦闘中は除外。'},
 balance:{name:'負荷分散',cost:1,kind:'attack',damage:7,block:4,upDamage:3,upBlock:2,text:'7ダメージ。4ブロック。'},
 reversal:{name:'逆転の一手',cost:2,kind:'attack',damage:12,perBlock:true,upDamage:6,text:'12＋現在のブロック分のダメージ。'},
 quarantine:{name:'封じ込め',cost:2,kind:'attack',damage:10,debuff:{id:'overload',amount:3},upDamage:5,text:'10ダメージ。敵に過負荷3。'}
};
export const ENEMIES={
 noise:{tier:'battle',name:'ノイズの群れ',hp:32,glyph:'✺',pattern:[['attack',7],['guard',7],['attack',10]]},
 surge:{tier:'battle',name:'負荷の奔流',hp:38,glyph:'≋',pattern:[['buff',2],['attack',8],['attack',12]]},
 leak:{tier:'battle',name:'メモリの亡霊',hp:35,glyph:'♧',pattern:[['attack',6],['attack',6],['attack',13]]},
 timeout:{tier:'battle',name:'時切れの番人',hp:42,glyph:'⌛',pattern:[['guard',10],['attack',13],['buff',3]]},
 storm:{tier:'battle',name:'再試行の嵐',hp:45,glyph:'ϟ',pattern:[['attack',9],['buff',2],['attack',14]]},
 deadlock:{tier:'battle',name:'膠着の双環',hp:47,glyph:'∞',pattern:[['attack',10],['guard',12],['attack',14]]},
 elite:{tier:'elite',name:'断絶の騎士',hp:65,glyph:'⛨',pattern:[['debuff',2,'misconfig'],['attack',15],['attack',19],['guard',12]]},
 elite_fire:{tier:'elite',name:'炎上の番人',hp:65,glyph:'♨',pattern:[['debuff',3,'burn'],['attack',14],['guard',12],['attack',18]]},
 elite_drain:{tier:'elite',name:'枯渇の収集者',hp:65,glyph:'◈',pattern:[['debuff',2,'depletion'],['attack',15],['guard',10],['attack',19]]},
 boss:{tier:'boss',name:'連鎖障害の王',hp:125,glyph:'♜',pattern:[['debuff',1,'delay'],['attack',13],['debuff',3,'burn'],['guard',18],['debuff',2,'overload'],['attack',24]]},
 boss_resource:{tier:'boss',name:'資源喰らいの巨塔',hp:125,glyph:'▥',pattern:[['debuff',2,'depletion'],['attack',16],['debuff',2,'misconfig'],['attack',18],['guard',18],['attack',22]]},
 boss_stagnation:{tier:'boss',name:'停滞の支配者',hp:125,glyph:'⌛',pattern:[['debuff',2,'overload'],['attack',16],['debuff',1,'delay'],['guard',18],['attack',22],['attack',14]]}
};
export const ENEMY_POOLS=Object.fromEntries(['battle','elite','boss'].map(tier=>[tier,Object.keys(ENEMIES).filter(id=>ENEMIES[id].tier===tier)]));
export const enemyDebuffTypes=id=>[...new Set(ENEMIES[id].pattern.filter(a=>a[0]==='debuff').map(a=>a[2]))];
export const RELICS={
 lantern:{name:'観測灯',text:'各戦闘の最初のターンに1枚多く引く。'},
 shell:{name:'耐障害の殻',text:'各戦闘の開始時に8ブロック。'},
 spring:{name:'復旧の泉',text:'戦闘勝利時にHPを4回復。'},
 ember:{name:'演算の火種',text:'各戦闘の開始時に強化＋1。'}
};
export const ROUTES=[['battle','battle'],['event','battle'],['elite','shop'],['rest','battle'],['battle','event'],['elite','shop'],['rest','rest'],['boss']];
export const NODE_NAMES={battle:'戦闘',elite:'強敵',rest:'休息',shop:'交換所',event:'クイズ',boss:'ボス'};
const rewardPool=Object.keys(CARDS).filter(x=>!['strike','guard'].includes(x));
const clone=x=>JSON.parse(JSON.stringify(x));
const owns=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function rnd(s){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296;}
function shuffle(s,arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function log(s,t){s.log=[...s.log,t].slice(-5);}
function heal(s,n){s.hp=Math.min(s.maxHp,s.hp+n);}
function add(s,id){s.deck.push({uid:s.nextId++,id,plus:false});}
export function newRun(seed=Date.now()){
 const s={version:4,seed:seed>>>0,rng:seed>>>0,nextId:0,hp:72,maxHp:72,gold:60,floor:0,phase:'map',deck:[],relics:['lantern'],history:[],log:['観測灯を携えて、尖塔へ。'],battle:null,reward:[],stock:[],removed:false,quiz:null};
 for(let i=0;i<5;i++)add(s,'strike');for(let i=0;i<4;i++)add(s,'guard');add(s,'probe');return s;
}
export function cardValues(card){const d=CARDS[card.id],v={...d};if(card.plus)for(const k of ['damage','block','heal','draw','energy','armor','strength'])v[k]=(v[k]||0)+(v['up'+k[0].toUpperCase()+k.slice(1)]||0);return v;}
export function describe(card){const d=cardValues(card),parts=[];if(d.damage)parts.push(d.damage+(d.perBlock?'＋ブロック分':'')+'ダメージ'+(d.hits?' × '+d.hits:''));if(d.block)parts.push(d.block+'ブロック');if(d.draw)parts.push(d.draw+'枚引く');if(d.heal)parts.push('HPを'+d.heal+'回復');if(d.debuff)parts.push('敵に'+DEBUFFS[d.debuff.id].name+(d.debuff.id==='delay'?'':d.debuff.amount));if(d.strength)parts.push('強化＋'+d.strength);if(d.armor)parts.push('毎ターン'+d.armor+'ブロック');if(d.energy)parts.push('エナジー＋'+d.energy);if(d.self)parts.push('HPを'+d.self+'失う');if(d.exhaust)parts.push('戦闘中除外');return parts.join('。')+'。';}
export function upgradeChanges(card){
 const before=cardValues({...card,plus:false}),after=cardValues({...card,plus:true}),labels={damage:before.hits?'1回のダメージ':'ダメージ',block:'ブロック',heal:'HP回復',draw:'ドロー枚数',energy:'獲得エナジー',armor:'毎ターン防御',strength:'強化'};
 return Object.keys(labels).filter(k=>(before[k]||0)!==(after[k]||0)).map(k=>labels[k]+' '+(before[k]||0)+' → '+(after[k]||0));
}
function draw(s,n){const b=s.battle;for(let i=0;i<n;i++){if(!b.draw.length){b.draw=shuffle(s,b.discard);b.discard=[];}if(!b.draw.length||b.hand.length>=10)break;b.hand.push(b.draw.pop());}}
function startBattle(s,id){
 const e=ENEMIES[id];s.phase='battle';s.battle={enemy:id,hp:e.hp,maxHp:e.hp,block:0,strength:0,enemyDebuffs:emptyDebuffs(),playerDebuffs:emptyDebuffs(),enemyStep:0,playerActions:1,events:[],turn:1,playerBlock:s.relics.includes('shell')?8:0,playerStrength:s.relics.includes('ember')?1:0,armor:0,energy:3,comboPlayed:[],comboDone:[],hand:[],draw:shuffle(s,s.deck.map(c=>c.uid)),discard:[],exhaust:[]};draw(s,s.relics.includes('lantern')?6:5);log(s,e.name+'が現れた。');
}
export function intentActions(s){
 if(!s.battle)return [];
 const b=s.battle;if(b.enemyDebuffs.delay===1)return [{type:'wait',value:0}];
 let strength=b.strength;const actions=[],target={...b.playerDebuffs};
 for(let n=0;n<(b.enemyDebuffs.delay===2?2:1);n++){
  const [type,base,status]=ENEMIES[b.enemy].pattern[(b.enemyStep+n)%ENEMIES[b.enemy].pattern.length];
  const value=type==='attack'?attackAmount(base+strength,b.enemyDebuffs,target):type==='guard'?blockAmount(base,b.enemyDebuffs):base;
  actions.push({type,value,...(status?{status}:{})});if(type==='buff')strength+=base;if(type==='debuff')applyDebuff(target,status,base);
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
function lose(s){s.phase='lost';log(s,'冒険はここまで。');}

function win(s){const tier=ENEMIES[s.battle.enemy].tier,elite=tier==='elite',boss=tier==='boss';s.gold+=elite?40:22;if(s.relics.includes('spring'))heal(s,4);if(boss){s.phase='won';log(s,'連鎖障害を断ち切った。登頂成功！');return;}s.reward=shuffle(s,rewardPool).slice(0,3);if(elite){const relic=shuffle(s,Object.keys(RELICS).filter(x=>!s.relics.includes(x)))[0];if(relic){s.relics.push(relic);log(s,'遺物「'+RELICS[relic].name+'」を獲得。');}else{s.gold+=30;log(s,'遺物収集済み：30コインを獲得。');}}s.phase='reward';log(s,'勝利。カードを1枚選ぶか、見送れます。');}
function startQuiz(s){
 const cases=[null,...QUIZ_CASE_PAIRS],pair=shuffle(s,cases)[0];
 s.quiz={ids:pair?[...pair]:shuffle(s,LEGACY_QUIZ_IDS).slice(0,2),answers:[],step:0,result:null};
}
function complete(s){s.quiz=null;s.phase='map';s.battle=null;s.reward=[];s.stock=[];}
export function act(state,action){
 const s=clone(state),a=action,b=s.battle;
 if(a.type==='node'&&s.phase==='map'&&Number.isInteger(a.lane)&&ROUTES[s.floor]?.[a.lane]){
  const type=ROUTES[s.floor][a.lane];s.history.push({floor:s.floor,lane:a.lane,type});s.floor++;log(s,s.floor+'階：'+NODE_NAMES[type]);
  if(['battle','elite','boss'].includes(type)){const pool=ENEMY_POOLS[type],id=pool[Math.floor(rnd(s)*pool.length)];startBattle(s,id);}
  else{s.phase=type;s.battle=null;s.removed=false;if(type==='event')startQuiz(s);if(type==='shop')s.stock=shuffle(s,rewardPool).slice(0,3);}return s;
 }
 if(a.type==='play'&&s.phase==='battle'){
  const index=b.hand.indexOf(a.uid),card=s.deck.find(c=>c.uid===a.uid);if(index<0||!card||b.playerDebuffs.delay===1)return state;const d=cardValues(card);if(d.cost>b.energy)return state;
  b.events=[];
  b.hand.splice(index,1);b.energy-=d.cost;(d.exhaust?b.exhaust:b.discard).push(card.uid);
  b.playerBlock+=blockAmount(d.block||0,b.playerDebuffs);b.playerStrength+=d.strength||0;b.armor+=d.armor||0;b.energy+=d.energy||0;
  if(d.debuff)applyDebuff(b.enemyDebuffs,d.debuff.id,d.debuff.amount);
  if(d.heal)heal(s,d.heal);if(d.self)s.hp=Math.max(0,s.hp-d.self);
  for(let hit=0;hit<(d.damage?(d.hits||1):0);hit++){const amount=attackAmount(d.damage+b.playerStrength+(d.perBlock?b.playerBlock:0),b.playerDebuffs,b.enemyDebuffs),absorbed=Math.min(b.block,amount);b.block-=absorbed;b.hp=Math.max(0,b.hp-amount+absorbed);}
  log(s,d.name+(card.plus?'＋':'')+'を使用。');
  b.comboPlayed??=[];b.comboDone??=[];
  if(!b.comboPlayed.includes(card.id))b.comboPlayed.push(card.id);
  // Self-inflicted defeat takes priority. Resolve each role once, before victory.
  if(s.hp>0)for(const [id,r] of Object.entries(COMBOS))if(!b.comboDone.includes(id)&&r.cards.every(c=>b.comboPlayed.includes(c))){
   b.comboDone.push(id);b.playerBlock+=blockAmount(r.block||0,b.playerDebuffs);b.energy+=r.energy||0;
   if(r.damage){const amount=attackAmount(r.damage,b.playerDebuffs,b.enemyDebuffs),absorbed=Math.min(b.block,amount);b.block-=absorbed;b.hp=Math.max(0,b.hp-amount+absorbed);}
   log(s,'役「'+r.name+'」成立：'+r.label+'。');
  }
  if(s.hp===0){s.phase='lost';log(s,'力尽きた。デッキを見直して次の冒険へ。');}
  else if(b.hp===0)win(s);else if(d.draw)draw(s,d.draw);return s;
 }
 if(a.type==='end'&&s.phase==='battle'){
  b.events=[];b.discard.push(...b.hand);b.hand=[];
  // The two player action windows belong to one turn: block and combo usage persist.
  if(b.playerDebuffs.delay===2&&b.playerActions===2){
   b.playerActions=1;b.energy=3;draw(s,5);log(s,'2回行動：後半へ。敵はまだ行動しない。');return s;
  }
  if(b.playerDebuffs.delay===1){b.playerDebuffs.delay=2;log(s,'遅延で休止。次は2回行動。');}
  else if(b.playerDebuffs.delay===2)b.playerDebuffs.delay=0;
  burn(s,'player');if(s.hp===0){lose(s);return s;}
  b.block=0;
  const refreshed=[];
  if(b.enemyDebuffs.delay===1){
   b.enemyDebuffs.delay=2;emit(b,'enemy','debuff',0,'遅延：行動休止');log(s,'敵は遅延で休止。次は2回行動。');
  }else{
   const count=b.enemyDebuffs.delay===2?2:1;
   for(let n=0;n<count&&s.hp>0;n++){
    // Recompute each action after prior buffs/debuffs; the cursor advances only on action.
    const [type,base,status]=ENEMIES[b.enemy].pattern[b.enemyStep%ENEMIES[b.enemy].pattern.length];b.enemyStep++;
    if(type==='attack'){
     const value=attackAmount(base+b.strength,b.enemyDebuffs,b.playerDebuffs),blocked=Math.min(value,b.playerBlock),loss=Math.min(s.hp,value-blocked);
     b.playerBlock-=blocked;s.hp-=loss;
     if(blocked)emit(b,'player','guard',blocked,(blocked===value?'完全ガード ':'防御 ')+blocked);
     if(loss)emit(b,'player','hit',loss,'−'+loss);
     log(s,'敵の攻撃'+value+'。HPダメージ '+loss+'。');
    }
    if(type==='guard'){const value=blockAmount(base,b.enemyDebuffs);b.block+=value;emit(b,'enemy','shield',value,'◇ ＋'+value);log(s,'敵は'+value+'ブロック。');}
    if(type==='buff'){b.strength+=base;emit(b,'enemy','power',base,'攻撃力 ＋'+base);log(s,'敵の強化＋'+base+'。');}
    if(type==='debuff'){
     if(applyDebuff(b.playerDebuffs,status,base)){refreshed.push(status);emit(b,'player','debuff',base,DEBUFFS[status].name+(status==='delay'?' 付与':' ＋'+base));log(s,'自分に'+DEBUFFS[status].name+'。');}
    }
   }
   if(b.enemyDebuffs.delay===2)b.enemyDebuffs.delay=0;
  }
  if(s.hp===0){lose(s);return s;}
  burn(s,'enemy');decayDebuffs(b.enemyDebuffs);decayDebuffs(b.playerDebuffs,refreshed);
  if(b.hp===0){win(s);return s;}
  b.turn++;b.energy=b.playerDebuffs.delay===1?0:3;b.playerActions=b.playerDebuffs.delay===2?2:1;
  b.comboPlayed=[];b.comboDone=[];b.playerBlock=blockAmount(b.armor,b.playerDebuffs);
  if(b.playerBlock)emit(b,'player','shield',b.playerBlock,'◇ ＋'+b.playerBlock);
  if(b.playerDebuffs.delay!==1)draw(s,5);return s;
 }
 if(a.type==='reward'&&s.phase==='reward'&&(a.id===null||s.reward.includes(a.id))){if(a.id){add(s,a.id);log(s,CARDS[a.id].name+'をデッキに追加。');}complete(s);return s;}
 if(s.phase==='rest'){
  if(a.type==='heal'){heal(s,22);log(s,'休息でHPを22回復。');complete(s);return s;}
  if(a.type==='upgrade'){const c=s.deck.find(c=>c.uid===a.uid&&!c.plus);if(!c)return state;c.plus=true;log(s,CARDS[c.id].name+'を強化：'+upgradeChanges(c).join(' / ')+'。');complete(s);return s;}
 }
 if(s.phase==='event'){
  const q=s.quiz;
  if(!q)return state;
  if(a.type==='quiz-answer'&&q.step<2&&q.answers.length===q.step&&a.questionId===q.ids[q.step]&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<QUIZZES[q.ids[q.step]].options.length){q.answers.push(a.choice);return s;}
  if(a.type==='quiz-next'&&q.step<2&&q.answers.length===q.step+1&&a.questionId===q.ids[q.step]){
   q.step++;
   if(q.step===2){
    const correct=quizScore(q);q.result={correct,relic:null,gold:0,damage:0};
    if(correct===2){const relic=shuffle(s,Object.keys(RELICS).filter(r=>!s.relics.includes(r)))[0];if(relic){q.result.relic=relic;s.relics.push(relic);}else{q.result.gold=QUIZ_RULES.allRelicsCoins;s.gold+=q.result.gold;}}
    if(correct===1){q.result.gold=QUIZ_RULES.coins;s.gold+=q.result.gold;}
    if(correct===0){q.result.damage=Math.min(s.hp,QUIZ_RULES.damage);s.hp-=q.result.damage;}
    log(s,'クイズ '+correct+'/2問正解。'+(q.result.relic?'遺物「'+RELICS[q.result.relic].name+'」を獲得。':q.result.gold?q.result.gold+'コイン獲得。':'HP −'+q.result.damage+'。'));
    if(s.hp===0){s.phase='lost';log(s,'クイズのダメージで力尽きた。');}
   }return s;
  }
  if(a.type==='quiz-leave'&&q.result){complete(s);return s;}
 }
 if(s.phase==='shop'){
  if(a.type==='buy'&&s.stock.includes(a.id)&&s.gold>=35){s.gold-=35;add(s,a.id);s.stock=s.stock.filter(x=>x!==a.id);log(s,CARDS[a.id].name+'を購入。');return s;}
  if(a.type==='remove'&&!s.removed&&s.gold>=45&&s.deck.length>5){const ix=s.deck.findIndex(c=>c.uid===a.uid);if(ix<0)return state;s.gold-=45;s.deck.splice(ix,1);s.removed=true;log(s,'カードを1枚削除。');return s;}
  if(a.type==='leave'){complete(s);return s;}
 }
 return state;
}
export function parseRun(raw){
 const s=JSON.parse(raw),num=(x,max=100000)=>Number.isSafeInteger(x)&&x>=0&&x<=max;
 if(!s||![1,2,3,4].includes(s.version)||!num(s.seed,4294967295)||!num(s.rng,4294967295)||!num(s.floor,8)||!num(s.hp,72)||s.maxHp!==72||!num(s.gold)||!num(s.nextId,1000)||!['map','battle','reward','rest','event','shop','won','lost'].includes(s.phase))throw Error('保存データの形式が不正です。');
 if(!Array.isArray(s.deck)||s.deck.length<5||s.deck.length>100||!s.deck.every(c=>num(c.uid,999)&&c.uid<s.nextId&&owns(CARDS,c.id)&&typeof c.plus==='boolean')||new Set(s.deck.map(c=>c.uid)).size!==s.deck.length)throw Error('デッキが不正です。');
 for(const [name,allowed,max] of [['relics',Object.keys(RELICS),4],['reward',rewardPool,3],['stock',rewardPool,3]])if(!Array.isArray(s[name])||s[name].length>max||!s[name].every(x=>allowed.includes(x))||new Set(s[name]).size!==s[name].length)throw Error('報酬が不正です。');
 if(!Array.isArray(s.history)||s.history.length!==s.floor||!s.history.every((h,i)=>h.floor===i&&num(h.lane,1)&&ROUTES[i][h.lane]===h.type)||!Array.isArray(s.log)||s.log.length>5||!s.log.every(t=>typeof t==='string'&&t.length<200)||typeof s.removed!=='boolean')throw Error('進行記録が不正です。');
 if(s.phase==='map'&&s.floor>=8)throw Error('ルートが不正です。');
 if(s.phase==='lost'&&s.hp!==0||s.phase!=='lost'&&s.hp===0)throw Error('HPが不正です。');
 if(s.quiz===undefined){if(s.version!==1)throw Error('クイズ保存形式が不正です。');s.quiz=null;if(s.phase==='event')startQuiz(s);}
 const q=s.quiz;
 if(q!==null){
  if(!['event','lost'].includes(s.phase)||s.history[s.history.length-1]?.type!=='event'||!Array.isArray(q.ids)||q.ids.length!==2||new Set(q.ids).size!==2||!q.ids.every(id=>owns(QUIZZES,id))||!Array.isArray(q.answers)||!num(q.step,2)||q.answers.length<q.step||q.answers.length>Math.min(2,q.step+1)||!q.answers.every((v,i)=>num(v,QUIZZES[q.ids[i]].options.length-1)))throw Error('クイズの記録が不正です。');
  if(q.step<2&&q.result!==null||q.step===2&&!q.result)throw Error('クイズ結果が不正です。');
  if(q.result){const r=q.result,n=quizScore(q);if(r.correct!==n||!num(r.gold)||!num(r.damage,8))throw Error('クイズ採点が不正です。');if(n===2?(r.damage!==0||(r.relic===null?r.gold!==60:!owns(RELICS,r.relic)||!s.relics.includes(r.relic)||r.gold!==0)):n===1?(r.relic!==null||r.gold!==30||r.damage!==0):(r.relic!==null||r.gold!==0||r.damage<1))throw Error('クイズ報酬が不正です。');}
 }else if(s.phase==='event')throw Error('クイズがありません。');
 const quizLost=s.phase==='lost'&&q?.result?.correct===0&&q.step===2&&s.battle===null;
 const b=s.battle;
 if(['battle','reward','won','lost'].includes(s.phase)&&!quizLost){
  if(!b||!owns(ENEMIES,b.enemy)||b.maxHp!==ENEMIES[b.enemy].hp||!num(b.hp,b.maxHp))throw Error('敵が不正です。');
  for(const k of ['block','strength','turn','playerBlock','playerStrength','armor','energy'])if(!num(b[k]))throw Error('戦闘の数値が不正です。');
  if(s.version<3){b.comboPlayed=[];b.comboDone=[];}
  if(s.version<4){
   if(b.weak!==undefined&&!num(b.weak))throw Error('旧状態異常の数値が不正です。');
   b.enemyDebuffs=emptyDebuffs();b.enemyDebuffs.overload=Math.min(999,b.weak||0);b.playerDebuffs=emptyDebuffs();
   b.enemyStep=b.turn-1;b.playerActions=1;b.events=[];delete b.weak;
  }
  for(const side of ['enemyDebuffs','playerDebuffs']){
   const d=b[side];if(!d||typeof d!=='object'||Object.keys(d).length!==5||!Object.keys(DEBUFFS).every(k=>num(d[k],k==='delay'?2:999)))throw Error('デバフの記録が不正です。');
  }
  if(!num(b.enemyStep)||![1,2].includes(b.playerActions)||b.playerActions===2&&b.playerDebuffs.delay!==2||s.phase==='battle'&&b.playerDebuffs.delay===1&&b.energy!==0||owns(b,'weak'))throw Error('行動順の記録が不正です。');
  // Only newly resolved actions can produce effects; saved UI events are not replayed.
  if(!Array.isArray(b.events)||b.events.length>30||!b.events.every(e=>e&&['player','enemy'].includes(e.side)&&['hit','guard','shield','power','debuff'].includes(e.kind)&&num(e.value)&&typeof e.label==='string'&&e.label.length<100))throw Error('演出記録が不正です。');

  if(!Array.isArray(b.comboPlayed)||b.comboPlayed.length>Object.keys(CARDS).length||new Set(b.comboPlayed).size!==b.comboPlayed.length||!b.comboPlayed.every(id=>owns(CARDS,id)&&s.deck.some(c=>c.id===id))||!Array.isArray(b.comboDone)||b.comboDone.length>Object.keys(COMBOS).length||new Set(b.comboDone).size!==b.comboDone.length||!b.comboDone.every(id=>owns(COMBOS,id)&&COMBOS[id].cards.every(c=>b.comboPlayed.includes(c))))throw Error('役の記録が不正です。');
  if(b.turn<1)throw Error('ターンが不正です。');
  const piles=['hand','draw','discard','exhaust'];if(!piles.every(p=>Array.isArray(b[p])))throw Error('山札が不正です。');
  const ids=piles.flatMap(p=>b[p]);if(ids.length!==s.deck.length||new Set(ids).size!==ids.length||!ids.every(id=>s.deck.some(c=>c.uid===id))||b.hand.length>10)throw Error('カードの所在が不正です。');
  if(s.phase==='battle'&&b.hp===0||['reward','won'].includes(s.phase)&&b.hp!==0)throw Error('敵HPが不正です。');
  if(s.phase==='won'&&(ENEMIES[b.enemy].tier!=='boss'||s.floor!==8))throw Error('クリア状態が不正です。');
 } else if(b!==null)throw Error('戦闘外の記録が不正です。');
 s.version=4;return s;
}
