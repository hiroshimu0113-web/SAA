// Existing scenario regressions intentionally keep the original map layout and 10-card saved deck.
import {newRun as createRun} from '../public/tower/engine.mjs';
export function fixedRun(...args){const s=createRun(...args);s.deck=['strike','strike','strike','strike','strike','guard','guard','guard','guard','probe'].map((id,uid)=>({uid,id,plus:false}));s.nextId=s.deck.length;delete s.routes;delete s.rewardPicks;delete s.shopRelic;delete s.cardPurchases;return s;}
