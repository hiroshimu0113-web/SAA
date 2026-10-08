import type { Progress } from './types';
export const emptyProgress = (): Progress => ({ version: 1, attempts: [], bookmarks: [], readLessons: [], exam: null, game: null });
const object = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const strings = (x: unknown): x is string[] => Array.isArray(x) && x.every(s => typeof s === 'string') && new Set(x).size === x.length;
export function parseBackup(text: string): Progress {
  if (text.length > 10_000_000) throw new Error('バックアップは10MB以内にしてください。');
  const p: unknown = JSON.parse(text);
  if (!object(p) || p.version !== 1 || !Array.isArray(p.attempts) || !strings(p.bookmarks) || !strings(p.readLessons)) throw new Error('対応していないバックアップ形式です。');
  if (!p.attempts.every(a => object(a) && typeof a.questionId === 'string' && strings(a.selected) && typeof a.correct === 'boolean' && typeof a.unsure === 'boolean' && typeof a.at === 'string' && Number.isFinite(Date.parse(a.at)))) throw new Error('回答履歴が不正です。');
  const validExam = (e: unknown): boolean => object(e) && ['mock1', 'mock2', 'assessment1'].includes(String(e.id)) && typeof e.startedAt === 'number' && Number.isFinite(e.startedAt) && typeof e.deadline === 'number' && Number.isFinite(e.deadline) && e.deadline >= e.startedAt && typeof e.submitted === 'boolean' && object(e.answers) && Object.values(e.answers).every(strings)
    && (e.revision === undefined || typeof e.revision === 'string')
    && (e.attemptNumber === undefined || (Number.isSafeInteger(e.attemptNumber) && Number(e.attemptNumber) > 0))
    && (e.exposure === undefined || ['unseen-self-reported', 'seen-or-unknown'].includes(String(e.exposure)));
  if (p.exam !== null && !validExam(p.exam)) throw new Error('模擬試験データが不正です。');
  if (p.examArchive !== undefined && (!Array.isArray(p.examArchive) || !p.examArchive.every(validExam))) throw new Error('試験履歴が不正です。');
  if (p.game !== null && !object(p.game)) throw new Error('冒険の保存データが不正です。');
  if (!('game' in p)) throw new Error('保存項目が不足しています。');
  return p as unknown as Progress;
}
export const exportBackup = (p: Progress): string => JSON.stringify(parseBackup(JSON.stringify(p)), null, 2);
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('saa-learning', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('state');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('別の画面を閉じて保存を再試行してください。'));
  });
}
export async function loadProgress(): Promise<Progress> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', 'readonly');
    const req = tx.objectStore('state').get('progress');
    let result = emptyProgress();
    req.onsuccess = () => { try { if (req.result !== undefined) result = parseBackup(JSON.stringify(req.result)); } catch (e) { reject(e); } };
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error); };
  });
}
export async function saveProgress(p: Progress): Promise<void> {
  const safe = parseBackup(JSON.stringify(p));
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('state', 'readwrite');
    tx.objectStore('state').put(safe, 'progress');
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error('保存に失敗しました。')); };
  });
}
