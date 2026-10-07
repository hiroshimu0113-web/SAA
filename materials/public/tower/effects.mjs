import {DEBUFFS} from './debuffs.mjs';
import {triggeredCombos} from './combos.mjs';
import {cardValues} from './engine.mjs';
// Presentation only: derive outcomes from the committed before/after states.
export function combatEffects(before,after,action){
 if(before===after||before?.phase!=='battle'||!['play','end'].includes(action.type))return [];
 const b=before.battle,n=after.battle,out=[];
 if(action.type==='end'){const events=[...n.events];if(n.hp===0&&b.hp>0)events.push({side:'enemy',kind:'finish',value:0,label:'撃破！'});return events;}
 const add=(side,kind,value,label)=>out.push({side,kind,value,label});
 if(action.type==='play'){
  const c=before.deck.find(c=>c.uid===action.uid);if(!c||!b.hand.includes(c.uid))return [];
  const d=cardValues(c),hits=d.hits||1;if(d.battleOnly)add('player','power',0,'障害ログを除外');
  if(d.damage){
   const loss=b.hp-n.hp,blocked=Math.max(0,b.block-n.block);
   if(loss)add('enemy','hit',loss,'−'+loss+(hits>1&&!triggeredCombos(before,after).length?' / '+hits+' HIT':''));
   if(blocked)add('enemy','guard',blocked,'防御 '+blocked);
  }
  if(n.playerBlock>b.playerBlock)add('player','shield',n.playerBlock-b.playerBlock,'◇ ＋'+(n.playerBlock-b.playerBlock));
  if(d.strength||d.armor||d.energy)add('player','power',0,d.strength?'攻撃力 ＋'+d.strength:d.armor?'毎ターン防御 ＋'+d.armor:'⚡ ＋'+d.energy);
  if(d.debuff){const {id,amount}=d.debuff;if(n.enemyDebuffs[id]>b.enemyDebuffs[id])add('enemy','debuff',amount,DEBUFFS[id].name+(id==='delay'?' 付与':' ＋'+amount));}
 }
 if(after.hp<before.hp)add('player','hit',before.hp-after.hp,'−'+(before.hp-after.hp));
 if(after.hp>before.hp)add('player','heal',after.hp-before.hp,'回復 ＋'+(after.hp-before.hp));
 if(n.hp===0&&b.hp>0)add('enemy','finish',0,'撃破！');
 return out;
}
let clearEffects=()=>{};
export function showCombatEffects(root,effects,demo=false){
 if(!effects.length)return;
 const stage=root.querySelector('.arena')||root.querySelector('.scene')||root;
 clearEffects();
 const layer=document.createElement('div');layer.className='combat-fx';layer.setAttribute('aria-hidden','true');
 const counts={player:0,enemy:0};
 for(const fx of effects){
  const el=document.createElement('div');el.className='fx-event fx-'+fx.kind+' fx-'+fx.side;el.dataset.kind=fx.kind;el.style.setProperty('--row',counts[fx.side]++);el.textContent=fx.label;layer.append(el);
  const target=root.querySelector(fx.side==='enemy'?'.enemy':'.operator');
  if(target){target.classList.add('react-'+fx.kind);}
 }
 stage.append(layer);
 const info=document.createElement('div');info.className='combat-toast';info.setAttribute('role','status');
 const heading=document.createElement('strong');heading.textContent=demo?'演出テスト（記録は変わりません）':'戦闘結果';info.append(heading);
 for(const fx of effects){const row=document.createElement('div');row.className='toast-'+fx.kind;row.textContent=(fx.side==='enemy'?'敵：':'自分：')+fx.label;info.append(row);}
 root.append(info);
 // The fixed result remains visible even when the arena is above the viewport.
 const targets=[...stage.querySelectorAll('[class*="react-"]')];
 const cleanup=()=>{layer.remove();info.remove();for(const el of targets)for(const name of [...el.classList])if(name.startsWith('react-'))el.classList.remove(name);};
 const timer=setTimeout(cleanup,1000);clearEffects=()=>{clearTimeout(timer);cleanup();};

}
