// Generated from knowledge/game-cases.json; do not edit.
export const CASE_QUIZZES={
  "temp-photo-provider": {
    "prompt": "写真加工アプリはEC2上でS3を利用する。 ロールとIMDSは利用可能で、SDKに先行する固定キー設定はない。コードへの固定キー埋め込みを避ける構成は？",
    "options": [
      "IAMユーザーの固定キーをソースへ書く",
      "SDKのEC2ロール認証情報プロバイダーを使う",
      "ロールの名前をシークレットアクセスキーとして送る"
    ],
    "answer": 1,
    "reasons": [
      "固定キーをコードへ配布する管理が残り、要件を満たしません。",
      "用意したEC2ロールの認証情報をIMDSから取得するプロバイダーを使えます。先行する設定がない前提です。",
      "ロール名は認証情報ではありません。API要求には実際の認証情報が必要です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/credentials/ec2rolecreds/doc.go"
  },
  "temp-photo-permission": {
    "prompt": "写真加工アプリはEC2上でS3を利用する。 有効期限内の一時認証情報がある。s3:GetObjectだけ許可され、ほかの許可はない。同じオブジェクトへのs3:DeleteObjectは？",
    "options": [
      "期限内なら削除も許可される",
      "セッショントークンを外せば削除できる",
      "削除は許可されない。期限と操作権限は別である"
    ],
    "answer": 2,
    "reasons": [
      "期限内であることは、削除権限の付与を意味しません。",
      "トークンを省略して権限を広げることはできません。一時認証情報を構成する必要な項目です。",
      "読み取り許可だけでは削除許可になりません。認証情報が有効でも操作の許可が必要です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_AssumeRole.go"
  },
  "role-upload-trust": {
    "prompt": "アカウントAの利用者がBのロールを引き受け、写真をBのS3へアップロードする。 通信は正常でAには対象へのsts:AssumeRole許可があるが、Bの信頼ポリシーはAの主体を許可していない。認証情報の取得に失敗したとき調べる箇所は？",
    "options": [
      "Bのロールの信頼ポリシー",
      "BのロールにS3の全操作許可を付ける",
      "セッション名を写真のファイル名に変える"
    ],
    "answer": 0,
    "reasons": [
      "引き受ける主体の許可が欠けています。Aの呼び出し元許可がある前提なので、Bの信頼関係を調べます。",
      "S3の操作権限を広げても、認証情報を得る段階の信頼不足は直りません。",
      "セッション名はセッションの識別に使う値で、信頼ポリシーの許可の代わりになりません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_AssumeRole.go"
  },
  "role-upload-permission": {
    "prompt": "アカウントAの利用者がBのロールを引き受け、写真をBのS3へアップロードする。 信頼を修正して引き受けは成功した。Bのロールは対象へのs3:GetObjectだけを許可し、ほかの許可やDenyはない。PutObjectに失敗する理由は？",
    "options": [
      "信頼ポリシーにPutObjectを書く必要がある",
      "インスタンスプロファイル名をキーとして送らないといけない",
      "対象へのPutObject許可がない。引き受け許可と操作許可は別である"
    ],
    "answer": 2,
    "reasons": [
      "信頼は引き受ける主体の条件です。対象S3操作を許可する権限とは分けて評価します。",
      "これはクロスアカウントの利用者セッションです。プロファイル名は認証用キーではありません。",
      "引き受け成功はS3書き込み許可を意味しません。必要な対象・操作の許可を確認します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_AssumeRole.go"
  },
  "auth-photo-version": {
    "prompt": "担当者がS3の汎用バケットにある写真の読み取りと保存を行う。 認証と通信は正常。対象にs3:GetObjectだけ許可され、ほかの許可やDeny・KMS制約はない。存在する特定versionIdを指定して読む要求に不足する許可は？",
    "options": [
      "s3:GetObjectVersion",
      "s3:PutObjectTagging",
      "許可は不足しない。GetObjectですべての版を読める"
    ],
    "answer": 0,
    "reasons": [
      "特定versionIdを指定するGetObjectにはGetObjectVersionが必要です。この場合GetObjectも必須とはしません。",
      "タグ付き保存に関係する許可で、特定版の読み取りを許可しません。",
      "versionIdの指定で必要許可が変わります。現在のGetObject許可だけでは要件を満たしません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_GetObject.go"
  },
  "auth-photo-tags": {
    "prompt": "担当者がS3の汎用バケットにある写真の読み取りと保存を行う。 今度は同じ汎用バケットへの保存。対象にs3:PutObjectを許可済み。KMS/ACL/ほかの許可やDenyはなく、PutObject要求でタグ集合も指定する。追加で必要な許可は？",
    "options": [
      "s3:GetObjectVersion",
      "s3:PutObjectTagging",
      "追加の許可は不要。保存許可はタグ設定も必ず含む"
    ],
    "answer": 1,
    "reasons": [
      "特定版の読み取り用で、保存時のタグ設定を許可しません。",
      "PutObjectでタグ集合を設定する要求にはPutObjectTaggingも必要です。指定条件に合わせて許可を確認します。",
      "PutObject許可だけで、その要求に付随するタグ設定も自動的に許可されるわけではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_PutObject.go"
  },
  "auth-caller-account": {
    "prompt": "EC2アプリがどの主体でAWSへ要求しているか調べる。 GetCallerIdentityがAccountとArnを返した。この応答から確認できるものは？",
    "options": [
      "呼び出しに使われた主体と、その主体を所有・包含するアカウント",
      "S3の全操作が許可されること",
      "その主体のシークレットアクセスキー"
    ],
    "answer": 0,
    "reasons": [
      "呼び出しに使ったIAMユーザーまたはロールの情報です。操作権限の判断は別です。",
      "主体の情報が返るだけで、S3の操作許可を証明しません。",
      "返されたARNは主体の識別子で、シークレットアクセスキーではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_GetCallerIdentity.go"
  },
  "auth-caller-deny": {
    "prompt": "EC2アプリがどの主体でAWSへ要求しているか調べる。 有効な認証情報と正常な通信は維持。IDポリシーでsts:GetCallerIdentityを明示的Denyした場合、このAPIの公式説明に合うものは？",
    "options": [
      "必ず主体情報を返せなくなる",
      "主体情報を得られるという固有の性質があり、他の操作にもDenyを無視できるとは言えない",
      "GetCallerIdentityが成功すればS3の明示的Denyも無効になる"
    ],
    "answer": 1,
    "reasons": [
      "GetCallerIdentityは権限不要で、当該Denyがあっても主体情報を得られると公式説明にあります。",
      "このAPIに限った性質です。一般の対象サービスのDeny評価と混同しません。",
      "API固有の例外を、S3などの操作許可へ一般化してはいけません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_GetCallerIdentity.go"
  },
  "mfa-session-token": {
    "prompt": "IAMユーザーがMFAを要求するAPI利用経路を設計する。 MFAで認証された一時認証情報をGetSessionTokenで取得する。IAMユーザーの長期キーを使い、MFAデバイスがある。適切な要求は？",
    "options": [
      "MFAデバイスの識別子と正しいコードを指定する",
      "デバイスは登録済みなので誤ったコードでもよい",
      "s3:*を追加すればMFAコードの代わりになる"
    ],
    "answer": 0,
    "reasons": [
      "GetSessionTokenに対応するMFA情報を提示します。長期認証情報とデバイスを用意した前提です。",
      "誤ったMFAコードは拒否されます。登録だけで今回の認証条件を満たすわけではありません。",
      "S3操作の許可はMFAによる認証の代わりにはなりません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_GetSessionToken.go"
  },
  "mfa-role-condition": {
    "prompt": "IAMユーザーがMFAを要求するAPI利用経路を設計する。 別の要求としてIAMユーザーの長期キーで直接AssumeRoleする。通信・引き受け元の許可・信頼する主体は正しいが、信頼がMFAを要求し、MFA情報は提示していない。結果の説明は？",
    "options": [
      "デバイス登録済みなら要求にMFA情報がなくても必ず成功する",
      "必要なMFA認証条件を満たさないため拒否される",
      "ロールへS3全操作を許可すればMFA条件を通過できる"
    ],
    "answer": 1,
    "reasons": [
      "登録と、実際の引き受け要求でMFA条件を満たすことは別です。",
      "信頼のMFA条件を満たす情報が必要です。既存のMFA付きセッションを使わない前提を明示しています。",
      "S3操作の権限を増やしても、引き受け時のMFA条件不足を解消しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_AssumeRole.go"
  },
  "least-photo-policy": {
    "prompt": "写真加工アプリは指定した汎用S3バケットのoutputs/配下へ保存する。 保存だけが必要で、タグ/ACL/SSE-KMS等の追加条件はない。この3案で不要な許可を最も少なくするものは？",
    "options": [
      "s3:*を指定バケット全体へ許可する",
      "s3:PutObjectを指定バケットのoutputs/配下のオブジェクトだけへ許可する",
      "s3:PutObjectを全バケットの全オブジェクトへ許可する"
    ],
    "answer": 1,
    "reasons": [
      "業務に不要な読み取りや削除などの操作を含めます。対象の限定だけでは操作を絞れていません。",
      "必要な保存操作と業務対象の両方を限定しています。追加条件がない比較の前提です。",
      "操作は絞れても業務外の保存先まで許可します。対象も限定する必要があります。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_PutObject.go"
  },
  "least-photo-simulation": {
    "prompt": "写真加工アプリは指定した汎用S3バケットのoutputs/配下へ保存する。 SimulatePrincipalPolicyが入力した保存操作と対象についてAllowを返した。まだ実環境ではAPIを実行していない。この結果の適切な扱いは？",
    "options": [
      "写真の保存が実際に完了した証拠である",
      "存在しないリソースもシミュレートできるので、本番の全要求の成功も保証される",
      "入力したポリシー判断の結果であり、API実行や実環境での期待結果は別に確認する"
    ],
    "answer": 2,
    "reasons": [
      "この操作はAPIを実行しません。Allowは実際の保存完了を示しません。",
      "実環境と結果が異なる場合があります。存在しないリソースの評価も、存在や到達性を保証しません。",
      "シミュレーションと実行の範囲を区別し、実環境でも必要な許可・拒否の結果を確認します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/iam/api_op_SimulatePrincipalPolicy.go"
  },
  "alb-consecutive-failures": {
    "prompt": "通常のリージョンAZにあるALBのHTTPリスナーから単一グループのEC2へ転送する。 登録済みで正常だったEC2について、UnhealthyThresholdCountを3に設定した。ヘルスチェック判定の説明として適切なものは？",
    "options": [
      "業務の要求が1回失敗すると必ず即時に異常になる",
      "ヘルスチェックの連続失敗が3回に達すると異常と判定する。周期とタイムアウトも関係する",
      "EC2ターゲットのヘルスチェックを無効にして要求を成功させられる"
    ],
    "answer": 1,
    "reasons": [
      "業務要求とヘルスチェックを混同しています。1回の要求失敗が連続失敗3回に相当するわけではありません。",
      "設定した連続失敗回数が判定条件です。周期やタイムアウトがあるので、障害検出と即時・無停止の保証を区別します。",
      "インスタンス型のターゲットではヘルスチェックを無効化できません。無効化してもアプリの障害を修復する理由にはなりません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/elasticloadbalancingv2/api_op_CreateTargetGroup.go"
  },
  "alb-all-unhealthy": {
    "prompt": "通常のリージョンAZにあるALBのHTTPリスナーから単一グループのEC2へ転送する。 新しい要求がALBへ到達している。全AZの全登録EC2が異常で、異常時ルーティングの正常数下限は既定1、割合はoff。転送の振る舞いは？",
    "options": [
      "異常先も含む全ターゲットへ送る。アプリの成功は保証されない",
      "ヘルスチェックがあるので必ず全要求を拒否し、異常先へは一切送らない",
      "ALBが停止したアプリを自動修復してから送る"
    ],
    "answer": 0,
    "reasons": [
      "正常数0が下限1を下回るため、異常先も含めて送る動きになります。転送を試みることと処理成功は別です。",
      "異常時ルーティングのしきい値による例外を無視しています。「異常先へ絶対に送らない」はこの条件で誤りです。",
      "ルーティングの設定はアプリ修復の設定ではありません。全異常がそのまま成功へ変わる保証はありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/elasticloadbalancingv2/types/types.go"
  },
  "ec2-before-termination": {
    "prompt": "EC2で加工した完成写真をインスタンス終了後も納品する。 再生成できない完成写真の唯一のコピーが、終了で失われるローカル領域にある。加工EC2を終了する前の適切な対応は？",
    "options": [
      "EC2は処理用なので写真の扱いを確認せず終了する",
      "ローカルにS3の保存予定を書き、転送を確認せず終了する",
      "独立したS3等へ写真を保存し、成功・内容・必要なアクセスを確認してから終了する"
    ],
    "answer": 2,
    "reasons": [
      "処理の役割と必要なデータの保持は別です。唯一のコピーが失われる条件を解決していません。",
      "保存先の計画は保存完了ではありません。実際の転送と確認が必要です。",
      "インスタンス終了と独立した保存を分け、唯一の完成写真を失う条件を解消します。保存側の保護も別途設計します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_TerminateInstances.go"
  },
  "ec2-ebs-retained": {
    "prompt": "EC2で加工した完成写真をインスタンス終了後も納品する。 別の加工EC2をTerminateInstancesで終了した。接続EBSのDeleteOnTerminationはfalse、ほかの削除はない。このEBSとEC2の説明は？",
    "options": [
      "EC2自体を同じIDで再起動して元どおりに戻せる",
      "そのEBSは終了時削除されず残るが、終了したEC2自体は復旧できない",
      "EBSの設定に関係なく必ずすべてのデータが削除される"
    ],
    "answer": 1,
    "reasons": [
      "TerminateInstancesの終了は不可逆です。StopInstancesとの混同です。",
      "終了時削除の条件を分けています。残るEBSの利用には別インスタンスへの接続等の手順が必要です。",
      "終了時削除に設定されたEBSが対象です。falseの条件を無視しています。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_TerminateInstances.go"
  },
  "s3-account-public-block": {
    "prompt": "写真を保存する汎用S3バケットの公開アクセスを防ぐ設定を点検する。 アカウントのBlockPublicPolicy=true、バケットではfalse。実行主体はPutBucketPolicyの許可を持ち、公開と判定される新しいバケットポリシーを設定しようとしている。BPAによる判断は？",
    "options": [
      "バケットがfalseなので必ず受け付ける",
      "アカウントのtrueが適用され、公開ポリシー設定要求は拒否される",
      "アカウント設定はオブジェクトの内容にしか作用しない"
    ],
    "answer": 1,
    "reasons": [
      "バケットのfalseでアカウントのtrueを弱めることはできません。最も厳しい組み合わせを評価します。",
      "実行許可があっても公開ポリシー防止の条件を別に評価します。アカウントのBlockPublicPolicyがこの要求を拒否します。",
      "BPAは公開アクセスの設定です。保存された写真の内容だけの機能ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_PutPublicAccessBlock.go"
  },
  "s3-existing-public-policy": {
    "prompt": "写真を保存する汎用S3バケットの公開アクセスを防ぐ設定を点検する。 汎用バケットに既存の公開ポリシーがある。BlockPublicPolicyだけをtrueへ変更した。その設定自体の作用として適切な説明は？",
    "options": [
      "既存の公開ポリシーを自動で削除する",
      "担当者の読み取り許可を自動で追加する",
      "新しい公開ポリシー設定要求を拒否するが、既存ポリシーは変更しない"
    ],
    "answer": 2,
    "reasons": [
      "BlockPublicPolicyは既存ポリシーを削除・変更しません。不要な既存許可は別に点検します。",
      "公開アクセスの防止設定は、必要な担当者への許可付与の代わりにはなりません。",
      "設定要求の予防と既存設定の修正を区別しています。他のBPA設定によるアクセス制限も別に確認します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/types/types.go"
  },
  "durability-previous-version": {
    "prompt": "S3へ保存した正しい写真の保持と、必要な時刻に利用できる条件を点検する。 書き込み前からバージョニングが有効なS3で、写真を誤って上書きした。正しい過去版が残り、そのversion IDと読取り許可もある。正しい内容の回復に向けた適切な最初の対応は？",
    "options": [
      "キーが同じなので過去内容は必ずすべて失われたと判断する",
      "記録した過去版のversion IDを指定して取り出し、内容を確認する",
      "複製があるという理由だけで何もせず以前の内容へ戻るのを待つ"
    ],
    "answer": 1,
    "reasons": [
      "有効バージョニングと残る過去版という条件を無視しています。同じキーでも版を指定できます。",
      "既知の過去版を取得して確認できます。必要に応じて意図する最新内容へ戻す手順は別に検証します。",
      "複製と版の履歴は別です。誤操作が自動で取り消される保証はありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_PutObject.go"
  },
  "durability-archive-unavailable": {
    "prompt": "S3へ保存した正しい写真の保持と、必要な時刻に利用できる条件を点検する。 別の写真オブジェクトはS3 Glacier Flexible Retrievalに存在し、まだ復元していない。GetObjectがInvalidObjectStateを返した。許可/ネットワークは整っている。この条件で適切な判断は？",
    "options": [
      "読み取れないので保存データが永久に消えた証拠である",
      "GetObjectを繰り返すだけで必ず即時に読める",
      "保存と即時利用を区別し、RestoreObjectを開始して利用可能になるまで待つ"
    ],
    "answer": 2,
    "reasons": [
      "このエラーはアーカイブ復元が必要な条件で起こります。保存データ喪失と同じ証拠にはなりません。",
      "このクラスは読取り前に復元が必要です。GetObjectの反復だけではその手順を満たしません。",
      "保存されていることと即時の読取りは別です。復元の時間と業務要件も比較します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_RestoreObject.go"
  },
  "s3-delete-marker-enabled": {
    "prompt": "汎用S3の写真を削除する要求が、どの版へ作用するか確認する。 バージョニング有効の写真キーに、データ版v1とv2が残っている。versionIdを付けずにDeleteObjectを実行し成功した。この操作の作用は？",
    "options": [
      "v1とv2を両方永久削除する",
      "delete markerを現在版として追加し、v1とv2はこの操作では永久削除しない",
      "正しい写真へ内容を自動で書き戻す"
    ],
    "answer": 1,
    "reasons": [
      "versionIdなしの削除では、有効バージョニングの既存データ版を両方永久削除する動きではありません。",
      "通常の現在版読取りは削除されたように扱いますが、残るデータ版とdelete markerを区別します。",
      "markerは削除状態を表すもので、内容を正しい過去版へ書き戻す処理ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_DeleteObject.go"
  },
  "s3-delete-null-suspended": {
    "prompt": "汎用S3の写真を削除する要求が、どの版へ作用するか確認する。 別の写真キーはバージョニング停止中で、nullのversion IDのデータ版と非null版v1がある。versionIdなしのDeleteObjectが成功した。この操作の作用は？",
    "options": [
      "停止中でもnull版とv1の両方を必ず保持し、markerだけ追加する",
      "null版もv1も、すべて永久削除する",
      "null版を削除してdelete markerを追加する。非null版v1はこの操作では削除しない"
    ],
    "answer": 2,
    "reasons": [
      "停止中はnull版があればそれを削除します。有効時の説明をそのまま流用できません。",
      "null版の削除と非null版の扱いを混同しています。この要求はv1のversionIdを指定していません。",
      "停止中の既存null版という条件に応じて作用が変わります。非null版の保持と現在の削除状態を分けます。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_DeleteObject.go"
  },
  "rds-pitr-restore-time": {
    "prompt": "RDS for PostgreSQLの注文DBの誤更新から復旧する。Aurora/RDS Customではない。 10:00 UTCに誤更新した。復元可能範囲は09:00から最新10:10 UTCまでで、09:59の状態が必要。適切な指定は？",
    "options": [
      "新しいDB名とRestoreTime=09:59 UTCを指定し、UseLatestRestorableTimeは同時指定しない",
      "新しいDB名とUseLatestRestorableTime=trueを指定すれば誤更新前へ必ず戻る",
      "RestoreTime=09:59 UTCとUseLatestRestorableTime=trueを両方指定する"
    ],
    "answer": 0,
    "reasons": [
      "必要時点が保持範囲内で最新時刻より前です。指定時刻と最新指定の排他条件を満たします。",
      "最新10:10は誤更新後です。最新と業務上正しい状態は同じ条件ではありません。",
      "RestoreTimeと最新時刻指定は同時に使えません。どちらの状態が必要かを決めます。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/rds/api_op_RestoreDBInstanceToPointInTime.go"
  },
  "rds-pitr-new-target": {
    "prompt": "RDS for PostgreSQLの注文DBの誤更新から復旧する。Aurora/RDS Customではない。 別にPITRを行い新しいDBが利用可能になった。元DBはカスタムグループを使用し、復元ではグループ/配置を明示しなかった。業務で使う前の適切な確認は？",
    "options": [
      "元DBが自動巻戻しされたと考え、同じ接続先で確認を省略する",
      "復元は別DBなので、内容・接続先と必要なネットワーク/パラメーター/配置を確認して切替を検証する",
      "元とすべての設定が完全に同じなので、内容だけ見れば必ず接続できる"
    ],
    "answer": 1,
    "reasons": [
      "PITRは新しいDBを作る操作です。元DBの内容と接続先が自動で入れ替わったとは考えません。",
      "復元内容と利用経路・設定は別の確認です。既定設定と元のカスタム設定の違いも調べます。",
      "多くの設定を持っていても、既定のグループや配置が適用される条件があります。完全一致や接続成功を保証しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/rds/api_op_RestoreDBInstanceToPointInTime.go"
  },
  "sqs-change-from-now": {
    "prompt": "SQS Standardキューのワーカーが、写真加工のメッセージを受信し処理する。 0秒に受信し、20秒の時点でChangeMessageVisibility(60秒)が成功した。追加の変更・削除はない。変更後の不可視期限は、起点0秒から何秒の時点？",
    "options": [
      "60秒。受信時刻から指定秒数を数える",
      "80秒。変更した20秒から60秒を数える",
      "もとの期限にさらに60秒を加えた時点"
    ],
    "answer": 1,
    "reasons": [
      "変更要求の時刻から数えるため、受信時刻を起点にした60秒ではありません。",
      "20+60=80です。これは架空の時計の計算でAWSの性能保証ではありません。",
      "指定値は変更時点からの新しい期間です。以前の期限へ単に加算しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sqs/api_op_ChangeMessageVisibility.go"
  },
  "sqs-new-receipt-handle": {
    "prompt": "SQS Standardキューのワーカーが、写真加工のメッセージを受信し処理する。 別の同じメッセージを2回受信した。MessageId=Mは同じ、初回のReceiptHandle=H1、最新はH2。最新の受信分の処理が成功した。DeleteMessageに使うのは？",
    "options": [
      "MessageId=M",
      "初回ReceiptHandle=H1",
      "最新ReceiptHandle=H2"
    ],
    "answer": 2,
    "reasons": [
      "メッセージのIDと受信ハンドルは別です。DeleteMessageはMessageIdを指定する操作ではありません。",
      "古いハンドルでは成功応答でも削除されない場合があります。最新受信の値を使います。",
      "最新受信のReceiptHandleを使います。Standardでの再受信に備える冪等処理も別に必要です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sqs/api_op_DeleteMessage.go"
  },
  "route53-dns-share": {
    "prompt": "写真サイトを旧環境から新環境へ段階移行する。Route 53の公開ゾーンで同名・Aレコードの重み付き応答を設定する。 同名同種の2候補は非エイリアスでヘルスチェックなし。旧環境の重み9、新環境1にした。割合の適切な説明は？",
    "options": [
      "新環境のDNS応答の配分10%を意図するが、HTTP要求数が厳密10%とは限らない",
      "どの連続10回のDNS問い合わせでも必ず新へ1回回答する",
      "全クライアントのHTTP要求が常に厳密10%だけ新環境へ届く"
    ],
    "answer": 0,
    "reasons": [
      "1/(9+1)=10%はDNS応答の配分です。有限回の結果やキャッシュから生じるHTTP要求の厳密比率は別です。",
      "重みは各候補の比率で、固定の10件単位で割り当てる保証ではありません。",
      "名前解決結果を再利用する条件ではDNS応答とHTTP要求は1対1ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/route53/types/types.go"
  },
  "route53-all-zero": {
    "prompt": "写真サイトを旧環境から新環境へ段階移行する。Route 53の公開ゾーンで同名・Aレコードの重み付き応答を設定する。 別の変更で、同名同種の非エイリアス2候補の重みを両方0にした。ヘルスチェックはない。新しいDNS応答の選択は？",
    "options": [
      "両方0なので両環境への回答が必ず停止する",
      "2候補が等しい確率で選ばれる",
      "必ず旧環境だけが選ばれる"
    ],
    "answer": 1,
    "reasons": [
      "この条件の全0は全停止を意味しません。全候補に等しい確率で応答する例外があります。",
      "非エイリアス・健康確認なしで同名同種が全0なら、全候補へ等しい確率で応答します。",
      "旧という役割を自動判定する設定ではありません。旧だけを優先する根拠がありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/route53/types/types.go"
  },
  "gsi-customer-query": {
    "prompt": "単一リージョンDynamoDBの注文テーブルは注文IDだけが主キーで、顧客IDをキーにしたGSIがある。 顧客IDから注文一覧が必要で、一時的な反映遅延を許容する。適切な使い方は？",
    "options": [
      "顧客IDのGSIをQueryし、強整合指定を付けずに結果整合性を扱う",
      "GSIへConsistentRead=trueを指定して必ず最新一覧を得る",
      "顧客IDだけをテーブルのGetItemへ渡す"
    ],
    "answer": 0,
    "reasons": [
      "GSIのキーによる一覧と、許容する整合性が一致します。まだ反映されない項目を考慮します。",
      "GSIのQueryは強整合をサポートしません。trueではValidationExceptionとなります。",
      "テーブルの主キーは注文IDです。GetItemは完全な主キーが必要で、顧客別一覧検索ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/dynamodb/api_op_Query.go"
  },
  "gsi-order-latest": {
    "prompt": "単一リージョンDynamoDBの注文テーブルは注文IDだけが主キーで、顧客IDをキーにしたGSIがある。 別の既知注文IDの更新が成功した。単一リージョンでその後ほかの更新はなく、更新後の状態を直ちに確認したい。適切な読取りは？",
    "options": [
      "GSIへ強整合Queryを指定する",
      "注文IDでテーブルへGetItemし、ConsistentRead=trueを指定する",
      "GSIに出るかどうかだけで更新成功を判定する"
    ],
    "answer": 1,
    "reasons": [
      "GSIへの強整合Queryはサポートされません。",
      "完全な主キーが既知なのでテーブルの強整合GetItemを選べます。複数操作の原子性とは別です。",
      "GSIは結果整合性です。反映遅延だけから、既に成功した更新の失敗を判断しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/dynamodb/api_op_GetItem.go"
  },
  "query-empty-page-key": {
    "prompt": "顧客IDをGSIキーにした注文一覧のQueryに、非キー属性の状態フィルターを付ける。 QueryのあるページはItemsが空で、LastEvaluatedKeyは空でない。条件に合う全結果を取得するための対応は？",
    "options": [
      "注文は0件と確定し、この時点で終了する",
      "キーをExclusiveStartKeyへ渡して同じQueryを続ける。次のページに一致項目が必ずあるとは限らない",
      "同じページを継続キーなしで無限に読み直す"
    ],
    "answer": 1,
    "reasons": [
      "このページのフィルター結果が空でも検索の終了とは限りません。",
      "継続キーを次へ渡します。キーの存在だけで次ページに一致項目があることまで保証しません。",
      "継続キーを使わない再実行では先へ進めません。ページングを実装します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/dynamodb/api_op_Query.go"
  },
  "query-filter-capacity": {
    "prompt": "顧客IDをGSIキーにした注文一覧のQueryに、非キー属性の状態フィルターを付ける。 別のQueryは100項目を評価し、状態フィルター後は2項目を返した。同じ対象/サイズ/読取り条件でフィルターなしと比較すると、容量の説明は？",
    "options": [
      "2項目だけ返したので評価した100項目の容量は課金対象外になる",
      "フィルターを使うと読取り容量を必ず0にできる",
      "容量は読んだ対象のサイズに基づく。返した2項目だけで算定せず、フィルター有無で同じ"
    ],
    "answer": 2,
    "reasons": [
      "結果を絞る前に読んでいます。返した件数だけで容量を算定しません。",
      "フィルターはQueryの読取り後の処理で、容量を0にする機能ではありません。",
      "同じ読取り条件の比較では、フィルターは返す量を変えても既に読んだ容量を減らしません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/dynamodb/api_op_Query.go"
  },
  "sqs-commit-before-delete": {
    "prompt": "標準SQSから注文操作を受信する。業務更新は同一アカウント・リージョンのDynamoDB内で完結し、外部決済APIは呼ばない。 ワーカーが業務更新の確定後、メッセージ削除前に停止した。再配信でも二重更新を防ぐ設計は？記録と業務更新は異なる項目で、同じDynamoDBトランザクションに含められる。",
    "options": [
      "ワーカーのメモリにだけ処理済み注文IDを保存する",
      "安定した業務キーの条件付き処理済み記録と業務更新を原子的に確定し、成功確認後に削除する",
      "先にSQSメッセージを削除してから業務更新する"
    ],
    "answer": 1,
    "reasons": [
      "停止すると記録が失われ、再配信時に二重更新を防げません。",
      "再配信時は記録の条件が重複更新を阻止します。失敗理由と既存記録の操作一致を確認してから削除します。",
      "削除後に停止すると、まだ実行していない業務を失う危険があります。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sqs/api_op_DeleteMessage.go"
  },
  "dynamodb-token-window": {
    "prompt": "標準SQSから注文操作を受信する。業務更新は同一アカウント・リージョンのDynamoDB内で完結し、外部決済APIは呼ばない。 別の構成で、処理済み記録や条件はなく、TransactWriteItemsで注文カウンターを加算する。初回完了15分後に同じClientRequestTokenと同じ内容で再実行した場合の説明は？",
    "options": [
      "同じトークンなら何日後でも再加算は起きない",
      "受信のReceiptHandleを保存すれば業務IDとして永久に重複を防げる",
      "10分間を超えて新規要求として扱われ、再加算し得る。業務キーの条件付き記録などが必要"
    ],
    "answer": 2,
    "reasons": [
      "同一要求の保証は初回完了後10分間です。永久の業務重複防止ではありません。",
      "ReceiptHandleは受信ごとに変わる削除用の値で、安定した業務キーではありません。",
      "トークンだけの短期保証を超えています。長期の再配信には永続的な重複防止を設計します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/dynamodb/api_op_TransactWriteItems.go"
  },
  "dlq-source-rate": {
    "prompt": "注文の解析バグを修正し、代表データで確認した。再実行の重複対策も維持する。 SQS標準キュー由来の標準DLQで、必要な権限があり実行中タスクはない。各元キューへ戻し、下流余力を監視しながら固定レートで開始したい。StartMessageMoveTaskの設定は？",
    "options": [
      "SourceArnにDLQ、DestinationArnは省略、固定移動レートを指定する",
      "SourceArnに元キューを指定し、レートを省略すれば必ず低速の一定レートになる",
      "DLQ到着を処理成功とみなし、業務更新を確認せず注文を完了扱いする"
    ],
    "answer": 0,
    "reasons": [
      "省略した移動先は各元キューです。移動レートを指定し、通常流入と処理状況も監視します。",
      "移動元はDLQです。レート省略時は滞留量に応じて変動し、低速一定を保証しません。",
      "DLQは隔離先であり、業務処理はまだ成功していません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sqs/api_op_StartMessageMoveTask.go"
  },
  "dlq-nonsqs-origin": {
    "prompt": "注文の解析バグを修正し、代表データで確認した。再実行の重複対策も維持する。 別のSQSキューには、SQSを送信元としないLambda関数由来の失敗イベントがDLQとして蓄積している。必要な権限を付ければStartMessageMoveTaskで戻せる？",
    "options": [
      "権限さえあれば、どんな送信元のDLQにも使える",
      "このAPIは他のSQSキュー由来のDLQが対象。Lambda由来は別の再処理方法を確認する",
      "移動レートを下げれば送信元の制約はなくなる"
    ],
    "answer": 1,
    "reasons": [
      "権限とは別にAPIの適用対象制約があります。",
      "格納先がSQSでも送信元がLambdaなら、このAPIの対象ではありません。",
      "レート指定は移動速度の設定で、対象外の送信元を対象に変えません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sqs/api_op_StartMessageMoveTask.go"
  },
  "sg-db-peer-permission": {
    "prompt": "同一VPC内のアプリEC2とDB EC2をSGで制御する。 同一VPCでアプリEC2からDB EC2のTCP 5432へ新規接続する。経路・NACL・OS・DB待受は正常。アプリSGは全送信禁止、DB SGは全受信禁止。他SGはなく、この2つの許可だけが不足している。最小限の設定は？",
    "options": [
      "DB SGの受信だけをアプリSGから5432で許可し、アプリ送信は閉じたまま",
      "アプリSGの送信先をDB SG・TCP 5432、DB SGの送信元をアプリSG・TCP 5432で許可する",
      "DB SGの受信を任意IPv4・全ポートへ広げれば、開始側送信も自動的に開く"
    ],
    "answer": 1,
    "reasons": [
      "開始側の新規送信許可も必要です。受信側だけでは前提を満たしません。",
      "開始側の送信と受信側の受信を必要な相手とポートに絞ります。",
      "受信許可は別SGの送信許可を変更せず、必要以上に範囲を広げます。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_AuthorizeSecurityGroupIngress.go"
  },
  "sg-reference-not-route": {
    "prompt": "同一VPC内のアプリEC2とDB EC2をSGで制御する。 同一VPCのアプリ/DBでTCP 5432の開始側送信・受信側受信を正しく設定した。後からネットワーク構成が変わり、DBへの有効な経路がなくなった。SGに相手SGを指定してあるので到達できる？",
    "options": [
      "SG参照がルートも自動作成するので到達できる",
      "SG参照はDBのデータ読取り権限も付与するので経路不要",
      "許可と経路は別。経路を復旧し、NACLや待受も確認する"
    ],
    "answer": 2,
    "reasons": [
      "SGルールは通信許可であり、経路を作成する設定ではありません。",
      "ネットワーク許可とDB認証・認可は別です。",
      "SG参照だけでネットワーク到達性を保証しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_AuthorizeSecurityGroupIngress.go"
  },
  "nacl-direction-order": {
    "prompt": "ネットワーク担当が、関連サブネットのNACLでIPv4通信を確認する。 関連サブネットに入るIPv4パケットをNACLで調べる。受信ルールは番号100と200、送信ルールは番号50と150。受信パケットについて評価するリストと順番は？ここでは許可/拒否の結果ではなく評価順だけを問う。",
    "options": [
      "受信100と200を番号の昇順に調べる。送信50/150は別方向のリスト",
      "受信と送信を混ぜて50、100、150、200の順に調べる",
      "受信200から100へ、番号の降順に調べる"
    ],
    "answer": 0,
    "reasons": [
      "受信と送信には独立したルール群があります。受信側の番号を昇順に読むので、別方向の50を混ぜません。",
      "方向別リストを混同しています。送信番号が小さくても受信評価へ混ぜません。",
      "NACLは番号の昇順です。追加した日時や大きい番号順ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateNetworkAclEntry.go"
  },
  "nacl-all-protocol-port": {
    "prompt": "ネットワーク担当が、関連サブネットのNACLでIPv4通信を確認する。 あるIPv4受信許可ルールをTCP 443だけに限定したい。競合するルールはない。設定案はProtocol=-1、PortRange=443〜443。この設定案をどう直す？",
    "options": [
      "443を指定してあるので、このままでTCP 443だけに限定できる",
      "Protocol=6（TCP）と443〜443を指定し、CIDRと方向も確認する",
      "送信方向のルール番号を変えれば、受信の-1がTCPだけに変わる"
    ],
    "answer": 1,
    "reasons": [
      "Protocol=-1は全プロトコルで、指定したポート範囲に関係なく全ポートを対象にします。",
      "TCPを指定したうえでポートを限定します。全プロトコルの-1との違いを確認します。",
      "別方向の番号変更は、この受信ルールのプロトコル指定を変更しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateNetworkAclEntry.go"
  },
  "route-prefix-choice": {
    "prompt": "IPv4ルートテーブルで複数の宛先範囲が重なる。例のIPとターゲットは教材用で、実AWSの構成測定ではない。 同じルートテーブルに192.0.2.0/24→ターゲットAと192.0.2.0/28→ターゲットBがある。両ターゲットは有効、同一プレフィックスの競合はない。宛先192.0.2.3へのルート選択は？A/Bは教材用の抽象ターゲット。",
    "options": [
      "A。広い/24のほうが多くの宛先を含むので常に優先する",
      "B。/28が一致し、/24より具体的な宛先範囲を持つ",
      "AとBへ同じパケットを必ず複製して送る"
    ],
    "answer": 1,
    "reasons": [
      "両方が一致する場合は、より具体的な小さい範囲を優先します。",
      "192.0.2.3は両方に含まれます。より長いプレフィックスの/28を選びます。",
      "この条件は複製配信ではなく、より具体的なルートの選択です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateRoute.go"
  },
  "route-specific-removed": {
    "prompt": "IPv4ルートテーブルで複数の宛先範囲が重なる。例のIPとターゲットは教材用で、実AWSの構成測定ではない。 別の状態で、192.0.2.0/28→Bを削除した。192.0.2.0/24→Aと0.0.0.0/0→Cは残り、有効。宛先192.0.2.3で最も具体的な一致は？A/Cは教材用ターゲットで、SG/NACLの許可を判断する問題ではない。",
    "options": [
      "以前Bがあったので、削除後も必ずBを選ぶ",
      "C。デフォルトルートはどんな具体的ルートより優先する",
      "A。残る一致のうち/24が/0より具体的"
    ],
    "answer": 2,
    "reasons": [
      "有効なルート選択は現在残っている宛先条件で判断します。",
      "デフォルトルートは広い/0で、残る/24のほうが具体的です。",
      "ルート変更後の一致対象を調べ直します。選択した経路があってもSG/NACLや待受は別の条件です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateRoute.go"
  },
  "kms-old-material-read": {
    "prompt": "KMSの鍵素材の更新方法と状態を、鍵そのものの無効化や資格情報更新と区別する。 AWS生成の対称暗号化鍵を使い、自動更新が完了した。鍵は有効で、必要な復号権限があり、暗号文と必要な条件は保持している。旧鍵素材がNON_CURRENTになった説明は？外部キャッシュの平文鍵は使わずKMSで復号する。",
    "options": [
      "旧素材は直ちに復号にも使えなくなるので、復号のために鍵を無効化する",
      "旧素材は復号用に扱われる。更新しただけで古い暗号文が復号不能になったとは判断しない",
      "鍵素材の更新はDBパスワードの変更でもあるため、DBの認証情報だけを直す"
    ],
    "answer": 1,
    "reasons": [
      "NON_CURRENTは復号用です。鍵を無効化するとKMSの暗号操作を妨げます。",
      "CURRENTは暗号化と復号、NON_CURRENTは復号用です。鍵の状態・権限・暗号文条件も別に確認します。",
      "鍵素材の更新とDB資格情報の更新は異なる作業です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/kms/api_op_EnableKeyRotation.go"
  },
  "kms-ondemand-schedule": {
    "prompt": "KMSの鍵素材の更新方法と状態を、鍵そのものの無効化や資格情報更新と区別する。 別の有効なAWS生成・顧客管理の対称暗号化鍵には、次回自動更新の予定がある。対応条件を満たすRotateKeyOnDemandを成功させた。今ある自動更新予定の扱いは？",
    "options": [
      "オンデマンド更新で既存の自動更新予定が消える",
      "必ず実行日から365日後へ次回予定が変更される",
      "既存の自動更新予定は変わらない。状態と完了履歴は対応APIで確認する"
    ],
    "answer": 2,
    "reasons": [
      "オンデマンド更新は既存の自動更新スケジュールを変更しません。",
      "既存予定は維持されます。指定周期や既存予定を無視して365日へリセットしません。",
      "即時の鍵素材更新と定期更新は別です。開始/進行状態と完了履歴を区別します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/kms/api_op_RotateKeyOnDemand.go"
  },
  "secret-current-cache": {
    "prompt": "Secrets Managerの更新・版の選択と、アプリが取得して保持する資格情報を分けて確認する。 更新が正常完了し、DBは新しい認証情報を受け付け、AWSCURRENTは新しい版へ移動済み。アプリは起動時取得した旧パスワードをメモリに保持したままで、新規接続が失敗する。必要な取得/KMS権限はある。適切な対応は？",
    "options": [
      "AWSCURRENTになればアプリのメモリも自動で書き換わるので永久に再取得しない",
      "更新方針に従いキャッシュを再取得し、AWSCURRENTの情報で接続を確認する",
      "KMSの鍵素材を更新すれば、メモリ内のDBパスワードも新しい値になる"
    ],
    "answer": 1,
    "reasons": [
      "ステージはサーバー側の版選択です。取得済みのアプリ内の値が自動更新される保証ではありません。",
      "キャッシュと現在版を分けて管理します。取得と接続を確認し、旧値を使い続けない設計にします。",
      "暗号鍵素材の更新はアプリが保持する資格情報の更新ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/secretsmanager/api_op_GetSecretValue.go"
  },
  "secret-test-not-noop": {
    "prompt": "Secrets Managerの更新・版の選択と、アプリが取得して保持する資格情報を分けて確認する。 別のシークレットで、Lambda更新関数を使う新しいcronスケジュールを設定し、RotateImmediately=falseを指定する。必要な権限と関数への到達性があり、既存のrate/日数設定による予定はない。この呼出しは何をする？",
    "options": [
      "次回予定まで何も実行せず、設定の検証もしない",
      "falseでも必ず今すぐ本更新を行い、すべての資格情報を変更する",
      "次回更新を待つ設定としつつtestSecretで検証し、テスト用AWSPENDING版を作成・除去する"
    ],
    "answer": 2,
    "reasons": [
      "falseでもtestSecretによる更新設定のテストを実行します。完全な無操作ではありません。",
      "即時の本更新を待つ指定と、設定検証のtestSecretを区別します。",
      "falseでも設定をテストします。テストと予定された更新本体を混同しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/secretsmanager/api_op_RotateSecret.go"
  },
  "ebs-restore-target-az": {
    "prompt": "EBSスナップショットから、復旧先EC2へ非ルートデータボリュームを作成・接続する。 同じリージョンのAZ-AのEBSを、AZ-BのEC2で復旧する。利用可能な完了済みスナップショットがあり、必要な権限・容量・接続枠は十分。Marketplace製品コードはなく暗号化条件も満たす。適切な手順は？",
    "options": [
      "AZ-Aの元ボリュームを、通常のAttachVolumeでAZ-BのEC2へ直接接続する",
      "スナップショットからAZ-Bに新ボリュームを作り、AZ-BのEC2へ接続してOSで利用を確認する",
      "EC2のNameタグをAZ-Aに変えれば、ボリュームと同じAZになる"
    ],
    "answer": 1,
    "reasons": [
      "通常のEBS接続は同じAZが必要です。異なるAZへ元ボリュームを直接接続しません。",
      "復旧先EC2と同じAZで新しいボリュームを作成し、接続後の利用可能化も確認します。",
      "表示用タグの変更はEC2の配置を変更しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateVolume.go"
  },
  "ebs-snapshot-capacity": {
    "prompt": "EBSスナップショットから、復旧先EC2へ非ルートデータボリュームを作成・接続する。 別の復元で、スナップショットのボリューム容量は100 GiB。保存済みファイルの使用量は20 GiBという教材用の仮定。CreateVolumeで、100 GiBまたは50 GiBを指定できると考えてよい？ファイル縮小やデータ移行はまだ行っていない。",
    "options": [
      "使用量が20 GiBなら、同じスナップショットから50 GiBを指定して直接縮小できる",
      "どちらも必ず禁止され、元より大きい値しか使えない",
      "100 GiBは容量条件を満たす。50 GiBへの直接縮小は不可で、必要なら別途移行を設計する"
    ],
    "answer": 2,
    "reasons": [
      "指定容量はスナップショットの容量以上です。ファイルの使用量だけで直接縮小できません。",
      "同じ容量も許可されます。必ず大きくする条件ではありません。",
      "スナップショットと同じか大きい容量が必要です。縮小移行は別の作業になります。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateVolume.go"
  },
  "snapshot-unwritten-buffer": {
    "prompt": "EBSのバックアップ取得時点に必要なファイルを含め、業務再開と取得完了を分ける。 単一EBSデータボリュームでアプリがファイルを書いている。直近の必要データはまだアプリ/OSのキャッシュにあり、EBSへ書き込まれていない。すべてを含む復元点を作りたい。停止調整は可能で、アプリの保存・書込み一時停止手順は検証済み。対応は？",
    "options": [
      "今すぐCreateSnapshotを呼べば、インスタンスのメモリも必ず含まれる",
      "検証済み手順で必要データをEBSへ保存し、書込みを一時停止してスナップショットを要求する",
      "ボリュームを暗号化すれば、未書込みのメモリも自動でスナップショットに入る"
    ],
    "answer": 1,
    "reasons": [
      "スナップショットはEBSへ書き込まれたデータが対象です。未書込みキャッシュまで必ず保存しません。",
      "取得時点で必要データをEBSへ書き込み、変化を調整します。要求成功だけで復元検証が完了するわけではありません。",
      "暗号化と、どのデータがEBSに保存されているかは別の条件です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateSnapshot.go"
  },
  "snapshot-pending-resume": {
    "prompt": "EBSのバックアップ取得時点に必要なファイルを含め、業務再開と取得完了を分ける。 別の単一EBSデータボリュームを、安全な手順でアンマウントしてCreateSnapshotを要求した。要求は成功し、状態はpending。OS/アプリの再開手順は検証済み。再マウントと完了確認の説明は？",
    "options": [
      "pending中でも再マウントして利用できる。スナップショット完了と復元検証は別途確認する",
      "pendingの間は必ずアンマウントを維持し、元ボリュームは一切使用できない",
      "要求成功だけで状態確認も復元テストも不要になる"
    ],
    "answer": 0,
    "reasons": [
      "取得要求後のpending中にも元ボリュームを利用できます。業務再開とバックアップの完了確認を分けます。",
      "公式APIはpending中の再マウントと利用を認めています。全処理中の停止を常に要求しません。",
      "APIの要求成功は復元の可否やアプリ整合性を検証したことにはなりません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/ec2/api_op_CreateSnapshot.go"
  },
  "dms-initial-and-changes": {
    "prompt": "稼働中DBの初期データを移し、切替前の変更を追従する。 対応するソースDBから空の移行先DBへ初期データを移し、その間や移行後の更新も切替前まで追従したい。必要な権限・通信・ソースCDC設定とテーブルマッピングは確認済み。どのMigrationTypeを選ぶ？",
    "options": [
      "full-loadのみを選び、その完了後の更新も必ず自動追従するとみなす",
      "full-load-and-cdcを選ぶ。移行後の変更適用と切替前の検証は別に確認する",
      "初期データを入れずにcdcのみを選び、既存の全行も必ずロードされるとみなす"
    ],
    "answer": 1,
    "reasons": [
      "初期ロードだけと継続変更の追従は区別します。全件と継続変更にはfull-load-and-cdcを選びます。",
      "テーブルデータを移し、その後にソースの変更を適用します。方式の選択だけで切替成功を保証しません。",
      "変更だけを扱う方式で初期データの移行も済んだと考えてはいけません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/databasemigrationservice/api_op_CreateReplicationTask.go"
  },
  "dms-first-start-action": {
    "prompt": "稼働中DBの初期データを移し、切替前の変更を追従する。 別の新しいfull-load-and-cdcタスクを作成した。まだ一度も実行しておらず、開始可能な状態と必要設定を確認済み。StartReplicationTaskの初回のStartReplicationTaskTypeは？",
    "options": [
      "resume-processing。作成しただけでも実行済みタスクと同じ扱いになる",
      "reload-target。初回は必ず再ロード操作から始める",
      "start-replication。開始要求の成功後も移行状況を確認する"
    ],
    "answer": 2,
    "reasons": [
      "resume-processingは以前に実行したタスク用で、初回には使いません。",
      "初回にreload-targetなどの別操作を使うとデータエラーになります。",
      "この方式を含めたタスクの初回にはstart-replicationを使います。要求成功とデータ移行の完了は別です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/databasemigrationservice/api_op_StartReplicationTask.go"
  },
  "cdc-position-or-time": {
    "prompt": "DMSの変更データ追従を、対応する開始地点とソース設定で開始する。 新しいCDC専用タスクを初回起動する。対応ソースの有効なRecoveryCheckpointと、その地点に一致する移行先データがあり、必要設定・ログ・権限は確認済み。このチェックポイントから始めたいのに、CdcStartPositionとCdcStartTimeを両方指定した。どう直す？",
    "options": [
      "開始位置と時刻を両方指定すると、DMSが自動で安全な方を選ぶので直さない",
      "start-replicationと有効なチェックポイントのCdcStartPositionを使い、CdcStartTimeを指定しない",
      "初期データと同じ位置が必要でも、任意の今の時刻へ変更すれば差分欠落は必ず防げる"
    ],
    "answer": 1,
    "reasons": [
      "両方の指定はエラーです。時刻と位置の優先度選択ではありません。",
      "開始位置と時刻はどちらか一方です。チェックポイントの対応データとソース条件は別にも確認します。",
      "開始地点を勝手に変えると必要な差分を外す危険があります。APIが受け付けることとデータの連続性は別です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/databasemigrationservice/api_op_StartReplicationTask.go"
  },
  "cdc-postgresql-slot": {
    "prompt": "DMSの変更データ追従を、対応する開始地点とソース設定で開始する。 別のPostgreSQLソースでネイティブのCdcStartPositionを使うCDCタスクを開始したい。有効な開始位置と対応データは準備済みだが、必要な論理レプリケーションスロットが存在せず、エンドポイントにも関連付けていない。対応は？",
    "options": [
      "ソース条件を満たすスロットの存在とslotNameの関連付けを整え、開始位置と合わせて確認する",
      "タスク名にPostgreSQLと付ければ、スロットなしでも必ず成功する",
      "CdcStartTimeも追加すれば、足りないスロットが自動で作られる"
    ],
    "answer": 0,
    "reasons": [
      "PostgreSQLの開始位置指定では論理スロットとエンドポイントの設定も必要です。適切な開始点条件を確認します。",
      "表示名はソースの論理スロットやエンドポイント設定を用意しません。",
      "二重指定はエラーです。ソースの設定不足を別の開始パラメータ追加で解消しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/databasemigrationservice/api_op_StartReplicationTask.go"
  },
  "athena-reused-freshness": {
    "prompt": "AthenaのSQL結果の再利用を、データの最新性と実行実績から判断する。 ある集計結果が生成された後に、対象S3へ新しいログを追加した。同じ集計SQLの今回の結果はReusedPreviousResult=trueで、10分前の結果を再利用している。今追加したログも含む最新集計が必要。どう判断する？",
    "options": [
      "最大経過時間内なので、10分前の結果にも必ず新しいログが入っている",
      "今回の結果を最新とは扱わず、再利用を無効にした新しい実行と対象データ・結果を確認する",
      "同じ実行IDへGetQueryResultsを繰り返せば、SQLも必ず再実行される"
    ],
    "answer": 1,
    "reasons": [
      "過去の生成済み結果を使っています。結果の経過時間と、生成後の新データを含むことは別です。",
      "実際に再利用された結果から、生成後の変更も集計済みとは判断しません。再実行の対象と結果も確認します。",
      "結果取得はクエリ実行とは別です。同じ実行結果の取得で入力追加後の集計が行われるわけではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/athena/types/types.go"
  },
  "athena-reuse-flag": {
    "prompt": "AthenaのSQL結果の再利用を、データの最新性と実行実績から判断する。 別の集計で結果再利用を有効にした。候補の最大経過時間は60分、今回のReusedPreviousResult=false。今回の結果の説明は？再利用の全適格条件を推定する問題ではない。",
    "options": [
      "新しいクエリ実行から生成された結果。設定の有効化だけで再利用されたとは言えない",
      "有効設定があるので、実績フラグに関係なく過去結果を再利用した",
      "falseなら次のすべてのクエリでも再利用は永久に禁止される"
    ],
    "answer": 0,
    "reasons": [
      "falseは新しい実行の結果を示します。候補の年齢設定と実際の再利用を分けます。",
      "設定は再利用の許可で、実際に使われた証拠ではありません。",
      "これは今回の結果の情報です。将来の設定や別実行の結果を保証しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/athena/types/types.go"
  },
  "athena-workgroup-output": {
    "prompt": "S3へSQL結果を保存するAthenaを使う。マネージド結果保存とSparkは使わない。 S3へ結果を保存するAthena SQLで、クライアントのOutputLocationはバケットA、ワークグループはバケットB。EnforceWorkGroupConfiguration=true。必要な出力権限と暗号化条件は満たす。実際に使う出力設定は？A/Bは教材用の仮称。",
    "options": [
      "クライアントが指定したAを必ず使い、ワークグループは無視する",
      "ワークグループのBを使う。取得側の権限もBの結果場所で確認する",
      "AとBへ結果を必ず二重保存し、両方の読取りを自動許可する"
    ],
    "answer": 1,
    "reasons": [
      "強制するワークグループ設定はクライアント側設定を上書きします。",
      "出力先が変われば、結果取得のS3権限を確認する場所もその実際の場所です。",
      "設定の優先制御であり、二重保存や読取り権限の自動付与ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/athena/types/types.go"
  },
  "athena-s3-result-deny": {
    "prompt": "S3へSQL結果を保存するAthenaを使う。マネージド結果保存とSparkは使わない。 別の利用者へathena:GetQueryResultsをDenyしたが、S3結果ファイルのs3:GetObjectは許可したまま。対象ファイルが存在し、他の取得を阻害する条件はない。この利用者による結果の読取りを止めたい。追加で必要な制御は？",
    "options": [
      "Athena APIだけをDenyすれば、S3への直接読取りも必ず拒否される",
      "ワークグループの表示名を変更すれば、既存結果へのS3権限も消える",
      "S3結果場所の直接読取りも拒否・制限し、Athena APIとS3の両経路を確認する"
    ],
    "answer": 2,
    "reasons": [
      "S3 GetObjectが許可されていれば、Athena APIのDenyとは別にS3から読めます。",
      "表示名の変更は、S3のオブジェクトアクセス制御を変更しません。",
      "結果ファイルの取得経路も保護します。APIの制限だけでは読取りを止め切れません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/athena/api_op_GetQueryResults.go"
  },
  "asg-min-only-update": {
    "prompt": "通常の台数指定ASGを使う。数値は教材用の仮定。重み付き混合構成は使わない。 通常の台数指定（1台=1容量単位、重み付き混合構成なし）のASG。現在サイズ3、希望3、最小2、最大6。UpdateAutoScalingGroupで最小だけを4へ変更し、DesiredCapacityは指定しない。ほかの容量変更はない。希望容量はどうなる？",
    "options": [
      "3のまま。最小値は希望容量に影響しない",
      "4になる。ただし4台が即時に起動・処理準備完了する保証ではない",
      "最大値6まで必ず増える"
    ],
    "answer": 1,
    "reasons": [
      "新しい最小値4が現在サイズ3を超えるこの更新では、希望容量も4になります。",
      "希望容量を新しい最小値へ変更します。設定値と実際の準備完了は分けて確認します。",
      "最小値だけを変更した条件で、最大値まで増やす設定ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/autoscaling/api_op_CreateAutoScalingGroup.go"
  },
  "asg-max-only-update": {
    "prompt": "通常の台数指定ASGを使う。数値は教材用の仮定。重み付き混合構成は使わない。 別の通常台数指定ASG。現在サイズ5、希望5、最小2、最大6。最大だけを3へ変更し、DesiredCapacityは指定しない。他の容量変更、終了保護、処理の停止はなく、縮退が行える。期待する設定と終了対象の決まり方は？",
    "options": [
      "希望5を維持する。最大は表示上の注意にすぎない",
      "最小2へ必ず下がり、全インスタンスが終了する",
      "希望3へ変わり、縮退時は終了ポリシーで終了対象を選ぶ"
    ],
    "answer": 2,
    "reasons": [
      "新しい最大値3が現在サイズ5より小さいこの更新では、希望容量は3へ変わります。",
      "設定される希望容量は新しい最大値3です。全台終了の設定ではありません。",
      "縮退時の対象選択も別の設定です。ローカル状態や実行中処理の保護は別途設計します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/autoscaling/api_op_UpdateAutoScalingGroup.go"
  },
  "target-tracking-disable-in": {
    "prompt": "Amazon EC2 Auto Scalingのターゲット追跡を使う。2問は別の構成の独立した判断。 通常台数指定のASGで、平均CPUのターゲット追跡を設定し、DisableScaleIn=true。CPUが目標より低下した。容量値は最小以上最大以下、他のポリシー・スケジュール・手動容量変更・障害による置換はない。このポリシーによる縮退は？",
    "options": [
      "このポリシーでは縮退しない。ただし別の容量変更まで禁止する設定ではない",
      "低CPUなのでこのポリシーで必ず1台減る",
      "全EC2が終了不能になるため、手動の希望容量変更も永久に禁止される"
    ],
    "answer": 0,
    "reasons": [
      "DisableScaleInはこのターゲット追跡ポリシーによる縮退を無効にします。ASG全体のすべての終了を禁止するものではありません。",
      "明示された縮退禁止を無視しています。正確な台数計算もこの条件だけでは判断できません。",
      "ポリシーの縮退設定と、すべての終了や手動変更の禁止は別です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/autoscaling/types/types.go"
  },
  "target-tracking-alb-label": {
    "prompt": "Amazon EC2 Auto Scalingのターゲット追跡を使う。2問は別の構成の独立した判断。 別のASGでALBRequestCountPerTargetを使い、特定ターゲットグループの平均リクエスト数を追跡したい。まだそのターゲットグループはこのASGに関連付けていない。ResourceLabelを設定する前提として必要なことは？",
    "options": [
      "ASGと関係のない任意のターゲットグループのラベルでよい",
      "ターゲットグループをこのASGへ関連付け、対象ALBとターゲットグループを識別するResourceLabelを使う",
      "平均CPUのTargetValueを100にすれば、ALBの関連付けやResourceLabelは不要になる"
    ],
    "answer": 1,
    "reasons": [
      "ResourceLabelはASGへ関連付けたターゲットグループから指標を取るための識別です。関連付けの前提を飛ばせません。",
      "実際に追跡する対象を関連付けとラベルで確認します。CPU指標の設定だけを流用しません。",
      "指標の目標値変更は、ALBリクエスト数の対象設定を代替しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/autoscaling/types/types.go"
  },
  "efs-same-az-subnets": {
    "prompt": "同一VPCのEC2からEFSを利用する。各設問でRegionalまたはOne Zoneを明記する。 同一VPC・同一AZ-AのサブネットX/Y。Regional EFSの利用可能なマウントターゲットはXに1つあり、YのEC2で同じEFSを使いたい。経路・DNS・TCP 2049の通信許可・NFS設定・ファイル権限は正常。このAZにY用の2つ目も必要？",
    "options": [
      "必要。EC2とマウントターゲットは必ず同じサブネットでなければならない",
      "不要。既存ターゲットを使える。同じファイルシステム・AZへ2つ目は作れない",
      "新しいファイルシステムをYに作るだけで、既存ファイルも自動同期される"
    ],
    "answer": 1,
    "reasons": [
      "同じAZ内のEC2は、別サブネットの同じマウントターゲットを利用できます。サブネットごとに作る要件ではありません。",
      "1AZにつき1つという配置制約と、同じサブネットでなくてもアクセスできる条件を分けます。",
      "別のファイルシステムを作成することは同じ共有ファイルへの接続でも自動同期の設定でもありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/efs/api_op_CreateMountTarget.go"
  },
  "efs-one-zone-target": {
    "prompt": "同一VPCのEC2からEFSを利用する。各設問でRegionalまたはOne Zoneを明記する。 別の構成で、One Zone EFSはAZ-Aに作成済みでavailable。まだマウントターゲットはない。同一VPCのAZ-Bのサブネットを指定して最初のターゲットを作ろうとしている。権限・空きIP等の他条件は正常。適切な配置は？",
    "options": [
      "One Zoneのターゲットはファイルシステムと同じAZ-Aに1つ作る",
      "AZ-A/Bの両方へ1つずつ作れば、そのままRegionalへ変わる",
      "VPCが同じならAZ-Bに作成してよく、AZの条件はない"
    ],
    "answer": 0,
    "reasons": [
      "One Zoneでは対象ファイルシステムと同じAZのサブネットを指定します。複数AZへターゲットを作る構成ではありません。",
      "マウントターゲットを増やしてファイルシステムの配置方式が変わるわけではありません。",
      "同じVPCという条件だけではOne Zoneの同じAZという条件を満たしません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/efs/api_op_CreateMountTarget.go"
  },
  "efs-access-point-identity": {
    "prompt": "EFSのアクセスポイント経由でマウントする。各設問のID・パスは教材用の仮定。2問は別構成の独立した判断。 EFSアクセスポイントでPosixUserのUID/GIDを1001/1001、RootDirectory.Pathを/apps/team-aへ設定済み。このアクセスポイントでマウントするクライアントのOS上のUID/GIDは2000/2000。対象パスは存在し、ネットワーク・IAM・マウント条件は正常。ファイル操作のIDと公開ルートは？",
    "options": [
      "必ず2000/2000を使い、EFS全体のルートを公開する",
      "1001/1001を使い、/apps/team-aをその経路のルートとして扱う。書込み可否は権限も確認する",
      "設定とクライアントのIDを加算し、3001/3001として新しいファイルシステムを作る"
    ],
    "answer": 1,
    "reasons": [
      "アクセスポイントで設定したPOSIX IDがクライアントIDを上書きし、設定パスがその経路のルートになります。",
      "設定IDとルートを適用します。ただしIDの上書きだけで全ファイルの書込み権限が付くわけではありません。",
      "IDは加算されず、アクセスポイント作成は別のファイルシステム作成ではありません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/efs/api_op_CreateAccessPoint.go"
  },
  "efs-access-point-missing-root": {
    "prompt": "EFSのアクセスポイント経由でマウントする。各設問のID・パスは教材用の仮定。2問は別構成の独立した判断。 別のEFSアクセスポイントでRootDirectory.Path=/apps/new-team。対象ディレクトリは存在せず、CreationInfoも未設定。まだクライアントは接続していない。ネットワーク・IAM等の他条件は正常。これを使って初回マウントする前の適切な対応は？",
    "options": [
      "パスを指定すれば所有者や権限なしで必ず自動作成されるので、何も確認しない",
      "マウントターゲットを同じAZに増やせばディレクトリも自動作成される",
      "適切な所有者UID/GID・Permissionsを含むCreationInfoでアクセスポイントを作成するか、事前に適切な権限でディレクトリを作り確認する"
    ],
    "answer": 2,
    "reasons": [
      "未存在パスの自動作成にはCreationInfoの所有者UID/GIDとPermissionsが必要です。指定パスだけでは足りません。",
      "ネットワーク接続先の配置は、アクセスポイントのルート作成条件を変更しません。",
      "未存在かつCreationInfoなしではそのアクセスポイントのマウントが失敗します。自動作成はクライアント接続時の動作です。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/efs/types/types.go"
  },
  "lambda-async-accepted": {
    "prompt": "通常LambdaをInvokeで直接呼び出す。SQS等のイベントソースマッピング経由ではない。2問は別構成の独立判断。 通常のLambdaをInvokeで直接呼び出し、InvocationType=Event。APIはHTTP 202を返した。まだ関数の実行結果や業務更新の完了は確認していない。この応答から何を判断する？",
    "options": [
      "依頼は受理された。関数実行結果と業務の完了は別に確認する",
      "注文の業務更新まで成功したので、結果確認は不要",
      "HTTP 202は同期の関数エラーを意味し、必ず2回だけ再試行済み"
    ],
    "answer": 0,
    "reasons": [
      "非同期のAPI応答は処理完了を待った関数結果ではありません。受理成功を業務完了へ読み替えません。",
      "HTTP 202だけでは関数の処理結果やその業務更新を確認できません。",
      "呼出し方式とHTTPコード、実際の処理結果・再試行回数を混同しています。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/lambda/api_op_Invoke.go"
  },
  "lambda-sync-function-error": {
    "prompt": "通常LambdaをInvokeで直接呼び出す。SQS等のイベントソースマッピング経由ではない。2問は別構成の独立判断。 別の通常LambdaをRequestResponseで直接呼び出した。APIはHTTP 200を返したがFunctionErrorがあり、Payloadに関数エラー情報がある。呼出し側が業務更新の成功扱いにしてよい？",
    "options": [
      "HTTP 200なので関数エラー情報を無視して成功扱いにする",
      "同期でも非同期と同じ既定2回の再試行が必ず完了したので成功扱いにする",
      "成功扱いにせず、関数エラーと業務結果を確認する。再試行する場合は呼出し方式と重複更新への対策を設計する"
    ],
    "answer": 2,
    "reasons": [
      "HTTPコードは関数内のエラーを反映しません。FunctionErrorとPayloadを確認します。",
      "非同期の関数エラー再試行の規則を、この同期応答の成功証拠へ流用できません。",
      "関数実行のエラーを読み取り、再試行の主体・条件と副作用を確認して対処します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/lambda/api_op_Invoke.go"
  },
  "lambda-reserved-version-sum": {
    "prompt": "通常Lambdaの同時実行設定を扱う。2問は別構成の独立判断。数値と版/エイリアス名は教材用の仮定。 通常Lambda関数Fの予約済み同時実行は5。公開バージョンv1で3実行、v2で2実行が同時に進行中で、いずれも終了していない。別の直接Invokeを受ける。アカウントの空き枠、呼出し権限等は正常。バージョンが違えば合計6実行へ増やせる？",
    "options": [
      "各バージョンで別々に5枠なので、合計10まで必ず増やせる",
      "増やせない。5は関数全体の上限で、追加実行はその関数上限に制約される",
      "公開バージョンの実行は同時実行数へ数えない"
    ],
    "answer": 1,
    "reasons": [
      "予約済み同時実行の設定はバージョン単位ではなく関数全体に適用されます。",
      "既に合計5実行が進行中です。アカウントに空きがあっても、この関数の予約上限とは別です。",
      "予約設定には全公開バージョンと未公開版が含まれます。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/lambda/api_op_PutFunctionConcurrency.go"
  },
  "lambda-provisioned-requested-available": {
    "prompt": "通常Lambdaの同時実行設定を扱う。2問は別構成の独立判断。数値と版/エイリアス名は教材用の仮定。 別の通常Lambdaのエイリアスprodへプロビジョニング済み同時実行5を要求した。設定取得の応答はRequested=5、Available=0、割当Status=IN_PROGRESS。5枠が利用可能かを確認したい。判断は？ Requested/Availableは応答項目の略記。",
    "options": [
      "要求が受け付けられたので、Availableに関係なく5枠利用可能とする",
      "予約済み上限を5にすると、その取得応答のAvailableも必ず即時5になる",
      "まだ5枠利用可能とは扱わず、対象エイリアスの割当状態と利用可能数を確認する"
    ],
    "answer": 2,
    "reasons": [
      "要求数と利用可能数を区別します。要求値だけで割当完了とは判断できません。",
      "関数全体の予約上限と、特定エイリアスへの割当・利用可能数は別の設定/状態です。",
      "割当処理とAvailableを確認します。失敗ならStatusReasonも読み取り、要求数だけで準備完了としません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/lambda/api_op_PutProvisionedConcurrencyConfig.go"
  },
  "rds-standby-read-target": {
    "prompt": "通常RDS PostgreSQLのDBインスタンスを扱う。2問は別状況の独立判断。 通常のRDS PostgreSQLで、単一スタンバイ型のMulti-AZ DBインスタンスを利用する。AuroraやMulti-AZ DBクラスターではない。分析の読取り負荷をプライマリから分離したい。選択は？",
    "options": [
      "スタンバイへ分析クエリを送り、読取り先として使う",
      "読取り用リードレプリカを別途検討し、分析の接続先と許容遅延を設計する",
      "Multi-AZにした時点で分析の接続先が自動分散されると扱う"
    ],
    "answer": 1,
    "reasons": [
      "この配置のスタンバイは読取り処理を提供しません。",
      "Multi-AZの待機系は可用性、リードレプリカは読取り分離のために使います。",
      "待機系への同期複製は分析クエリの自動分散を意味しません。"
    ],
    "source": "https://github.com/awsdocs/amazon-rds-user-guide/blob/f2e9ed35fba2cb7e3942a1c23ed5b37162222d41/doc_source/Concepts.MultiAZSingleStandby.md"
  },
  "rds-failover-reconnect": {
    "prompt": "通常RDS PostgreSQLのDBインスタンスを扱う。2問は別状況の独立判断。 同じ単一スタンバイ型RDS PostgreSQLで、切替後に古いDB接続が切断された。DBエンドポイントのDNS更新は完了し、権限と経路は正常。アプリは古いIPを固定している。対処は？",
    "options": [
      "古いIPと切断された接続を使い続ける",
      "スタンバイを読取り専用のまま手動で書込み先にする",
      "DBエンドポイントを再解決して接続を再確立し、未確定処理の結果を確認する"
    ],
    "answer": 2,
    "reasons": [
      "切替でDNSの参照先が変わり、既存接続の再確立が必要です。",
      "この切替はRDSが扱います。待機系への直接接続を設計する対処ではありません。",
      "新しい参照先へ接続を復旧します。切断前の処理結果は別途確認し、書込みを無条件に二重実行しません。"
    ],
    "source": "https://github.com/awsdocs/amazon-rds-user-guide/blob/f2e9ed35fba2cb7e3942a1c23ed5b37162222d41/doc_source/Concepts.MultiAZSingleStandby.md"
  },
  "rds-replica-freshness": {
    "prompt": "通常RDS PostgreSQLのDBインスタンスを扱う。2問は別状況の独立判断。 通常RDS PostgreSQLのリードレプリカを分析に使う。プライマリで確定した更新Xが、このレプリカにはまだ反映されていないことを確認済み。更新Xを今すぐ確認する読取りが必要で、プライマリへの接続・権限は正常。選択は？",
    "options": [
      "レプリカは常に同期済みと扱い、ここで最新のXを読む",
      "プライマリで確定済みのXを読み、通常の分析と最新確認の読取り先を分ける",
      "レプリカ自身をMulti-AZにすればXが必ず即時反映される"
    ],
    "answer": 1,
    "reasons": [
      "このレプリカではXが未反映という条件が明示されています。",
      "非同期複製の未反映を踏まえて読取り先を選びます。",
      "レプリカ自身の可用性と、元DBからの非同期複製の鮮度は別です。"
    ],
    "source": "https://github.com/awsdocs/amazon-rds-user-guide/blob/f2e9ed35fba2cb7e3942a1c23ed5b37162222d41/doc_source/USER_ReadRepl.md"
  },
  "rds-replica-backup-prerequisite": {
    "prompt": "通常RDS PostgreSQLのDBインスタンスを扱う。2問は別状況の独立判断。 別の通常RDS PostgreSQL DBインスタンスから読取り用レプリカを作成したい。作成元のバックアップ保持期間は0で、保持は無効。権限・対応条件・容量は正常。作成前に必要な変更は？",
    "options": [
      "作成元のバックアップ保持を有効にして、必要な作成条件を満たす",
      "作成元の保持を0のままにし、Multi-AZだけを有効にする",
      "アプリのSQL権限だけを変更してバックアップ保持の前提を省く"
    ],
    "answer": 0,
    "reasons": [
      "CreateDBInstanceReadReplicaは作成元のバックアップ保持が有効であることを要求します。",
      "Multi-AZはバックアップ保持の有効化を代替しません。",
      "SQL権限はAPIが要求するバックアップ保持条件を変更しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/rds/api_op_CreateDBInstanceReadReplica.go"
  },
  "cloudfront-language-cache-key": {
    "prompt": "標準CloudFront配信の設定を扱う。2問は別状況の独立判断。 標準CloudFront配信で、同じパス/catalogの公開商品一覧がクエリlang=ja/enで変わる。キャッシュは有効、認証・個人別応答はない。langはオリジンリクエストポリシーだけで転送し、キャッシュキーには含めていない。同じ言語で共有しつつ言語別の混同を防ぐ変更は？",
    "options": [
      "langを転送するだけで、言語ごとに必ず別キャッシュになると扱う",
      "langをキャッシュポリシーのキーに含め、言語別の応答を分ける",
      "無関係な全クッキーをキーに含め、langは除外したままにする"
    ],
    "answer": 1,
    "reasons": [
      "転送だけではキーに含まれず、応答の区別を指定できません。",
      "応答を変えるlangをキーに含めます。キーに含む値はオリジンへも転送されます。",
      "必要な言語の区別がなく、無関係な分割も増えます。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/cloudfront/types/types.go#L733"
  },
  "cloudfront-min-ttl-private": {
    "prompt": "標準CloudFront配信の設定を扱う。2問は別状況の独立判断。 別の標準CloudFront配信で、オリジンがCache-Control: private, no-storeを返す。対象キャッシュポリシーのMinTTLは60秒。数値は教材用の設定例。これだけでCloudFrontが一切キャッシュしないと判断できる？",
    "options": [
      "no-storeがあれば正のMinTTLに関係なく必ず非キャッシュになる",
      "privateが付いていればMinTTLの設定確認は不要",
      "判断できない。正のMinTTLを見直し、非キャッシュ要件に合うポリシーを確認する"
    ],
    "answer": 2,
    "reasons": [
      "正のMinTTLはこれらの指示があっても最低期間のキャッシュを行うという公式の注意があります。",
      "オリジンの指示だけを見ず、配信側の保持設定も確認します。",
      "正のMinTTLによる保持を避ける必要があります。MinTTL=0だけで全応答が必ず非キャッシュになるとも断定しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/cloudfront/types/types.go#L733"
  },
  "cloudfront-oac-website-origin": {
    "prompt": "標準CloudFront配信の設定を扱う。2問は別状況の独立判断。 標準CloudFront配信の配信元を、公開S3静的ウェブサイトエンドポイントから非公開S3へ変更したい。ウェブサイト固有のリダイレクト等には依存せず、通常S3オリジンへの移行が可能。OACを使う構成は？",
    "options": [
      "ウェブサイトエンドポイントのままOACを関連付ける",
      "通常S3オリジンへ変更し、OACと配信元バケットの必要な許可を設定する",
      "閲覧者向け署名付きURLだけを追加し、S3の公開アクセスは維持する"
    ],
    "answer": 1,
    "reasons": [
      "S3のwebsite endpointはHTTPのカスタムオリジンで、OAC/OAIの対象ではありません。",
      "OACの対象である通常S3オリジンと非公開バケットを組み合わせ、署名と許可を確認します。",
      "閲覧者の条件を変えても、この前提のS3直接公開を閉じる構成にはなりません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/cloudfront/types/types.go#L4330"
  },
  "cloudfront-oac-imported-bucket-policy": {
    "prompt": "標準CloudFront配信の設定を扱う。2問は別状況の独立判断。 別の標準CloudFront配信Dで、既存の非公開S3バケットをCDKへインポートした。通常S3オリジンにOACが関連付け済みで、署名はalways。Object OwnershipはBucket owner enforced。オブジェクトは存在しSSE-S3、必要なCloudFrontのs3:GetObject許可だけがバケットポリシーにない。他の権限・経路は正常。修正は？",
    "options": [
      "OACが署名すれば、欠けたGetObject許可も自動的に有効と扱う",
      "バケットを全員へ公開して、配信Dへの限定を省略する",
      "CloudFrontサービスプリンシパルのGetObject許可を対象オブジェクトに追加し、SourceArnでDへ限定する"
    ],
    "answer": 2,
    "reasons": [
      "署名による要求の識別と、バケットポリシーによる許可は別です。インポート済みバケットのポリシー更新も必要です。",
      "公開すると非公開の配信元という要件を満たしません。",
      "既知の不足をバケットポリシーで修正します。インポート済みバケットではCDKが元ポリシーを変更したと仮定しません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/cloudfront/types/types.go#L4330"
  },
  "budget-forecast-warning": {
    "prompt": "2問は別状況の独立判断。数値は教材用の仮定で、AWSの料金・性能保証ではない。 月額予算200ドル、閾値80%の教材用例。実績150ドル、予測240ドルが既知。月末の予測超過を早く知らせたい。通知対象は？",
    "options": [
      "ACTUALだけを選び、未発生の予測費用も実績に数える",
      "FORECASTEDを選び、必要なら実績通知も別に用意する",
      "閾値を削除すれば、将来の費用を必ず0に抑えられる"
    ],
    "answer": 1,
    "reasons": [
      "ACTUALは実績、FORECASTEDは予測です。別の値を実績へ読み替えません。",
      "予測の超過を知りたい目的に合います。実績の把握は別の通知として管理できます。",
      "通知の比較条件を変えても費用を抑制する構成にはなりません。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/budgets/types/types.go"
  },
  "budget-notification-not-action": {
    "prompt": "2問は別状況の独立判断。数値は教材用の仮定で、AWSの料金・性能保証ではない。 別の予算で通知とメール購読だけを設定した。予算アクション、リソース停止や権限制限の自動化は設定していない。通知が届けば、その通知だけで全リソースが停止し費用が増えなくなる？",
    "options": [
      "メール通知だけで全サービスの利用が自動停止する",
      "予算値を下げれば、保存済みデータ等の費用も即時消える",
      "停止は保証されない。対象と影響を確認し、必要な対処や制御を別途設計する"
    ],
    "answer": 2,
    "reasons": [
      "通知の購読設定はリソース停止の設定ではありません。",
      "予算の設定値と利用中リソースの状態は別です。",
      "通知とアクションは別です。実行対象・権限・承認・業務影響を確認して対処します。"
    ],
    "source": "https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/budgets/types/types.go"
  }
};
export const QUIZ_CASE_PAIRS=[
  [
    "temp-photo-provider",
    "temp-photo-permission"
  ],
  [
    "role-upload-trust",
    "role-upload-permission"
  ],
  [
    "auth-photo-version",
    "auth-photo-tags"
  ],
  [
    "auth-caller-account",
    "auth-caller-deny"
  ],
  [
    "mfa-session-token",
    "mfa-role-condition"
  ],
  [
    "least-photo-policy",
    "least-photo-simulation"
  ],
  [
    "alb-consecutive-failures",
    "alb-all-unhealthy"
  ],
  [
    "ec2-before-termination",
    "ec2-ebs-retained"
  ],
  [
    "s3-account-public-block",
    "s3-existing-public-policy"
  ],
  [
    "durability-previous-version",
    "durability-archive-unavailable"
  ],
  [
    "s3-delete-marker-enabled",
    "s3-delete-null-suspended"
  ],
  [
    "rds-pitr-restore-time",
    "rds-pitr-new-target"
  ],
  [
    "sqs-change-from-now",
    "sqs-new-receipt-handle"
  ],
  [
    "route53-dns-share",
    "route53-all-zero"
  ],
  [
    "gsi-customer-query",
    "gsi-order-latest"
  ],
  [
    "query-empty-page-key",
    "query-filter-capacity"
  ],
  [
    "sqs-commit-before-delete",
    "dynamodb-token-window"
  ],
  [
    "dlq-source-rate",
    "dlq-nonsqs-origin"
  ],
  [
    "sg-db-peer-permission",
    "sg-reference-not-route"
  ],
  [
    "nacl-direction-order",
    "nacl-all-protocol-port"
  ],
  [
    "route-prefix-choice",
    "route-specific-removed"
  ],
  [
    "kms-old-material-read",
    "kms-ondemand-schedule"
  ],
  [
    "secret-current-cache",
    "secret-test-not-noop"
  ],
  [
    "ebs-restore-target-az",
    "ebs-snapshot-capacity"
  ],
  [
    "snapshot-unwritten-buffer",
    "snapshot-pending-resume"
  ],
  [
    "dms-initial-and-changes",
    "dms-first-start-action"
  ],
  [
    "cdc-position-or-time",
    "cdc-postgresql-slot"
  ],
  [
    "athena-reused-freshness",
    "athena-reuse-flag"
  ],
  [
    "athena-workgroup-output",
    "athena-s3-result-deny"
  ],
  [
    "asg-min-only-update",
    "asg-max-only-update"
  ],
  [
    "target-tracking-disable-in",
    "target-tracking-alb-label"
  ],
  [
    "efs-same-az-subnets",
    "efs-one-zone-target"
  ],
  [
    "efs-access-point-identity",
    "efs-access-point-missing-root"
  ],
  [
    "lambda-async-accepted",
    "lambda-sync-function-error"
  ],
  [
    "lambda-reserved-version-sum",
    "lambda-provisioned-requested-available"
  ],
  [
    "rds-standby-read-target",
    "rds-failover-reconnect"
  ],
  [
    "rds-replica-freshness",
    "rds-replica-backup-prerequisite"
  ],
  [
    "cloudfront-language-cache-key",
    "cloudfront-min-ttl-private"
  ],
  [
    "cloudfront-oac-website-origin",
    "cloudfront-oac-imported-bucket-policy"
  ],
  [
    "budget-forecast-warning",
    "budget-notification-not-action"
  ]
];
