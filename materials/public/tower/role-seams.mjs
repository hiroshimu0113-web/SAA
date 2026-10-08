import {COMBOS} from './combos.mjs';
// Stable motifs follow role IDs, even when lesson-driven card/role names change.
export const ROLE_SEAMS={
 incident:'M0 6H6L16 1L26 11L36 1L46 11L56 1L66 11L76 1L86 11L96 6H100',
 balancing:'M0 6H10V1H22V11H34V1H46V11H58V1H70V11H82V1H94V6H100',
 caching:'M0 6H7L12 1L17 6L22 1L27 6H37L42 11L47 6L52 11L57 6H67L72 1L77 6L82 1L87 6H100',
};
const escape=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function roleSeam(id){
 if(!ROLE_SEAMS[id]||!COMBOS[id])return '';
 return '<svg class="role-seam seam-'+id+'" data-combo="'+id+'" viewBox="0 0 100 12" preserveAspectRatio="none" role="img" aria-label="役候補：'+escape(COMBOS[id].name)+'" focusable="false"><title>'+escape(COMBOS[id].name)+'</title><path d="'+ROLE_SEAMS[id]+'"/></svg>';
}
export function cardRoleSeams(cardId){
 const roles=Object.entries(COMBOS).filter(([,role])=>role.cards.includes(cardId));
 return roles.length?'<span class="role-seams">'+roles.map(([id])=>roleSeam(id)).join('')+'</span>':'';
}
