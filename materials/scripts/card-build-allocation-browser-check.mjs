import {chromium,webkit} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import assert from 'node:assert/strict';
import {terms} from '../src/content/index.ts';
const supplement=JSON.parse(await readFile('knowledge/game-supplement.json','utf8'));
const data=supplement.characterCardAllocation;
assert.deepEqual(data,JSON.parse(await readFile('public/design/card-build-allocation.json','utf8')));
assert.deepEqual(data.candidates.map(c=>c.termId).sort(),[...terms,...supplement.terms].map(t=>t.id).sort());
assert.equal(new Set(data.candidates.map(c=>c.id)).size,data.candidates.length);
assert.equal(data.builds.length,18);assert.equal(new Set(data.builds.map(b=>b.characterId)).size,6);
for(const c of data.candidates){assert.ok(c.memberships.length||c.remainderId);for(const m of c.memberships)assert.ok(data.builds.find(b=>b.id===m.buildId)?.cards.find(x=>x.candidateId===c.id&&x.role===m.role&&x.usage===m.usage&&x.usageCondition===m.usageCondition));}
for(const b of data.builds)for(const c of b.cards){assert.ok(Object.hasOwn(data.axes.role.values,c.role));assert.ok(Object.hasOwn(data.axes.usage.values,c.usage));assert.ok(c.usageCondition.length>0);}
assert.equal(data.schema,2);assert.equal(data.candidates.filter(c=>c.remainderId).length,17);assert.equal(data.builds.flatMap(b=>b.cards).length,215);
const html=await readFile('public/design/card-build-allocation.html');
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});res.end(html)});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{const wk=process.env.BROWSER==='webkit';browser=await(wk?webkit:chromium).launch(wk?{}:{executablePath:process.env.CHROME_PATH});const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));const url='http://127.0.0.1:'+server.address().port;await p.goto(url);assert.equal(await p.locator('.membership').count(),215);assert.ok(await p.locator('#axes').isVisible());assert.equal(await p.locator('.membership[data-role="中核"][data-usage="特定条件で使える"]').count()>0,true);await p.locator('#search').fill('remainder-dms');assert.equal(await p.locator('.candidate:visible').count(),1);await p.locator('a[href="#c-ec2"]').first().click();assert.equal(await p.locator('.candidate:visible').count(),data.candidates.length);for(const width of [320,390,1024]){await p.setViewportSize({width,height:800});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}assert.deepEqual(await p.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);assert.deepEqual(errors,[]);assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),[]);const n=await browser.newPage({javaScriptEnabled:false});await n.goto(url);assert.equal(await n.locator('.candidate').count(),data.candidates.length);console.log('PASS full candidate coverage, memberships, search/reset, anchors, noJS, mobile widths and no save changes');}finally{await browser?.close();await new Promise(r=>server.close(r));}
