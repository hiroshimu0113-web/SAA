import { useState } from 'react';
import { advanceGame, cards, checkGame, evaluateMission, missions, newGame, readGame } from './game';
import './game.css';

export default function Game({ value, onSave, onLesson }: { value: unknown; onSave: (value: unknown) => void; onLesson: (id: string) => void }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const state = readGame(value);
  const [started, setStarted] = useState(Boolean(state));
  const game = state ?? newGame();
  const mission = missions[game.mission];
  const result = mission ? evaluateMission(game.mission, game.selected) : null;
  const complete = game.mission === missions.length;
  const start = () => { onSave(newGame()); setStarted(true); setConfirmReset(false); };
  return <section className="quest" aria-label="設計クエスト">
    <div className="quest-topline"><span>ARCHITECT QUEST</span><span>PROTOTYPE / 01</span></div>
    {!started ? <div className="quest-intro">
      <div className="quest-emblem" aria-hidden="true">◇</div><p className="quest-kicker">小さな工房、大きな設計。</p>
      <h1>その構成で、<br />守りきれる？</h1><p>8枚のAWSカードで、3つのミッションへ。<br />選ぶ → 試す → 理由を知る。失敗しても、何度でも。</p>
      <div className="quest-facts"><span>3 MISSIONS</span><span>5–10 MIN</span><span>途中保存</span></div>
      <button className="quest-primary" onClick={start}>工房の設計をはじめる →</button>
      {value != null && !state && <p role="alert">以前のゲーム記録はこの版では読み込めません。開始するとゲーム記録のみを置き換えます。</p>}
      <p className="quest-note">設計ポイントはゲーム用の数値で、AWSの料金や性能を表しません。実際のAWSリソースは作成しません。</p>
    </div> : complete ? <div className="quest-finish">
      <p className="quest-kicker">ALL MISSIONS CLEAR</p><div className="quest-emblem" aria-hidden="true">✦</div><h1>工房を守る、<br />設計ができた。</h1>
      <p className="quest-score">{game.stars.reduce((a, b) => a + b, 0)} <span>/ 9 STARS</span></p>
      <p>失敗の理由を知った分だけ、次の選択が変わります。</p>
      {missions.map((m, i) => <article className="quest-recap" key={m.title}><small>MISSION 0{i + 1} · {'★'.repeat(game.stars[i])}</small><h2>{m.title}</h2><p>{m.takeaway}</p><button onClick={() => onLesson(m.lesson)}>関連テキストを読む →</button></article>)}
      <p className="quest-note">星はこのゲーム内の結果です。SAA試験の点数・合格判定ではありません。</p>
      <button className="quest-primary" onClick={() => setConfirmReset(true)}>もう一度、設計する</button>
    </div> : <>
      <ol className="quest-route" aria-label="ミッションの進捗">{missions.map((m, i) => <li key={m.title} aria-current={i === game.mission ? 'step' : undefined} className={i < game.mission ? 'done' : i === game.mission ? 'current' : ''}><span>{i < game.mission ? '✓' : `0${i + 1}`}</span><small>{['保存', '可用性', 'アクセス'][i]}</small></li>)}</ol>
      <p className="quest-kicker">{mission.subtitle}</p><h1>{mission.title}</h1><p className="quest-brief">{mission.brief}</p>
      <div className="quest-workbench"><div><small>YOUR ARCHITECTURE</small><h2>カードで構成をつくる</h2></div><strong className={result!.cost > mission.budget ? 'over-budget' : ''}>{result!.cost}<span> / {mission.budget} pt</span></strong></div>
      <p className="quest-note">使うカードをタップ。もう一度タップで外せます。ポイントは実料金ではありません。</p>
      <div className="quest-layout" aria-label="選択した構成">{game.selected.length === 0 ? <span>下のカードから、必要な役割を選ぼう。</span> : cards.filter(c => game.selected.includes(c.id)).map(c => <span className="quest-chip" key={c.id}>{c.icon} {c.name}</span>)}</div>
      <div className="quest-cards">{cards.map(card => <button key={card.id} className={`quest-card ${game.selected.includes(card.id) ? 'chosen' : ''}`} aria-pressed={game.selected.includes(card.id)} disabled={game.checked} onClick={() => onSave({ ...game, selected: game.selected.includes(card.id) ? game.selected.filter(id => id !== card.id) : [...game.selected, card.id] })}>
        <span className="quest-card-top"><span aria-hidden="true">{card.icon}</span><small>{card.cost} pt</small></span><small className="quest-category">{card.kind}</small><strong>{card.name}</strong><span className="quest-card-text">{card.text}</span><span className="quest-card-select">{game.selected.includes(card.id) ? '✓ 選択中' : '＋ 構成に加える'}</span>
      </button>)}</div>
      {!game.checked ? <div className="quest-controls"><p>何度でも試せます。初回クリアで★★★、2回目は★★、3回目以降は★。</p><button className="quest-primary" disabled={!game.selected.length} onClick={() => onSave(checkGame(game))}>この構成をテストする →</button></div> : <section className={`quest-result ${result!.passed ? 'passed' : ''}`} aria-label="構成テストの結果" aria-live="polite">
        <h2>{result!.passed ? '✓ ミッションクリア！' : 'あと一歩。構成を見直そう。'}</h2>
        <ul>{result!.checks.map(check => <li key={check.label}><strong>{check.passed ? '✓' : '×'} {check.label}</strong><p>{check.reason}</p></li>)}</ul>
        {result!.passed && <p>{mission.takeaway}</p>}
        <a href={mission.source} target="_blank" rel="noreferrer">AWS公式資料で確認 ↗</a>
        {result!.passed ? <button className="quest-primary" onClick={() => { onSave(advanceGame(game)); window.scrollTo({ top: 0 }); }}>{game.mission === 2 ? '工房の完成を見る →' : '次のミッションへ →'}</button> : <button className="quest-primary" onClick={() => onSave({ ...game, checked: false })}>カードを選び直す</button>}
      </section>}
    </>}
    {started && !complete && <button className="quest-reset" onClick={() => setConfirmReset(true)}>最初からやり直す</button>}
    {confirmReset && <section className="quest-confirm" aria-label="やり直しの確認"><p>ゲームの途中経過と星を消して、ミッション1から始めます。教材の読了・問題集の履歴は残ります。</p><button className="quest-primary" onClick={start}>ゲーム記録をリセットして開始</button><button className="quest-reset" onClick={() => setConfirmReset(false)}>キャンセル</button></section>}
    <p className="quest-note">選択と結果はこのブラウザーへ保存します。「設定」から学習記録と一緒にバックアップできます。</p>
  </section>;
}
