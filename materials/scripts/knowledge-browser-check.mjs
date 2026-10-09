import { chromium } from 'playwright';
import { preview } from 'vite';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const unitCount=JSON.parse(readFileSync(new URL('../knowledge/units.json',import.meta.url))).units.length;
const server=await preview({base:'/SAA/',preview:{host:'127.0.0.1',port:4190,strictPort:true}});
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined});const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4190/SAA/knowledge/index.html');
 await page.getByRole('status').filter({hasText:unitCount+'単位の型'}).waitFor();
 assert.equal(await page.locator('#graph g[role=button]').count(),unitCount);
 await page.getByLabel('細分化した単位を検索').fill('IAM');
 await page.locator('#unit-list').getByRole('button',{name:'IAMロール',exact:true}).click();
 await page.locator('#detail').getByRole('heading',{name:'IAMロール',exact:true}).waitFor();
 assert.ok((await page.locator('#detail').innerText()).includes('audio:sample-01'));
 await page.locator('#detail summary').first().click();assert.ok(await page.getByText('信頼ポリシーは誰が引き受けられるか',{exact:true}).isVisible());
 await page.locator('#detail .relations').first().getByRole('button',{name:'一時認証情報',exact:true}).click();
 await page.locator('#detail').getByRole('heading',{name:'一時認証情報',exact:true}).waitFor();
 await page.getByLabel('細分化した単位を検索').fill('見つからない単位');assert.ok(await page.locator('#empty').isVisible());
 assert.equal(await page.locator('#inventory tr').count(),12);
 await page.locator('#graph g[aria-label="MFAと認証の強化"]').focus();await page.keyboard.press('Enter');await page.locator('#detail').getByRole('heading',{name:'MFAと認証の強化',exact:true}).waitFor();
 await page.setViewportSize({width:320,height:568});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
 console.log('PASS: dynamic graph nodes, concept search, prerequisite navigation, rubric expansion, media links, 12 chapter inventory, keyboard selection, 320px layout.');
}finally{await browser?.close();await new Promise(resolve=>server.httpServer.close(resolve));}
