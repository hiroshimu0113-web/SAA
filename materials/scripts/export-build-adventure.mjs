import {readFile,writeFile} from 'node:fs/promises';
import {CARDS,HEROES} from '../public/tower/build-lab-engine.mjs';
const source=JSON.parse(await readFile('knowledge/game-supplement.json','utf8')).characterCardAllocation;
const notes=Object.fromEntries(Object.entries(CARDS).map(([id,card])=>{const c=source.candidates.find(c=>c.termId===card.term);if(!c)throw Error('Missing learning term: '+card.term);return[id,{termId:card.term,meaning:c.meaning,mechanism:c.stsEffectProposal.correspondence,limit:c.stsEffectProposal.limits}];}));
const builds=source.builds.map(({id,characterId,name,gameplay,cards:members})=>{
 const pool=new Set(['ec2-burst','ec2-deploy','security-group','cloudwatch',...HEROES[characterId].dedicated,...HEROES[characterId].support]);
 const cards=members.flatMap(m=>Object.entries(CARDS).filter(([cid,c])=>pool.has(cid)&&c.term===m.termId).map(([cardId])=>({cardId,role:m.role}))).filter((c,i,all)=>all.findIndex(x=>x.cardId===c.cardId)===i);
 if(!cards.some(c=>c.role==='キー'))throw Error('Missing playable key card: '+id);
 return {id,characterId,name,gameplay,cards};
});
for(const hero of Object.keys(HEROES))if(builds.filter(b=>b.characterId===hero).length!==3)throw Error('Expected three builds: '+hero);
const text=JSON.stringify({revision:3,scope:'試遊用30形態。全181形態の実装ではない。',notes,builds},null,2)+'\n';
const path='public/tower/build-adventure-content.json';
if(process.argv.includes('--check')){if(await readFile(path,'utf8')!==text)throw Error('Stale revision 3 learning notes');}else await writeFile(path,text);
console.log('Revision 3 learning notes: '+Object.keys(notes).length+' profiles');
