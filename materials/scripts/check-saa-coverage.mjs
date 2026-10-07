import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const data=JSON.parse(readFileSync(resolve(root,'knowledge/saa-coverage.json'),'utf8'));
const units=new Map(JSON.parse(readFileSync(resolve(root,'knowledge/units.json'),'utf8')).units.map(u=>[u.id,u]));
const fail=m=>{throw new Error(m)};
const refs=rs=>rs.every(p=>!p.startsWith('/')&&!p.split('/').includes('..')&&existsSync(resolve(root,p)));
const review=r=>r&&r.reviewer&&/^\d{4}-\d{2}-\d{2}$/.test(r.checked_on);
const ids=new Set(),tasks=new Set();
if(data.chapters.length!==12)fail('12章が必要');
if(!refs([data.basis.path]))fail('基準の参照が不存在');
for(let n=0;n<12;n++){
 const c=data.chapters[n];
 if(c.id!==`ch${String(n+1).padStart(2,'0')}`)fail('章IDまたは順序');
 if(!['needs_expansion','review_pending','adequate'].includes(c.status))fail('章判定');
 for(const t of c.task_ids)tasks.add(t);
 if(!refs(c.evidence_refs)||c.unit_ids.some(id=>!units.has(id)))fail(`${c.id}:参照切れ`);
 for(const g of c.gaps){
  if(ids.has(g.id))fail('不足ID重複');ids.add(g.id);
  if(!['open','resolved'].includes(g.status))fail('不足状態');
  if(!refs(g.resolution_refs))fail('解消資料が不存在');
  if(g.status==='resolved'&&(!g.resolution_refs.length||!review(g.review)))fail('解消根拠と確認が必要');
 }
 if(c.status==='adequate'&&(c.gaps.some(g=>g.status!=='resolved')||!review(c.final_review)||data.current_guide.status!=='verified'||c.unit_ids.some(id=>units.get(id).review.status!=='reviewed')))fail(`${c.id}:充足判定の前提未達`);
}
const required=['1.1','1.2','1.3','2.1','2.2','3.1','3.2','3.3','3.4','3.5','4.1','4.2','4.3','4.4'];
if(required.some(t=>!tasks.has(t))||[...tasks].some(t=>!required.includes(t)))fail('公式14タスクの対応不足または不正');
if(data.goal_status==='completed'&&data.chapters.some(c=>c.status!=='adequate'))fail('未充足章が残っている');
console.log(`SAA coverage: 12章 / ${ids.size}不足束 / 未解決${data.chapters.flatMap(c=>c.gaps).filter(g=>g.status==='open').length}`);
