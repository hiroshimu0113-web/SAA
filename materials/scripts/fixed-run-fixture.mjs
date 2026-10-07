// Existing scenario regressions intentionally keep the original map layout.
import {newRun as createRun} from '../public/tower/engine.mjs';
export function fixedRun(...args){const s=createRun(...args);delete s.routes;delete s.rewardPicks;delete s.shopRelic;delete s.cardPurchases;return s;}
