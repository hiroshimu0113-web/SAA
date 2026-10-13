// Original generated art. One local transparent atlas is cached for all six portraits.
// Per-character display windows exclude neighbouring silhouettes in the painted sheet.
const slots={
 guardian:{x:0,y:0,h:512,clip:'<rect width="512" height="490"/>'},
 tuner:{x:512,y:0,h:512,clip:'<rect width="512" height="496"/>'},
 accelerator:{x:1024,y:0,h:512,clip:'<rect width="512" height="470"/><rect y="470" width="185" height="26"/><rect x="320" y="470" width="192" height="26"/>'},
 commander:{x:0,y:480,h:544,clip:'<rect x="250" width="115" height="32"/><rect y="32" width="512" height="512"/>'},
 builder:{x:512,y:496,h:528,clip:'<rect width="512" height="528"/>'},
 restorer:{x:1024,y:472,h:552,clip:'<polygon points="200,0 275,0 325,40 180,40"/><rect y="40" width="512" height="512"/>'}
};
let serial=0;
export const PORTRAIT_ATLAS='./portraits/serious-atlas-v1.png';
export function buildPortrait(id){
 const slot=slots[id];if(!slot)return '<svg class="build-portrait random-portrait" viewBox="0 0 100 112" aria-hidden="true"><circle cx="50" cy="52" r="34" fill="#253543" stroke="#d7c394" stroke-width="2" stroke-dasharray="3 5"/><text x="50" y="69" text-anchor="middle" fill="#e7d9b6" font-size="49" font-family="sans-serif">?</text><path d="M34 95h32" stroke="#d7c394" stroke-width="3"/></svg>';
 const clip='portrait-window-'+(++serial);
 return `<svg class="build-portrait painted-portrait portrait-${id}" viewBox="0 0 512 ${slot.h}" aria-hidden="true" focusable="false"><defs><clipPath id="${clip}">${slot.clip}</clipPath></defs><g class="portrait-art"><g clip-path="url(#${clip})"><image href="${PORTRAIT_ATLAS}" x="${-slot.x}" y="${-slot.y}" width="1536" height="1024"/></g></g></svg>`;
}
