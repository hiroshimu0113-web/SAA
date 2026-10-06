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
  ]
];
