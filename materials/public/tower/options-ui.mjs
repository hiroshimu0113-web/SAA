export function openOptions(root,views){
 const focus=document.activeElement,overflow=document.body.style.overflow;
 const overlay=document.createElement('div');overlay.className='options-overlay';
 overlay.innerHTML='<section class="options-dialog" role="dialog" aria-modal="true" aria-labelledby="options-title"><header><button data-menu="back" hidden>戻る</button><h2 id="options-title">オプション</h2><button data-menu="close" aria-label="オプションを閉じる">閉じる</button></header><div class="options-content"></div></section>';
 const content=overlay.querySelector('.options-content'),heading=overlay.querySelector('h2'),back=overlay.querySelector('[data-menu=back]');
 const priorHidden=root.getAttribute('aria-hidden');root.setAttribute('aria-hidden','true');root.inert=true;document.body.style.overflow='hidden';
 function show(name){heading.textContent=name||'オプション';back.hidden=!name;content.innerHTML=name?views[name]():'<nav class="options-menu">'+Object.keys(views).map(x=>'<button data-view="'+x+'">'+x+'</button>').join('')+'</nav>';overlay.querySelector('.options-dialog').scrollTop=0;(name?back:content.querySelector('button')).focus();}
 function close(){overlay.remove();root.inert=false;if(priorHidden===null)root.removeAttribute('aria-hidden');else root.setAttribute('aria-hidden',priorHidden);document.body.style.overflow=overflow;document.removeEventListener('keydown',keys,true);focus?.isConnected?focus.focus():root.querySelector('[data-action=options]')?.focus();}
 function keys(e){if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();}else if(e.key==='Tab'){const all=[...overlay.querySelectorAll('button,a[href],summary')].filter(x=>!x.hidden&&x.getClientRects().length);const i=all.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();all[all.length-1].focus();}else if(!e.shiftKey&&(i===all.length-1||i<0)){e.preventDefault();all[0].focus();}}}
 overlay.addEventListener('click',e=>{const el=e.target.closest('button');if(e.target===overlay||el?.dataset.menu==='close')close();else if(el?.dataset.menu==='back')show();else if(el?.dataset.view)show(el.dataset.view);});
 document.body.append(overlay);document.addEventListener('keydown',keys,true);show();
}
