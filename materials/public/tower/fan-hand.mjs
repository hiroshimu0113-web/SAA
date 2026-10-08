// Presentation only: the engine and saved hand order never change here.
export function mountFanHand(hand,{scrollLeft=null}={}){
 const cards=[...hand.querySelectorAll('.card')];if(!cards.length)return;
 let hovered=null,frame=0;
 const center=card=>card.offsetLeft+card.offsetWidth/2;
 const nearest=x=>cards.reduce((best,c,i)=>Math.abs(center(c)-x)<Math.abs(center(cards[best])-x)?i:best,0);
 function paint(){
  const active=hovered??nearest(hand.scrollLeft+hand.clientWidth/2);
  cards.forEach((card,i)=>{const distance=i-active,amount=Math.min(Math.abs(distance),4);
   card.style.setProperty('--fan-angle',Math.max(-32,Math.min(32,distance*9))+'deg');
   card.style.setProperty('--fan-scale',String(1-amount*.055));
   card.style.setProperty('--fan-drop',amount*9+'px');
   card.style.zIndex=String(10-amount);card.classList.toggle('fan-active',i===active);
  });
 }
 function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(paint);}
 hand.classList.add('fan-hand');
 hand.scrollLeft=scrollLeft===null?center(cards[Math.floor((cards.length-1)/2)])-hand.clientWidth/2:scrollLeft;
 hand.addEventListener('scroll',()=>{hovered=null;schedule();},{passive:true});
 hand.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||e.buttons)return;const bounds=hand.getBoundingClientRect();hovered=nearest(e.clientX-bounds.left+hand.scrollLeft);schedule();},{passive:true});
 hand.addEventListener('pointerleave',()=>{hovered=null;schedule();},{passive:true});
 hand.addEventListener('focusin',e=>{const i=cards.indexOf(e.target);if(i<0)return;hovered=i;paint();});
 // A resized viewport changes the scroll center, not the underlying hand.
 const observer=new ResizeObserver(schedule);observer.observe(hand);
 paint();
 return ()=>{observer.disconnect();cancelAnimationFrame(frame);};
}
