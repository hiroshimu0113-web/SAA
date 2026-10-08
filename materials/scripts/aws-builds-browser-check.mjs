import {chromium,webkit} from '@playwright/test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile(new URL('../public/design/aws-builds.html',import.meta.url));
const supplement=JSON.parse(await readFile(new URL('../knowledge/game-supplement.json',import.meta.url),'utf8'));
const data=supplement.architectureBuildResearch;
const ledger=JSON.parse(await readFile(new URL('../knowledge/game-classifications.json',import.meta.url),'utf8')).items;
const idSet=new Set(ledger.map(x=>x.id));assert.equal(idSet.size,ledger.length);
for(const item of [...data.builds,...data.cases])assert.ok(idSet.has(item.classification_id));
for(const c of data.cases){assert.equal(c.questions.length,2);for(const q of c.questions){assert.equal(q.options.length,3);assert.equal(q.options.filter(o=>o.id===q.correct_option_id).length,1);assert.ok(q.options.every(o=>o.explanation));}for(const id of c.recommended)assert.ok(data.builds.some(x=>x.id===id));}
assert.ok(data.builds.every(x=>x.source_ids.every(k=>data.sources[k]?.url.startsWith('https://docs.aws.amazon.com/'))));
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
try{
 const isWebkit=process.env.BROWSER==='webkit';browser=await (isWebkit?webkit:chromium).launch(isWebkit?{}:{executablePath:process.env.CHROME_PATH||undefined});
 const context=await browser.newContext({viewport:{width:320,height:740},hasTouch:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port+'/SAA/design/aws-builds.html';
 await page.goto(url);assert.equal(await page.locator('.build:visible').count(),18);assert.equal(await page.locator('.case').count(),8);assert.equal(await page.locator('.quiz').count(),16);
 const keys=await page.evaluate(()=>Object.keys(localStorage));assert.deepEqual(keys,[]);
 await page.selectOption('#category','データ高速化');assert.equal(await page.locator('.build:visible').count(),3);
 await page.fill('#search','該当しない語句');assert.ok(await page.locator('#empty').isVisible());
 await page.fill('#search','');await page.selectOption('#category','');
 for(const c of data.cases){await page.selectOption('#scenario',c.id);assert.equal(await page.locator('#suggestions a').count(),c.recommended.length);assert.ok((await page.locator('#scenario-summary').innerText()).includes(c.why));}
 await page.fill('#search','該当しない語句');await page.locator('#suggestions a').first().click();assert.equal(await page.locator('.build:visible').count(),18);
 // Show all branches and verify answer IDs rather than relying on option order.
 await page.locator('.case > details').evaluateAll(list=>list.forEach(d=>d.open=true));
 for(const c of data.cases)for(const q of c.questions){const quiz=page.locator('.quiz[data-id="'+q.id+'"]');const wrong=q.options.find(o=>o.id!==q.correct_option_id);await quiz.locator('[data-option="'+wrong.id+'"]').click();assert.ok((await quiz.locator('.feedback').innerText()).startsWith('この条件では不適合。'));await quiz.locator('[data-option="'+q.correct_option_id+'"]').click();assert.ok((await quiz.locator('.feedback').innerText()).startsWith('正解。'));}
 const setValue=async(id,value)=>{await page.locator(id).evaluate((el,v)=>{el.value=String(v);el.dispatchEvent(new Event('input',{bubbles:true}));},value);};
 assert.ok((await page.locator('#capacity-result').innerText()).includes('不足 60'));
 await setValue('#capacity-b',160);assert.ok((await page.locator('#capacity-result').innerText()).includes('容量条件を満たす'));
 await page.selectOption('#failure','b');assert.ok((await page.locator('#capacity-result').innerText()).includes('不足 60'));
 await page.selectOption('#failure','both');assert.ok((await page.locator('#capacity-result').innerText()).includes('不足 160'));
 await page.selectOption('#failure','none');assert.ok((await page.locator('#capacity-result').innerText()).includes('有効容量260'));
 assert.ok((await page.locator('#cost-result').innerText()).includes('260'));
 for(const width of [320,390,1024]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 // All hash destinations exist, including citations to build conditions.
 assert.deepEqual(await page.evaluate(()=>Array.from(document.querySelectorAll('a[href^="#"]')).map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id))),[]);
 assert.deepEqual(errors,[]);assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),[]);
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:740}});const p=await nojs.newPage();await p.goto(url);assert.equal(await p.locator('.build:visible').count(),18);assert.equal(await p.locator('.case').count(),8);await p.locator('.case > details').first().locator('summary').first().click();assert.ok(await p.locator('.quiz').first().isVisible());assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await nojs.close();await context.close();
 console.log('PASS AWS design: 18 build/classification references, 8 scenarios, 16 answer IDs, requirement reversal, residual capacity/failures/cost, no-JS, 320/390/1024px, no save mutations');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
