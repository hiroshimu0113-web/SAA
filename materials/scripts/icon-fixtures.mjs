import {readFile} from 'node:fs/promises';
import {newRun,act,parseRun,RELICS,HEROES,ENEMIES} from '../public/tower/engine.mjs';
export {RELICS,ENEMIES};
export const KEY='saa-tower-run-v1';
export const pack=JSON.parse(await readFile(new URL('../public/tower/learning-catalog.json',import.meta.url)));
export function fixture(type='battle'){
 let s=newRun(1,pack);s.routes[1][0]=type==='map'?'battle':type;s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];
 s=type==='map'?s:act(s,{type:'node',lane:0});return s;
}
export function withEnemy(id){const s=fixture();s.battle.enemy=id;s.battle.hp=s.battle.maxHp=ENEMIES[id].hp;return s;}
export function allRelics(){const s=fixture();delete s.hero;s.relics=Object.keys(RELICS);return s;}
export async function load(page,s){parseRun(JSON.stringify(s));await page.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key:KEY,s});await page.reload();await page.locator('#game').waitFor();await page.evaluate(async()=>{for(let i=0;i<3;i++)await new Promise(requestAnimationFrame);window.scrollTo(0,0);});}
export async function openMenu(page,name){await page.locator('[data-action=options]').click();await page.getByRole('button',{name,exact:true}).click();}
