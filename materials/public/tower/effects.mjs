import {cardValues,intent} from './engine.mjs';
// Presentation only: derive outcomes from the committed before/after states.
export function combatEffects(before,after,action){
 if(before===after||before?.phase!=='battle'||!['play','end'].includes(action.type))return [];
 const b=before.battle,n=after.battle,out=[];
 const add=(side,kind,value,label)=>out.push({side,kind,value,label});
 if(action.type==='play'){
  const c=before.deck.find(c=>c.uid===action.uid);if(!c||!b.hand.includes(c.uid))return [];
  const d=cardValues(c),hits=d.hits||1;
  if(d.damage){
   const loss=b.hp-n.hp,blocked=Math.max(0,b.block-n.block);
   if(loss)add('enemy','hit',loss,'−'+loss+(hits>1?' / '+hits+' HIT':''));
   if(blocked)add('enemy','guard',blocked,'防御 '+blocked);
  }
  if(n.playerBlock>b.playerBlock)add('player','shield',n.playerBlock-b.playerBlock,'◇ ＋'+(n.playerBlock-b.playerBlock));
  if(d.strength||d.armor||d.energy)add('player','power',0,d.strength?'攻撃力 UP':d.armor?'持続防御 UP':'⚡ ＋'+d.energy);
  if(d.weak)add('enemy','weak',d.weak,'弱体 ＋'+d.weak);
 }else{
  const i=intent(before);
  if(i.type==='attack'){
   const blocked=Math.min(i.value,b.playerBlock);
   if(blocked)add('player','guard',blocked,(blocked===i.value?'完全ガード ':'防御 ')+blocked);
  }
  if(i.type==='guard')add('enemy','shield',i.value,'◇ ＋'+i.value);
  if(i.type==='buff')add('enemy','power',i.value,'攻撃力 UP');
  if(after.phase==='battle'&&n.armor)add('player','shield',n.armor,'◇ ＋'+n.armor);
 }
 if(after.hp<before.hp)add('player','hit',before.hp-after.hp,'−'+(before.hp-after.hp));
 if(after.hp>before.hp)add('player','heal',after.hp-before.hp,'回復 ＋'+(after.hp-before.hp));
 if(n.hp===0&&b.hp>0)add('enemy','finish',0,'撃破！');
 return out;
}
export function showCombatEffects(root,effects){
 if(!effects.length)return;
 const stage=root.querySelector('.arena')||root.querySelector('.scene');if(!stage)return;
 const layer=document.createElement('div');layer.className='combat-fx';layer.setAttribute('aria-hidden','true');
 const counts={player:0,enemy:0};
 for(const fx of effects){
  const el=document.createElement('div');el.className='fx-event fx-'+fx.kind+' fx-'+fx.side;el.dataset.kind=fx.kind;el.style.setProperty('--row',counts[fx.side]++);el.textContent=fx.label;layer.append(el);
  const target=root.querySelector(fx.side==='enemy'?'.enemy':'.operator');
  if(target){target.classList.add('react-'+fx.kind);}
 }
 stage.append(layer);
 const info=document.createElement('p');info.className='combat-announcement';info.setAttribute('role','status');info.textContent=effects.map(fx=>(fx.side==='enemy'?'敵：':'自分：')+fx.label).join('、');stage.append(info);
 // Remove only these nodes: rapid taps never cancel or postpone game actions.
 setTimeout(()=>{layer.remove();info.remove();for(const el of stage.querySelectorAll('[class*="react-"]'))for(const name of [...el.classList])if(name.startsWith('react-'))el.classList.remove(name);},1100);
}
