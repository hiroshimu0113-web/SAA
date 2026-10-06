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
  }
};
export const QUIZ_CASE_PAIRS=[
  [
    "temp-photo-provider",
    "temp-photo-permission"
  ]
];
