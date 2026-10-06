import {COMBOS,triggeredCombos} from './combos.mjs';
let timer=null;
export function showComboEffects(root,before,after,names){
 const ids=triggeredCombos(before,after);if(!ids.length)return;
 clearTimeout(timer);root.querySelector('.combo-toast')?.remove();
 const box=document.createElement('aside');box.className='combo-toast';box.setAttribute('role','status');box.setAttribute('aria-label','役成立');
 for(const id of ids){const r=COMBOS[id],row=document.createElement('section'),title=document.createElement('strong'),icons=document.createElement('div'),effect=document.createElement('b');title.textContent='役成立：'+r.name;icons.className='combo-icons';
 r.cards.forEach((c,i)=>{const chip=document.createElement('span');chip.textContent=r.icons[i]+' '+names[c].name;icons.append(chip);});effect.textContent=r.label;row.append(title,icons,effect);box.append(row);}
 root.append(box);timer=setTimeout(()=>box.remove(),1000);
}
