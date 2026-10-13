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
const windows={
 guardian:'polygon(0 0,100% 0,100% 95.703%,0 95.703%)',
 tuner:'polygon(0 0,100% 0,100% 96.875%,0 96.875%)',
 accelerator:'polygon(0 0,100% 0,100% 96.875%,62.5% 96.875%,62.5% 91.797%,36.133% 91.797%,36.133% 96.875%,0 96.875%)',
 commander:'polygon(48.828% 0,71.289% 0,71.289% 5.882%,100% 5.882%,100% 100%,0 100%,0 5.882%,48.828% 5.882%)',
 builder:'inset(0)',
 restorer:'polygon(39.063% 0,53.711% 0,63.477% 7.246%,100% 7.246%,100% 100%,0 100%,0 7.246%,35.156% 7.246%)'
};
export const PORTRAIT_ATLAS='./portraits/serious-atlas-v1.png';
export function buildPortrait(id){
 const slot=slots[id];if(!slot)return '<svg class="build-portrait random-portrait" viewBox="0 0 100 112" aria-hidden="true"><circle cx="50" cy="52" r="34" fill="#253543" stroke="#d7c394" stroke-width="2" stroke-dasharray="3 5"/><text x="50" y="69" text-anchor="middle" fill="#e7d9b6" font-size="49" font-family="sans-serif">?</text><path d="M34 95h32" stroke="#d7c394" stroke-width="3"/></svg>';
 return `<span class="build-portrait painted-portrait portrait-${id}" aria-hidden="true" style="--portrait-ratio:512/${slot.h}"><span class="portrait-window" style="clip-path:${windows[id]}"><img src="${PORTRAIT_ATLAS}" alt="" draggable="false" width="1536" height="1024" style="left:${-slot.x/512*100}%;top:${-slot.y/slot.h*100}%"/></span></span>`;
}
