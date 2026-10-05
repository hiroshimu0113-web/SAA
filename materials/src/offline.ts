let registration: Promise<ServiceWorkerRegistration> | undefined;
function register(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator)) return Promise.reject(new Error('このブラウザーではオフライン保存を利用できません。'));
  if (import.meta.env.DEV) return Promise.reject(new Error('オフライン機能はビルド済みのプレビューまたは公開版で確認してください。'));
  registration ??= navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(error => { registration = undefined; throw error; });
  return registration;
}
async function activeWorker(): Promise<ServiceWorker> {
  const r = await register();
  if (r.active) return r.active;
  return new Promise((resolve, reject) => {
    const deadline = setTimeout(() => reject(new Error('教材の保存が完了しませんでした。通信状態を確認して再試行してください。')), 60000);
    const check = () => {
      if (r.active) { clearTimeout(deadline); resolve(r.active); }
      else if (r.installing?.state === 'redundant') { clearTimeout(deadline); reject(new Error('教材を保存できませんでした。再試行してください。')); }
    };
    r.installing?.addEventListener('statechange', check);
    r.addEventListener('updatefound', () => r.installing?.addEventListener('statechange', check));
    check();
  });
}
function message(worker: ServiceWorker, type: string): Promise<{ ok: boolean; version: string }> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('保存状態を確認できません。再試行してください。')); }, 15000);
    channel.port1.onmessage = e => { clearTimeout(timer); channel.port1.close(); resolve(e.data); };
    worker.postMessage({ type }, [channel.port2]);
  });
}
export async function prepareOffline(): Promise<string> {
  const worker = await activeWorker();
  const status = await message(worker, 'VERIFY');
  if (!status.ok) { await message(worker, 'REPAIR'); const again = await message(worker, 'VERIFY'); if (!again.ok) throw new Error('教材の保存が不足しています。オンラインで再試行してください。'); }
  await navigator.storage?.persist?.().catch(() => false);
  return `オフライン準備完了（教材 ${status.version}）。機内モードで再起動して確認できます。`;
}
export async function activateUpdate(): Promise<void> {
  const r = await register();
  await r.update();
  if (r.installing) await new Promise<void>((resolve, reject) => {
    const worker = r.installing!;
    const timer = setTimeout(() => reject(new Error('更新が完了しませんでした。旧版は引き続き利用できます。')), 60000);
    const check = () => { if (worker.state === 'installed') { clearTimeout(timer); resolve(); } else if (worker.state === 'redundant') { clearTimeout(timer); reject(new Error('更新に失敗しました。旧版を引き続き利用できます。')); } };
    worker.addEventListener('statechange', check); check();
  });
  if (r.waiting) {
    const status = await message(r.waiting, 'VERIFY');
    if (!status.ok) throw new Error('新版の保存が未完了です。旧版を利用してください。');
    const waiting = r.waiting;
    await new Promise<void>((resolve, reject) => {
      const done = () => { clearTimeout(timer); navigator.serviceWorker.removeEventListener('controllerchange', done); resolve(); location.reload(); };
      const timer = setTimeout(() => { navigator.serviceWorker.removeEventListener('controllerchange', done); reject(new Error('更新の切り替えを確認できませんでした。アプリを再起動してください。')); }, 15000);
      navigator.serviceWorker.addEventListener('controllerchange', done);
      waiting.postMessage({ type: 'ACTIVATE' });
    });
  }
}
