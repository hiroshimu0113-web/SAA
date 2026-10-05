import { useEffect, useRef, useState } from 'react';
import { chapters, questions, terms, release } from './content';
import { loadProgress, saveProgress, exportBackup, parseBackup, emptyProgress } from './storage';
import { isCorrect, reviewQuestions } from './learning';
import { prepareOffline, activateUpdate } from './offline';
import type { Progress, Question, Source } from './types';
import './styles.css';
import Game from './Game';

type Page = 'game' | 'home' | 'text' | 'quiz' | 'terms' | 'settings';
const domains = ['セキュリティ', 'レジリエンス', '高性能', 'コスト最適化'];
const nav: { id: Page; icon: string; label: string }[] = [{ id: 'home', icon: '◈', label: '今日' }, { id: 'text', icon: '▤', label: 'テキスト' }, { id: 'quiz', icon: '✓', label: '問題集' }, { id: 'terms', icon: 'Aa', label: '用語' }, { id: 'settings', icon: '⚙', label: '設定' }];
function Sources({ sources }: { sources: Source[] }) { return <details className="sources"><summary>公式出典・確認日</summary>{sources.map((source, i) => <p key={i}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><small>確認日 {source.checked} · リンクの閲覧には通信が必要です</small></p>)}</details>; }
function Explanation({ question, onOpenLesson }: { question: Question; onOpenLesson: (id: string) => void }) { return <section className="explanation"><h3>考え方</h3><p>{question.explanation}</p>{question.options.map(option => <div className="option-explanation" key={option.id}><strong>{question.answers.includes(option.id) ? '✓ 正解' : '— 誤答'} · {option.text}</strong><p>{option.explanation}</p></div>)}<Sources sources={question.sources} /><div className="button-row">{(() => { const matches = chapters.flatMap(ch => ch.lessons).filter(l => l.conceptIds.some(id => question.conceptIds.includes(id))); const related = matches.length ? matches : chapters.find(ch => ch.id === question.chapterId)?.lessons.slice(0, 1) ?? []; return related.map(lesson => <button className="secondary" key={lesson.id} onClick={() => onOpenLesson(lesson.id)}>テキスト：{lesson.title} →</button>); })()}</div></section>; }

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const current = useRef(progress);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const unsaved = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [search, setSearch] = useState('');
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState<'practice' | 'review' | 'exam'>('practice');
  const [filter, setFilter] = useState('all');
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [unsure, setUnsure] = useState(false);
  const [examIndex, setExamIndex] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [notice, setNotice] = useState('');
  const [offlineBusy, setOfflineBusy] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<Progress | null>(null);
  const [backupBusy, setBackupBusy] = useState(false);

  async function initialize() {
    setLoadError('');
    try { const value = await loadProgress(); current.current = value; setProgress(value); setLoaded(true); }
    catch { setLoadError('学習記録を読み込めませんでした。保存領域の設定を確認し、再試行してください。'); }
  }
  useEffect(() => { void initialize(); }, []);
  function update(change: (value: Progress) => Progress) {
    const next = change(current.current); current.current = next; setProgress(next);
    unsaved.current = true;
    queue.current = queue.current.then(async () => { try { await saveProgress(next); if (current.current === next) unsaved.current = false; setSaveError(''); } catch { unsaved.current = true; setSaveError('記録の保存に失敗しました。この画面の記録をバックアップし、保存領域を確認してください。'); } });
  }
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (loaded && progress.exam && !progress.exam.submitted && now >= progress.exam.deadline) { update(p => ({ ...p, exam: p.exam ? { ...p.exam, submitted: true } : null })); setNotice('模擬試験の時間が終了したため、自動提出しました。'); } }, [now, loaded, progress.exam]);
  function go(next: Page) { setPage(next); setSearch(''); window.scrollTo({ top: 0 }); }
  const allLessons = chapters.flatMap(chapter => chapter.lessons);
  const activeLesson = allLessons.find(lesson => lesson.id === lessonId);
  const practiceQuestions = questions.filter(q => !q.exam);
  const review = reviewQuestions(practiceQuestions, progress.attempts);
  const pool = (quizMode === 'review' ? review : practiceQuestions).filter(q => filter === 'all' || q.chapterId === filter);
  const question = questions.find(q => q.id === questionId);
  function openQuestion(q: Question) { setQuestionId(q.id); setSelected([]); setAnswered(false); setUnsure(false); }
  function answer() { if (!question || selected.length !== question.answers.length || answered) return; update(p => ({ ...p, attempts: [...p.attempts, { questionId: question.id, selected, correct: isCorrect(question, selected), unsure, at: new Date().toISOString() }] })); setAnswered(true); }
  function toggleSelection(values: string[], id: string, count: number) { return count === 1 ? [id] : values.includes(id) ? values.filter(value => value !== id) : values.length < count ? [...values, id] : values; }
  const exam = progress.exam;
  const examQuestions = questions.filter(q => q.exam === exam?.id);
  const examQuestion = examQuestions[examIndex];
  const seconds = Math.max(0, Math.ceil(((exam?.deadline ?? now) - now) / 1000));
  function startExam(id: 'mock1' | 'mock2') {
    if (questions.filter(q => q.exam === id).length !== 65) { setNotice('模擬試験は教材の検証が終わってから公開します。'); return; }
    if (current.current.exam && !window.confirm('現在の模擬試験を置き換えます。結果を残したい場合は先にバックアップしてください。新しく開始しますか？')) return;
    const start = Date.now(); update(p => ({ ...p, exam: { id, startedAt: start, deadline: start + 130 * 60 * 1000, answers: {}, submitted: false } })); setExamIndex(0); setQuizMode('exam');
  }
  const latest = new Map(progress.attempts.map(attempt => [attempt.questionId, attempt]));
  const correctCount = [...latest.values()].filter(attempt => attempt.correct).length;
  function downloadBackup() { const blob = new Blob([exportBackup(current.current)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `saa-backup-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  if (!loaded) return <main className="loading">
    <div className="brand-mark">S</div><h1>SAA 学習ノート</h1>
    <p role="status">{loadError || '学習記録を読み込んでいます…'}</p>
    {loadError && <section className="paper recovery">
      <button onClick={() => void initialize()}>読み込みを再試行</button>
      <h2>バックアップから復元する</h2>
      <p>保存しておいたJSONを選択してください。内容を確認して復元を実行するまで、端末の記録は変更しません。</p>
      <label className="file-button">バックアップを選ぶ
        <input type="file" accept=".json,application/json" disabled={backupBusy} onChange={async e => {
          const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
          setBackupBusy(true); setPendingBackup(null);
          try { if (file.size > 10 * 1024 * 1024) throw new Error('ファイルは10MB以内にしてください。'); setPendingBackup(parseBackup(await file.text())); setNotice(''); }
          catch (error) { setNotice(`ファイルを確認できませんでした。${error instanceof Error ? error.message : ''}`); }
          finally { setBackupBusy(false); }
        }} />
      </label>
      {notice && <p role="alert">{notice}</p>}
      {pendingBackup && <div className="restore-confirm">
        <h3>復元内容を確認</h3><p>回答 {pendingBackup.attempts.length} 件・読了 {pendingBackup.readLessons.length} 件・ブックマーク {pendingBackup.bookmarks.length} 件</p>
        <p>読み込めない端末内の記録を、この内容で置き換えます。</p>
        <div className="button-row"><button disabled={backupBusy} onClick={async () => {
          setBackupBusy(true);
          try { await saveProgress(pendingBackup); current.current = pendingBackup; setProgress(pendingBackup); setPendingBackup(null); setLoadError(''); setLoaded(true); setNotice('バックアップから学習記録を復元しました。'); }
          catch { setNotice('復元内容を保存できませんでした。保存領域の設定を確認してください。'); }
          finally { setBackupBusy(false); }
        }}>{backupBusy ? '復元中…' : 'この内容で記録を置き換えて復元'}</button><button disabled={backupBusy} onClick={() => setPendingBackup(null)}>キャンセル</button></div>
      </div>}
    </section>}
  </main>;

  return <div className={`app ${largeText ? 'large-text' : ''}`}>
    <header className="site-header"><button className="brand" onClick={() => go('home')} aria-label="今日の学習へ"><span className="brand-mark">S</span><span>SAA 学習ノート<small>ひとつずつ、設計できる自分へ。</small></span></button><span className="edition">{release.label}</span></header>
    {saveError && <div className="banner error" role="alert">{saveError}<button onClick={downloadBackup}>記録を書き出す</button></div>}
    {notice && <div className="banner" role="status">{notice}<button aria-label="お知らせを閉じる" onClick={() => setNotice('')}>×</button></div>}
    <main id="main-content">
      {page === 'home' && <>
        <section className="hero"><div><p className="eyebrow">YOUR DAILY LEARNING</p><h1>今日の一歩が、<br />設計の力になる。</h1><p>読む、考える、振り返る。<br />1日25分のAWS学習を、ここから。</p><button className="primary" onClick={() => { go('text'); setLessonId(allLessons.find(l => !progress.readLessons.includes(l.id))?.id ?? allLessons[0]?.id ?? null); }}>今日のテキストを読む <span>→</span></button></div><div className="hero-art" aria-hidden="true"><span className="cloud">☁</span><div className="architecture"><i>AZ 1</i><i>AZ 2</i></div><div className="architecture-line" /><b>AWS ARCHITECTURE</b></div></section>
        <p className="release-note">先行学習版：全体像・IAMの2章、基礎問題20問。残りの教材・模擬試験は制作中です。設計クエストは3ミッションの試作版です。</p><section className="stats" aria-label="学習の進み具合"><div><strong>{progress.readLessons.length}<small> / {allLessons.length}</small></strong><span>読了レッスン</span></div><div><strong>{latest.size}<small> 問</small></strong><span>取り組んだ問題</span></div><div><strong>{latest.size ? Math.round(correctCount / latest.size * 100) : 0}<small> %</small></strong><span>直近回答の正答率</span></div></section>
        <div className="section-heading"><h2>今日の学習メニュー</h2><span>目安 25分</span></div><section className="daily-grid"><button className="action-card" onClick={() => { go('quiz'); setQuizMode('review'); setQuestionId(null); }}><span className="step">01 / 5 MIN</span><h3>思い出す</h3><p>間違えた問題・自信のない問題を復習。</p><strong>{review.length} 問を復習 →</strong></button><button className="action-card" onClick={() => { go('text'); setLessonId(null); }}><span className="step">02 / 10 MIN</span><h3>理解をつなぐ</h3><p>身近なたとえから、AWSの仕組みへ。</p><strong>テキストを読む →</strong></button><button className="action-card" onClick={() => { go('quiz'); setQuizMode('practice'); setQuestionId(null); }}><span className="step">03 / 10 MIN</span><h3>選ぶ力をつける</h3><p>要件を読み、選択肢の理由を考える。</p><strong>問題を解く →</strong></button></section>
        <section className="quest-entry"><div><small>NEW / ARCHITECT QUEST</small><h2>カードでつくる、小さな工房。</h2><p>8枚のカード、3つのミッション。失敗から設計を学ぼう。</p></div><button className="quest-primary" onClick={() => go('game')}>設計クエストを遊ぶ →</button></section>
        <section className="offline-callout"><span className="round-icon">↓</span><div><h3>電波のない場所も、学びの時間に。</h3><p>最初に教材を保存すると、読む・解く・復習する操作をオフラインで利用できます。</p></div><button className="secondary" onClick={() => go('settings')}>オフラインの準備</button></section>
      </>}
      {page === 'game' && <><button className="text-button" onClick={() => go('home')}>← 今日の学習へ</button><Game value={progress.game} onSave={game => update(p => ({ ...p, game }))} onLesson={id => { go('text'); setLessonId(id); }} /></>}
      {page === 'text' && <><p className="eyebrow">LEARNING LIBRARY</p><h1>テキスト</h1>{activeLesson ? <article className="lesson paper"><button className="text-button" onClick={() => setLessonId(null)}>← 章の一覧へ</button><h2>{activeLesson.title}</h2><div className="button-row"><button className="secondary" onClick={() => update(p => ({ ...p, bookmarks: p.bookmarks.includes(activeLesson.id) ? p.bookmarks.filter(id => id !== activeLesson.id) : [...p.bookmarks, activeLesson.id] }))}>{progress.bookmarks.includes(activeLesson.id) ? '★ 保存済み' : '☆ ブックマーク'}</button><button className="secondary" onClick={() => update(p => ({ ...p, readLessons: p.readLessons.includes(activeLesson.id) ? p.readLessons.filter(id => id !== activeLesson.id) : [...p.readLessons, activeLesson.id] }))}>{progress.readLessons.includes(activeLesson.id) ? '✓ 読了済み' : '読了にする'}</button></div><section className="analogy"><h3>身近なたとえで考える</h3><p>{activeLesson.analogy}</p></section><h3>仕組みを理解する</h3><p className="preserve-lines">{activeLesson.explanation}</p><div className="diagram" aria-label="構成図">{activeLesson.diagram.map((line, i) => <div key={i}>{line}</div>)}</div><h3>選び方のポイント</h3><ul>{activeLesson.points.map(point => <li key={point}>{point}</li>)}</ul><div className="comparison">{activeLesson.comparison.map(item => <section key={item.name}><h4>{item.name}</h4><p>{item.use}</p><small>{item.caution}</small></section>)}</div><Sources sources={activeLesson.sources} /><button className="primary" onClick={() => { const related = practiceQuestions.find(q => q.conceptIds.some(id => activeLesson.conceptIds.includes(id))); go('quiz'); setQuizMode('practice'); if (related) openQuestion(related); else setQuestionId(null); }}>関連する問題で確認する →</button></article> : <><label className="search-field"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="章・レッスン・本文を検索" aria-label="教材を検索" /></label>{chapters.map((chapter, i) => { const lessons = chapter.lessons.filter(l => `${chapter.title} ${l.title} ${l.explanation}`.toLowerCase().includes(search.toLowerCase())); return lessons.length > 0 && <section className="chapter paper" key={chapter.id}><div className="chapter-head"><span className="chapter-number">{String(i + 1).padStart(2, '0')}</span><div><h2>{chapter.title}</h2><p>{chapter.intro}</p></div></div>{lessons.map(lesson => <button className="lesson-link" key={lesson.id} onClick={() => { setLessonId(lesson.id); window.scrollTo({ top: 0 }); }}><span>{progress.readLessons.includes(lesson.id) ? '✓ ' : ''}{progress.bookmarks.includes(lesson.id) ? '★ ' : ''}{lesson.title}</span><span>→</span></button>)}</section>; })}{!chapters.some(ch => ch.lessons.some(l => `${ch.title} ${l.title} ${l.explanation}`.toLowerCase().includes(search.toLowerCase()))) && <p>一致する教材はありません。</p>}</>}</>}
      {page === 'quiz' && <><p className="eyebrow">PRACTICE & REFLECT</p><h1>問題集</h1><div className="tabs">{(['practice', 'review', 'exam'] as const).map((mode, i) => <button aria-pressed={quizMode === mode} className={quizMode === mode ? 'active' : ''} key={mode} onClick={() => { setQuizMode(mode); setQuestionId(null); setFilter('all'); }}>{['通常問題', `復習 (${review.length})`, '模擬試験'][i]}</button>)}</div>
        {quizMode !== 'exam' && (question ? <article className="paper question"><button className="text-button" onClick={() => setQuestionId(null)}>← 問題一覧へ</button><p className="eyebrow">{domains[question.domain - 1]} · {question.id}</p><h2>{question.prompt}</h2><p className="selection-hint">{question.answers.length === 1 ? '正しいものを1つ選んでください。' : `正しいものを${question.answers.length}つ選んでください。`}（選択中 {selected.length} / {question.answers.length}）</p><div className="choices">{question.options.map(option => <button key={option.id} disabled={answered} aria-pressed={selected.includes(option.id)} className={`choice ${selected.includes(option.id) ? 'selected' : ''} ${answered && question.answers.includes(option.id) ? 'correct' : ''}`} onClick={() => setSelected(toggleSelection(selected, option.id, question.answers.length))}><span className="choice-letter">{option.id.toUpperCase()}</span><span>{option.text}</span></button>)}</div>{!answered ? <><label className="checkbox-row"><input type="checkbox" checked={unsure} onChange={e => setUnsure(e.target.checked)} />自信なし・後で復習したい</label><button className="primary" disabled={selected.length !== question.answers.length} onClick={answer}>回答して解説を見る</button></> : <><div className={`result ${isCorrect(question, selected) ? 'success' : ''}`} role="status">{isCorrect(question, selected) ? '✓ 正解です' : 'もう一度、理由を確認しましょう'}</div><Explanation question={question} onOpenLesson={id => { go('text'); setLessonId(id); }} /><button className="secondary" onClick={() => { const next = pool.find(q => q.id !== question.id && !latest.has(q.id)) ?? pool.find(q => q.id !== question.id); if (next) openQuestion(next); else setQuestionId(null); window.scrollTo({ top: 0 }); }}>次の問題へ →</button></>}</article> : <><div className="filter-row"><label>章で絞り込み <select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">すべての章</option>{chapters.map(ch => <option key={ch.id} value={ch.id}>{ch.title}</option>)}</select></label><span>{pool.length} 問</span></div>{pool.length === 0 ? <div className="paper empty"><h2>復習する問題はありません</h2><p>通常問題で間違えた問題や「自信なし」の問題がここに表示されます。</p></div> : <div className="question-list">{pool.map((q, i) => <button className="paper question-link" key={q.id} onClick={() => openQuestion(q)}><span className="question-number">{String(i + 1).padStart(2, '0')}</span><span><small>{domains[q.domain - 1]} · {q.answers.length > 1 ? `${q.answers.length}つ選択` : '単一選択'} {latest.get(q.id)?.correct ? '· ✓ 正解済み' : ''}</small><strong>{q.prompt}</strong></span><span>→</span></button>)}</div>}</>)}
        {quizMode === 'exam' && <><div className="exam-intro paper"><h2>本番を意識して、力を確かめる。</h2><p>準備中です。先行学習版には模擬試験を収録していません。完成版は各65問・130分。解説は提出後に表示します。途中で閉じても時間は進み、再開時に期限を過ぎていれば自動提出されます。</p><div className="button-row"><button className="secondary" disabled={!release.mocksReady} onClick={() => startExam('mock1')}>模擬試験 1 を開始</button><button className="secondary" disabled={!release.mocksReady} onClick={() => startExam('mock2')}>模擬試験 2 を開始</button></div></div>{exam && (!exam.submitted ? <section className="paper question"><div className="exam-status"><strong>模擬試験 {exam.id === 'mock1' ? '1' : '2'}</strong><span>残り {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span></div><label>問題へ移動 <select value={examIndex} onChange={e => setExamIndex(Number(e.target.value))}>{examQuestions.map((q, i) => <option value={i} key={q.id}>{i + 1} / {examQuestions.length}{exam.answers[q.id]?.length === q.answers.length ? ' 回答済み' : ' 未回答'}</option>)}</select></label>{examQuestion && <><h2>{examQuestion.prompt}</h2><p>{examQuestion.answers.length}つ選択 · 選択中 {exam.answers[examQuestion.id]?.length ?? 0}</p><div className="choices">{examQuestion.options.map(option => <button className={`choice ${(exam.answers[examQuestion.id] ?? []).includes(option.id) ? 'selected' : ''}`} aria-pressed={(exam.answers[examQuestion.id] ?? []).includes(option.id)} key={option.id} onClick={() => update(p => p.exam && !p.exam.submitted && Date.now() < p.exam.deadline ? { ...p, exam: { ...p.exam, answers: { ...p.exam.answers, [examQuestion.id]: toggleSelection(p.exam.answers[examQuestion.id] ?? [], option.id, examQuestion.answers.length) } } } : p)}><span className="choice-letter">{option.id.toUpperCase()}</span>{option.text}</button>)}</div></>}<div className="button-row"><button className="secondary" disabled={examIndex === 0} onClick={() => setExamIndex(i => i - 1)}>← 前へ</button><button className="secondary" disabled={examIndex >= examQuestions.length - 1} onClick={() => setExamIndex(i => i + 1)}>次へ →</button><button className="primary" onClick={() => { if (window.confirm(`回答済み ${examQuestions.filter(q => exam.answers[q.id]?.length === q.answers.length).length} / ${examQuestions.length} 問です。提出して採点しますか？`)) update(p => ({ ...p, exam: p.exam ? { ...p.exam, submitted: true } : null })); }}>提出する</button></div><p className="muted">回答は選択するたびに保存されます。</p></section> : <section className="paper"><h2>模擬試験の結果</h2><div className="exam-score">{examQuestions.filter(q => isCorrect(q, exam.answers[q.id] ?? [])).length}<small> / {examQuestions.length} 問正解</small></div><p>正答率は学習の目安です。本試験のスコア・合格を保証するものではありません。</p><div className="domain-results">{domains.map((name, index) => { const group = examQuestions.filter(q => q.domain === index + 1); return <div key={name}><span>{name}</span><strong>{group.filter(q => isCorrect(q, exam.answers[q.id] ?? [])).length} / {group.length}</strong></div>; })}</div>{examQuestions.map((q, i) => <details className="exam-review" key={q.id}><summary>{isCorrect(q, exam.answers[q.id] ?? []) ? '✓' : '×'} 問題 {i + 1} · {q.prompt}</summary><p>あなたの回答：{(exam.answers[q.id] ?? []).map(id => q.options.find(o => o.id === id)?.text ?? id).join(' ／ ') || '未回答'}</p><Explanation question={q} onOpenLesson={id => { go('text'); setLessonId(id); }} /></details>)}</section>)}</>}
      </>}
      {page === 'terms' && <><p className="eyebrow">YOUR AWS DICTIONARY</p><h1>用語集</h1><p className="muted">ことばの意味から、仕組みの理解へ。</p><label className="search-field"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="サービス名・キーワードを検索" aria-label="用語を検索" /></label><div className="term-grid">{terms.filter(term => `${term.name} ${term.meaning}`.toLowerCase().includes(search.toLowerCase())).map(term => <article className="paper term" key={term.id}><h2>{term.name}</h2><p>{term.meaning}</p><button className="text-button" onClick={() => { go('text'); setLessonId(allLessons.find(l => l.conceptIds.includes(term.id))?.id ?? chapters.find(ch => ch.id === term.chapterId)?.lessons[0]?.id ?? null); }}>関連テキストへ →</button></article>)}</div>{!terms.some(term => `${term.name} ${term.meaning}`.toLowerCase().includes(search.toLowerCase())) && <p>一致する用語はありません。</p>}</>}
      {page === 'settings' && <><p className="eyebrow">MAKE IT YOURS</p><h1>設定</h1><section className="paper"><h2>オフラインで学習する</h2><ol><li>iPhoneのSafariでこのページを開きます。</li><li>共有メニューから「ホーム画面に追加」を選びます。</li><li>ホーム画面からアプリを開き、下のボタンで教材を保存します。</li><li>「準備完了」を確認後、機内モードで起動を確かめます。</li></ol><button className="primary" disabled={offlineBusy} onClick={async () => { setOfflineBusy(true); setNotice('教材を保存・確認しています…'); try { setNotice(await prepareOffline()); } catch (error) { setNotice(`準備できませんでした。通信状態を確認してください。${error instanceof Error ? error.message : ''}`); } finally { setOfflineBusy(false); } }}>{offlineBusy ? '保存状態を確認中…' : '教材を保存・オフライン状態を確認'}</button><p className="muted">iOSが保存データを削除する場合があります。記録を定期的にバックアップしてください。出典リンクはオンライン専用です。</p></section><section className="paper"><h2>教材・アプリの更新</h2><p>オンラインで新版を取得した後、学習の区切りで適用してください。</p><button className="secondary" onClick={async () => { await queue.current; if (unsaved.current) { setNotice('保存に失敗しているため、先にバックアップしてください。'); return; } try { await activateUpdate(); setNotice('更新の確認が完了しました。'); } catch (error) { setNotice(`更新できませんでした。${error instanceof Error ? error.message : ''}`); } }}>更新を確認・適用</button></section><section className="paper"><h2>学習記録のバックアップ</h2><p>回答履歴、読了、ブックマーク、模擬試験、設計クエストの状態をJSONで保存します。復元すると現在の記録を置き換えます。</p><div className="button-row"><button className="secondary" onClick={downloadBackup}>バックアップを書き出す</button><label className="file-button">バックアップを選ぶ<input type="file" accept=".json,application/json" disabled={backupBusy} onChange={async e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; setBackupBusy(true); setPendingBackup(null); try { if (file.size > 10 * 1024 * 1024) throw new Error('ファイルは10MB以内にしてください。'); setPendingBackup(parseBackup(await file.text())); } catch (error) { setNotice(`復元ファイルを確認できませんでした。${error instanceof Error ? error.message : ''}`); } finally { setBackupBusy(false); } }} /></label></div>{pendingBackup && <div className="restore-confirm"><h3>復元内容を確認</h3><p>回答 {pendingBackup.attempts.length} 件・読了 {pendingBackup.readLessons.length} 件・ブックマーク {pendingBackup.bookmarks.length} 件</p><p>現在の記録をこの内容で置き換えます。</p><div className="button-row"><button className="primary" onClick={() => { update(() => pendingBackup); setPendingBackup(null); setNotice('復元内容を読み込みました。保存に失敗した場合は画面上部に表示します。'); }}>この内容で復元</button><button className="secondary" onClick={() => setPendingBackup(null)}>キャンセル</button></div></div>}</section><section className="paper"><h2>読みやすさ</h2><label className="checkbox-row"><input type="checkbox" checked={largeText} onChange={e => setLargeText(e.target.checked)} />文字を大きくする</label><p className="muted">Safariの文字サイズ設定も利用できます。</p></section><section className="paper"><h2>この教材について</h2><p>AWS初学者のための独自教材・オリジナル問題です。AWS公式の試験問題ではありません。出典と確認日は各レッスン・解説に掲載しています。</p></section></>}
    </main><footer className="site-footer">SAA 学習ノート <span>小さな理解を、確かな設計へ。</span></footer><nav className="bottom-nav" aria-label="メインナビゲーション">{nav.map(item => <button key={item.id} className={page === item.id ? 'active' : ''} aria-current={page === item.id ? 'page' : undefined} onClick={() => go(item.id)}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}</nav>
  </div>;
}
