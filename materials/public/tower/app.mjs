import {DEBUFFS,debuffLabel} from './debuffs.mjs';
import {FLAVOR} from './flavor.mjs';
import {COMBOS,comboReady} from './combos.mjs';
import {showComboEffects} from './combo-ui.mjs';
import {QUIZZES,QUIZ_RULES,quizScore} from './quiz.mjs';
import {lifetime,inspectPlay,synergyHints} from './strategy.mjs';
import {combatEffects,showCombatEffects} from './effects.mjs';

import {CARDS,ENEMIES,RELICS,ROUTES,NODE_NAMES,newRun,act,intent,describe,parseRun,cardValues,upgradeChanges} from './engine.mjs';
const KEY='saa-tower-run-v1',root=document.querySelector('#game');
let state=null,loadError='',notice='',saveFailed=false,selectedUid=null,upgradeNotice=null;
let swipe=null,suppressUntil=0,holdTimer=null;
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{const raw=localStorage.getItem(KEY);if(raw)state=parseRun(raw);}catch(e){loadError='保存データを読み込めませんでした。元データは上書きしていません。';}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));saveFailed=false;}catch{saveFailed=true;notice='保存できません。ページを閉じる前に「バックアップ」を保存してください。';}}
const btn=(text,action,extra='',disabled=false)=>'<button data-action="'+action+'" '+extra+(disabled?' disabled':'')+'>'+text+'</button>';
const title=c=>CARDS[c.id].name+(c.plus?'＋':'');
function card(c,action,disabled=false){const d=cardValues(c),plan=action==='play'?inspectPlay(state,c):null,short=action==='play'?(plan?.brief||'エナジー不足'):'',tips=['reward','buy'].includes(action)?synergyHints(state,c):[];return '<button class="card '+d.kind+(action==='play'&&plan&&comboReady(state.battle,c.id).length?' combo-ready':'')+(action==='play'&&!plan?' unaffordable':'')+'" data-action="'+action+'" data-uid="'+c.uid+'" data-id="'+c.id+'" '+(disabled?'disabled':'')+'><span class="cost">'+d.cost+'</span><span class="kind">'+({attack:'攻撃',skill:'スキル',power:'持続'}[d.kind])+'</span><span class="sigil" aria-hidden="true">'+({attack:'ϟ',skill:'◇',power:'✧'}[d.kind])+'</span><strong>'+title(c)+'</strong><span class="effect">'+describe(c)+'</span>'+(action==='play'&&plan&&comboReady(state.battle,c.id).length?'<span class="combo-badge">役が揃う</span>':'')+(short?'<span class="card-summary">'+esc(short)+'</span>':'')+(action==='upgrade'?'<span class="upgrade-preview">強化すると<br>'+upgradeChanges(c).map(esc).join('<br>')+'</span>':'')+(tips.length?'<span class="synergy-note">組合せ例：'+esc(tips[0])+'</span>':'')+'</button>';}
function relics(){return '<details class="relic-details"><summary>◈ 遺物 '+state.relics.length+'個 <small>この冒険中有効</small></summary><ul>'+state.relics.map(r=>'<li><strong>'+RELICS[r].name+'</strong>：'+RELICS[r].text+'</li>').join('')+'</ul></details>';}

function map(){
 return '<p class="eyebrow">THE ASCENT / '+(state.floor+1)+'階へ</p><h2>次の道を選ぶ</h2><p class="muted">各階で1つ選択。強敵には遺物、休息には回復か強化が待っています。</p><div class="route-map">'+ROUTES.map((nodes,i)=>'<section class="route-row '+(i===state.floor?'current':i<state.floor?'visited':'future')+'"><span class="floor-label">'+(i+1)+'F</span>'+nodes.map((type,lane)=>{const taken=state.history.some(h=>h.floor===i&&h.lane===lane);return '<button data-action="node" data-lane="'+lane+'" '+(i!==state.floor?'disabled':'')+' class="node '+type+(taken?' taken':'')+'"><span aria-hidden="true">'+({battle:'⚔',elite:'♜',rest:'♨',shop:'◇',event:'?',boss:'✺'}[type])+'</span><strong>'+NODE_NAMES[type]+'</strong><small>'+(taken?'通過':({battle:'カード＋22コイン',elite:'遺物＋40コイン',rest:'回復 / 強化',shop:'購入 / 削除',event:'2問クイズ / 報酬かダメージ',boss:'連鎖障害の王'}[type]))+'</small></button>';}).join('')+'</section>').join('')+'</div>';
}
function intentText(i){if(i.type==='double')return '2回行動：'+i.actions.map(intentText).join(' → ');return ({attack:'⚔ 攻撃 '+i.value,guard:'◇ 防御 '+i.value,buff:'✧ 強化 ＋'+i.value,wait:'遅延：行動なし（次は2回）',debuff:i.status?'⚠ '+DEBUFFS[i.status].name+(i.status==='delay'?'': ' '+i.value):''})[i.type];}
function statusSummary(d){return Object.entries(d).filter(([,n])=>n>0).map(([id,n])=>'<span>'+debuffLabel(id,n)+'</span>').join('');}
function endLabel(){const b=state.battle;return b.playerDebuffs.delay===1?'休止ターンを終了':b.playerDebuffs.delay===2&&b.playerActions===2?'後半の行動へ':'ターン終了';}
function battle(){
 const b=state.battle,e=ENEMIES[b.enemy],i=intent(state);
 return '<div class="battle-meta">'+btn(endLabel(),'end','class="end-turn"')+'<span>第'+state.floor+'階 · TURN '+b.turn+'</span><span class="intent">'+esc(intentText(i))+'</span></div>'+((statusSummary(b.playerDebuffs)||statusSummary(b.enemyDebuffs))?'<div class="debuff-strip">'+(statusSummary(b.playerDebuffs)?'<div>自分：'+statusSummary(b.playerDebuffs)+'</div>':'')+(statusSummary(b.enemyDebuffs)?'<div>敵：'+statusSummary(b.enemyDebuffs)+'</div>':'')+'</div>':'')+(b.playerDebuffs.delay?'<p class="delay-notice">'+(b.playerDebuffs.delay===1?'遅延：今ターンはカードを使えません。終了すると、次は2回行動。':b.playerActions===2?'2回行動・前半。後半は敵の行動なしで3エナジー・手札5枚。':'2回行動・後半。終了すると敵が行動します。')+'</p>':'')+'<section class="arena"><div class="avatar operator combatant" data-status="player" role="button" tabindex="0" aria-label="自分の状態（長押しで確認）"><span>◇</span><i></i></div><div class="enemy combatant" data-status="enemy" role="button" tabindex="0" aria-label="敵の状態（長押しで確認）"><div class="enemy-glyph '+b.enemy+'" aria-hidden="true">'+e.glyph+'</div><h2>'+e.name+'</h2><div class="health"><span style="width:'+b.hp/b.maxHp*100+'%"></span></div><p>'+b.hp+' / '+b.maxHp+' HP　<span class="shield">◇ '+b.block+'</span></p><small>長押しで状態</small></div></section><dialog class="status-dialog" aria-labelledby="status-title"></dialog>'+'<div class="hand">'+(b.energy===0?btn('<span aria-hidden="true">↻</span><strong>'+endLabel()+'</strong><small>次の手札へ</small>','end','class="hand-end"'):'')+b.hand.map(uid=>{const c=state.deck.find(x=>x.uid===uid);return card(c,'play');}).join('')+'</div>'+(!b.hand.length?'<p>手札がありません。ターンを終了してください。</p>':'')+handControls()+'<div id="card-detail-slot">'+previewCard()+'</div>'+ '<div class="pile-row"><span>山札 '+b.draw.length+'</span><span>捨て札 '+b.discard.length+'</span><span>除外 '+b.exhaust.length+'</span><span>手札 '+b.hand.length+' / 10</span></div>'+comboGuide();
}

function comboInfo(c){return Object.entries(COMBOS).filter(([,r])=>r.cards.includes(c.id)).map(([id,r])=>{const b=state?.phase==='battle'?state.battle:null,done=b?.comboDone?.includes(id),ready=b&&comboReady(b,c.id).includes(id);return '<section class="combo-info"><strong>'+r.name+'：'+r.label+'</strong><p>'+r.cards.map((x,i)=>r.icons[i]+' '+CARDS[x].name+(b?.comboPlayed?.includes(x)?' ✓':'')).join(' ＋ ')+'</p>'+(done?'<p>このターンは成立済み</p>':ready?'<p>このカードを使うと成立（エナジーが必要）</p>':'')+'<p>'+r.lesson+'</p><a href="'+r.source+'" target="_blank" rel="noopener">AWS公式資料</a></section>';}).join('');}
function comboGuide(){return '<details class="combo-guide"><summary>役の組み合わせ（3種類）</summary><p>同じターンに指定の3種類を使用。順番は自由、各役は1ターン1回。同じ種類を重ねても代用できません。追加攻撃3は強化が乗らず、敵のブロックで防がれます。</p><p>カードは仕組みの要素を表す比喩です。実際のAWS構成の必要十分条件ではなく、数値はゲーム上の報酬です。</p>'+Object.entries(COMBOS).map(([id,r])=>'<section><strong>'+r.name+'：'+r.label+'</strong><p>'+r.cards.map(x=>CARDS[x].name+(state.battle.comboPlayed?.includes(x)?' ✓':'')).join(' ＋ ')+'</p><small>'+(state.battle.comboDone?.includes(id)?'成立済み':'今ターン '+r.cards.filter(x=>state.battle.comboPlayed?.includes(x)).length+' / 3種類')+'</small><p>'+r.lesson+'</p><a href="'+r.source+'" target="_blank" rel="noopener">AWS公式資料</a></section>').join('')+'</details>';}
function handControls(){return '<div class="hand-nav">'+btn('←','hand-prev','aria-label="前の手札へ"')+'<span>左右にスワイプして手札を見る</span>'+btn('→','hand-next','aria-label="次の手札へ"')+'</div>';}
function previewCard(){
 if(selectedUid===null||state?.phase!=='battle')return '';
 const c=state.deck.find(c=>c.uid===selectedUid&&state.battle.hand.includes(c.uid));if(!c)return '';
 const d=cardValues(c),enough=d.cost<=state.battle.energy,plan=inspectPlay(state,c),tips=synergyHints(state,c);
 return '<section class="card-preview" aria-label="カードの詳細">'+card(c,'inspect').replace('<button','<div').replace('</button>','</div>').replace('data-action="inspect"','')+'<div class="card-plan"><p class="lifetime">'+lifetime(c)+'</p>'+(plan?'<strong>今使った場合</strong><ul>'+plan.lines.map(line=>'<li>'+esc(line)+'</li>').join('')+'</ul>':'<p>今は使用できません（エナジー不足または遅延）。</p>')+(tips.length?'<strong>このデッキとの組合せ</strong><ul>'+tips.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'')+((d.debuff)?'<p class="debuff-rule"><strong>'+DEBUFFS[d.debuff.id].name+'</strong>：'+DEBUFFS[d.debuff.id].rule+'</p>':'')+flavorDetail(c)+comboInfo(c)+'</div><p>詳細を表示しています。ここでは使用しません。<br><small>必要 '+d.cost+' / 残り '+state.battle.energy+' エナジー'+(enough?'':'（不足）')+'</small></p>'+btn('閉じる','cancel-card')+'</section>';
}

function flavorDetail(c){const f=FLAVOR[c.id];if(!f)return '';return '<section class="flavor-detail"><h3>用語の説明・補足</h3><p>'+esc(f.note)+'</p><details><summary>比喩と実際の違い</summary><p>'+esc(f.limit)+'</p></details>'+(f.source?'<a href="'+f.source+'" target="_blank" rel="noopener">AWS公式資料</a>':'')+'</section>';}
function upgradeResult(){return upgradeNotice?'<section class="upgrade-result" role="status"><h2>'+esc(upgradeNotice.name)+' を強化しました</h2><ul>'+upgradeNotice.changes.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul><p>強化後：'+esc(upgradeNotice.after)+'</p>'+btn('閉じる','dismiss-upgrade')+'</section>':'';}
function reward(){return '<p class="eyebrow">VICTORY</p><h2>デッキの次の一手</h2><p>1枚だけ獲得できます。デッキを増やさず進むことも戦略です。</p><div class="cards-grid">'+state.reward.map((id,n)=>card({id,uid:n,plus:false},'reward')).join('')+'</div>'+btn('カードを見送る','skip','class="secondary"');}
function rest(){return '<p class="eyebrow">A QUIET MOMENT</p><h2>静かな中継所</h2><p>回復かカード強化を、どちらか1回選びます。</p>'+btn('休息する：HPを22回復','heal','class="primary"')+'<h3>または、カードを強化</h3><div class="cards-grid compact">'+state.deck.filter(c=>!c.plus).map(c=>card(c,'upgrade')).join('')+'</div><p class="muted">選んだカードは次の戦闘以降も強化済みになります。</p>';}
function shop(){return '<p class="eyebrow">THE EXCHANGE</p><h2>旅の交換所</h2><p>1枚35コイン。購入後は売り切れます。</p><div class="cards-grid">'+state.stock.map((id,n)=>card({id,uid:n,plus:false},'buy',state.gold<35)).join('')+'</div><h3>カードを1枚削除：45コイン</h3><p class="muted">この訪問で1回だけ。デッキは最低5枚残します。</p><div class="remove-list">'+state.deck.map(c=>btn(esc(title(c)),'remove','data-uid="'+c.uid+'"',state.removed||state.gold<45||state.deck.length<=5)).join('')+'</div>'+btn('先へ進む','leave','class="primary"');}
function quizResult(){const r=state.quiz?.result;if(!r)return '';return '<section class="quiz-result"><h2>'+r.correct+' / 2問 正解</h2><p>'+(r.relic?'◈ レリック「'+RELICS[r.relic].name+'」を獲得！':r.gold?'◈ '+r.gold+'コイン獲得'+(r.correct===2?'（全レリック所持済みの代替報酬）':''):'♥ HP −'+r.damage)+'</p>'+(r.relic?'<p>'+RELICS[r.relic].text+'</p>':'')+'<p>現在 HP '+state.hp+' / '+state.maxHp+' · コイン '+state.gold+'</p></section>';}
function event(){
 const q=state.quiz;
 if(q.result)return '<p class="eyebrow">QUIZ RESULT</p>'+quizResult()+btn('先へ進む','quiz-leave','class="primary"');
 const id=q.ids[q.step],item=QUIZZES[id],answered=q.answers.length>q.step,choice=q.answers[q.step];
 return '<p class="eyebrow">QUESTION ROOM</p><h2>知識の間：'+(q.step+1)+' / 2問</h2><p class="quiz-rules">2問正解：未所持レリック（全所持なら60コイン）<br>1問正解：30コイン / 0問正解：HP −8<br>HPが0になると冒険終了。正答数で判定します。</p><p class="quiz-prompt">'+esc(item.prompt)+'</p><div class="quiz-options">'+item.options.map((text,i)=>btn(String.fromCharCode(65+i)+'. '+esc(text),'quiz-answer','data-question="'+id+'" data-choice="'+i+'" class="quiz-option '+(answered&&i===item.answer?'correct':answered&&i===choice?'incorrect':'')+'"',answered)).join('')+'</div>'+(answered?'<section class="quiz-explanation" role="status"><h3>'+(choice===item.answer?'正解！':'不正解')+'</h3><p>正解：'+esc(item.options[item.answer])+'</p><ul>'+item.reasons.map((reason,i)=>'<li><strong>'+String.fromCharCode(65+i)+'</strong>：'+esc(reason)+'</li>').join('')+'</ul><a href="'+item.source+'" target="_blank" rel="noopener">AWS公式資料（オンライン）</a></section>'+btn(q.step===0?'次の問題へ':'結果を受け取る','quiz-next','data-question="'+id+'" class="primary"'):'<p class="muted">回答をタップすると確定します。途中の回答も自動保存します。</p>');
}
function battleHud(){return state?.phase==='battle'?'<aside class="battle-hud" aria-label="戦闘ステータス"><strong class="hud-hp '+(state.hp<=state.maxHp*.25?'low-hp':'')+'">♥ HP '+state.hp+' / '+state.maxHp+'</strong><span>◇ '+state.battle.playerBlock+'</span><span>⚡ '+state.battle.energy+'</span></aside>':'';}

function ending(){return '<section class="ending"><p class="eyebrow">'+(state.phase==='won'?'SUMMIT REACHED':'ANOTHER PATH AWAITS')+'</p><div class="event-art">'+(state.phase==='won'?'✧':'◇')+'</div><h2>'+(state.phase==='won'?'尖塔を越えて':'冒険の記録')+'</h2>'+quizResult()+'<p>'+state.floor+'階まで到達 · デッキ'+state.deck.length+'枚 · 遺物'+state.relics.length+'個</p><p>'+(state.phase==='won'?'連鎖障害の王を退けました。別のルート、別のデッキで次の冒険へ。':'この冒険のデッキはここまで。次は敵の予告を見ながら、攻撃と防御の配分を変えてみよう。')+'</p>'+btn('新しい冒険を始める','new','class="primary"')+'</section>';}
function help(){return '<details class="help"><summary>遊び方とカードのルール</summary><ol><li>8階のルートで各階1つの道を選び、最後のボスを倒します。</li><li>戦闘は毎ターン3エナジー、手札5枚。最初のターンは観測灯で6枚です。左右スワイプで手札を送り、手札を1タップすると、左上の数字のエナジーを払って使用します。約0.45秒長押しすると詳細を表示します。指を離しても使用せず、「閉じる」で戻れます。キーボードではShift＋F10で詳細を表示できます。</li><li>自分や敵を長押しすると現在の状態を確認できます。キーボードではEnterでも開けます。敵の上に次の行動を表示します。ブロックはHPへの攻撃を防ぎ、次の自分のターン開始時に消えます。</li><li>ターン終了で残りの手札を捨て、敵が行動。その後5枚引きます。山札が尽きると捨て札を混ぜて再利用します。手札は最大10枚です。</li><li>強化は各攻撃のダメージを増加。過負荷は攻撃を25%減らします。設定不備は被攻撃を25%増やします。倍率を掛けてから端数を切り捨てます。「戦闘中除外」は次の戦闘で復帰します。</li><li>戦闘のHP損失は次の階に持ち越します。勝利報酬はカード3択。不要なら見送れます。</li><li>休息は回復かカード強化。交換所では購入とカード削除。強敵を倒すと遺物を獲得します。</li><li>HPが0になると冒険終了。新しい冒険は初期デッキから始まります。各操作後にこのブラウザーへ自動保存します。</li></ol><h3>デバフ（敵味方共通）</h3><ul>'+Object.values(DEBUFFS).map(d=>'<li><strong>'+d.name+'</strong>：'+d.rule+'</li>').join('')+'</ul><p>遅延中の自分はカード使用不可。次のターンは3エナジー・手札5枚を2回使えます。前半の防御と役の使用履歴を後半へ持ち越します。炎上は各側のターン終了時に1回。過負荷・枯渇・設定不備は敵行動後に1減少し、その敵行動で新たに受けた分は次のターンから減少します。遅延以外は重ねがけで数値を加算（上限999）。</p><p>雑魚はデバフなし、強敵は設定不備、ボスは炎上・過負荷・遅延を使います。</p><p>クラウド運用をモチーフにした独立ゲームです。攻撃・HP・カード数値は架空のゲームルールで、AWSの機能や実性能を表すものではありません。「?」マスではSAA復習クイズを2問出題します。2問正解でレリック、1問で30コイン、0問でHPを8失います。教材の読了による解放条件はありません。</p><ul>'+Object.values(RELICS).map(r=>'<li>'+r.name+'：'+r.text+'</li>').join('')+'</ul></details>';}
function render(){
 root.classList.toggle('in-battle',state?.phase==='battle');
 root.classList.toggle('in-map',state?.phase==='map');
 clearTimeout(holdTimer);holdTimer=null;
 const activeCombo=root.querySelector('.combo-toast');
 const handScroll=root.querySelector('.hand')?.scrollLeft||0;
 const revealEnd=state?.phase==='battle'&&state.battle.energy===0&&!root.querySelector('.hand-end');
 root.innerHTML=battleHud()+(!state?'<section class="title-screen"><p class="eyebrow">CLOUD SPIRE / DECKBUILDING ROGUELIKE</p><div class="tower-art" aria-hidden="true"><i></i><i></i><i></i><i></i><span>✧</span></div><h1>クラウドの尖塔</h1><p>一枚の選択が、次の階を変える。</p><p class="muted">20種のカード。分岐する8階。<br>手札を育て、連鎖障害の王に挑もう。</p>'+(loadError?'<p class="warning" role="alert">'+loadError+'</p>':'')+btn(loadError?'保存を破棄して新しく始める':'冒険を始める','new','class="primary"')+'</section>':'<header class="run-header"><div><small>CLOUD SPIRE</small><h1>クラウドの尖塔</h1></div><div class="resources"><strong>♥ '+state.hp+' / '+state.maxHp+'</strong><span>◈ '+state.gold+'</span><span>'+state.floor+' / 8 F</span></div></header><div class="relics">'+relics()+'</div><section class="scene">'+upgradeResult()+({map:map,battle:battle,reward:reward,rest:rest,shop:shop,event:event,won:ending,lost:ending}[state.phase])()+'</section><details class="deck-list"><summary>デッキを見る（'+state.deck.length+'枚）</summary><ul>'+state.deck.map(c=>'<li><strong>'+title(c)+'</strong> — '+describe(c)+'</li>').join('')+'</ul></details><aside class="log" aria-label="直近の行動">'+state.log.map(x=>'<p>'+esc(x)+'</p>').join('')+'</aside>')+help()+'<footer class="controls">'+(state?btn('バックアップ','export')+btn('最初から','new','class="subtle"'):'')+'<label class="import">記録を読み込む<input type="file" accept=".json" id="import"></label>'+btn('オフライン保存を確認','offline')+'<a href="../index.html">学習ホームへ</a></footer><p class="muted">ゲーム記録は教材の学習記録とは別に保存されます。端末間の自動同期はありません。</p><p id="notice" class="'+(saveFailed?'warning':'muted')+'" role="status">'+esc(notice||(state?'自動保存済み':'保存した記録は次回起動時に再開します。'))+'</p>'+'<div class="game-tools"><span><span>演出 v2</span> · クイズ追加</span>'+btn('演出を試す','demo-fx')+'</div>';

 if(activeCombo&&['battle','reward','won'].includes(state?.phase))root.append(activeCombo);
 const hand=root.querySelector('.hand');if(hand){hand.scrollLeft=revealEnd?0:handScroll;for(const el of hand.querySelectorAll('.card')){const picked=Number(el.dataset.uid)===selectedUid;el.classList.toggle('selected',picked);el.setAttribute('aria-expanded',String(picked));}}
}
function showDetails(uid){
 if(state?.phase!=='battle'||!state.battle.hand.includes(uid))return;
 selectedUid=uid;root.querySelector('#card-detail-slot').innerHTML=previewCard();
 for(const el of root.querySelectorAll('.hand .card')){const picked=Number(el.dataset.uid)===uid;el.classList.toggle('selected',picked);el.setAttribute('aria-expanded',String(picked));}
}
function closeStatus(){const d=root.querySelector('.status-dialog');if(!d)return;if(d.close)d.close();else d.removeAttribute('open');}
function showStatus(side){
 if(state?.phase!=='battle')return;
 const b=state.battle,enemy=side==='enemy',dialog=root.querySelector('.status-dialog');
 const statuses=enemy?b.enemyDebuffs:b.playerDebuffs;
 dialog.innerHTML='<h2 id="status-title">'+(enemy?ENEMIES[b.enemy].name:'自分')+'の状態</h2><dl><dt>HP</dt><dd>'+(enemy?b.hp+' / '+b.maxHp:state.hp+' / '+state.maxHp)+'</dd><dt>ブロック</dt><dd>'+(enemy?b.block:b.playerBlock)+'</dd><dt>強化</dt><dd>'+(enemy?b.strength:b.playerStrength)+'</dd>'+(!enemy?'<dt>毎ターン防御</dt><dd>'+b.armor+'</dd><dt>エナジー</dt><dd>'+b.energy+'</dd>':'')+'</dl><div class="status-debuffs">'+Object.entries(DEBUFFS).map(([id,d])=>'<p><strong>'+debuffLabel(id,statuses[id])+'</strong><br>'+d.rule+'</p>').join('')+'</div><p>炎上以外の残りターンは敵行動後に減少（その行動中に新たに受けた分を除く）。2回行動は全体で1ターン。状態は戦闘終了で解除。</p>'+btn('閉じる','close-status');
 if(!dialog.open){if(dialog.showModal)dialog.showModal();else{dialog.setAttribute('open','');dialog.classList.add('legacy-dialog');dialog.querySelector('button').focus();}}
}
function clearHold(){clearTimeout(holdTimer);holdTimer=null;}
root.addEventListener('pointerdown',e=>{
 if(swipe){swipe.moved=true;clearHold();return;}
 const el=e.target.closest('.hand .card, .hand-end, [data-status]');if(!el||e.button!==0)return;
 suppressUntil=0;swipe={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,held:false,uid:Number(el.dataset.uid),side:el.dataset.status};
 holdTimer=setTimeout(()=>{if(!swipe||swipe.moved)return;swipe.held=true;if(swipe.side)showStatus(swipe.side);else showDetails(swipe.uid);},450);
},{passive:true});
window.addEventListener('pointermove',e=>{if(swipe&&e.pointerId===swipe.id&&(Math.abs(e.clientX-swipe.x)>12||Math.abs(e.clientY-swipe.y)>12)){swipe.moved=true;clearHold();}},{passive:true});
for(const type of ['pointerup','pointercancel'])window.addEventListener(type,e=>{
 if(!swipe||e.pointerId!==swipe.id)return;clearHold();const held=swipe.held;
 if(swipe.moved||held||type==='pointercancel')suppressUntil=Date.now()+500;
 swipe=null;if(held)root.querySelector('.card-preview')?.scrollIntoView({block:'nearest',behavior:'smooth'});
},{passive:true});
window.addEventListener('blur',()=>{clearHold();swipe=null;suppressUntil=Date.now()+500;});
root.addEventListener('contextmenu',e=>{const el=e.target.closest('.hand .card, .hand-end, [data-status]');if(el)e.preventDefault();});
root.addEventListener('keydown',e=>{const open=root.querySelector('.status-dialog[open]');if(open&&e.key==='Escape'){e.preventDefault();closeStatus();return;}if(open&&e.key==='Tab'&&open.classList.contains('legacy-dialog')){e.preventDefault();open.querySelector('button').focus();return;}const target=e.target.closest('[data-status]');if(target&&(['Enter',' ','ContextMenu'].includes(e.key)||(e.shiftKey&&e.key==='F10'))){e.preventDefault();showStatus(target.dataset.status);return;}const el=e.target.closest('.hand .card');if(el&&(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10'))){e.preventDefault();showDetails(Number(el.dataset.uid));root.querySelector('.card-preview')?.scrollIntoView({block:'nearest'});}if(e.key==='Escape'&&selectedUid!==null){selectedUid=null;render();}});
root.addEventListener('click',e=>{if(Date.now()<suppressUntil||swipe?.held||swipe?.moved){e.preventDefault();e.stopImmediatePropagation();}},true);
root.addEventListener('click',async e=>{
 const el=e.target.closest('[data-action]');if(!el||el.disabled)return;let type=el.dataset.action,uid=Number(el.dataset.uid);const id=el.dataset.id;let next;
 if(type==='demo-fx'){showCombatEffects(root,[{side:'enemy',kind:'hit',value:6,label:'−6'},{side:'player',kind:'guard',value:5,label:'完全ガード 5'}],true);return;}
 if(type==='hand-prev'||type==='hand-next'){const h=root.querySelector('.hand');if(h)h.scrollBy({left:(type==='hand-next'?1:-1)*Math.max(160,h.clientWidth*.8),behavior:'smooth'});return;}
 if(type==='close-status'){closeStatus();return;}
 if(type==='dismiss-upgrade'){upgradeNotice=null;render();return;}
 if(type==='cancel-card'){selectedUid=null;render();return;}
 if(type==='new'){if((state||loadError)&&!confirm('現在の冒険を終了して、初期デッキから始めますか？'))return;state=newRun();selectedUid=null;upgradeNotice=null;loadError='';notice='';save();render();return;}
 if(type==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='cloud-spire-save.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
 if(type==='offline'){
  el.disabled=true;try{if(!('serviceWorker'in navigator))throw Error('HTTPSまたはlocalhostから開いてください。');await navigator.serviceWorker.register('../sw.js');const reg=await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error("初回保存が完了しません。オンラインで再試行してください。")),20000))]);if(reg.waiting)throw Error("新版が待機中です。学習ホームの設定で更新を適用してください。");const ok=await new Promise((resolve,reject)=>{const ch=new MessageChannel(),timer=setTimeout(()=>reject(Error('保存確認がタイムアウトしました。')),20000);ch.port1.onmessage=e=>{clearTimeout(timer);ch.port1.close();resolve(e.data?.ok);};reg.active.postMessage({type:'REPAIR'},[ch.port2]);});notice=ok?'オフライン保存を確認しました。次に機内モードで再起動を確かめてください。':'保存が不足しています。オンラインで学習ホームの設定から更新してください。';}catch(e){notice='保存を確認できません：'+e.message;}render();return;
 }
 if(!state)return;
 if(type==='play'&&state.phase==='battle'){const c=state.deck.find(c=>c.uid===uid);if(c&&cardValues(c).cost>state.battle.energy){notice='エナジーが足りません。長押しでカードの詳細を確認できます。';render();return;}}
 const actions={'quiz-answer':{type,questionId:el.dataset.question,choice:Number(el.dataset.choice)},'quiz-next':{type,questionId:el.dataset.question},'quiz-leave':{type},node:{type,lane:Number(el.dataset.lane)},play:{type,uid},end:{type},reward:{type,id},skip:{type:'reward',id:null},heal:{type},upgrade:{type,uid},buy:{type,id},remove:{type,uid},leave:{type},risk:{type:'event',choice:'risk'},safe:{type:'event',choice:'safe'}};
 if(actions[type]){next=act(state,actions[type]);if(next!==state){const upgraded=type==='upgrade'?state.deck.find(c=>c.uid===uid):null;upgradeNotice=upgraded?{name:CARDS[upgraded.id].name,changes:upgradeChanges(upgraded),after:describe({...upgraded,plus:true})}:null;const previous=state,fx=combatEffects(state,next,actions[type]);state=next;selectedUid=null;notice='';save();render();showCombatEffects(root,fx);showComboEffects(root,previous,state,CARDS);if(type==='node'||['reward','skip','heal','upgrade','leave','risk','safe','quiz-next','quiz-leave'].includes(type))window.scrollTo({top:0,behavior:'auto'});}}
});
root.addEventListener('change',async e=>{
 if(e.target.id!=='import')return;const f=e.target.files?.[0];if(!f)return;
 try{if(f.size>100000)throw Error('100KB以内のJSONを選んでください。');const s=parseRun(await f.text());if(!confirm('このバックアップで現在の冒険を置き換えますか？'))return;state=s;selectedUid=null;upgradeNotice=null;loadError='';notice='記録を読み込みました。';save();}catch(err){notice='読み込めません：'+err.message;}render();
});
render();
window.__towerStarted=true;
document.querySelector('#startup')?.remove();
