import {BASE_CARDS} from './card-definitions.mjs';
import {BASE_QUIZZES,QUIZZES} from './quiz.mjs';
import {BASE_FLAVOR,FLAVOR} from './flavor.mjs';
const JUNK={name:'障害ログ',cost:1,kind:'junk',exhaust:true,battleOnly:true,text:'効果なし。1エナジーで戦闘中除外。使わないと捨て札へ回り、再び引きます。戦闘終了時に消滅。'};
export const STARTERS=['strike','guard','probe'];
export const CARDS={...JSON.parse(JSON.stringify(BASE_CARDS)),junk:{...JUNK}};
let active=null;
const copy=x=>JSON.parse(JSON.stringify(x));
const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
const text=(s,max=4000)=>typeof s==='string'&&s.length>0&&s.length<=max;
const id=s=>typeof s==='string'&&/^[a-z][a-z0-9_-]{0,99}$/.test(s)&&!['constructor','prototype','__proto__'].includes(s);
const source=s=>typeof s==='string'&&/^https:\/\/(?:docs\.aws\.amazon\.com|aws\.amazon\.com)\/[^\s"<>]*$/.test(s);
const assert=(ok)=>{if(!ok)throw Error('教材データの形式に対応していません。ゲーム本体を更新してください。');};
export function validateCatalog(p){
 assert(obj(p)&&p.schema===1&&/^[a-f0-9]{16}$/.test(p.version)&&obj(p.cards)&&obj(p.notes)&&obj(p.quizzes)&&obj(p.starterNames));
 assert(JSON.stringify(p).length<=2000000&&Object.keys(p.cards).length<=500&&Object.keys(p.quizzes).length<=3000);
 assert(Object.keys(p.starterNames).length===3&&STARTERS.every(k=>text(p.starterNames[k],100)&&!/[<>]/.test(p.starterNames[k])));
 const numeric=['cost','damage','upDamage','block','upBlock','draw','upDraw','heal','upHeal','energy','upEnergy','armor','upArmor','strength','upStrength','hits','self'];
 for(const [k,c] of Object.entries(p.cards)){
  assert(id(k)&&k!=='junk'&&!STARTERS.includes(k)&&obj(c)&&text(c.name,100)&&!/[<>]/.test(c.name)&&['attack','skill','power'].includes(c.kind)&&text(c.text,500));
  assert(Number.isInteger(c.cost)&&c.cost>=0&&c.cost<=3);
  for(const [key,v] of Object.entries(c)){
   if(numeric.includes(key))assert(Number.isInteger(v)&&v>=0&&v<=50);
   else if(['exhaust','perBlock'].includes(key))assert(typeof v==='boolean');
   else if(key==='debuff')assert(obj(v)&&['burn','overload','depletion','misconfig','delay'].includes(v.id)&&Number.isInteger(v.amount)&&v.amount>=1&&v.amount<=5);
   else assert(['name','kind','text'].includes(key));
  }
 }
 for(const [k,n] of Object.entries(p.notes))assert((STARTERS.includes(k)||Object.prototype.hasOwnProperty.call(p.cards,k))&&obj(n)&&text(n.note)&&text(n.limit)&&(n.source===null||source(n.source)));
 assert([...Object.keys(p.cards),...STARTERS].every(k=>Object.prototype.hasOwnProperty.call(p.notes,k)));
 assert(Object.keys(BASE_QUIZZES).every(k=>Object.prototype.hasOwnProperty.call(p.quizzes,k)));
 for(const [k,q] of Object.entries(p.quizzes))assert(id(k)&&obj(q)&&text(q.prompt)&&Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=8&&q.options.every(s=>text(s))&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length&&Array.isArray(q.reasons)&&q.reasons.length===q.options.length&&q.reasons.every(s=>text(s))&&source(q.source));
 return p;
}
function replace(target,data){for(const k of Object.keys(target))delete target[k];Object.assign(target,copy(data));}
export function activateCatalog(pack){
 if(pack!==null)validateCatalog(pack);
 replace(CARDS,BASE_CARDS);replace(QUIZZES,BASE_QUIZZES);replace(FLAVOR,BASE_FLAVOR);
 if(pack){Object.assign(CARDS,copy(pack.cards));for(const k of STARTERS)CARDS[k].name=pack.starterNames[k];Object.assign(QUIZZES,copy(pack.quizzes));Object.assign(FLAVOR,copy(pack.notes));}
 CARDS.junk={...JUNK};
 active=pack?copy(pack):null;
}
export const getActiveCatalog=()=>active?copy(active):null;
export const CATALOG_KEY='saa-tower-catalog-v1';
export function chooseCatalog(bundled,storage){try{const s=JSON.parse(storage.getItem(CATALOG_KEY));if(s?.bundledVersion===bundled.version)return validateCatalog(s.pack);}catch{}return validateCatalog(bundled);}
export async function fetchCatalog(url,{fetcher=fetch,storage=localStorage,bundledVersion}={}){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 let response,raw;try{response=await fetcher(url,{cache:'no-store',signal:controller.signal});raw=await response.text();}finally{clearTimeout(timer);}if(!response.ok)throw Error('教材を取得できませんでした。');
 if(raw.length>2000000)throw Error('教材データが大きすぎます。');
 const pack=validateCatalog(JSON.parse(raw));
 // Persist atomically before making it available. No active run is changed here.
 storage.setItem(CATALOG_KEY,JSON.stringify({bundledVersion,pack}));return pack;
}

export const activeVersion=()=>active?.version||null;
