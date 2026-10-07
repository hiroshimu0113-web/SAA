import {test} from 'node:test';import assert from 'node:assert/strict';
import {newRun,generateRoutes,parseRun,act,ENEMIES} from '../public/tower/engine.mjs';
test('routes: random room counts and choices, fixed final boss floor, useful rooms and stable saves',()=>{
 const maps=new Set(),counts=new Set();
 for(let seed=0;seed<300;seed++){
  const s=newRun(seed),routes=s.routes;maps.add(JSON.stringify(routes));counts.add(JSON.stringify(['battle','event','shop','elite','rest'].map(t=>routes.flat().filter(x=>x===t).length)));
  assert.deepEqual(routes,generateRoutes(seed));assert.equal(routes.length,8);assert.deepEqual(routes[7],['boss']);assert.equal(routes.flat().filter(x=>x==='boss').length,1);
  assert.deepEqual(routes[0],['battle','battle']);assert.ok(routes[6].includes('rest'));
  for(const type of ['event','shop','elite'])assert.ok(routes.slice(1,6).flat().includes(type));for(const row of routes.slice(1,7))assert.notEqual(row[0],row[1]);
  assert.deepEqual(parseRun(JSON.stringify(s)),s);
  s.floor=7;s.history=routes.slice(0,7).map((row,i)=>({floor:i,lane:0,type:row[0]}));const boss=act(s,{type:'node',lane:0});assert.equal(boss.phase,'battle');assert.equal(ENEMIES[boss.battle.enemy].tier,'boss');assert.deepEqual(parseRun(JSON.stringify(boss)).routes,routes);
 }
 assert.ok(maps.size>290);assert.ok(counts.size>30,'must vary room counts, not just shuffle fixed rooms');
 const old=newRun(5);old.routes=[['battle','battle'],['event','battle'],['elite','shop'],['rest','battle'],['battle','event'],['elite','shop'],['rest','rest'],['boss']];assert.deepEqual(parseRun(JSON.stringify(old)).routes,old.routes);
});
