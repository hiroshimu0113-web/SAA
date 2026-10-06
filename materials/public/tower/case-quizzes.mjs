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
  ]
];
