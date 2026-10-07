import type { Chapter, Question } from '../../types';
// Each mapping includes actual teaching text; adding tags alone is not a remedy.
const details: Record<string, [string, string]> = {
 'spot':['ch01-l03','中断を許容できて再開可能な処理はSpotを比較します。期限が厳しく再実行できない単一処理では、安さより継続性を先に満たします。'],
 'root':['ch02-l01','ルートユーザーはMFAで保護し、日常作業は別の必要最小権限のIDへ分けます。'],
 'mfa':['ch02-l01','MFAはパスワード以外の認証要素を追加します。認証を強化しても許可する操作の範囲は別に設計します。'],
 'cognito':['ch02-l03','Cognitoはアプリの利用者認証を扱い、従業員の複数AWSアカウントへのアクセスを統合するIdentity Centerとは利用者が異なります。'],
 'permissions-boundary':['ch02-l02','アクセス許可の境界はIAM主体へ付与できる権限の上限です。開発者へロール作成を委任する時は、境界の設定を必須にし、境界の削除や迂回による権限昇格も防ぎます。'],
 'abac':['ch02-l02','ABACは主体とリソースのタグ等の属性を条件にする認可です。Projectタグの一致で範囲を制限する場合、利用者が自由に認可用タグを変更できないようにします。'],
 'implicit-deny':['ch02-l02','適用される許可がない操作は暗黙的Denyです。リソースポリシーや主体の種類による評価の違いを確認し、IAM側にAllowがないだけで常に結論を出さないようにします。'],
 'access-analyzer':['ch02-l03','IAM Access Analyzerは対象リソースポリシー等を分析して外部アクセスを見つけるために使います。検出と権限の修正は別の作業です。'],
 'block-public-access':['ch02-l03','S3 Block Public Accessはパブリックなアクセス設定への防御です。必要な特定アカウントへの共有と不特定多数への公開を区別します。'],
 'cognito-identity':['ch02-l03','Cognitoユーザープールはアプリ利用者の認証、IDプールは認証済みID等へAWSの一時認証情報を提供する機能です。アプリへ共通の長期キーを埋め込む方式と区別します。'],
 'public-subnet':['ch03-l01','IGWへの直接ルートがある公開サブネットでも、IPv4で直接通信するEC2にはパブリックIPv4とSG/NACLの許可が必要です。'],
 'longest-prefix':['ch03-l01','宛先10.1.2.3に10.0.0.0/8と10.1.0.0/16が一致するなら、より具体的な/16を選びます。ルートの作成順ではありません。'],
 'cidr':['ch03-l03','VPCピアリングのCIDRは重複できません。10.0.0.0/16同士をそのまま接続しても宛先を一意にできないためアドレス計画が必要です。'],
 'private-link':['ch03-l03','PrivateLinkのInterface endpointではプライベートIP、DNS、エンドポイントのSGを確認します。Gateway endpointとは構成・対応サービス・料金が違います。'],
 'site-to-site-vpn':['ch03-l03','Site-to-Site VPNは拠点とAWSをIPsecトンネルで結びます。暗号化することと十分な帯域・冗長性があることは別に検証します。'],
 'direct-connect':['ch03-l03','Direct ConnectはAWSへの専用接続です。既定の通信暗号化はないためTLS/VPN等と組み合わせる条件を確認します。費用と冗長接続の比較は第7章で扱います。'],
 'ipv6-egress':['ch03-l01','IPv6で外向き接続とその応答を許可し外部からの新規接続を防ぐならEgress-only Internet Gatewayを使う構成が候補です。IPv6からIPv4へ変換するNAT64とは要件が違います。'],
 'vpc-flow-logs':['ch03-l02','VPC Flow Logsで送信元・宛先やACCEPT/REJECT等の通信メタデータを調べます。パケット本文を記録する仕組みではなく、到達性調査ではルートやSG/NACLも確認します。'],
 'session-manager':['ch03-l02','Session Managerは受信SSHを開けず管理セッションを提供する候補です。SSM Agent、IAMロール、サービスへのHTTPS到達性などを整えます。'],
 'instance-store':['ch04-l01','インスタンスストアは停止・終了や基盤障害で失い得る一時領域です。再生成できない結果はS3やEBS等へ保存し、必要なら履歴バックアップも確保します。'],
 'fsx-windows':['ch05-l03','WindowsのSMB共有やActive Directory連携が必要ならFSx for Windows File Serverを比較します。LinuxのNFS共有を中心にするEFSとプロトコル要件を区別します。'],
 's3-replication':['ch05-l02','S3レプリケーションは設定した対象を複製します。既存オブジェクトの一括複製にはS3 Batch Replication等を検討し、ルール追加だけですべて過去分も複製されたと判断しません。'],
 'ebs-snapshot':['ch05-l03','EBSスナップショットは時点のバックアップで、別AZのボリューム復元にも使えます。アプリ整合性の確保と復元後の起動・I/Oを検証し、同期待機ディスクと混同しません。'],
 'multipart-upload':['ch05-l01','S3マルチパートアップロードは大きいオブジェクトを部分に分けて送信し、失敗した部分を再送できます。完了しないアップロードの片付けも設計します。'],
 'transfer-acceleration':['ch05-l01','S3 Transfer Accelerationは遠隔クライアントからS3への転送を改善する候補です。実際の経路で効果と追加費用を測り、どの転送も必ず速くなるとはしません。'],
 's3-encryption':['ch05-l02','S3のSSE-S3とSSE-KMSは保存時暗号化です。KMSキーの制御が必要ならSSE-KMSを比較し、KMS権限と料金も考慮します。暗号化だけでは閲覧権限を制限できません。'],
 's3-consistency':['ch05-l01','S3はPUT/DELETE後のオブジェクト読取りやLISTに強い整合性を提供します。CloudFront等のキャッシュが返す旧内容や、非同期のレプリケーション先の状態とは区別します。'],
 'dynamodb-ttl':['ch06-l02','DynamoDB TTLは指定した有効期限後に非同期で項目を削除します。期限の瞬間に消す保証はないため、期限切れデータを表示しない要件なら読取り側の判定も設けます。'],
 'dax':['ch06-l03','DAXはDynamoDB向けのインメモリキャッシュです。結果整合性の繰返し読取りに使い、最新値必須の強い読取りをキャッシュだけで保証しません。'],
 'dynamodb-transactions':['ch06-l02','DynamoDBトランザクションで複数項目の更新を全成功または全失敗にできます。通常の独立Putの連続実行は同じ原子性を持たず、トランザクションの費用・制約も比較します。']
};
export function connectLessons(chapters: Chapter[], questions: Question[]) {
 for (const [concept, [id, text]] of Object.entries(details)) {
  const lesson = chapters.flatMap(c => c.lessons).find(l => l.id === id);
  if (!lesson) continue;
  if (!lesson.conceptIds.includes(concept)) lesson.conceptIds.push(concept);
  if (!lesson.explanation.includes(text)) lesson.explanation += '\n\n' + text;
  const refs = questions.filter(q => q.conceptIds.includes(concept)).flatMap(q => q.sources);
  for (const s of refs) if (!lesson.sources.some(x => x.url === s.url)) lesson.sources.push(s);
 }
}
