import {chromium,webkit} from '@playwright/test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile(new URL('../public/design/role-combinations.html',import.meta.url));
const data=JSON.parse(await readFile(new URL('../public/design/role-combinations.json',import.meta.url),'utf8'));
for(const scheme of data.schemes){const patterns=data.patterns.filter(p=>p.scheme===scheme.id);assert.equal(patterns.length,data.counts[scheme.id].total);assert.equal(new Set(patterns.map(p=>p.counts.join(','))).size,patterns.length);for(const p of patterns){assert.equal(p.counts.reduce((a,b)=>a+b,0),p.size);assert.ok(p.size>=2&&p.size<=4);}}
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
try{
 browser=await(process.env.BROWSER==='webkit'?webkit:chromium).launch(process.env.BROWSER==='webkit'?{}:{executablePath:process.env.CHROME_PATH||undefined});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),p=await context.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:'+server.address().port+'/SAA/design/role-combinations.html');assert.equal(await p.locator('.pattern:visible').count(),65);assert.equal(await p.locator('.axis').count(),12);
 const result=p.locator('#sim-result'),initial=await result.getAttribute('data-key');assert.equal(initial,'proposal-3-2100');
 const first=await p.locator('#slots select').evaluateAll(xs=>xs.map(x=>x.value));await p.click('#reverse');assert.equal(await result.getAttribute('data-key'),initial);assert.notDeepEqual(await p.locator('#slots select').evaluateAll(xs=>xs.map(x=>x.value)),first);
 await p.selectOption('#size','3');assert.equal(await p.locator('.pattern:visible').count(),20);await p.selectOption('#shape','2+1');assert.equal(await p.locator('.pattern:visible').count(),12);
 await p.selectOption('#size','4');await p.selectOption('#shape','2+2');assert.equal(await p.locator('.pattern:visible').count(),6);await p.selectOption('#shape','1+1+1+1');assert.equal(await p.locator('.pattern:visible').count(),1);
 await p.selectOption('#shape','');await p.selectOption('#size','');await p.selectOption('#scheme','current');assert.equal(await p.locator('.pattern:visible').count(),65);assert.match(await p.locator('#scheme-note').textContent(),/お邪魔/);
 await p.selectOption('#scheme','playable');assert.equal(await p.locator('.pattern:visible').count(),31);assert.equal(await p.locator('#count-4').textContent(),'15通り');
 await p.selectOption('#sim-size','4');assert.equal(await p.locator('#slots select').count(),4);await p.selectOption('#scheme','proposal');assert.equal(await p.locator('.pattern:visible').count(),65);
 for(const width of [320,390,1024]){await p.setViewportSize({width,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.equal(await p.evaluate(()=>localStorage.length),0);assert.deepEqual(errors,[]);
 const raw=await browser.newContext({javaScriptEnabled:false});const nojs=await raw.newPage();await nojs.goto(p.url());assert.equal(await nojs.locator('.pattern:visible').count(),161);
 console.log('PASS genre combinations: all pattern counts/uniqueness, reordered example one set, shape filters, category schemes, 12 other axes, no-JS reading, 320/390/1024px, no game storage writes.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
