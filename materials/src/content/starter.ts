import type { Term } from '../types';
export const starterTerms: Term[] = [
 {id:'region',name:'リージョン',meaning:'AWSの地理的な提供地域。遅延、データの所在、サービスの提供状況を考えて選ぶ。',chapterId:'ch01'},
 {id:'az',name:'アベイラビリティーゾーン（AZ）',meaning:'リージョン内の独立した場所。複数AZへの構成で、1つのAZの障害に備える。',chapterId:'ch01'},
 {id:'shared-responsibility',name:'責任共有モデル',meaning:'AWSと利用者で安全性や運用の責任を分担する考え方。利用するサービスで境界が変わる。',chapterId:'ch01'},
 {id:'availability',name:'可用性',meaning:'必要なときにサービスを利用できる性質。冗長化と切り替えを組み合わせて高める。',chapterId:'ch01'},
 {id:'durability',name:'耐久性',meaning:'保存したデータを失いにくい性質。サービスが今応答できるかを表す可用性とは異なる。',chapterId:'ch01'},
 {id:'scaling',name:'スケーリング',meaning:'負荷に合わせて処理能力を変えること。1台を大きくするスケールアップ、台数を増やすスケールアウトがある。',chapterId:'ch01'},
 {id:'spot',name:'Spotインスタンス',meaning:'中断の可能性があるEC2の購入方式。中断しても再開できる処理などでコスト削減を検討する。',chapterId:'ch01'},
 {id:'instance-store',name:'インスタンスストア',meaning:'EC2ホストに直接接続された一時的なストレージ。停止・終了などによる消失に備え、唯一の永続データを置かない。',chapterId:'ch01'},
 {id:'s3',name:'Amazon S3',meaning:'データをオブジェクトとして保存するサービス。アクセス権とデータ管理は利用者が設計する。',chapterId:'ch01'},
 {id:'rds',name:'Amazon RDS',meaning:'リレーショナルデータベースの管理サービス。基盤保守の一部をAWSに任せられるがデータ・権限の管理は残る。',chapterId:'ch01'},
 {id:'iam-role',name:'IAMロール',meaning:'人やサービスが引き受ける権限のまとまり。信頼ポリシーで誰が引き受けるか、権限ポリシーで何ができるかを定める。',chapterId:'ch02'},
 {id:'temporary-credentials',name:'一時認証情報',meaning:'有効期限を持つAWS操作用の認証情報。長期アクセスキーの配布を減らせる。',chapterId:'ch02'},
 {id:'least-privilege',name:'最小権限',meaning:'必要な対象に必要な操作だけを許可する原則。Action、Resource、Conditionなどを絞る。',chapterId:'ch02'},
 {id:'explicit-deny',name:'明示的Deny',meaning:'ポリシーで明示的に禁止する指定。対象操作に適用されればAllowより優先される。',chapterId:'ch02'},
 {id:'scp',name:'サービスコントロールポリシー（SCP）',meaning:'Organizationsのメンバーアカウントで利用できる権限の上限を定める。SCP単体では操作権限を付与しない。',chapterId:'ch02'},
 {id:'cross-account',name:'クロスアカウントアクセス',meaning:'別のAWSアカウントのリソースへアクセスすること。ロールによる委任などで信頼関係と権限を設定する。',chapterId:'ch02'},
 {id:'external-id',name:'External ID',meaning:'外部事業者が複数顧客のロールを使うとき、顧客の取り違えを防ぐ信頼ポリシー条件。秘密のパスワードではない。',chapterId:'ch02'},
 {id:'identity-center',name:'IAM Identity Center',meaning:'従業員の複数AWSアカウントや業務アプリへのアクセスをまとめて管理するサービス。',chapterId:'ch02'},
 {id:'cognito',name:'Amazon Cognito',meaning:'一般利用者向けアプリの認証などを扱うサービス。ユーザープールでサインアップとログインを提供できる。',chapterId:'ch02'},
 {id:'root',name:'ルートユーザー',meaning:'AWSアカウントの強い権限を持つ主体。MFAで保護し、日常作業は別の適切なIDで行う。',chapterId:'ch02'},
 {id:'mfa',name:'多要素認証（MFA）',meaning:'パスワードに加えて別の認証要素を求める仕組み。パスワードだけの漏えいに対する防御を加える。',chapterId:'ch02'}
];
