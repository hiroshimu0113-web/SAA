import {activateCatalog} from '../public/tower/catalog.mjs';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fixedRun} from './fixed-run-fixture.mjs';
import {act,CARDS} from '../public/tower/engine.mjs';
export async function checkOptions(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage();
 try{
  const pack=JSON.parse(await readFile(new URL('../public/tower/learning-catalog.json',import.meta.url),'utf8'));
  const s=act(fixedRun(1,pack),{type:'node',lane:0});s.deck[0].plus=true;
  await p.goto(base+'tower/options.html');await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();
  const saved=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));
  await p.locator('[data-action=options]').tap();const dialog=p.getByRole('dialog');
  assert.deepEqual(await dialog.locator('nav button').allTextContents(),['マップ','役一覧','デッキ','コレクション']);
  await dialog.getByRole('button',{name:'マップ',exact:true}).tap();assert.equal(await dialog.locator('.route-row').count(),8);assert.equal(await dialog.locator('[data-action=node]').count(),0);assert.match(await dialog.locator('.route-row.current').innerText(),/1F/);
  await dialog.getByRole('button',{name:'戻る',exact:true}).tap();await dialog.getByRole('button',{name:'役一覧',exact:true}).tap();assert.equal(await dialog.locator('.combo-guide section').count(),3);
  await dialog.getByRole('button',{name:'戻る',exact:true}).tap();await dialog.getByRole('button',{name:'デッキ',exact:true}).tap();assert.equal(await dialog.locator('.options-cards .card').count(),s.deck.length);assert.match(await dialog.locator('.card strong').first().innerText(),/＋/);assert.ok(await dialog.locator('.card .effect').first().isVisible());
  await dialog.getByRole('button',{name:'戻る',exact:true}).tap();await dialog.getByRole('button',{name:'コレクション',exact:true}).tap();assert.equal(await dialog.locator('.options-cards .card').count(),Object.keys(CARDS).length);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth));
  await p.screenshot({path:'artifacts/options-mobile.png'});await p.keyboard.press('Escape');assert.equal(await p.locator('.options-overlay').count(),0);assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),saved);assert.equal(await p.locator('[data-action=options]').evaluate(e=>e===document.activeElement),true);
  assert.equal(await p.locator('[data-action=hand-next],[data-action=hand-prev]').count(),0);
  console.log('PASS options: four menus, read-only current map, all detailed deck/collection cards, 320px, Escape/focus, unchanged save.');
 }finally{await c.close();activateCatalog(null);}
}
