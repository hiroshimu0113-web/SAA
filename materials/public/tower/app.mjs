import {cycleForRun} from './quiz-cycle.mjs';
import {mountFanHand} from './fan-hand.mjs';
import {openStudy,recordRoomAnswers} from './study-ui.mjs';
import {icon} from './icons.mjs';
import {CARD_TYPES,cardIcon} from './card-icons.mjs';
import {comboHints} from './combo-hints.mjs';
import {openOptions} from './options-ui.mjs';
import {presentTurns} from './turn-presentation.mjs';
import {resolveAction} from './turn-flow.mjs';
import {heroFigure} from './hero-visuals.mjs';
import bundledCatalog from './learning-catalog.json';
import {chooseCatalog,fetchCatalog,activateCatalog,STARTERS} from './catalog.mjs';
import {DEBUFFS,debuffLabel,delayPaused,delayRemaining} from './debuffs.mjs';
import {FLAVOR} from './flavor.mjs';
import {COMBOS} from './combos.mjs';
import {showComboEffects} from './combo-ui.mjs';
import {QUIZZES,QUIZ_RULES,quizScore} from './quiz.mjs';
import {lifetime,inspectPlay,synergyHints} from './strategy.mjs';
import {combatEffects,showCombatEffects} from './effects.mjs';

import {routesFor,shopPrice,defenseBonus,HEROES,CARDS,ENEMIES,enemyDebuffTypes,RELICS,NODE_NAMES,newRun,intent,describe,parseRun,cardValues,upgradeChanges} from './engine.mjs';
const KEY='saa-tower-run-v1',root=document.querySelector('#game');
let turnBusy=false,presentationView=null,shopPanel='';
let handHints=new Map();
let state=null,loadError='',notice='',saveFailed=false,selectedUid=null,upgradeNotice=null;
let nextCatalog=chooseCatalog(bundledCatalog,{getItem:k=>localStorage.getItem(k)}),updating=false;
activateCatalog(nextCatalog);
let swipe=null,suppressUntil=0,holdTimer=null;
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{const raw=localStorage.getItem(KEY);if(raw)state=parseRun(raw);}catch(e){loadError='保存データを読み込めませんでした。元データは上書きしていません。';}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));saveFailed=false;}catch{saveFailed=true;notice='保存できません。ページを閉じる前に「バックアップ」を保存してください。';}}
const ACTION_ICONS={new:'restart',end:'next',heal:'heal',upgrade:'upgrade','rest-remove':'remove',remove:'remove','buy-relic':'shop',leave:'next','quiz-next':'next','quiz-leave':'next',export:'download',offline:'offline','update-learning':'book','dismiss-upgrade':'close','cancel-card':'close','close-status':'close','demo-fx':'result'};
const btn=(text,action,extra='',disabled=false)=>'<button data-action="'+action+'" '+extra+(disabled?' disabled':'')+'>'+(ACTION_ICONS[action]?icon(ACTION_ICONS[action]):'')+text+'</button>';
const title=c=>esc(CARDS[c.id].name)+(c.plus?'＋':'');
function card(c,action,disabled=false){const hint=action==='play'?handHints.get(c.uid):null,d=cardValues(c),plan=action==='play'?inspectPlay(state,c):null,short=action==='play'?(plan?.brief||'エナジー不足'):'',tips=['reward','buy'].includes(action)?synergyHints(state,c):[];return '<button class="card '+d.kind+(hint?(hint.level===2?' combo-ready':' combo-progress'):'')+(action==='play'&&!plan?' unaffordable':'')+'" data-action="'+action+'" data-uid="'+c.uid+'" data-id="'+c.id+'" '+(disabled?'aria-disabled="true"':'')+'><span class="cost">'+d.cost+'</span><span class="kind">'+CARD_TYPES[d.kind].name+'</span><strong class="card-title icon-label">'+cardIcon(d.kind)+'<span>'+title(c)+'</span></strong><span class="effect">'+describe(c)+'</span>'+(hint?'<span class="combo-badge">'+(hint.level===2?'役が揃う':'役 1/3')+'</span>':'')+(short?'<span class="card-summary">'+esc(short)+'</span>':'')+(action==='upgrade'?'<span class="upgrade-preview">強化すると<br>'+upgradeChanges(c).map(esc).join('<br>')+'</span>':'')+(tips.length?'<span class="synergy-note">組合せ例：'+esc(tips[0])+'</span>':'')+'</button>';}
function vocabularyDetail(group,id){
 const entry=(state?state.learningCatalog:nextCatalog)?.vocabulary?.[group]?.[id];
 return entry?'<details class="vocabulary-note"><summary>教材の説明・補足</summary><p>'+esc(entry.note)+'</p><p>'+esc(entry.limit)+'</p><a href="'+entry.source+'" target="_blank" rel="noopener">AWS公式資料</a></details>':'';
}
function vocabularyGuide(){
 const vocabulary=(state?state.learningCatalog:nextCatalog)?.vocabulary;
 if(!vocabulary)return '';
 return '<details class="learning-vocabulary"><summary>敵・レリック・役・一時カードの教材用語を見る</summary>'+Object.entries(vocabulary).map(([group,entries])=>'<section><h3>'+({enemies:'敵（復習する課題）',relics:'レリック',combos:'役',junk:'戦闘限定カード'}[group])+'</h3>'+Object.entries(entries).map(([id,entry])=>'<div><strong>'+esc(entry.name)+'</strong>'+vocabularyDetail(group,id)+'</div>').join('')+'</section>').join('')+'</details>';
}
function relics(){return (state.hero?'<small class="hero-profile">'+HEROES[state.hero].name+'</small>':'')+'<details class="relic-details" open><summary>'+icon('choice')+' 遺物 '+state.relics.length+'個 <small>この冒険中有効</small></summary><ul>'+state.relics.map(r=>'<li><strong>'+icon(r)+RELICS[r].name+'</strong>：'+RELICS[r].text+vocabularyDetail('relics',r)+'</li>').join('')+'</ul></details>';}
let heroPopupTimer;
function announceHero(){clearTimeout(heroPopupTimer);document.querySelector('.hero-arrival')?.remove();const h=HEROES[state.hero],popup=document.createElement('aside');popup.className='hero-arrival';popup.setAttribute('role','status');popup.innerHTML=heroFigure(state.hero)+'<small>今回の主人公</small><strong>'+h.name+'</strong><p>'+RELICS[h.relic].name+'<br>'+RELICS[h.relic].text+'</p>';document.body.append(popup);heroPopupTimer=setTimeout(()=>popup.remove(),3000);}


function map(readOnly=false){
 const current=readOnly&&state.phase!=='map'?Math.max(0,state.floor-1):state.floor;
 return '<p class="eyebrow">THE ASCENT / '+(current+1)+'階へ</p><h2>'+icon('map')+(readOnly?'マップ（閲覧のみ）':'次の道を選ぶ')+'</h2><p class="muted">下の1階から上の8階へ登ります。各階で1つ選択。マスの種類・数・配置は冒険ごとに変わります。8階は必ずボス戦です。</p><div class="route-map">'+routesFor(state).map((nodes,i)=>'<section data-floor="'+i+'" class="route-row '+(i===current?'current':i<current?'visited':'future')+'"><span class="floor-label">'+(i+1)+'F</span>'+nodes.map((type,lane)=>{const taken=state.history.some(h=>h.floor===i&&h.lane===lane);return (readOnly?'<div ': '<button data-action="node" data-lane="'+lane+'" '+(i!==state.floor?'disabled':'')+' ')+' class="node '+type+(taken?' taken':'')+'"><strong class="icon-label node-name">'+icon(type)+'<span>'+NODE_NAMES[type]+'</span></strong><small>'+(taken?'通過':({battle:'カード＋22コイン',elite:'遺物＋40コイン',rest:'回復 / 強化',shop:'購入 / 削除',event:'2問クイズ / 報酬かダメージ',boss:'3種のボスから1体'}[type]))+'</small>'+(readOnly?'</div>':'</button>');}).join('')+'</section>').reverse().join('')+'</div>';
}
function intentText(i){if(i.type==='double')return '2回行動：'+i.actions.map(intentText).join(' → ');return ({attack:'⚔ 攻撃 '+i.value,guard:'◇ 防御 '+i.value,buff:'✧ 強化 ＋'+i.value,wait:'遅延：休止 '+delayRemaining(state.battle.enemyDebuffs.delay)+'ターン',junk:(i.damage!==undefined?'⚔ 攻撃 '+i.damage+' ＋ ':'')+CARDS.junk.name+' '+i.value+'枚を山札へ',debuff:i.status?(i.damage!==undefined?'⚔ 攻撃 '+i.damage+' ＋ ':'')+'⚠ '+DEBUFFS[i.status].name+(i.status==='delay'?'': ' '+i.value):''})[i.type];}
function intentMarkup(i){return esc(intentText(i)).replace(/⚔/g,icon('battle')).replace(/◇/g,icon('shield')).replace(/✧/g,icon('power')).replace(/⚠/g,icon(i.status||'misconfig'));}
function statusBadges(d,side){const active=Object.entries(d).filter(([,n])=>n>0);return active.length?'<div class="status-badges" aria-label="'+side+'のデバフ">'+active.map(([id,n])=>'<span role="img" class="status-badge status-'+id+'" data-debuff="'+id+'" title="'+debuffLabel(id,n)+'" aria-label="'+debuffLabel(id,n)+'"><span aria-hidden="true">'+icon(id)+'</span><b aria-hidden="true">'+(id==='delay'?(n===2?'×2':delayRemaining(n)):n)+'</b></span>').join('')+'</div>':'';}
function endLabel(){const b=state.battle;return delayPaused(b.playerDebuffs.delay)?'休止ターンを終了':b.playerDebuffs.delay===2&&b.playerActions===2?'後半の行動へ':'ターン終了';}
function battle(){
 const b=state.battle,e=ENEMIES[b.enemy],i=intent(state);handHints=turnBusy?new Map():comboHints(state);
 return '<div class="battle-meta">'+btn(endLabel(),'end','class="end-turn"')+'<span>TURN '+b.turn+'</span><span class="intent '+(i.type==='double'?'double-intent':'')+'">'+intentMarkup(i)+'</span></div>'+(b.playerDebuffs.delay?'<p class="delay-notice">'+(delayPaused(b.playerDebuffs.delay)?'遅延：あと'+delayRemaining(b.playerDebuffs.delay)+'ターン休止（カードを使えません）。その後に2回行動。':b.playerActions===2?'2回行動・前半。後半は敵の行動なしで3エナジー・手札5枚。':'2回行動・後半。終了すると敵が行動します。')+'</p>':'')+'<section class="arena"><div class="combat-column player-column"><div class="avatar operator combatant '+(state.hero?'hero-'+state.hero:'hero-legacy')+'" data-status="player" role="button" tabindex="0" aria-label="'+(state.hero?HEROES[state.hero].name:'自分')+'の状態（長押しで確認）">'+heroFigure(state.hero)+(state.hero?'<small class="hero-tag">'+HEROES[state.hero].name+'</small>':'')+'</div>'+statusBadges(b.playerDebuffs,'自分')+'</div><div class="combat-column enemy-column"><div class="enemy combatant" data-status="enemy" role="button" tabindex="0" aria-label="敵の状態（長押しで確認）"><div class="enemy-glyph '+b.enemy+'" aria-hidden="true">'+icon(b.enemy)+'</div><h2>'+e.name+'</h2><div class="health"><span style="width:'+b.hp/b.maxHp*100+'%"></span></div><p>'+b.hp+' / '+b.maxHp+' HP　<span class="shield">'+icon('shield')+' '+b.block+'</span></p><small>長押しで状態</small></div>'+statusBadges(b.enemyDebuffs,'敵')+'</div></section><dialog class="status-dialog" aria-labelledby="status-title"></dialog>'+'<div class="hand">'+(b.energy===0?btn('<span aria-hidden="true">↻</span><strong>'+endLabel()+'</strong><small>次の手札へ</small>','end','class="hand-end"'):'')+b.hand.map(uid=>{const c=state.deck.find(x=>x.uid===uid);return card(c,'play');}).join('')+'</div>'+(!b.hand.length?'<p>手札がありません。ターンを終了してください。</p>':'')+'<div id="card-detail-slot">'+previewCard()+'</div>'+ '<div class="pile-row"><span>山札 '+b.draw.length+'</span><span>捨て札 '+b.discard.length+'</span><span>除外 '+b.exhaust.length+'</span><span>手札 '+b.hand.length+' / 10</span></div>';
}

function comboInfo(c){return Object.entries(COMBOS).filter(([,r])=>r.cards.includes(c.id)).map(([id,r])=>{const b=state?.phase==='battle'?state.battle:null,done=b?.comboDone?.includes(id),ready=b&&handHints.get(c.uid)?.roles.includes(id)&&handHints.get(c.uid)?.level===2;return '<section class="combo-info"><strong>'+icon(id)+r.name+'：'+r.label+'</strong><p>'+r.cards.map((x,i)=>cardIcon(CARDS[x].kind)+' '+CARDS[x].name+(b?.comboPlayed?.includes(x)?' ✓':'')).join(' ＋ ')+'</p>'+(done?'<p>このターンは成立済み</p>':ready?'<p>このカードを使うと成立（エナジーが必要）</p>':'')+'<p>'+r.lesson+'</p><a href="'+r.source+'" target="_blank" rel="noopener">AWS公式資料</a></section>';}).join('');}
function comboGuide(){return '<details class="combo-guide"><summary>'+icon('combo')+'役の組み合わせ（3種類）</summary><p>同じターンに指定の3種類を使用。順番は自由、各役は1ターン1回。同じ種類を重ねても代用できません。追加攻撃3は強化が乗らず、敵のブロックで防がれます。</p><p>カードは仕組みの要素を表す比喩です。実際のAWS構成の必要十分条件ではなく、数値はゲーム上の報酬です。</p>'+Object.entries(COMBOS).map(([id,r])=>'<section><strong>'+icon(id)+r.name+'：'+r.label+'</strong>'+collectionCards(r.cards.map((id,uid)=>({id,uid,plus:false})),false)+'<small>'+(state.battle?.comboDone?.includes(id)?'成立済み':'今ターン '+r.cards.filter(x=>state.battle?.comboPlayed?.includes(x)).length+' / 3種類')+'</small><p>'+r.lesson+'</p><a href="'+r.source+'" target="_blank" rel="noopener">AWS公式資料</a></section>').join('')+'</details>';}
function optionsButton(){return btn(icon('menu'),'options','class="header-options" aria-label="オプション"');}
function collectionCards(cards,showHint=true){return (showHint?'<p class="collection-help">長押しで詳細（キーボードではEnter）</p>':'')+'<div class="options-cards">'+cards.map((c,i)=>'<article>'+card(c,'inspect').replace('data-action="inspect"','data-inspect="'+i+'" aria-label="'+title(c)+'の詳細"')+'<template>'+card(c,'inspect').replace('<button ','<div ').replace('</button>','</div>')+'<p>'+esc(lifetime(c))+'</p>'+flavorDetail(c)+comboInfo(c)+'</template></article>').join('')+'</div>';}
function restartRun(){const cycle=cycleForRun(state,Object.keys(QUIZZES));state=newRun(crypto.getRandomValues(new Uint32Array(1))[0],nextCatalog,cycle);selectedUid=null;upgradeNotice=null;loadError='';notice='';save();delete root.dataset.mapFloor;render();announceHero();return true;}
function showOptions(){
 openOptions(root,{
  'デッキ':()=>'<p>持ち札 '+state.deck.length+'枚（重複・強化・戦闘限定カードを含む）</p>'+collectionCards(state.deck),
  '所持レリック':()=>relics(),
  'マップ':()=>map(true),
  '役一覧':()=>comboGuide().replace('<details class="combo-guide">','<details class="combo-guide" open>')+'<p>このターンに1種類使用すると弱く、2種類使用すると強く光ります。今の手札とエナジーで、このカードから役を完成できるときだけ光ります。ドローやエナジー回復後に再判定します。</p>',
  'コレクション':()=>'<p>今回の冒険の教材カード '+Object.keys(CARDS).length+'種類（戦闘限定カードを含む）</p>'+collectionCards(Object.entries(CARDS).map(([id],uid)=>({id,uid,plus:false})))
 },{'学習室':()=>{setTimeout(()=>openStudy(root),0);return true;},'はじめから':restartRun},state.hero?HEROES[state.hero].name:'冒険者');
}

function previewCard(){
 if(selectedUid===null||state?.phase!=='battle')return '';
 const c=state.deck.find(c=>c.uid===selectedUid&&state.battle.hand.includes(c.uid));if(!c)return '';
 const d=cardValues(c),enough=d.cost<=state.battle.energy,plan=inspectPlay(state,c),tips=synergyHints(state,c);
 return '<section class="card-preview" aria-label="カードの詳細">'+card(c,'inspect').replace('<button','<div').replace('</button>','</div>').replace('data-action="inspect"','')+'<div class="card-plan"><p class="lifetime">'+lifetime(c)+'</p>'+(plan?'<strong>今使った場合</strong><ul>'+plan.lines.map(line=>'<li>'+esc(line)+'</li>').join('')+'</ul>':'<p>今は使用できません（エナジー不足または遅延）。</p>')+(tips.length?'<strong>このデッキとの組合せ</strong><ul>'+tips.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'')+((d.debuff)?'<p class="debuff-rule"><strong>'+DEBUFFS[d.debuff.id].name+'</strong>：'+DEBUFFS[d.debuff.id].rule+'</p>':'')+flavorDetail(c)+comboInfo(c)+'</div><p>詳細を表示しています。ここでは使用しません。<br><small>必要 '+d.cost+' / 残り '+state.battle.energy+' エナジー'+(enough?'':'（不足）')+'</small></p>'+btn('閉じる','cancel-card')+'</section>';
}

function flavorDetail(c){const f=FLAVOR[c.id];if(!f)return '';return '<section class="flavor-detail"><h3>用語の説明・補足</h3><p>'+esc(f.note)+'</p><details><summary>比喩と実際の違い</summary><p>'+esc(f.limit)+'</p></details>'+(f.source?'<a href="'+f.source+'" target="_blank" rel="noopener">AWS公式資料</a>':'')+'</section>';}
function upgradeResult(){return upgradeNotice?'<section class="upgrade-result" role="status"><h2>'+esc(upgradeNotice.name)+' を強化しました</h2><ul>'+upgradeNotice.changes.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><p>強化後：'+esc(upgradeNotice.after)+'</p>'+btn('閉じる','dismiss-upgrade')+'</section>':'';}
function reward(){return '<p class="eyebrow">VICTORY</p><h2>'+icon('cards')+'デッキの次の一手</h2><p>候補'+state.reward.length+'枚から、あと'+(state.rewardPicks??1)+'枚まで獲得できます。不要なら見送れます。</p><p class="collection-help">タップで獲得、長押しで詳細を確認できます。</p><div class="cards-grid">'+state.reward.map((id,n)=>card({id,uid:n,plus:false},'reward')).join('')+'</div>'+btn('残りのカードを見送る','skip','class="secondary"');}
function rest(){return '<p class="eyebrow">A QUIET MOMENT</p><h2>'+icon('rest')+'静かな中継所</h2><p>選べる行動は1回だけです。</p>'+btn('休息する：HPを22回復','heal','class="primary"')+'<h3>'+icon('upgrade')+'または、カードを強化</h3><p class="collection-help">タップで強化、長押しで効果と強化内容を確認できます。</p><div class="cards-grid compact">'+state.deck.filter(c=>!c.plus).map(c=>card(c,'upgrade')).join('')+'</div><p class="muted">選んだカードは次の戦闘以降も強化済みになります。</p>'+(state.relics.includes('prune')?'<details class="rest-remove"><summary>または、カードを削除（無料）</summary><p>選んだ1枚を削除して休憩所を終了します。デッキは最低5枚です。</p><div class="cards-grid remove-list">'+state.deck.map(c=>card(c,'rest-remove',state.deck.length<=5)).join('')+'</div></details>':'');}
function shop(){
 const price=shopPrice(state,'card'),remove=shopPrice(state,'remove'),relic=state.shopRelic,canRemove=!state.removed&&state.gold>=remove&&state.deck.length>5;
 const slots=Array.from({length:3},(_,n)=>state.stock[n]?'<div class="shop-slot">'+card({id:state.stock[n],uid:n,plus:false},'buy',state.gold<price)+'<small>'+price+' C</small></div>':'<div class="shop-slot shop-empty">売り切れ</div>').join('');
 return '<p class="eyebrow">THE EXCHANGE</p><h2>'+icon('shop')+'旅の交換所</h2><p>カード1枚'+price+'コイン'+(price===0?'（この冒険の初回購入は無料）':'')+'。購入後は売り切れます。</p><p class="collection-help">カードはタップで購入、長押しで詳細。アイコンはタップで開きます。</p><div class="shop-shelf">'+slots+'<div class="shop-slot">'+btn(icon(relic||'choice')+'<span>レリック</span><small>'+(relic?shopPrice(state,'relic')+' C':'売り切れ')+'</small>','shop-relic-panel','class="shop-icon" aria-expanded="'+(shopPanel==='relic')+'"',!relic)+'</div><div class="shop-slot">'+btn(icon('remove')+'<span>削除</span><small>'+(state.removed?'利用済み':remove+' C')+'</small>','shop-remove-panel','class="shop-icon" aria-expanded="'+(shopPanel==='remove')+'"',!canRemove)+'</div></div>'+(shopPanel==='relic'?'<section class="shop-relic"><h3>レリック（1種類限定）</h3>'+(relic?'<strong>'+icon(relic)+RELICS[relic].name+'</strong><p>'+RELICS[relic].text+'</p>'+btn('レリックを購入：'+shopPrice(state,'relic')+'コイン','buy-relic','data-id="'+relic+'"',state.gold<shopPrice(state,'relic')):'<p>売り切れ・販売なし</p>')+'</section>':'')+(shopPanel==='remove'?'<section class="shop-removal"><h3>削除するカードを選択</h3><p>タップした1枚を'+remove+'コインで削除。この訪問で1回だけ、最低5枚残します。長押しでは削除せず詳細を確認できます。</p><div class="cards-grid remove-list">'+state.deck.map(c=>card(c,'remove',!canRemove)).join('')+'</div></section>':'')+btn('先へ進む','leave','class="primary"');
}
function quizResult(){const r=state.quiz?.result;if(!r)return '';return '<section class="quiz-result"><h2>'+r.correct+' / 2問 正解</h2><p>'+(r.relic?icon(r.relic)+' レリック「'+RELICS[r.relic].name+'」を獲得！':r.gold?icon('coin')+' '+r.gold+'コイン獲得':r.correct===2?'全レリック所持済みのため、追加報酬はありません。':'報酬なし')+'</p>'+(r.damage?'<p>誤答によるHP減少：合計'+r.damage+'（適用済み）</p>':'')+(r.interrupted?'<p>HPが0になったため、クイズを中断しました。</p>':'')+(r.relic?'<p>'+RELICS[r.relic].text+'</p>':'')+'<p>現在 HP '+state.hp+' / '+state.maxHp+' · コイン '+state.gold+'</p></section>';}
function fatalQuizReview(){const q=state.quiz;if(!q?.result?.interrupted)return '';const item=QUIZZES[q.ids[q.answers.length-1]];return '<section class="quiz-explanation"><h3>最後の問題の復習</h3><p>'+esc(item.prompt)+'</p><p>正解：'+esc(item.options[item.answer])+'</p><ul>'+item.reasons.map(reason=>'<li>'+esc(reason)+'</li>').join('')+'</ul></section>';}
function event(){
 const q=state.quiz;
 if(q.result)return '<p class="eyebrow">QUIZ RESULT</p>'+quizResult()+btn('先へ進む','quiz-leave','class="primary"');
 const id=q.ids[q.step],item=QUIZZES[id],answered=q.answers.length>q.step,choice=q.answers[q.step],order=q.orders?.[q.step]||item.options.map((_,i)=>i);
 return '<p class="eyebrow">QUESTION ROOM</p><h2>'+icon('event')+'知識の間：'+(q.step+1)+' / 2問</h2><p class="quiz-cycle-progress">出題 '+cycleForRun(state,Object.keys(QUIZZES)).round+'巡目・'+cycleForRun(state,Object.keys(QUIZZES)).seen.length+' / '+Object.keys(QUIZZES).length+'問</p><p>'+esc(item.level==='design'?'設計演習':'基礎確認')+'</p><p class="quiz-prompt">'+esc(item.prompt)+'</p>'+(answered?'<section class="quiz-explanation" role="status"><h3>'+(choice===item.answer?'正解！':'不正解'+(q.rulesVersion===2?'：HP −'+q.penalty+'（適用済み）':''))+'</h3><p>あなたの回答：'+esc(item.options[choice])+'</p><p>正解：'+esc(item.options[item.answer])+'</p><ul>'+order.map((i,position)=>'<li><strong>'+String.fromCharCode(65+position)+'. '+esc(item.options[i])+'</strong>：'+esc(item.reasons[i])+'</li>').join('')+'</ul><a href="'+item.source+'" target="_blank" rel="noopener">AWS公式資料（オンライン）</a></section>'+btn(q.step===0?'次の問題へ':'結果を受け取る','quiz-next','data-question="'+id+'" class="primary"'):'<div class="quiz-options">'+order.map((i,position)=>btn(String.fromCharCode(65+position)+'. '+esc(item.options[i]),'quiz-answer','data-question="'+id+'" data-choice="'+i+'" class="quiz-option '+(answered&&i===item.answer?'correct':answered&&i===choice?'incorrect':'')+'"',answered)).join('')+'</div>'+'<p class="muted">回答をタップすると確定します。途中の回答も自動保存します。</p>')+'<details class="quiz-rules"><summary>？マスのルール・報酬</summary><p>2問正解：未所持レリック<br>1問正解：30コイン<br>'+(q.rulesVersion===2?'全レリック所持済みなら追加報酬なし。誤答1回につき最大HPの10％（'+q.penalty+'ダメージ、端数切り上げ）を即時適用。':'この保存済みクイズは旧ルール：0問正解で8ダメージ、全所持時は60コイン。')+'<br>HPが0になると冒険終了。</p><p>未出題からランダムに出題し、全問が出たら次の一巡へ進みます。「はじめから」でも出題履歴を引き継ぎます。</p></details>';
}
function journeyStats(){return '<div class="journey-stats"><span>'+icon('coin')+' '+state.gold+'</span><span>'+state.floor+' / 8 F</span></div>';}
function battleHud(){return state?.phase==='battle'?'<header class="battle-hud" aria-label="戦闘ステータス">'+optionsButton()+'<div class="combat-resources"><strong class="hud-hp '+(state.hp<=state.maxHp*.25?'low-hp':'')+'">'+icon('heart')+' HP '+state.hp+' / '+state.maxHp+'</strong><div><span aria-label="防御">'+icon('shield')+' '+state.battle.playerBlock+'</span><span aria-label="エナジー">'+icon('energy')+' '+state.battle.energy+'</span></div></div>'+journeyStats()+'</header>':'';}
function runHeader(){return state.phase==='battle'?'':'<header class="run-header">'+optionsButton()+'<div class="header-title"><small>CLOUD SPIRE</small><h1>クラウドの尖塔</h1></div><div class="resources"><strong>'+icon('heart')+' '+state.hp+' / '+state.maxHp+'</strong>'+journeyStats()+'</div></header>';}


function ending(){return '<section class="ending"><p class="eyebrow">'+(state.phase==='won'?'SUMMIT REACHED':'ANOTHER PATH AWAITS')+'</p><div class="event-art">'+icon(state.phase==='won'?'boss':'result')+'</div><h2>'+(state.phase==='won'?'尖塔を越えて':'冒険の記録')+'</h2>'+quizResult()+fatalQuizReview()+'<p>'+state.floor+'階まで到達 · デッキ'+state.deck.length+'枚 · 遺物'+state.relics.length+'個</p><p>'+(state.phase==='won'?ENEMIES[state.battle.enemy].name+'を退けました。別のルート、別のデッキで次の冒険へ。':'この冒険のデッキはここまで。次は敵の予告を見ながら、攻撃と防御の配分を変えてみよう。')+'</p>'+btn('新しい冒険を始める','new','class="primary"')+'</section>';}
function help(){return '<details class="help"><summary>遊び方とカードのルール</summary><ol><li>冒険ごとに生成される8階のルートで各階1つの道を選び、最後のボスを倒します。再読込では配置は変わりません。</li><li>戦闘は毎ターン3エナジー、手札5枚。主人公は新しい冒険ごとに3種類からランダムで決まり、初期レリックが異なります。SEは戦闘開始時に追加2枚、SREは戦闘勝利時にHPを6回復、クラウドアーキテクトは戦闘開始時にエナジー＋1です。左右スワイプで手札を送り、手札を1タップすると、左上の数字のエナジーを払って使用します。約0.45秒長押しすると詳細を表示します。指を離しても使用せず、「閉じる」で戻れます。キーボードではShift＋F10で詳細を表示できます。</li><li>自分や敵を長押しすると現在の状態を確認できます。キーボードではEnterでも開けます。敵の上に次の行動を表示します。ブロックはHPへの攻撃を防ぎ、次の自分のターン開始時に消えます。</li><li>カードの効果処理後にエナジーが0になると自動でターン終了します（0コストのカードが残っていても終了）。手動の「ターン終了」も使えます。ターン終了で残りの手札を捨て、敵が行動。その後5枚引きます。山札が尽きると捨て札を混ぜて再利用します。敵が混ぜる「'+esc(CARDS.junk.name)+'」は効果のないゴミカードです。放置すると再び回り、1エナジーで使用すると戦闘中除外。戦闘終了時には消えます。手札は最大10枚です。</li><li>強化は各攻撃のダメージを増加。過負荷は攻撃を25%減らします。設定不備は被攻撃を25%増やします。倍率を掛けてから端数を切り捨てます。「戦闘中除外」は次の戦闘で復帰します。</li><li>戦闘のHP損失は次の階に持ち越します。勝利報酬は通常3択から1枚。レリックで候補4枚・獲得2枚に増えます。不要なら途中でも見送れます。</li><li>強化で基本ダメージは1.5倍（切り上げ）、デバフは＋1ターン。パワーは効果を据え置いてコスト－1（最低0）。休息は回復かカード強化。「'+esc(RELICS.prune.name)+'」があれば無料のカード削除も選べます。交換所ではカードとレリック1種類（基本100コイン）を販売し、有料のカード削除も可能です。強敵を倒すと遺物を獲得します。</li><li>HPが0になると冒険終了。新しい冒険は初期デッキから始まります。各操作後にこのブラウザーへ自動保存します。</li></ol><h3>'+icon('misconfig')+'デバフ（敵味方共通）</h3><ul>'+Object.entries(DEBUFFS).map(([id,d])=>'<li><strong>'+icon(id)+' '+d.name+'</strong>：'+d.rule+'</li>').join('')+'</ul><p>遅延の休止中はカード使用不可。指定の休止ターン終了後は3エナジー・手札5枚を2回使えます。前半の防御と役の使用履歴を後半へ持ち越します。炎上は各側のターン終了時に1回。過負荷・枯渇・設定不備は敵行動後に1減少し、その敵行動で新たに受けた分は次のターンから減少します。遅延以外は重ねがけで数値を加算（上限999）。</p><p>雑魚はデバフなし。強敵3種はそれぞれ異なる1種、ボス3種はそれぞれ異なる2〜3種の組み合わせを使います。敵を長押しすると、その敵が使うデバフを確認できます。</p><p>クラウド運用をモチーフにした独立ゲームです。攻撃・HP・カード数値は架空のゲームルールで、AWSの機能や実性能を表すものではありません。「?」マスではSAA復習クイズを2問出題します。2問正解で未所持レリックのみ（全所持時のコイン代替なし）、1問正解で30コイン。誤答するたびに最大HPの10％（端数切り上げ）を即時に失います。教材の読了による解放条件はありません。</p><ul>'+Object.entries(RELICS).map(([id,r])=>'<li>'+icon(id)+r.name+'：'+r.text+'</li>').join('')+'</ul></details>';}
function catalogPanel(){
 const current=state?.learningCatalog?.version||(state?'従来版':nextCatalog.version);
 return '<section class="study-entry"><h2>ゲーム内の学習室</h2>'+btn('学習室を開く','study')+'<p>全問学習・誤答復習・複数選択・65問の到達度確認。冒険のHPや報酬とは別です。</p></section><section class="catalog-panel" aria-label="教材の更新"><h2>'+icon('book')+'教材とカード</h2><p>使用中：'+Object.values(CARDS).filter(c=>!c.battleOnly).length+'種類のカード / クイズ'+Object.keys(QUIZZES).length+'問</p>'+btn(updating?'確認中…':'教材からカード・クイズを更新','update-learning','',updating)+'<p>公開された教材を取り込みます。進行中の冒険には変更を加えず、次の冒険から反映します。</p>'+(current!==nextCatalog.version?'<p class="catalog-pending">次の冒険：'+(Object.keys(nextCatalog.cards).length+3)+'種 / クイズ'+Object.keys(nextCatalog.quizzes).length+'問（更新準備済み）</p>':'')+'<details class="learning-cards"><summary>使用中のカードと学べる内容を見る</summary>'+Object.entries(CARDS).filter(([,c])=>!c.battleOnly).map(([id,c])=>'<section><h3>'+cardIcon(c.kind)+esc(c.name)+(STARTERS.includes(id)?'（スターター）':'')+'</h3><p>'+esc(describe({id,plus:false}))+'</p>'+flavorDetail({id}).replace('flavor-detail','catalog-note')+'</section>').join('')+'</details>'+vocabularyGuide()+'</section>';
}
function render(snapshot=presentationView||state){
 const committed=state;state=snapshot;
 try{renderCurrent();}finally{state=committed;}
 root.setAttribute('aria-busy',String(turnBusy));
 if(turnBusy)for(const control of root.querySelectorAll('button,input'))control.disabled=true;
}
async function animateTurns(flow){
 turnBusy=true;
 const blocker=document.createElement('div');blocker.className='turn-blocker';document.body.append(blocker);
 try{await presentTurns(flow.steps,{
  draw(snapshot){presentationView=snapshot;render();},
  effects(step){showCombatEffects(root,combatEffects(step.before,step.after,step.action));showComboEffects(root,step.before,step.after,CARDS);},
  banner(text){const el=document.createElement('aside');el.className='turn-banner '+(text==='Enemy Turn'?'enemy-turn':'your-turn');el.setAttribute('role','status');el.textContent=text;blocker.append(el);return ()=>el.remove();}
 });}catch(error){console.error(error);notice='ターン演出を省略しました。保存済みの結果から続けられます。';}
 finally{turnBusy=false;presentationView=null;blocker.remove();render();}
}
let mapFocusFrame,disposeFanHand;
if('scrollRestoration' in history)history.scrollRestoration='manual';
function focusCurrentFloor(){cancelAnimationFrame(mapFocusFrame);mapFocusFrame=requestAnimationFrame(()=>{mapFocusFrame=requestAnimationFrame(()=>{if(state?.phase==='map')root.querySelector('.scene .route-row.current')?.scrollIntoView({block:'end',behavior:'auto'});});});}
window.addEventListener('pageshow',focusCurrentFloor);
function renderCurrent(){
 const mapKey=state?.phase==='map'?String(state.floor):'',focusMap=mapKey!==''&&root.dataset.mapFloor!==mapKey;root.dataset.mapFloor=mapKey;
 root.classList.toggle('in-battle',state?.phase==='battle');
 root.classList.toggle('in-map',state?.phase==='map');
 clearTimeout(holdTimer);holdTimer=null;
 const activeCombo=root.querySelector('.combo-toast');
 const previousHand=root.querySelector('.hand'),handScroll=previousHand?.scrollLeft??null;disposeFanHand?.();
 const revealEnd=state?.phase==='battle'&&state.battle.energy===0&&!root.querySelector('.hand-end');
 root.innerHTML=battleHud()+(!state?'<section class="title-screen"><p class="eyebrow">CLOUD SPIRE / DECKBUILDING ROGUELIKE</p><div class="tower-art" aria-hidden="true"><i></i><i></i><i></i><i></i><span>✧</span></div><h1>クラウドの尖塔</h1><p>一枚の選択が、次の階を変える。</p><p>SE・SRE・クラウドアーキテクト。<br>新しい冒険ごとに主人公をランダムで選びます。</p><p class="muted">'+Object.values(CARDS).filter(c=>!c.battleOnly).length+'種のカード。分岐する8階。<br>手札を育て、最上階のボスに挑もう。</p>'+(loadError?'<p class="warning" role="alert">'+loadError+'</p>':'')+btn(loadError?'保存を破棄して新しく始める':'冒険を始める','new','class="primary"')+'</section>':runHeader()+'<section class="scene">'+upgradeResult()+({map:map,battle:battle,reward:reward,rest:rest,shop:shop,event:event,won:ending,lost:ending}[state.phase])()+'</section><aside class="log" aria-label="直近の行動">'+state.log.map(x=>'<p>'+esc(x)+'</p>').join('')+'</aside>')+catalogPanel()+help()+'<footer class="controls">'+(state?btn('バックアップ','export'):'')+'<label class="import">'+icon('upload')+'記録を読み込む<input type="file" accept=".json" id="import"></label>'+btn('オフライン保存を確認','offline')+'<a href="../index.html">'+icon('home')+'学習ホームへ</a></footer><p class="muted">ゲーム記録は教材の学習記録とは別に保存されます。端末間の自動同期はありません。</p><p id="notice" class="'+(saveFailed?'warning':'muted')+'" role="status">'+esc(notice||(state?'自動保存済み':'保存した記録は次回起動時に再開します。'))+'</p>'+'<div class="game-tools"><span><span>演出 v2</span> · クイズ追加</span>'+btn('演出を試す','demo-fx')+'</div>';

 if(focusMap)focusCurrentFloor();
 if(activeCombo&&['battle','reward','won'].includes(state?.phase))root.append(activeCombo);
 const hand=root.querySelector('.hand');if(hand){disposeFanHand=mountFanHand(hand,{scrollLeft:revealEnd?0:handScroll});for(const el of hand.querySelectorAll('.card')){const picked=Number(el.dataset.uid)===selectedUid;el.classList.toggle('selected',picked);el.setAttribute('aria-expanded',String(picked));}}
}
function showDetails(uid){
 if(state?.phase!=='battle'||!state.battle.hand.includes(uid))return;
 selectedUid=uid;root.querySelector('#card-detail-slot').innerHTML=previewCard();
 for(const el of root.querySelectorAll('.hand .card')){const picked=Number(el.dataset.uid)===uid;el.classList.toggle('selected',picked);el.setAttribute('aria-expanded',String(picked));}
}
function inspectSceneCard(el){
 if(!el||state?.phase==='battle')return;
 const action=el.dataset.action,c=['buy','reward'].includes(action)?{id:el.dataset.id,uid:Number(el.dataset.uid),plus:false}:state.deck.find(c=>c.uid===Number(el.dataset.uid));
 if(!c)return;
 const html='<div class="options-card-detail">'+card(c,'inspect').replace('<button ','<div ').replace('</button>','</div>')+(action==='upgrade'?'<h3>強化すると</h3><p>'+upgradeChanges(c).map(esc).join('<br>')+'</p>':'')+'<p>'+esc(lifetime(c))+'</p>'+(['buy','reward'].includes(action)?'<p>'+synergyHints(state,c).map(esc).join('<br>')+'</p>':'')+flavorDetail(c)+comboInfo(c)+'</div>';
 openOptions(root,{'カード詳細':()=>html},{},'カード詳細','カード詳細');
}
function focusCardDetails(){const el=root.querySelector('.card-preview');if(!el)return;const gap=(root.querySelector('.battle-hud')?.getBoundingClientRect().height||0)+12;window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top-gap,behavior:'auto'});}
function closeStatus(){const d=root.querySelector('.status-dialog');if(!d)return;if(d.close)d.close();else d.removeAttribute('open');}
function showStatus(side){
 if(state?.phase!=='battle')return;
 const b=state.battle,enemy=side==='enemy',dialog=root.querySelector('.status-dialog');
 const statuses=enemy?b.enemyDebuffs:b.playerDebuffs;
 dialog.innerHTML='<h2 id="status-title">'+(enemy?icon(b.enemy)+ENEMIES[b.enemy].name:'自分')+'の状態</h2>'+(enemy?vocabularyDetail('enemies',b.enemy):'')+'<dl><dt>'+icon('heart')+'HP</dt><dd>'+(enemy?b.hp+' / '+b.maxHp:state.hp+' / '+state.maxHp)+'</dd><dt>'+icon('shield')+'ブロック</dt><dd>'+(enemy?b.block:b.playerBlock)+'</dd><dt>強化</dt><dd>'+(enemy?b.strength:b.playerStrength)+'</dd>'+(!enemy?'<dt>防御力補正</dt><dd>'+defenseBonus(state)+'</dd><dt>毎ターン防御</dt><dd>'+b.armor+'</dd><dt>'+icon('energy')+'エナジー</dt><dd>'+b.energy+'</dd>':'')+'</dl>'+(enemy?'<p class="enemy-abilities"><strong>使用するデバフ</strong><br>'+ (enemyDebuffTypes(b.enemy).map(id=>DEBUFFS[id].name).join('・')||'なし')+'</p>':'')+'<div class="status-debuffs">'+Object.entries(DEBUFFS).map(([id,d])=>'<p><strong>'+icon(id)+debuffLabel(id,statuses[id])+'</strong><br>'+d.rule+'</p>').join('')+'</div><p>炎上以外の残りターンは敵行動後に減少（その行動中に新たに受けた分を除く）。2回行動は全体で1ターン。状態は戦闘終了で解除。</p>'+btn('閉じる','close-status');
 if(!dialog.open){if(dialog.showModal)dialog.showModal();else{dialog.setAttribute('open','');dialog.classList.add('legacy-dialog');dialog.querySelector('button').focus();}}
}
function clearHold(){clearTimeout(holdTimer);holdTimer=null;}
root.addEventListener('pointerdown',e=>{if(turnBusy||document.querySelector('.options-overlay'))return;
 if(swipe){swipe.moved=true;clearHold();return;}
 const el=e.target.closest('.hand .card, .cards-grid .card, .shop-shelf .card, .hand-end, [data-status]');if(!el||e.button!==0)return;
 suppressUntil=0;swipe={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,held:false,uid:Number(el.dataset.uid),side:el.dataset.status,element:el};
 holdTimer=setTimeout(()=>{if(!swipe||swipe.moved)return;swipe.held=true;if(swipe.side)showStatus(swipe.side);else if(state?.phase==='battle')showDetails(swipe.uid);else inspectSceneCard(swipe.element);},450);
},{passive:true});
window.addEventListener('pointermove',e=>{if(swipe&&e.pointerId===swipe.id&&(Math.abs(e.clientX-swipe.x)>12||Math.abs(e.clientY-swipe.y)>12)){swipe.moved=true;clearHold();}},{passive:true});
for(const type of ['pointerup','pointercancel'])window.addEventListener(type,e=>{
 if(!swipe||e.pointerId!==swipe.id)return;clearHold();const held=swipe.held;
 if(swipe.moved||held||type==='pointercancel')suppressUntil=Date.now()+500;
 swipe=null;if(held)focusCardDetails();
},{passive:true});
window.addEventListener('blur',()=>{clearHold();swipe=null;suppressUntil=Date.now()+500;});
root.addEventListener('contextmenu',e=>{const el=e.target.closest('.hand .card, .cards-grid .card, .shop-shelf .card, .hand-end, [data-status]');if(el)e.preventDefault();});
root.addEventListener('keydown',e=>{if(turnBusy||document.querySelector('.options-overlay')){e.preventDefault();e.stopImmediatePropagation();return;}const open=root.querySelector('.status-dialog[open]');if(open&&e.key==='Escape'){e.preventDefault();closeStatus();return;}if(open&&e.key==='Tab'&&open.classList.contains('legacy-dialog')){e.preventDefault();open.querySelector('button').focus();return;}const target=e.target.closest('[data-status]');if(target&&(['Enter',' ','ContextMenu'].includes(e.key)||(e.shiftKey&&e.key==='F10'))){e.preventDefault();showStatus(target.dataset.status);return;}const el=e.target.closest('.hand .card, .cards-grid .card, .shop-shelf .card');if(el&&(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10'))){e.preventDefault();if(state?.phase==='battle'){showDetails(Number(el.dataset.uid));focusCardDetails();}else inspectSceneCard(el);}if(e.key==='Escape'&&selectedUid!==null){selectedUid=null;render();}});
root.addEventListener('click',e=>{if(document.querySelector('.options-overlay')||turnBusy||Date.now()<suppressUntil||swipe?.held||swipe?.moved){e.preventDefault();e.stopImmediatePropagation();}},true);
root.addEventListener('click',async e=>{
 const el=e.target.closest('[data-action]');if(document.querySelector('.options-overlay')||turnBusy||!el||el.disabled||el.getAttribute('aria-disabled')==='true')return;let type=el.dataset.action,uid=Number(el.dataset.uid);const id=el.dataset.id;let next;
 if(type==='update-learning'){
  if(updating)return;updating=true;notice='新しい教材を確認しています…';render();
  try{const pack=await fetchCatalog('./learning-catalog.json?update='+Date.now(),{bundledVersion:bundledCatalog.version});const same=pack.version===nextCatalog.version;nextCatalog=pack;if(!state)activateCatalog(pack);notice=same?'教材は最新です。':state?'教材を保存しました。今の冒険はそのまま、次の冒険から反映します。':'カードとクイズを更新しました。';}
  catch(error){notice='更新できませんでした。保存済みの教材と冒険を保持しています。通信と端末の空き容量を確認して再試行してください。';}
  finally{updating=false;render();}return;
 }
 if(type==='options'){showOptions();return;}
 if(type==='shop-relic-panel'||type==='shop-remove-panel'){const panel=type==='shop-relic-panel'?'relic':'remove';shopPanel=shopPanel===panel?'':panel;render();return;}
 if(type==='demo-fx'){showCombatEffects(root,[{side:'enemy',kind:'hit',value:6,label:'−6'},{side:'player',kind:'guard',value:5,label:'完全ガード 5'}],true);return;}

 if(type==='close-status'){closeStatus();return;}
 if(type==='dismiss-upgrade'){upgradeNotice=null;render();return;}
 if(type==='cancel-card'){selectedUid=null;render();return;}
 if(type==='study'){openStudy(root);return;}
 if(type==='new'){restartRun();return;}
 if(type==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='cloud-spire-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
 if(type==='offline'){
  el.disabled=true;try{if(!('serviceWorker'in navigator))throw Error('HTTPSまたはlocalhostから開いてください。');await navigator.serviceWorker.register('../sw.js');const reg=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error("初回保存が完了しません。オンラインで再試行してください。")),20000))]);if(reg.waiting)throw Error("新版が待機中です。学習ホームの設定で更新を適用してください。");const ok=await new Promise((resolve,reject)=>{const ch=new MessageChannel(),timer=setTimeout(()=>reject(Error('保存確認がタイムアウトしました。')),20000);ch.port1.onmessage=e=>{clearTimeout(timer);ch.port1.close();resolve(e.data?.ok);};reg.active.postMessage({type:'REPAIR'},[ch.port2]);});notice=ok?'オフライン保存を確認しました。次に機内モードで再起動を確かめてください。':'保存が不足しています。オンラインで学習ホームの設定から更新してください。';}catch(e){notice='保存を確認できません：'+e.message;}render();return;
 }
 if(!state)return;
 if(type==='play'&&state.phase==='battle'){const c=state.deck.find(c=>c.uid===uid);if(c&&cardValues(c).cost>state.battle.energy){notice='エナジーが足りません。長押しでカードの詳細を確認できます。';render();return;}}
 const actions={'quiz-answer':{type,questionId:el.dataset.question,choice:Number(el.dataset.choice),answeredAt:Date.now()},'quiz-next':{type,questionId:el.dataset.question},'quiz-leave':{type},node:{type,lane:Number(el.dataset.lane)},play:{type,uid},end:{type},reward:{type,id},skip:{type:'reward',id:null},heal:{type},upgrade:{type,uid},buy:{type,id},'buy-relic':{type,id},'rest-remove':{type,uid},remove:{type,uid},leave:{type},risk:{type:'event',choice:'risk'},safe:{type:'event',choice:'safe'}};
 if(actions[type]){const flow=resolveAction(state,actions[type]);next=flow.state;if(next!==state){const upgraded=type==='upgrade'?state.deck.find(c=>c.uid===uid):null;upgradeNotice=upgraded?{name:CARDS[upgraded.id].name,changes:upgradeChanges(upgraded),after:describe({...upgraded,plus:true})}:null;const previous=state,fx=flow.steps.flatMap(step=>combatEffects(step.before,step.after,step.action));state=next;if(type==='node'||type==='leave')shopPanel='';selectedUid=null;notice='';save();try{recordRoomAnswers(state,QUIZZES);}catch(e){notice='学習履歴を保存できません：'+e.message;}if(flow.steps.some(step=>step.action.type==='end')){await animateTurns(flow);}else{render();showCombatEffects(root,fx);showComboEffects(root,previous,flow.steps[0].after,CARDS);}if(type==='node'||['reward','skip','heal','upgrade','rest-remove','leave','risk','safe','quiz-next','quiz-leave'].includes(type))window.scrollTo({top:0,behavior:'auto'});}}
});
root.addEventListener('change',async e=>{
 if(document.querySelector('.options-overlay')||turnBusy||e.target.id!=='import')return;const f=e.target.files?.[0];if(!f)return;
 try{if(f.size>2000000)throw Error('2MB以内のJSONを選んでください。');const s=parseRun(await f.text());if(!confirm('このバックアップで現在の冒険を置き換えますか？')){activateCatalog(state?.learningCatalog||null);return;}state=s;selectedUid=null;upgradeNotice=null;loadError='';notice='記録を読み込みました。';save();try{recordRoomAnswers(state,QUIZZES);}catch(e){notice='冒険を復元しましたが学習履歴を保存できません：'+e.message;}}catch(err){notice='読み込めません：'+err.message;}render();
});
try{recordRoomAnswers(state,QUIZZES);}catch(e){notice='学習履歴を保存できません：'+e.message;}
render();
window.__towerStarted=true;
document.querySelector('#startup')?.remove();
