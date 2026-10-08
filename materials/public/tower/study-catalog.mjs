import {validQuestion} from './study-state.mjs';
export const STUDY_CATALOG_KEY='saa-tower-study-catalog-v1';
export function validateStudyCatalog(p){
 if(!p||p.schema!==1||!/^[a-f0-9]{16}$/.test(p.version)||!Array.isArray(p.practice)||!Array.isArray(p.assessment)||p.practice.length>2000||p.assessment.length!==65||![...p.practice,...p.assessment].every(validQuestion)||new Set([...p.practice,...p.assessment].map(q=>q.id)).size!==p.practice.length+p.assessment.length||p.assessment.some(q=>q.level!=='assessment')||p.practice.some(q=>q.level==='assessment'))throw Error('学習教材の形式が不正です。');
 return p;
}
export function chooseStudyCatalog(bundled,storage){try{const saved=JSON.parse(storage.getItem(STUDY_CATALOG_KEY));if(saved?.bundledVersion===bundled.version)return validateStudyCatalog(saved.pack);}catch{}return validateStudyCatalog(bundled);}
export async function fetchStudyCatalog(url,bundled,storage,fetcher=fetch){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{const response=await fetcher(url,{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('教材を取得できません。');const raw=await response.text();if(raw.length>4000000)throw Error('教材が大きすぎます。');const pack=validateStudyCatalog(JSON.parse(raw));storage.setItem(STUDY_CATALOG_KEY,JSON.stringify({bundledVersion:bundled.version,pack}));return pack;}finally{clearTimeout(timer);}
}
