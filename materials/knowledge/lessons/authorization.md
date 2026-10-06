# 認可：操作と要求条件に必要な許可を選ぶ

学習目標：認証情報が有効でも、対象・操作・要求の条件に合う許可が必要だと説明する。既存単位 `authorization` の補足本文。前提は認証。関連章：ch02、ch05、ch10。

## 仕組みと判断順

認証は主体を確かめる段階、認可はその主体が対象へ行う操作を許可するか判断する段階。認証済みというだけで、読み取り、上書き、削除、タグ設定のすべてが許可されるわけではない。操作名だけでなく、対象リソースと要求の条件を読む。

S3の汎用バケットを例にすると、特定のversionIdを指定しないGetObjectにはs3:GetObject、特定バージョンを指定したGetObjectにはs3:GetObjectVersionが必要になる。特定バージョンを読む場合はGetObjectも必須という説明は正しくない。versionIdはバージョニングで保存された特定の版を識別する値で、読み取り用の認証情報ではない。

PutObjectによる保存にはs3:PutObjectが必要。さらに、その要求でタグ集合を設定するならs3:PutObjectTaggingも必要になる。タグはオブジェクトへ付けるキーと値の組で、PutObjectというAPI名を覚えるだけでは要求条件に応じた許可を判断できない。ACLを変更する要求ならs3:PutObjectAclも必要で、これらを無条件にすべて付けることが最小権限ではない。

流れ：主体の認証情報 → 操作対象と要求パラメーター → 対応する許可を評価 → 実行か拒否。実際にはSCP、アクセス許可境界、セッション/リソースポリシー、明示的Denyなどが関わり、この簡略化した流れだけで評価全体を表さない。

## 比較・条件・限界

| 要求 | この範囲で確認する許可 | 混同を避ける点 |
|---|---|---|
| versionIdを指定しないGetObject | s3:GetObject | 特定版の読取許可と同一視しない |
| versionIdを指定するGetObject | s3:GetObjectVersion | GetObject許可も同時に必須とはしない |
| タグ/ACLを付けないPutObject | s3:PutObject | これだけでタグやACLの設定も許可されるわけではない |
| タグを指定するPutObject | s3:PutObjectとs3:PutObjectTagging | 必要な要求でのみ追加許可を検討する |
| versionIdを指定しないDeleteObject | s3:DeleteObject | 読取許可は削除許可の代わりにならない |

この表は汎用バケットの対象操作に限定する。暗号化にSSE-KMSを使う場合はKMSの許可条件も関わり、ディレクトリバケットには異なる認可の説明がある。バージョニング有効時のDeleteObjectの結果、Object Lock、所有権なども別に判断する。許可があるだけでネットワークやストレージ状態による失敗がなくなるとは保証しない。

## ケースと転移

`knowledge/game-cases.json` の `authorization-photo-conditions` が連続2問の正本。汎用バケットで通信と認証は正常とし、SSE-KMS・ACL・ほかの許可やDenyを設問から除外して、versionId指定とタグ指定が必要許可を変える理由を問う。全誤答の理由はケースへ保存する。

条件変更：特定versionIdを指定する読み取り要求を、versionIdを指定しない要求へ変える。確認すべき読み取り許可もGetObjectVersionからGetObjectへ変わる。いつでも広い許可へ増やすのでなく、要求に対応する対象・操作を確認する。

既存の適用問題は「写真を読めるが消せない担当者」。読取と削除を別の操作として必要対象へ許可を限定する。バージョニングや他ポリシーからの削除許可まで含めて実環境で保証するには追加の評価が必要。

## 内容確認と出典

2026-10-06、Codexが作成後の別工程で、対象範囲、パラメーター、各操作の必要許可、条件変更、全誤答の理由を無料のAWS公式SDK固定版のPermissions節へ照合した。別担当者の独立監査・AWSアカウントでの実験・本人理解評価は未実施。

- [GetObject公式API説明](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_GetObject.go)：versionId指定の有無とGetObject/GetObjectVersion。
- [PutObject公式API説明](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_PutObject.go)：PutObject、PutObjectTagging、PutObjectAcl、暗号化/バケット種別の範囲。
- [DeleteObject公式API説明](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/s3/api_op_DeleteObject.go)：DeleteObject/DeleteObjectVersionと明示的Deny。
- [AssumeRole公式API説明](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sts/api_op_AssumeRole.go)：認証情報の取得とロールの操作権限は別。

現行のAWSドキュメントサイトは環境の接続制限で未取得。公式SDKに含まれるAPI説明で上記の主張を確認し、アーカイブ済みガイドだけで確認済みとはしていない。
