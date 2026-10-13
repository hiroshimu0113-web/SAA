import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import {newJourney,transition,SAVE_KEY,validateJourney,HEROES} from '../public/tower/build-adventure-engine.mjs';
import {policy} from './build-lab-balance.mjs';
const atlas=await readFile('dist/tower/portraits/serious-atlas-v1.png');
const html=await readFile('dist/tower/index.html'),legacy=await readFile('dist/tower/legacy.html');assert.ok(!html.toString().includes('type="module"'));
for(const entry of ['motifs','portraits','cylinder','build-colours','builds','options','role-seams','fan','menu'])assert.deepEqual(await readFile('dist/tower/'+entry+'.html'),html,'promoted bookmark '+entry);
const server=createServer((req,res)=>{if(req.url?.endsWith('/portraits/serious-atlas-v1.png')){res.setHeader('Content-Type','image/png');res.end(atlas);return;}res.setHeader('Content-Type','text/html;charset=utf-8');res.end(req.url?.includes('legacy.html')?legacy:html);});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await(process.env.BROWSER==='webkit'?webkit:chromium).launch(process.env.BROWSER==='webkit'?{}:{executablePath:process.env.CHROME_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port+'/tower/index.html';await page.goto(url);
 await page.evaluate(()=>localStorage.setItem('saa-tower-run-v1','legacy-sentinel'));
 const saved=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),SAVE_KEY);
 const load=async s=>{validateJourney(s);await page.evaluate(([key,s])=>localStorage.setItem(key,JSON.stringify(s)),[SAVE_KEY,s]);await page.reload();};
 assert.equal(await page.locator('.hero-cylinder').getAttribute('data-selected'),'random');await page.locator('[data-chamber="5"]').click();await page.click('[data-action="new"]');assert.equal((await saved()).combat.hero,'builder');await page.waitForTimeout(3100);
 assert.ok(await page.locator('.build-floor.current').evaluate(e=>{const r=e.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}));await page.click('.build-floor.current [data-action="enter"]');assert.ok(await page.locator('.resources>strong').isVisible());assert.match(await page.locator('.resources>strong').textContent(),/72/);
 await page.locator('.hand .card:not([aria-disabled])').first().click();await page.waitForFunction(()=>document.querySelector('#game').getAttribute('aria-busy')!=='true');assert.ok((await saved()).combat.metrics.plays>0);const turnBefore=(await saved()).combat.turn;await page.click('[data-action="end"]');await page.waitForTimeout(1300);assert.equal((await saved()).combat.turn,turnBefore+1);
 await page.click('[data-action="options"]');await page.click('[data-view="コレクション"]');assert.equal(await page.locator('.options-cards article').count(),30);
 const surface=id=>page.locator('.options-cards [data-id="'+id+'"]').evaluate(e=>({colour:getComputedStyle(e).borderTopColor,background:getComputedStyle(e).backgroundImage,build:e.dataset.build}));
 const lambda=await surface('lambda'),scaling=await surface('auto-scaling'),front=await surface('cloudfront');assert.equal(lambda.colour,scaling.colour);assert.equal(lambda.background,scaling.background);assert.notEqual(lambda.colour,front.colour);assert.equal((await surface('ec2-burst')).build,'common');assert.equal(await page.locator('.build-legend span').count(),7);
 await page.screenshot({path:'/tmp/build-colours.png',fullPage:true});
 const inspect=page.locator('[data-inspect]').first();await inspect.focus();await page.keyboard.press('Enter');assert.ok(await page.locator('.options-card-detail').isVisible());await page.click('[data-menu="close"]');await page.click('[data-menu="close"]');
 for(const width of [320,390,1024]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);}
 // Every family has a playable battle and survives reload.
 for(const h of Object.keys(HEROES)){let s=newJourney(h,10);s=transition(s,{kind:'enter',scenario:'attack'});await load(s);await page.locator('.avatar .portrait-'+h+' img').evaluate(async img=>{await img.decode();if(img.naturalWidth!==1536||img.getBoundingClientRect().width===0)throw Error('Battle portrait missing');});await page.locator('.hand .card:not([aria-disabled])').first().click();await page.waitForTimeout(1200);assert.equal((await saved()).combat.hero,h);await page.reload();assert.match(await page.locator('.header-title').textContent(),new RegExp(HEROES[h].name));}
 let s=newJourney('guardian',1);s=transition(s,{kind:'enter',scenario:'attack'});while(s.screen==='battle')s=transition(s,policy(s.combat));await load(s);await page.click('[data-action="select"][data-id="upgrade"]');await page.locator('[data-action="upgrade"]').first().click();assert.equal((await saved()).combat.upgradeAvailable,false);await page.locator('[data-action="reward"]').first().click();assert.equal((await saved()).screen,'camp');await page.click('[data-action="camp"][data-id="shop"]');
 const before=await saved();await page.locator('[data-action="buy"]:not([disabled])').first().click();assert.equal((await saved()).combat.coins,before.combat.coins-35);assert.equal((await saved()).combat.deck.length,before.combat.deck.length+1);
 await page.setViewportSize({width:390,height:844});const boxes=await page.locator('.shop-shelf article').evaluateAll(nodes=>nodes.map(n=>({y:n.getBoundingClientRect().top,x:n.getBoundingClientRect().left})));assert.equal(boxes.length,5);assert.ok(boxes.every(b=>Math.abs(b.y-boxes[0].y)<2));await page.screenshot({path:'/tmp/build-adventure-shop.png',fullPage:true});
 await page.click('[data-action="leave"]');assert.equal((await saved()).screen,'map');await page.reload();assert.equal((await saved()).screen,'map');
 s=newJourney('restorer',1);s=transition(s,{kind:'enter',scenario:'attack'});s.combat.data.healthy=false;await load(s);await page.click('[data-action="restore"]');assert.equal((await saved()).combat.data.healthy,true);
 await page.waitForTimeout(1300);await page.locator('.hand').scrollIntoViewIfNeeded();await page.waitForTimeout(200);const card=page.locator('.hand .card.fan-active');const box=await card.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(550);await page.mouse.up();assert.ok(await page.locator('.options-card-detail').isVisible());await page.click('[data-menu="close"]');await page.waitForTimeout(700);
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(200);await page.screenshot({path:'/tmp/build-adventure-battle.png',fullPage:true});
 let elite=newJourney('tuner',55);elite.combat.floor=3;elite.routes[2]=['attack','elite'];await load(elite);await page.click('.build-floor.current [data-scenario="elite"]');assert.match(await page.locator('.arena h2').textContent(),/強敵/);elite=await saved();elite.combat.enemy.hp=1;await load(elite);await page.click('[data-action="end"]');await page.waitForTimeout(1300);assert.equal((await saved()).screen,'reward');assert.match(await page.locator('.scene').textContent(),/現在のデッキ/);const offerIDs=(await saved()).combat.offers;await page.reload();assert.deepEqual((await saved()).combat.offers,offerIDs);
 assert.equal(await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),'legacy-sentinel');assert.deepEqual(errors,[]);
 console.log('PASS revised adventure: 6 heroes, map, 30-card collection, details, legacy-save preservation, reward, upgrades, shop purchase, five slots, restore, reload, widths, promoted entry/bookmarks, build colours, elite reward/reload.');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
