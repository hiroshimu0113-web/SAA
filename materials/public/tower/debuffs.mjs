// Game rules, not claims about AWS service behavior.
export const DEBUFFS={
 burn:{name:'炎上',rule:'ターン終了時に数値分のHPを失う（ブロック無視）。その後1減少。'},
 overload:{name:'過負荷',rule:'与える攻撃ダメージが25%減少。数字は残りターン。'},
 delay:{name:'遅延',rule:'次の1ターンは行動できず、その次は2回行動。2回行動終了まで再付与不可。'},
 depletion:{name:'枯渇',rule:'新たに得るブロックが50%減少。既存のブロックは維持。数字は残りターン。'},
 misconfig:{name:'設定不備',rule:'受ける攻撃ダメージが25%増加。その後ブロックで軽減。数字は残りターン。'}
};
export const emptyDebuffs=()=>Object.fromEntries(Object.keys(DEBUFFS).map(k=>[k,0]));
export function applyDebuff(target,id,amount){
 if(id==='delay'){if(target.delay)return false;target.delay=1;return true;}
 target[id]=Math.min(999,target[id]+amount);return true;
}
export const attackAmount=(base,source,target)=>Math.floor(base*(source.overload>0?.75:1)*(target.misconfig>0?1.25:1));
export const blockAmount=(base,status)=>Math.floor(base*(status.depletion>0?.5:1));
export function decayDebuffs(status,except=[]){for(const k of ['overload','depletion','misconfig'])if(status[k]>0&&!except.includes(k))status[k]--;}
export const debuffLabel=(id,n)=>DEBUFFS[id].name+(id==='delay'?(n===0?'：なし':n===1?'：休止→次に2回':'：2回行動'):' '+n);
