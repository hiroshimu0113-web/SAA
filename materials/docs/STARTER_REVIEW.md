# 先行学習版の確認記録

確認日: 2026-10-05。教材作成担当とは別に親エージェントが第1・2章とq001〜q020を読み、下記公式情報と比較した。これは全12章200問の内容監査とは別の、先行版の範囲確認である。

| 対象 | 確認した判断 | 根拠 |
|---|---|---|
| q001,004,005,006,010 | AZ障害とリージョン障害の範囲、地域選択、冗長化 | [Regions and Zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) |
| q002,003,009 | EC2ゲストOSは利用者側、マネージド化してもデータと認可は残る | [責任共有モデル](https://aws.amazon.com/compliance/shared-responsibility-model/) |
| q007 | インスタンスストアは一時データ向け、唯一の結果を保存しない | [Instance storage](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) |
| q008 | 中断を許容し再投入できる処理でSpotを検討 | [EC2購入方式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html) |
| q011,015 | ロール、一時認証情報、信頼ポリシーの役割 | [IAM roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) |
| q012 | 明示的Denyの優先 | [ポリシー評価](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) |
| q013 | SCPは上限であり単体で権限を付与しない | [SCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) |
| q014,020 | 最小権限、MFA、ルートを日常利用しない | [IAMベストプラクティス](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) |
| q016 | 第三者の顧客取り違えへのExternal ID | [第三者アカウントアクセス](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html) |
| q017 | 従業員の複数アカウントアクセス | [Identity Center](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html) |
| q018 | 一般アプリ利用者の認証 | [Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) |
| q019 | 一時認証情報の期限と長期キー配布の削減 | [一時認証情報](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html) |

修正: 確認問題に出るSpot・インスタンスストア・S3・RDSの導入説明を第1章へ追加。MFAとルート保護を第2章へ補足。先行版用語は明示的な21件を定義し、重複と概念リンクを確認した。q015の問題文へIAMロール作成の文脈を補った。

品質上の位置付け: 基本概念の導入用問題で、誤答を判別しやすい設計。SAA本試験相当の複雑な設計判断を測る問題集とは扱わない。合格可否の判定に使わない。

ソフトウェア確認: 型検査・ビルド、構造/採点/保存の自動テスト9件、Chromeのモバイル幅ブラウザーテスト。オフライン再読込時にVary: Originによって静的アセットのキャッシュ照合が外れる問題を発見し、アプリスコープ内の静的応答をignoreVaryで照合する修正を実施した。修正後は通信遮断、新しいページからの起動、未閲覧の用語・問題・解説、バックアップ拒否/復元が成功した。

追加検証: `scripts/update-check.mjs` で、新版の一部ファイルが404になる更新失敗、旧版によるオフライン再起動、正常更新の明示適用、欠けたキャッシュの検出・再取得が成功した。EPUBはZIPのCRC、全XML/XHTML/OPFの構文、問題・解説リンクを検証。単一HTMLはJavaScript無効のChromeモバイル幅で表示と問題・解説間移動を確認した。

未検証: iPhone SafariとApple Booksの実機表示、HTTPS公開先での確認、保存領域枯渇のブラウザー試験、模試、ゲーム。旧キャッシュは開いた別画面を壊さないため即時削除せず、長期運用時の容量管理は改善項目として残す。
