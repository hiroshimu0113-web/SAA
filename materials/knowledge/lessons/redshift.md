# RedshiftとAthenaの選択・SQL結果確認

## 仕組み

分析サービスの選択では、データの場所、既存の実行環境、分析頻度、準備や運用の条件をそろえる。Athena SQLはS3のデータをSQLで直接分析するサーバーレスの仕組み。Redshift Data APIは対象クラスターまたはServerlessワークグループとデータベースへSQLを実行する。サービス名だけで、常に速い・安いとは判断しない。

S3の対応形式とカタログが準備済みで、時々集計し、新規ウェアハウスを準備しない条件ならAthenaを検討する。既存Redshiftのデータベースを利用する条件では、その接続先・DB・認証方式を確認する。RedshiftがS3を扱えないという意味ではなく、Spectrum等の別構成は今回の確認範囲外。

ExecuteStatementの応答に文IDがあっても、その時点でSQL完了や全結果取得を判断しない。DescribeStatementで状態を確認する。SUBMITTEDは未処理、STARTEDは開始、FINISHEDは完了。FAILEDやABORTEDを成功扱いしない。JSON形式の結果ならGetStatementResultで取得し、NextTokenがあれば続きのページも取得する。

## 比較・条件

| 判断 | 確認するもの | 混同を避けるもの |
| --- | --- | --- |
| S3直接SQL分析 | Athenaの対応形式・定義・権限 | クローラー起動だけで集計完了 |
| Redshift SQL | 実行先・DB・認証方式 | 実行先未準備で名前だけ設定 |
| 文の完了 | DescribeStatementの状態 | 文IDだけで完了 |
| 全結果取得 | 形式・取得操作・ページング | 最初の応答だけで全行 |

## 限界

Athenaの既存教材にある結果再利用・出力先/権限の説明は共有する。Redshiftの文IDをAthenaの実行IDとして使わない。比較の仕組みは無料の公式アーカイブ版ガイドで確認し、API状態は公式SDK固定コミットへ照合した。アーカイブの時間・価格・上限を現行保証として使わない。

ワークロードの計測、最新料金、全認証方式、外部/連携クエリ、全結果形式、結果保持期間の数値、実AWS試験は未確認。SQLを実行できることと、利用者の全データ権限・業務集計の正しさも別に確認する。

## ケース問題・誤答理由

第1問はS3直接分析の条件、第2問は別の既存Redshiftで受理だけを観測した状態。実行先の準備を省く誤答、文IDを完了へ読み替える誤答、異なるIDを交換する誤答を確認する。

## 用語・補足

**データウェアハウス**は分析に用いるDB基盤。**Data API**はAPI経由のSQL実行操作。**文ID**はRedshiftのSQLを追跡する識別子。**ページング**は複数ページに分かれた結果を取得すること。**Serverlessワークグループ**はRedshift Serverlessの実行先で、Athenaのワークグループとは別。

## 根拠と確認状態

2026-10-07に原稿作成後の内容確認を実施。同一担当確認、独立監査・実AWS実験・本人理解評価は未実施。ゲーム取り込みと公開は別管理。AWS公式リポジトリの固定コミットを無料で閲覧。

- [api_op_ExecuteStatement.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/redshiftdata/api_op_ExecuteStatement.go) — Data APIで単一SQLを実行する。認証方式とクラスター/Serverlessワークグループに応じて接続先・DB名・権限を指定。応答は文のIDを持つ。
- [api_op_DescribeStatement.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/redshiftdata/api_op_DescribeStatement.go) — 文のStatusを取得し、SUBMITTEDは未処理、STARTEDは実行開始、FINISHEDは完了、FAILED/ABORTEDは別状態。
- [api_op_GetStatementResult.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/redshiftdata/api_op_GetStatementResult.go) — JSON形式の一時キャッシュ結果を文IDで取得。結果のNextTokenで続きのページを取得する。
- [api_op_StartQueryExecution.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/athena/api_op_StartQueryExecution.go) — SQLクエリを実行し、実行IDを返す。実行コンテキストとワークグループ等を指定する。
- [what-is.md](https://github.com/awsdocs/amazon-athena-user-guide/blob/765e909ebcf8817b22efad881b7f90f32440b891/doc_source/what-is.md) — 公式アーカイブ版：Athena SQLはS3データをSQLで分析するサーバーレスの仕組み。現行価格・速度・制限・全機能の根拠には使わない。
