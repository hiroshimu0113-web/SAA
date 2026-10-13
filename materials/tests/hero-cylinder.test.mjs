import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CHAMBERS,cylinderIndex,angleDelta,cylinderHTML} from '../public/tower/hero-cylinder.mjs';
import {buildPortrait} from '../public/tower/build-portraits.mjs';
test('7枠はランダム初期位置と6キャラ。複数回転・逆転でも選択が循環する',()=>{assert.equal(CHAMBERS.length,7);assert.equal(CHAMBERS[0],'');for(let i=-35;i<=35;i++)assert.equal(cylinderIndex(-i*360/7),(i%7+7)%7);assert.equal(angleDelta(-179,179),2);assert.equal(angleDelta(179,-179),-2);assert.equal((cylinderHTML().match(/data-chamber=/g)||[]).length,7);});
test('立ち絵は6種類とも独立したSVGで、外部画像やスクリプトに依存しない',()=>{const figures=CHAMBERS.slice(1).map(buildPortrait);assert.equal(new Set(figures).size,6);for(const svg of figures){assert.match(svg,/viewBox="0 0 100 112"/);assert.doesNotMatch(svg,/<script|<image|https?:/);}});
