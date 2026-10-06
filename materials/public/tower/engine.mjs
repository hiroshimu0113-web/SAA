
export const CARDS={
 strike:{name:'切り分け',cost:1,kind:'attack',damage:6,upDamage:3,text:'6ダメージ。'},
 guard:{name:'防壁',cost:1,kind:'skill',block:5,upBlock:3,text:'5ブロック。'},
 probe:{name:'観測',cost:1,kind:'attack',damage:4,upDamage:2,draw:1,text:'4ダメージ。1枚引く。'},
 burst:{name:'集中処理',cost:2,kind:'attack',damage:18,upDamage:7,text:'18ダメージ。'},
 parallel:{name:'並列処理',cost:1,kind:'attack',damage:4,hits:2,upDamage:2,text:'4ダメージを2回。強化の効果も2回。'},
 retry:{name:'再試行',cost:0,kind:'attack',damage:3,upDamage:2,text:'3ダメージ。'},
 reserve:{name:'予備容量',cost:2,kind:'skill',block:14,upBlock:6,text:'14ブロック。'},
 restore:{name:'復旧手順',cost:1,kind:'skill',heal:7,upHeal:4,exhaust:true,text:'HPを7回復。この戦闘中は除外。'},
 foresight:{name:'先読み',cost:1,kind:'skill',draw:3,upDraw:1,text:'3枚引く。'},
 isolate:{name:'隔離',cost:1,kind:'skill',weak:2,block:3,upBlock:4,text:'3ブロック。敵を2ターン弱体化。'},
 detour:{name:'迂回',cost:1,kind:'skill',block:4,draw:1,upBlock:4,text:'4ブロック。1枚引く。'},
 analysis:{name:'ログ分析',cost:0,kind:'skill',draw:2,upDraw:1,exhaust:true,text:'2枚引く。この戦闘中は除外。'},
 overload:{name:'過負荷試験',cost:1,kind:'attack',damage:16,self:3,upDamage:5,text:'16ダメージ。自分のHPを3失う。'},
 redundant:{name:'冗長構成',cost:2,kind:'power',armor:3,upArmor:2,exhaust:true,text:'毎ターン開始時3ブロック。この戦闘中持続。'},
 optimize:{name:'最適化',cost:1,kind:'power',strength:2,upStrength:1,exhaust:true,text:'この戦闘中、攻撃のダメージ＋2。'},
 cache:{name:'キャッシュ',cost:0,kind:'skill',energy:2,upEnergy:1,exhaust:true,text:'エナジーを2得る。この戦闘中は除外。'},
 patch:{name:'緊急パッチ',cost:0,kind:'skill',block:4,upBlock:3,exhaust:true,text:'4ブロック。この戦闘中は除外。'},
 balance:{name:'負荷分散',cost:1,kind:'attack',damage:7,block:4,upDamage:3,upBlock:2,text:'7ダメージ。4ブロック。'},
 reversal:{name:'逆転の一手',cost:2,kind:'attack',damage:12,perBlock:true,upDamage:6,text:'12＋現在のブロック分のダメージ。'},
 quarantine:{name:'封じ込め',cost:2,kind:'attack',damage:10,weak:3,upDamage:5,text:'10ダメージ。敵を3ターン弱体化。'}
};
export const ENEMIES={
 noise:{name:'ノイズの群れ',hp:32,glyph:'✺',pattern:[['attack',7],['guard',7],['attack',10]]},
 surge:{name:'負荷の奔流',hp:38,glyph:'≋',pattern:[['buff',2],['attack',8],['attack',12]]},
 leak:{name:'メモリの亡霊',hp:35,glyph:'♧',pattern:[['attack',6],['attack',6],['attack',13]]},
 timeout:{name:'時切れの番人',hp:42,glyph:'⌛',pattern:[['guard',10],['attack',13],['buff',3]]},
 storm:{name:'再試行の嵐',hp:45,glyph:'ϟ',pattern:[['attack',9],['buff',2],['attack',14]]},
 deadlock:{name:'膠着の双環',hp:47,glyph:'∞',pattern:[['attack',10],['guard',12],['attack',14]]},
 elite:{name:'断絶の騎士',hp:65,glyph:'⛨',pattern:[['buff',3],['attack',15],['attack',19],['guard',12]]},
 boss:{name:'連鎖障害の王',hp:125,glyph:'♜',pattern:[['attack',13],['buff',3],['guard',18],['attack',24]]}
};
export const RELICS={
 lantern:{name:'観測灯',text:'各戦闘の最初のターンに1枚多く引く。'},
 shell:{name:'耐障害の殻',text:'各戦闘の開始時に8ブロック。'},
 spring:{name:'復旧の泉',text:'戦闘勝利時にHPを4回復。'},
 ember:{name:'演算の火種',text:'各戦闘の開始時に強化＋1。'}
};
export const ROUTES=[['battle','battle'],['event','battle'],['elite','shop'],['rest','battle'],['battle','event'],['elite','shop'],['rest','rest'],['boss']];
export const NODE_NAMES={battle:'戦闘',elite:'強敵',rest:'休息',shop:'交換所',event:'探索',boss:'ボス'};
const rewardPool=Object.keys(CARDS).filter(x=>!['strike','guard'].includes(x));
const clone=x=>structuredClone(x);
function rnd(s){s.rng=(Math.imul(s.rng,1664525)+1013904223)>>>0;return s.rng/4294967296;}
function shuffle(s,arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function log(s,t){s.log=[...s.log,t].slice(-5);}
function heal(s,n){s.hp=Math.min(s.maxHp,s.hp+n);}
function add(s,id){s.deck.push({uid:s.nextId++,id,plus:false});}
export function newRun(seed=Date.now()){
 const s={version:1,seed:seed>>>0,rng:seed>>>0,nextId:0,hp:72,maxHp:72,gold:60,floor:0,phase:'map',deck:[],relics:['lantern'],history:[],log:['観測灯を携えて、尖塔へ。'],battle:null,reward:[],stock:[],removed:false};
 for(let i=0;i<5;i++)add(s,'strike');for(let i=0;i<4;i++)add(s,'guard');add(s,'probe');return s;
}
export function cardValues(card){const d=CARDS[card.id],v={...d};if(card.plus)for(const k of ['damage','block','heal','draw','energy','armor','strength'])v[k]=(v[k]||0)+(v['up'+k[0].toUpperCase()+k.slice(1)]||0);return v;}
export function describe(card){const d=cardValues(card),parts=[];if(d.damage)parts.push(d.damage+(d.perBlock?'＋ブロック分':'')+'ダメージ'+(d.hits?' × '+d.hits:''));if(d.block)parts.push(d.block+'ブロック');if(d.draw)parts.push(d.draw+'枚引く');if(d.heal)parts.push('HPを'+d.heal+'回復');if(d.weak)parts.push('弱体'+d.weak+'ターン');if(d.strength)parts.push('強化＋'+d.strength);if(d.armor)parts.push('毎ターン'+d.armor+'ブロック');if(d.energy)parts.push('エナジー＋'+d.energy);if(d.self)parts.push('HPを'+d.self+'失う');if(d.exhaust)parts.push('戦闘中除外');return parts.join('。')+'。';}
function draw(s,n){const b=s.battle;for(let i=0;i<n;i++){if(!b.draw.length){b.draw=shuffle(s,b.discard);b.discard=[];}if(!b.draw.length||b.hand.length>=10)break;b.hand.push(b.draw.pop());}}
function startBattle(s,id){
 const e=ENEMIES[id];s.phase='battle';s.battle={enemy:id,hp:e.hp,maxHp:e.hp,block:0,strength:0,weak:0,turn:1,playerBlock:s.relics.includes('shell')?8:0,playerStrength:s.relics.includes('ember')?1:0,armor:0,energy:3,hand:[],draw:shuffle(s,s.deck.map(c=>c.uid)),discard:[],exhaust:[]};draw(s,s.relics.includes('lantern')?6:5);log(s,e.name+'が現れた。');
}
export function intent(s){if(!s.battle)return null;const b=s.battle,[type,value]=ENEMIES[b.enemy].pattern[(b.turn-1)%ENEMIES[b.enemy].pattern.length];return {type,value:type==='attack'?Math.floor((value+b.strength)*(b.weak>0?.75:1)):value};}
function win(s){const elite=s.battle.enemy==='elite',boss=s.battle.enemy==='boss';s.gold+=elite?40:22;if(s.relics.includes('spring'))heal(s,4);if(boss){s.phase='won';log(s,'連鎖障害を断ち切った。登頂成功！');return;}s.reward=shuffle(s,rewardPool).slice(0,3);if(elite){const relic=shuffle(s,Object.keys(RELICS).filter(x=>!s.relics.includes(x)))[0];if(relic){s.relics.push(relic);log(s,'遺物「'+RELICS[relic].name+'」を獲得。');}else{s.gold+=30;log(s,'遺物収集済み：30コインを獲得。');}}s.phase='reward';log(s,'勝利。カードを1枚選ぶか、見送れます。');}
function complete(s){s.phase='map';s.battle=null;s.reward=[];s.stock=[];}
export function act(state,action){
 const s=clone(state),a=action,b=s.battle;
 if(a.type==='node'&&s.phase==='map'&&Number.isInteger(a.lane)&&ROUTES[s.floor]?.[a.lane]){
  const type=ROUTES[s.floor][a.lane];s.history.push({floor:s.floor,lane:a.lane,type});s.floor++;log(s,s.floor+'階：'+NODE_NAMES[type]);
  if(['battle','elite','boss'].includes(type)){const id=type==='battle'?['noise','surge','leak','timeout','storm','deadlock'][Math.floor(rnd(s)*6)]:type;startBattle(s,id);}
  else{s.phase=type;s.removed=false;if(type==='shop')s.stock=shuffle(s,rewardPool).slice(0,3);}return s;
 }
 if(a.type==='play'&&s.phase==='battle'){
  const index=b.hand.indexOf(a.uid),card=s.deck.find(c=>c.uid===a.uid);if(index<0||!card)return state;const d=cardValues(card);if(d.cost>b.energy)return state;
  b.hand.splice(index,1);b.energy-=d.cost;(d.exhaust?b.exhaust:b.discard).push(card.uid);
  b.playerBlock+=d.block||0;b.playerStrength+=d.strength||0;b.armor+=d.armor||0;b.energy+=d.energy||0;b.weak+=d.weak||0;
  if(d.heal)heal(s,d.heal);if(d.self)s.hp=Math.max(0,s.hp-d.self);
  for(let hit=0;hit<(d.damage?(d.hits||1):0);hit++){const amount=d.damage+b.playerStrength+(d.perBlock?b.playerBlock:0),absorbed=Math.min(b.block,amount);b.block-=absorbed;b.hp=Math.max(0,b.hp-amount+absorbed);}
  log(s,d.name+(card.plus?'＋':'')+'を使用。');
  if(s.hp===0){s.phase='lost';log(s,'力尽きた。デッキを見直して次の冒険へ。');}
  else if(b.hp===0)win(s);else if(d.draw)draw(s,d.draw);return s;
 }
 if(a.type==='end'&&s.phase==='battle'){
  const i=intent(s);b.discard.push(...b.hand);b.hand=[];
  // Enemy block lasts through the player's turn, then expires before its next action.
  b.block=0;
  if(i.type==='attack'){const damage=Math.max(0,i.value-b.playerBlock);s.hp=Math.max(0,s.hp-damage);log(s,'敵の攻撃'+i.value+'。HPダメージ '+damage+'。');}
  if(i.type==='guard'){b.block=i.value;log(s,'敵は'+i.value+'ブロック。');}
  if(i.type==='buff'){b.strength+=i.value;log(s,'敵の強化＋'+i.value+'。');}
  if(b.weak>0)b.weak--;if(s.hp===0){s.phase='lost';log(s,'冒険はここまで。');return s;}
  b.turn++;b.energy=3;b.playerBlock=b.armor;draw(s,5);return s;
 }
 if(a.type==='reward'&&s.phase==='reward'&&(a.id===null||s.reward.includes(a.id))){if(a.id){add(s,a.id);log(s,CARDS[a.id].name+'をデッキに追加。');}complete(s);return s;}
 if(s.phase==='rest'){
  if(a.type==='heal'){heal(s,22);log(s,'休息でHPを22回復。');complete(s);return s;}
  if(a.type==='upgrade'){const c=s.deck.find(c=>c.uid===a.uid&&!c.plus);if(!c)return state;c.plus=true;log(s,CARDS[c.id].name+'を強化。');complete(s);return s;}
 }
 if(s.phase==='event'){
  if(a.type==='event'&&a.choice==='risk'&&s.hp>8){s.hp-=8;s.gold+=42;log(s,'廃棄サーバーを探索。HP−8、42コイン獲得。');complete(s);return s;}
  if(a.type==='event'&&a.choice==='safe'){heal(s,7);log(s,'安全な経路でHPを7回復。');complete(s);return s;}
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
 if(!s||s.version!==1||!num(s.seed,4294967295)||!num(s.rng,4294967295)||!num(s.floor,8)||!num(s.hp,72)||s.maxHp!==72||!num(s.gold)||!num(s.nextId,1000)||!['map','battle','reward','rest','event','shop','won','lost'].includes(s.phase))throw Error('保存データの形式が不正です。');
 if(!Array.isArray(s.deck)||s.deck.length<5||s.deck.length>100||!s.deck.every(c=>num(c.uid,999)&&c.uid<s.nextId&&Object.hasOwn(CARDS,c.id)&&typeof c.plus==='boolean')||new Set(s.deck.map(c=>c.uid)).size!==s.deck.length)throw Error('デッキが不正です。');
 for(const [name,allowed,max] of [['relics',Object.keys(RELICS),4],['reward',rewardPool,3],['stock',rewardPool,3]])if(!Array.isArray(s[name])||s[name].length>max||!s[name].every(x=>allowed.includes(x))||new Set(s[name]).size!==s[name].length)throw Error('報酬が不正です。');
 if(!Array.isArray(s.history)||s.history.length!==s.floor||!s.history.every((h,i)=>h.floor===i&&num(h.lane,1)&&ROUTES[i][h.lane]===h.type)||!Array.isArray(s.log)||s.log.length>5||!s.log.every(t=>typeof t==='string'&&t.length<200)||typeof s.removed!=='boolean')throw Error('進行記録が不正です。');
 if(s.phase==='map'&&s.floor>=8)throw Error('ルートが不正です。');
 if(s.phase==='lost'&&s.hp!==0||s.phase!=='lost'&&s.hp===0)throw Error('HPが不正です。');
 const b=s.battle;
 if(['battle','reward','won','lost'].includes(s.phase)){
  if(!b||!Object.hasOwn(ENEMIES,b.enemy)||b.maxHp!==ENEMIES[b.enemy].hp||!num(b.hp,b.maxHp))throw Error('敵が不正です。');
  for(const k of ['block','strength','weak','turn','playerBlock','playerStrength','armor','energy'])if(!num(b[k]))throw Error('戦闘の数値が不正です。');
  if(b.turn<1)throw Error('ターンが不正です。');
  const piles=['hand','draw','discard','exhaust'];if(!piles.every(p=>Array.isArray(b[p])))throw Error('山札が不正です。');
  const ids=piles.flatMap(p=>b[p]);if(ids.length!==s.deck.length||new Set(ids).size!==ids.length||!ids.every(id=>s.deck.some(c=>c.uid===id))||b.hand.length>10)throw Error('カードの所在が不正です。');
  if(s.phase==='battle'&&b.hp===0||['reward','won'].includes(s.phase)&&b.hp!==0)throw Error('敵HPが不正です。');
  if(s.phase==='won'&&(b.enemy!=='boss'||s.floor!==8))throw Error('クリア状態が不正です。');
 } else if(b!==null)throw Error('戦闘外の記録が不正です。');
 return s;
}
