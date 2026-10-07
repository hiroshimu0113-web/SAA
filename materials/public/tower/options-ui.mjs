export function openOptions(root,views){
 const focus=document.activeElement,overflow=document.body.style.overflow;
 const overlay=document.createElement('div');overlay.className='options-overlay';
 overlay.innerHTML='<section class="options-dialog" role="dialog" aria-modal="true" aria-labelledby="options-title"><header><button data-menu="back" hidden>戻る</button><h2 id="options-title">オプション</h2><button data-menu="close" aria-label="オプションを閉じる">閉じる</button></header><div class="options-content"></div></section>';
 const content=overlay.querySelector('.options-content'),heading=overlay.querySelector('h2'),back=overlay.querySelector('[data-menu=back]'),panel=overlay.querySelector('.options-dialog');
 const priorHidden=root.getAttribute('aria-hidden');root.setAttribute('aria-hidden','true');root.inert=true;document.body.style.overflow='hidden';
 let view='',detail=null,hold=null,pointer=null,suppressUntil=0;
 function clearHold(){clearTimeout(hold);hold=null;pointer=null;}
 function show(name){clearHold();view=name||'';detail=null;heading.textContent=name||'オプション';back.hidden=!name;content.innerHTML=name?views[name]():'<nav class="options-menu">'+Object.keys(views).map(x=>'<button data-view="'+x+'">'+x+'</button>').join('')+'</nav>';panel.scrollTop=0;(name?back:content.querySelector('button')).focus();}
 function inspect(card){
  if(detail||!card?.isConnected)return;
  clearHold();detail={nodes:[...content.childNodes],scroll:panel.scrollTop,card};
  heading.textContent='カード詳細';content.innerHTML='<div class="options-card-detail">'+card.closest('article').querySelector('template').innerHTML+'</div>';panel.scrollTop=0;back.focus();
 }
 function goBack(){clearHold();if(!detail){show();return;}const old=detail;detail=null;heading.textContent=view;content.replaceChildren(...old.nodes);old.card.focus({preventScroll:true});panel.scrollTop=old.scroll;}
 function close(){clearHold();overlay.remove();root.inert=false;if(priorHidden===null)root.removeAttribute('aria-hidden');else root.setAttribute('aria-hidden',priorHidden);document.body.style.overflow=overflow;document.removeEventListener('keydown',keys,true);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',clearHold);window.removeEventListener('pointercancel',clearHold);window.removeEventListener('blur',clearHold);focus?.isConnected?focus.focus():root.querySelector('[data-action=options]')?.focus();}
 function keys(e){
  const card=e.target.closest?.('[data-inspect]');
  if(card&&(e.key==='Enter'||e.key===' '||e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10'))){e.preventDefault();e.stopImmediatePropagation();inspect(card);return;}
  if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();detail?goBack():close();}
  else if(e.key==='Tab'){const all=[...overlay.querySelectorAll('button,a[href],summary')].filter(x=>!x.hidden&&x.getClientRects().length);const i=all.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();all[all.length-1].focus();}else if(!e.shiftKey&&(i===all.length-1||i<0)){e.preventDefault();all[0].focus();}}
 }
 function move(e){if(pointer&&e.pointerId===pointer.id&&(Math.abs(e.clientX-pointer.x)>12||Math.abs(e.clientY-pointer.y)>12))clearHold();}
 overlay.addEventListener('pointerdown',e=>{const card=e.target.closest('[data-inspect]');if(pointer){clearHold();return;}if(!card||e.button!==0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};hold=setTimeout(()=>{inspect(card);suppressUntil=Date.now()+500;},450);},{passive:true});
 overlay.addEventListener('contextmenu',e=>{if(e.target.closest('[data-inspect]'))e.preventDefault();});
 overlay.addEventListener('click',e=>{if(Date.now()<suppressUntil){e.preventDefault();return;}const el=e.target.closest('button');if(e.target===overlay||el?.dataset.menu==='close')close();else if(el?.dataset.menu==='back')goBack();else if(el?.dataset.view)show(el.dataset.view);});
 window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerup',clearHold);window.addEventListener('pointercancel',clearHold);window.addEventListener('blur',clearHold);
 document.body.append(overlay);document.addEventListener('keydown',keys,true);show();
}
