import {chromium,webkit} from '@playwright/test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile(new URL('../public/design/role-effects.html',import.meta.url));
const server=createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 const type=process.env.BROWSER==='webkit'?webkit:chromium;
 browser=await type.launch(process.env.BROWSER==='webkit'?{}:{executablePath:process.env.CHROME_PATH||undefined});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.address().port+'/SAA/design/role-effects.html';
 await page.goto(url);assert.equal(await page.locator('.effect').count(),60);
 for(const size of ['2','3','4']){await page.selectOption('#size',size);assert.equal(await page.locator('.effect:visible').count(),20);}
 await page.selectOption('#cat','回復');assert.equal(await page.locator('.effect:visible').count(),1);
 await page.locator('.effect:visible .decision').selectOption('残す');await page.reload();
 assert.equal(await page.locator('[data-option="E4-15"] .decision').inputValue(),'残す');
 await page.selectOption('#judgement','残す');assert.equal(await page.locator('.effect:visible').count(),1);
 await page.selectOption('#judgement','');await page.fill('#search','次の自分');assert.ok(await page.locator('.effect:visible').count()<60);await page.fill('#search','');
 const downloadPromise=page.waitForEvent('download');await page.click('#export');const download=await downloadPromise;assert.equal(download.suggestedFilename(),'role-effect-decisions.json');
 const decisions=JSON.parse(await readFile(await download.path(),'utf8'));assert.equal(decisions.decisions['E4-15'],'残す');
 await page.setInputFiles('#import',{name:'decisions.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schema_version:1,decisions:{'E2-01':'保留'}}))});
 await page.waitForFunction(()=>document.querySelector('[data-option="E2-01"] .decision').value==='保留');
 await page.setInputFiles('#import',{name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await page.waitForFunction(()=>document.getElementById('status').textContent.includes('読み込めません'));
 for(const width of [320,390,1024]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.click('#close');assert.equal(await page.locator('.effect:visible').count(),0);await page.click('#open');assert.equal(await page.locator('.effect:visible').count(),60);
 const nojs=await browser.newContext({javaScriptEnabled:false});const raw=await nojs.newPage();await raw.goto(url);assert.equal(await raw.locator('.effect:visible').count(),60);
 assert.deepEqual(errors,[]);console.log('PASS role effects: HTTP reading, 60 proposals, filters, saved decisions/reload, JSON export/import, invalid import, expand/collapse, 320/390/1024px, no-JS.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
