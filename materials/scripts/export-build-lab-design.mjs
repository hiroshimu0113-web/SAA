import {CARDS,HEROES,ROLES} from '../public/tower/build-lab-engine.mjs';
import {readFile,writeFile} from 'node:fs/promises';
const manifest={version:3,status:'independent-prototype',engine:'public/tower/build-lab-engine.mjs',profiles:CARDS,heroes:HEROES,roles:ROLES,scope:'30形態のみ動作する独立試作。全180名称/181形態案と正式冒険の採用判定は別。',limits:['複数対象は適合する先頭を自動選択。','レリック・コスト支出・交換所・全25脅威・全181形態は未接続。','役は戦闘をまたがない3種使用＋状態成立の報酬。現行版の同一ターン役とは独立。']};
await writeFile('knowledge/card-balance-pilot.json',JSON.stringify(manifest,null,2)+'\n');
const full=JSON.parse(await readFile('knowledge/game-supplement.json','utf8')),d=full.characterCardAllocation;
d.balancePilotImplementation={...manifest,profiles:undefined,manifest:'knowledge/card-balance-pilot.json',profileCount:30};
for(const c of d.candidates){const x=c.stsEffectProposal;delete c.pilotImplementation;const profiles=Object.entries(CARDS).filter(([,v])=>v.term===c.termId).map(([id,v])=>({id,...v}));
 x.upgradeOverride.energy=x.energy;x.upgrade=x.upgrade.replace(/^コスト \d+→\d+。/,'コスト '+x.energy+'→'+x.energy+'。');
 if(profiles.length){c.pilotImplementation={scope:manifest.scope,profiles};const p=profiles[0];x.energy=p.cost;x.baseProfile.energy=p.cost;x.baseProfile.effect=p.text;x.effect=p.text;x.upgradeOverride.energy=p.cost;x.upgradeOverride.effect=p.up;x.upgrade='コスト '+p.cost+'→'+p.cost+'。'+p.up;x.balanceNote='独立試作に '+profiles.map(p=>p.id).join('・')+' を実装。前提の基本VPC/最小権限/所有データは全キャラ共通で準備。正式冒険への一括導入は未実施。';
 if(c.termId==='read-replica'){x.effect+='書込みには加算しない。';x.baseProfile.effect=x.effect;}
 if(c.termId==='idempotency'){x.effect+='完了成果を重複加算しない。';x.baseProfile.effect=x.effect;}
 if(x.variants)for(const v of x.variants){const profile=profiles.find(p=>v.name.includes('配置')?p.id==='ec2-deploy':p.id==='ec2-burst');if(profile){v.energy=profile.cost;v.effect=profile.text;v.upgradeOverride.energy=profile.cost;v.upgradeOverride.effect=profile.up;}}
 }
}
await writeFile('knowledge/game-supplement.json',JSON.stringify(full,null,2)+'\n');
