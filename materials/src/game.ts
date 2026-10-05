export const cards = [
  { id: 'ec2', name: 'EC2 × 1', icon: '▣', cost: 2, kind: 'COMPUTE', text: '1つのAZで処理する仮想サーバー。AZ全体の障害には単独で耐えられません。' },
  { id: 'multi-az', name: 'EC2 × 2 / 別々のAZ', icon: '◫', cost: 4, kind: 'COMPUTE', text: '同じ処理ができる2台を別々のAZへ。状態はサーバーの外へ保存します。' },
  { id: 'alb', name: 'Application Load Balancer', icon: '⑂', cost: 2, kind: 'NETWORK', text: '複数AZで構成し、正常なEC2へHTTPリクエストを振り分けます。' },
  { id: 's3', name: 'S3 / 非公開バケット', icon: '▱', cost: 2, kind: 'STORAGE', text: '処理結果をオブジェクトとして保存。今回の構成はS3 Standardを想定します。' },
  { id: 'role', name: '必要な権限のIAMロール', icon: '◇', cost: 1, kind: 'IDENTITY', text: '信頼関係と最小権限を設定し、一時認証情報でアクセスします。' },
  { id: 'keys', name: 'コードに固定アクセスキー', icon: '⚿', cost: 1, kind: 'IDENTITY', text: '手早く接続できますが、漏えいと長期キー管理のリスクがあります。' },
  { id: 'mfa', name: 'フェデレーション + MFA', icon: '◎', cost: 1, kind: 'IDENTITY', text: '従業員は認証基盤でMFAを使って認証し、許可されたロールを引き受けます。' },
  { id: 'root', name: 'ルート認証情報の共有', icon: '△', cost: 0, kind: 'IDENTITY', text: '強い権限を全員で共有する方法。日常作業に利用してはいけません。' },
] as const;
export type CardId = typeof cards[number]['id'];
export const missions: { title: string; subtitle: string; brief: string; budget: number; required: CardId[]; checks: { card: CardId; label: string; reason: string }[]; lesson: string; takeaway: string; source: string }[] = [
  { title: '消えない成果を届ける', subtitle: 'MISSION 01 / 小さな写真工房', budget: 5,
    brief: '写真を加工するバッチ処理を1台のEC2で動かします。EC2を削除した後も完成写真を残し、コードには認証情報を埋め込まない構成を作ってください。今回はサーバー停止中の処理継続は求めません。',
    required: ['ec2', 's3', 'role'], lesson: 'ch01-l03',
    checks: [{ card: 'ec2', label: '処理を実行できる', reason: 'このミッションは1台のEC2が処理を担います。' }, { card: 's3', label: 'EC2を削除しても成果を保持', reason: '処理結果をS3へ保存すれば、EC2の存続に依存しません。' }, { card: 'role', label: '固定キーを埋め込まずアクセス', reason: 'EC2へIAMロールを割り当て、必要なS3操作だけを許可します。' }],
    takeaway: '処理する場所と、失いたくない結果の保存先を分けます。S3へのアクセスにはEC2のIAMロールを使います。', source: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html' },
  { title: 'ひとつのAZが止まったら？', subtitle: 'MISSION 02 / 工房のオンライン化', budget: 9,
    brief: '工房がWebサービスになりました。1つのAZが使えなくなっても、正常なAZへ新しいリクエストを送りたい。完成写真はS3へ保存し、アクセスはロール経由にします。各EC2は同じ処理ができ、セッションを保持しない前提です。',
    required: ['multi-az', 'alb', 's3', 'role'], lesson: 'ch01-l01',
    checks: [{ card: 'multi-az', label: '別AZにも処理先を用意', reason: '同じAZ内だけで増やしても、AZ全体の障害には備えられません。' }, { card: 'alb', label: '正常な処理先へ振り分け', reason: '複数AZのALBとヘルスチェックで、正常なターゲットへ振り分けます。' }, { card: 's3', label: '処理結果をサーバー外へ保存', reason: 'どのEC2が処理しても、結果を共通の保存先へ残します。' }, { card: 'role', label: 'EC2の権限を最小限にする', reason: '各EC2に必要な権限のロールを割り当てます。' }],
    takeaway: 'AZを分けるだけでなく、正常な処理先へ切り替える仕組みと、サーバーに閉じ込めない状態管理が必要です。進行中のリクエストは失敗し得るため、実システムでは再試行も設計します。', source: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html' },
  { title: '鍵を渡さず、チームを迎える', subtitle: 'MISSION 03 / 仲間と守る工房', budget: 4,
    brief: '最後は従業員のアクセス設計です。非公開S3の完成写真を担当者が管理します。MFAで本人確認を強化し、一時認証情報と必要最小限の権限を使ってください。EC2の処理基盤は今回の選択対象外です。',
    required: ['s3', 'role', 'mfa'], lesson: 'ch02-l01',
    checks: [{ card: 's3', label: '完成写真を非公開で管理', reason: '共有するのは必要なアクセス権です。写真を一般公開する必要はありません。' }, { card: 'mfa', label: '従業員をMFAで認証', reason: '認証基盤でフェデレーションとMFAを構成します。' }, { card: 'role', label: '必要な権限を一時的に使う', reason: '認証された従業員が適切なロールを引き受け、必要な操作だけを行います。' }],
    takeaway: 'MFAは本人確認を強化し、IAMの権限設定は実行できる操作を制限します。役割が異なるため両方が必要です。ルート認証情報や長期キーをチームへ配りません。', source: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' },
];
export function evaluateMission(index: number, selected: CardId[]) {
  const mission = missions[index];
  if (!mission) throw new Error('Unknown mission');
  const unique = [...new Set(selected)];
  const cost = cards.filter(card => unique.includes(card.id)).reduce((sum, card) => sum + card.cost, 0);
  const checks = [
    ...mission.checks.map(check => ({ label: check.label, reason: check.reason, passed: unique.includes(check.card) })),
    { label: '危険な認証情報の共有を避ける', reason: 'コードに固定キーを埋め込んだり、ルート認証情報を共有したりせず、適切なロールを使います。', passed: !unique.includes('keys') && !unique.includes('root') },
    { label: `設計ポイント ${cost} / ${mission.budget}`, reason: '必要な役割を満たし、不要なカードを外して設計ポイント内に収めましょう。', passed: cost <= mission.budget },
  ];
  return { cost, checks, passed: checks.every(check => check.passed) };
}
export interface GameState { version: 1; mission: number; selected: CardId[]; attempts: number; checked: boolean; stars: number[] }
export const newGame = (): GameState => ({ version: 1, mission: 0, selected: [], attempts: 0, checked: false, stars: [] });
export function readGame(value: unknown): GameState | null {
  if (!value || typeof value !== 'object') return null;
  const g = value as GameState;
  if (g.version !== 1 || !Number.isInteger(g.mission) || g.mission < 0 || g.mission > missions.length || !Array.isArray(g.selected) || g.selected.length > cards.length || new Set(g.selected).size !== g.selected.length || !g.selected.every(id => cards.some(c => c.id === id)) || !Number.isInteger(g.attempts) || g.attempts < 0 || typeof g.checked !== 'boolean' || !Array.isArray(g.stars) || g.stars.length !== g.mission || !g.stars.every(s => Number.isInteger(s) && s >= 1 && s <= 3)) return null;
  return g;
}
export function checkGame(state: GameState): GameState {
  if (state.checked || state.mission >= missions.length) return state;
  return { ...state, checked: true, attempts: state.attempts + 1 };
}
export function advanceGame(state: GameState): GameState {
  if (!state.checked || state.mission >= missions.length || !evaluateMission(state.mission, state.selected).passed) return state;
  return { ...newGame(), mission: state.mission + 1, stars: [...state.stars, Math.max(1, 4 - state.attempts)] };
}
