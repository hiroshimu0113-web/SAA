# CloudFront OACとS3オリジンの許可境界

## 到達目標

CloudFrontから通常S3オリジンへアクセスする際の署名と許可を分け、非公開の配信元を構成する。既存cloudfront-oac素材を詳細化する。

## 仕組み

OAC（Origin Access Control）はCloudFrontからオリジンへの要求を制御する設定。署名動作alwaysではCloudFrontが要求を署名し、Authorizationを上書きする。要求を署名することと、S3がその操作を許可することは別である。

通常S3オリジンと非公開バケットを使い、CloudFrontサービスプリンシパルcloudfront.amazonaws.comに必要なs3:GetObjectを許可する。対象は配信するオブジェクトで、AWS:SourceArnに配信のARNを指定して利用元を限定する。無関係な全員へバケットを公開する変更で不足許可を代替しない。

S3 Object Ownershipは通常Bucket owner enforcedを使用する。ACLが必要な場合のBucket owner preferredは別途要件を確認する。オブジェクト所有権の設定も、OAC利用の前提として確認する。

CDKへインポートした既存バケットのポリシーは自動変更されたと仮定しない。公式READMEは既存ポリシーを手動で更新する必要を説明している。既存の許可/拒否と変更の実体を確認する。

## 比較・条件

| 制御・配信元 | 対象 | 注意 |
| --- | --- | --- |
| OACの署名 | CloudFrontからオリジンへの要求 | バケットの操作許可も必要 |
| S3バケットポリシー | S3への許可/拒否 | 配信のSourceArn等で対象を絞る |
| 閲覧者向け署名付きURL/クッキー | 閲覧者からCloudFrontへの条件 | 公開S3の直接アクセスを閉じる操作ではない |
| S3 website endpoint | HTTPのカスタムオリジン | OAC/OAIは利用できない |

S3静的ウェブサイトのエンドポイントと通常S3オリジンを同じものとして扱わない。移行ではウェブサイト固有のリダイレクト等の依存も確認する。OAIは旧来の仕組みであり、OACと同じ対応範囲とは扱わない。

## 限界

SSE-KMSではS3許可だけでなくKMSキーの許可も必要。インポート済みキーのポリシーは別途更新する。教材のケースはSSE-S3としてこの不足を除外している。読み取りに必要な権限を扱い、書込み権限を一律に付けない。全IAM評価、署名を上書きしない設定、OAI移行、マルチテナント配信、最新料金、実AWS検証は未完了。OACは閲覧者本人の認証を提供する説明ではない。

## ケース問題・誤答理由

正本は `knowledge/game-cases.json` の `cloudfront-oac-s3-boundary`。第1問はwebsite endpointから通常オリジンへの移行が可能と明記する。第2問は別構成で、欠けたバケット許可だけを既知原因として示す。OACだけで許可が付く誤答は署名と認可の混同、公開化する誤答は非公開要件違反。

## 用語・補足

**OAC**はオリジンへの要求のアクセス制御。**OAI**は旧来のオリジンアクセスアイデンティティ。**サービスプリンシパル**はAWSサービスを許可主体として指定するもの。**ARN**はAWSリソースの識別名。**SourceArn**は利用元リソースを限定する条件。**SSE-S3/SSE-KMS**はS3保存時の暗号化方式で、KMSキーの権限が必要かを区別する。

## 根拠と確認状態

2026-10-07に原稿作成後の内容確認を実施。同一担当確認、独立監査・実AWS実験・本人理解評価は未実施。ゲーム取り込みと公開は別管理。AWS公式リポジトリの固定コミットを無料で閲覧。

- [types.go#L4330](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/cloudfront/types/types.go#L4330) — OriginAccessControlConfigのalwaysはCloudFrontがオリジン要求を署名しAuthorizationを上書きする。S3のwebsite endpointはカスタムオリジンとして扱う。
- [README.md#restricting-access-to-a-standard-s3-origin](https://github.com/aws/aws-cdk/blob/6ede0060d93bab5903a0528bdd323a56e1430003/packages/aws-cdk-lib/aws-cloudfront-origins/README.md#restricting-access-to-a-standard-s3-origin) — OAC/OAIは通常S3オリジンに利用でき、website endpointには利用できない。非公開バケットと組み合わせる。インポート済みバケットはポリシーを手動変更する必要がある。CloudFrontサービスプリンシパルへGetObjectを許可しSourceArnで配信を限定する例がある。
- [README.md#setting-up-oac-with-a-sse-kms-encrypted-s3-origin](https://github.com/aws/aws-cdk/blob/6ede0060d93bab5903a0528bdd323a56e1430003/packages/aws-cdk-lib/aws-cloudfront-origins/README.md#setting-up-oac-with-a-sse-kms-encrypted-s3-origin) — SSE-KMSではKMSキーへの許可が別途必要。インポート済みKMSキーはCDKで変更されず、手動のキーポリシー更新が必要。
