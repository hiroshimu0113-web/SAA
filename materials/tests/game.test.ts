import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceGame, cards, checkGame, evaluateMission, missions, newGame, readGame } from '../src/game';
import { emptyProgress, exportBackup, parseBackup } from '../src/storage';

test('3つのミッションをクリアし、途中記録をバックアップから再開できる', () => {
  let state = newGame();
  for (let i = 0; i < missions.length; i++) {
    state = checkGame({ ...state, selected: [...missions[i].required] });
    assert.equal(evaluateMission(i, state.selected).passed, true);
    const restored = parseBackup(exportBackup({ ...emptyProgress(), game: state }));
    assert.deepEqual(readGame(restored.game), state);
    state = advanceGame(readGame(restored.game)!);
  }
  assert.equal(state.mission, 3);
  assert.deepEqual(state.stars, [3, 3, 3]);
  assert.deepEqual(checkGame(state), state);
  assert.deepEqual(advanceGame(state), state);
});
test('全カード組合せで必須機能・予算・危険な認証を評価する', () => {
  for (let i = 0; i < missions.length; i++) {
    let wins = 0;
    for (let mask = 0; mask < 2 ** cards.length; mask++) {
      const chosen = cards.filter((_, c) => mask & (1 << c));
      const selected = chosen.map(c => c.id);
      const result = evaluateMission(i, selected);
      if (!result.passed) continue;
      wins++;
      for (const required of missions[i].required) assert.ok(selected.includes(required));
      assert.ok(!selected.includes('keys') && !selected.includes('root'));
      assert.ok(chosen.reduce((sum, c) => sum + c.cost, 0) <= missions[i].budget);
    }
    assert.ok(wins > 0, `Mission ${i} must be winnable`);
    for (const required of missions[i].required) assert.equal(evaluateMission(i, missions[i].required.filter(c => c !== required)).passed, false);
  }
});
test('失敗では進まず、再挑戦で星を得る。連打で試行回数を増やさない', () => {
  let state = checkGame({ ...newGame(), selected: ['ec2', 'keys'] });
  assert.deepEqual(checkGame(state), state);
  assert.deepEqual(advanceGame(state), state);
  state = checkGame({ ...state, checked: false, selected: ['ec2', 's3', 'role'] });
  assert.deepEqual(advanceGame(state).stars, [2]);
  assert.deepEqual(advanceGame({ ...state, attempts: 10 }).stars, [1]);
});
test('未知版や破損記録はゲームへ読み込まず、未確認の構成で先へ進めない', () => {
  for (const value of [null, {}, { ...newGame(), version: 2 }, { ...newGame(), mission: 4 }, { ...newGame(), stars: [3] }, { ...newGame(), selected: ['unknown'] }, { ...newGame(), attempts: -1 }, { ...newGame(), selected: ['s3', 's3'] }]) assert.equal(readGame(value), null);
  const state = { ...newGame(), selected: [...missions[0].required] };
  assert.deepEqual(advanceGame(state), state);
});
