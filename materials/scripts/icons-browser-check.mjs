import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium,webkit} from '@playwright/test';
import {preview} from 'vite';
import {ICON_PATHS,icon} from '../public/tower/icons.mjs';
import {CARD_TYPES,cardIcon} from '../public/tower/card-icons.mjs';
import {BASE_CARDS} from '../public/tower/card-definitions.mjs';
import {NODE_NAMES,act,QUIZZES} from '../public/tower/engine.mjs';
import {KEY,fixture,withEnemy,allRelics,load,openMenu,RELICS,ENEMIES} from './icon-fixtures.mjs';
for(const group of [Object.keys(ENEMIES),Object.keys(RELICS)]){
 assert.ok(group.every(id=>ICON_PATHS[id]),'complete ID coverage');assert.equal(new Set(group.map(id=>ICON_PATHS[id])).size,group.length,'unique category paths');
}
for(const kind of ['attack','skill','power','junk'])assert.match(cardIcon(kind),new RegExp('data-icon="'+CARD_TYPES[kind].icon+'"'));
for(const card of Object.values(BASE_CARDS))assert.ok(CARD_TYPES[card.kind]);
assert.throws(()=>icon('unknown'),/Unknown icon/);assert.throws(()=>cardIcon('unknown'),/Unknown card kind/);
const server=await preview({preview:{host:'127.0.0.1',port:4179,strictPort:true}}),kind=process.env.BROWSER||'chromium';
const browser=await (kind==='webkit'?webkit:chromium).launch(kind==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try{
 await mkdir('artifacts',{recursive:true});const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4179/tower/icons.html');
 await load(p,fixture('map'));assert.equal(await p.locator('.node').count(),15);
 for(const node of await p.locator('.node').all()){
  const label=node.locator('.node-name'),svg=label.locator('svg'),text=label.locator('span');assert.equal(await svg.count(),1);const {a,b}=await label.evaluate(e=>{const rect=x=>{const r=x.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};return {a:rect(e.querySelector('svg')),b:rect(e.querySelector('span'))};});assert.ok(a.x+a.width<=b.x+1&&Math.abs((a.y+a.height/2)-(b.y+b.height/2))<3,'map horizontal label: '+JSON.stringify({a,b}));
 }
 const before=await p.evaluate(k=>localStorage.getItem(k),KEY);await p.reload();assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),before);
 for(const id of Object.keys(ENEMIES)){
  await load(p,withEnemy(id));assert.equal(await p.locator('.enemy-glyph [data-icon="'+id+'"]').count(),1);
  await p.locator('[data-status=enemy]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.status-dialog h2 [data-icon="'+id+'"]').count(),1);await p.locator('[data-action=close-status]').click();
 }
 await load(p,allRelics());await openMenu(p,'所持レリック');for(const id of Object.keys(RELICS))assert.equal(await p.locator('.relic-details li [data-icon="'+id+'"]').count(),1);
 // Award result uses the exact relic ID, not the coin glyph.
 let q=fixture('event');for(let i=0;i<2;i++){q=act(q,{type:'quiz-answer',questionId:q.quiz.ids[i],choice:QUIZZES[q.quiz.ids[i]].answer});q=act(q,{type:'quiz-next',questionId:q.quiz.ids[i]});}
 assert.ok(q.quiz.result.relic);await p.keyboard.press('Escape');await load(p,q);assert.equal(await p.locator('.quiz-result [data-icon="'+q.quiz.result.relic+'"]').count(),1);assert.equal(await p.locator('.quiz-result [data-icon=coin]').count(),0);
 await p.setContent('<style>body{background:#10212c;color:#eee9d9;font:16px system-ui;padding:24px}main{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}section{border:1px solid #44606c;padding:12px;display:flex;align-items:center;gap:10px}svg{width:32px;height:32px;flex:none}h2{grid-column:1/-1}</style><main>'+[['カード',Object.entries(CARD_TYPES).map(([id,d])=>[id,d.name,cardIcon(id)])],['敵',Object.entries(ENEMIES).map(([id,d])=>[id,d.name,icon(id)])],['レリック',Object.entries(RELICS).map(([id,d])=>[id,d.name,icon(id)])],['マップ',Object.entries(NODE_NAMES).map(([id,name])=>[id,name,icon(id)])]].map(([label,items])=>'<h2>'+label+'</h2>'+items.map(([id,name,svg])=>'<section>'+svg+'<span>'+name+'<br><small>'+id+'</small></span></section>').join('')).join('')+'</main>');await p.setViewportSize({width:1000,height:900});await p.screenshot({path:'artifacts/icons-roster.png',fullPage:true});assert.deepEqual(errors,[]);await c.close();console.log('PASS icons: 4 kinds, 12 unique enemies, 24 unique relics, matching status/award icons, 15 horizontal nodes and unchanged resume.');
}finally{await browser.close();await server.close();}
