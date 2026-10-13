import {BUILD_COLOURS} from './build-adventure-engine.mjs';
// Small heraldic UI marks, distinct from the full character artwork.
const shapes={
 guardian:'<path d="M32 12 48 18V33Q46 44 32 52 18 44 16 33V18Z"/><path d="M32 20V42M23 28H41"/>',
 tuner:'<path d="M23 13V28Q23 37 32 37T41 28V13M32 37V52M26 52H38"/><path d="M18 17H27M37 17H46"/>',
 accelerator:'<path d="M12 40 48 14 43 28 29 35 40 33 34 43 21 45 15 52Z"/><path d="m15 30 14-10M11 23l8-6"/>',
 commander:'<path d="M32 13V48M17 48V35H47V48"/><path d="m32 8 7 7-7 7-7-7ZM12 48h10v8H12ZM27 48h10v8H27ZM42 48h10v8H42Z"/>',
 builder:'<path d="m32 11 20 12v26L32 59 12 49V23ZM12 23l20 12 20-12M32 35V59M22 17l20 12"/>',
 restorer:'<path d="M48 24A20 20 0 1 0 51 41M48 13V25H36"/><path d="m31 24 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>'
};
export function heroMotif(id){const known=Object.prototype.hasOwnProperty.call(shapes,id),key=known?id:'random';return `<svg class="hero-motif" data-motif="${key}" viewBox="0 0 64 64" aria-hidden="true" focusable="false" style="color:${BUILD_COLOURS[key]||'#d7c394'}"><circle class="motif-ring" cx="32" cy="32" r="29"/><g class="motif-mark">${known?shapes[id]:'<path d="M24 24a8 8 0 0 1 16 0c0 6-8 7-8 14M32 46v2"/>'}</g></svg>`;}
