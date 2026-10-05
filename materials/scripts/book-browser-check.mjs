import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});
 await page.goto(process.env.BOOK_URL || pathToFileURL(resolve('deliverables/SAA-starter.html')).href);
 await page.getByRole('heading',{name:'学びを、ひとつずつ。',exact:true}).waitFor();
 await page.screenshot({path:'artifacts/book-mobile.png'});
 await page.getByRole('link',{name:'基礎問題20問',exact:true}).click();
 await page.getByRole('link',{name:'この問題の解説へ',exact:true}).first().click();
 assert.ok(page.url().endsWith('#q001-answer'));
 await page.getByRole('link',{name:'問題へ戻る',exact:true}).first().click();
 assert.ok(page.url().endsWith('#q001'));
 console.log('PASS: standalone book renders at mobile width without JavaScript; question/answer links work.');
}finally{await browser.close();}
