import assert from 'node:assert/strict';
import {newRun,act} from '../public/tower/engine.mjs';
export async function checkHandIcons(browser,base){
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=await ctx.newPage(),key='saa-tower-run-v1';
 const load=async s=>{await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();};
 const read=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 async function centered(){await p.waitForTimeout(250);const ids=await p.locator('.hand .card').evaluateAll(es=>es.map(e=>e.dataset.uid));assert.equal(await p.locator('.fan-active').getAttribute('data-uid'),ids[Math.floor((ids.length-1)/2)]);const offset=await p.locator('.hand').evaluate(e=>{const c=e.querySelector('.fan-active');return(c.offsetLeft+c.offsetWidth/2-e.scrollLeft)/e.clientWidth;});assert.ok(Math.abs(offset-.38)<.015,'left aligned focus '+offset);}
 try{
 await p.goto(base+'tower/hand-icons.html');
 let s=act(newRun(2),{type:'node',lane:0});s.deck[0].id='strike';s.battle.hand=s.deck.map(c=>c.uid);s.battle.draw=[];s.battle.energy=1;
 for(const double of [false,true]){
  const test=JSON.parse(JSON.stringify(s));if(double){test.battle.playerDebuffs.delay=2;test.battle.playerActions=2;}
  await load(test);await centered();await p.locator('.hand').evaluate(e=>e.scrollLeft=0);await p.locator('.hand .card').first().tap();await p.locator('.turn-blocker').waitFor({state:'detached'});await centered();assert.equal((await read()).battle.turn,double?1:2);assert.equal((await read()).battle.playerActions,1);
 }
 await p.locator('[data-action=end]').tap();await p.locator('.turn-blocker').waitFor({state:'detached'});await centered();
 await p.screenshot({path:'artifacts/hand-icons-battle.png'});let before=await read();const card=p.locator('.hand .card').first();await card.focus();await p.keyboard.press('Shift+F10');assert.equal(await p.locator('.card-preview [data-action=cancel-card]').count(),1);await p.locator('.card-preview>.card').click({position:{x:5,y:130}});assert.equal(await p.locator('.card-preview').count(),0);assert.deepEqual(await read(),before);
 await p.locator('[data-action=options]').tap();await p.getByRole('button',{name:'デッキ',exact:true}).tap();await p.locator('[data-inspect]').first().focus();await p.keyboard.press('Enter');assert.equal(await p.locator('[data-menu=back]').isVisible(),false);await p.locator('.options-card-detail>.card').click({position:{x:5,y:130}});await p.locator('.options-cards').waitFor();assert.deepEqual(await read(),before);await p.keyboard.press('Escape');
 let shop=newRun(2);shop.routes[1]=['shop','battle'];shop.floor=1;shop.history=[{floor:0,lane:0,type:'battle'}];shop.gold=200;shop=act(shop,{type:'node',lane:0});shop.shopRelic='discount';shop.stock=['burst','detour','redundant'];
 for(const width of [320,390]){await p.setViewportSize({width,height:844});await load(shop);const prices=await p.locator('.shop-shelf .shop-price').evaluateAll(es=>es.map(e=>({y:e.getBoundingClientRect().bottom,text:e.textContent})));assert.equal(prices.length,5);assert.ok(prices.every(x=>Math.abs(x.y-prices[0].y)<2));assert.deepEqual(prices.map(x=>x.text),['35 C','35 C','35 C','100 C','45 C']);assert.equal(await p.locator('.shop-shelf .card .kind').count(),3);assert.equal(await p.locator('.shop-shelf .card .card-effect-icons').count(),3);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width===390)await p.screenshot({path:'artifacts/hand-icons-shop.png',fullPage:true});}
 await p.locator('[data-action=buy]').first().focus();await p.keyboard.press('Shift+F10');assert.equal(await p.locator('[data-menu=back]').isVisible(),false);await p.locator('.options-card-detail>.card').click({position:{x:5,y:130}});assert.equal(await p.locator('.options-overlay').count(),0);
 assert.equal((await read()).gold,200);console.log('PASS hand icons: auto/manual/double-window recenter at 38%, blank detail close without action, one close control, aligned five prices and effect badges at 320/390.');
 }finally{await ctx.close();}
}
