// Game rules, not claims about AWS service behavior.
export const DEBUFFS={
 burn:{icon:'♨',name:'炎上',rule:'ターン終了時に数値分のHPを失う（ブロック無視）。その後1減少。'},
 overload:{icon:'ϟ',name:'過負荷',rule:'与える攻撃ダメージが25%減少。数字は残りターン。'},
 delay:{icon:'⌛',name:'遅延',rule:'指定ターン行動できず、その次は2回行動（通常1ターン、強化カードは2ターン休止）。2回行動終了まで再付与不可。'},
 depletion:{icon:'▽',name:'枯渇',rule:'新たに得るブロックが50%減少。既存のブロックは維持。数字は残りターン。'},
 misconfig:{icon:'⚙',name:'設定不備',rule:'受ける攻撃ダメージが25%増加。その後ブロックで軽減。数字は残りターン。'}
};
export const emptyDebuffs=()=>Object.fromEntries(Object.keys(DEBUFFS).map(k=>[k,0]));
export function applyDebuff(target,id,amount){
 if(id==='delay'){if(target.delay)return false;target.delay=amount<=1?1:Math.min(999,amount+1);return true;}
 target[id]=Math.min(999,target[id]+amount);return true;
}
export const attackAmount=(base,source,target)=>Math.floor(base*(source.overload>0?.75:1)*(target.misconfig>0?1.25:1));
export const blockAmount=(base,status)=>Math.floor(base*(status.depletion>0?.5:1));
export function decayDebuffs(status,except=[]){for(const k of ['overload','depletion','misconfig'])if(status[k]>0&&!except.includes(k))status[k]--;}
export const delayPaused=n=>n===1||n>=3;
export const delayRemaining=n=>n>=3?n-1:n===1?1:0;
export const advanceDelay=n=>n===1?2:n===3?1:n-1;
export const debuffLabel=(id,n)=>DEBUFFS[id].name+(id==='delay'?(n===0?'：なし':delayPaused(n)?'：あと'+delayRemaining(n)+'ターン休止→2回行動':'：2回行動'):' '+n);
