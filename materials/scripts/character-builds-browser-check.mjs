import {chromium,webkit} from '@playwright/test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile(new URL('../public/design/character-builds.html',import.meta.url));
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await (process.env.BROWSER==='webkit'?webkit:chromium).launch(process.env.BROWSER==='webkit'?{}:{executablePath:process.env.CHROME_PATH||undefined});
 const page=await browser.newPage({viewport:{width:320,height:740},hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port+'/design/character-builds.html';
 await page.goto(url);assert.equal(await page.locator('.build:visible').count(),59);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.selectOption('#category','回復・HP');assert.equal(await page.locator('.build:visible').count(),7);
 await page.fill('#query','吸収');assert.equal(await page.locator('.build:visible').count(),2);
 await page.fill('#query','見つからない語句');assert.ok(await page.locator('#empty').isVisible());
 await page.fill('#query','');await page.selectOption('#category','');assert.equal(await page.locator('.build:visible').count(),59);
 await page.getByRole('link',{name:'キャラへの割り振り案',exact:true}).click();assert.ok((await page.url()).endsWith('#characters'));
 await page.locator('summary').click();assert.ok(await page.locator('details').evaluate(d=>d.open));
 assert.deepEqual(errors,[]);
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const offline=await nojs.newPage();await offline.goto(url);assert.equal(await offline.locator('.build:visible').count(),59);
 assert.ok(await offline.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await nojs.close();console.log('PASS design: 59 builds, filters, empty results, anchors, details, 320px, no-JS full text');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
