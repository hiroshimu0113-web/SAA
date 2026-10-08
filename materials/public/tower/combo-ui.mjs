import {icon} from './icons.mjs';
import {cardIcon} from './card-icons.mjs';
import {COMBOS,triggeredCombos} from './combos.mjs';
let timer=null;
export function showComboEffects(root,before,after,names){
 const ids=triggeredCombos(before,after);if(!ids.length)return;
 clearTimeout(timer);root.querySelector('.combo-toast')?.remove();
 const box=document.createElement('aside');box.className='combo-toast';box.setAttribute('role','status');box.setAttribute('aria-label','役成立');
 for(const id of ids){const r=COMBOS[id],row=document.createElement('section'),title=document.createElement('strong'),icons=document.createElement('div'),effect=document.createElement('b');title.innerHTML=icon(id);title.append(document.createTextNode('役成立：'+r.name));icons.className='combo-icons';
 r.cards.forEach((c,i)=>{const chip=document.createElement('span');chip.innerHTML=cardIcon(names[c].kind);chip.append(document.createTextNode(' '+names[c].name));icons.append(chip);});effect.textContent=r.label;row.append(title,icons,effect);box.append(row);}
 root.append(box);timer=setTimeout(()=>box.remove(),1000);
}
