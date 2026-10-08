# GR-001 レビュー対応表

2026-10-08 JST。依頼元：[SAA_FR_RESPONSE_REVIEW.md](SAA_FR_RESPONSE_REVIEW.md)。レビュー対象 `149cc24`、着手時main `f7f3618`。前回FR-001の解消とFR-002の改善が確認され、残った条件明記1件に対応した。

| 指摘 | 対応 | 確認・状態 |
|---|---|---|
| GR-001：assessment-007で現在出口がないことを、今後の出口新設禁止と解釈している | 問題文に「インターネット出口を新設せず、Secrets Managerへの通信をプライベートな経路に限定したい」を追加。正答解説にもDNS名維持・出口新設不要を明記 | 修正済み・独立した受入確認待ち。正答キー`a`、問題IDは維持 |
| NAT案を除外する根拠 | 候補をPublic NAT Gateway＋IGW＋必要な経路として具体化。既定DNS名でAPI接続できる成立部分を認めたうえで、明示された出口新設禁止・私設経路限定に反するため除外 | NAT単体で通信が成立する、または公開エンドポイントへ接続できない、という説明にはしていない |
| 記録と正本の同期 | [全候補点検表の007](SAA_FR_OPTION_AUDIT.md#assessment-007)、[設計索引](SAA_ASSESSMENT_BLUEPRINT.md)、分類台帳の該当1件を更新 | `case-rereview-assessment-007`：分類reviewed、内容draft、ゲーム取り込みdeferredを維持 |
| 改訂前の回答履歴 | 試験版を`2026-10-08-gr-review`へ変更。FR版以前の回答は保存し、新しい条件で再採点しない | 旧版受験後の再回答を初回未読扱いに戻さない既存処理を利用。直前FR版を回帰テストに追加 |

## 条件と全候補の照合

| 保存ID | 成立する部分 | 採否を決める条件 |
|---|---|---|
| a | Interface endpoint、プライベートDNS、タスクから443のSG許可 | 既定DNS名と私設経路を両立し、出口を新設しないため採用 |
| b | Interface endpointで私設経路を確保 | エンドポイント固有DNS名への変更が、既定DNS名維持に反する |
| c | Public NAT・IGW・経路により既定DNS名でAPI接続可能 | インターネット出口の新設禁止・私設経路限定に反する |
| d | Interface endpointとプライベートDNSは有効 | SGが運用端末からのみ許可し、接続元タスクからの443を許可していない |

保存IDは画面の表示順と別。正答を含む記録のため、初回未読の受験前には読まない。

## 根拠と範囲

無料のAWS公式資料を2026-10-08に確認し、この設問の出典を直接関係する2件へ整理した。

- [Secrets Manager VPC endpoint](https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html)：IGW/NAT不要の私設接続と、private DNSによる既定DNS名の利用。
- [NAT gateway](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html)：Public NAT・IGW・経路による外向き接続。Private NATとの違い。

変更対象は独立セットの1問と関連記録・版管理。12章58本文、通常235問、65問×3セット、165語を維持。ゲーム設計は別担当の変更を保持。全430問の全技術主張の独立監査、本試験相当の難度・識別力、本人の初回未読実績は本対応の確認範囲外。

## 検証・公開

| 検証 | 結果 |
|---|---|
| 全テスト | 111件成功・0件失敗。直前FR版の記録保存・現行版採点除外を含む |
| knowledge/game/progress | export/updateとcheck成功 |
| 型検査・ビルド | 成功 |
| Chromium | 章・試験・保存・初回/再回答・旧版採点除外・モバイル表示の既存回帰検証成功 |
| 変更範囲・同期 | 設問変更は007のみ、全ID・正答キーは不変。点検表の問題文/全4候補/解説、索引との一致を確認 |
| 公開 | CI WebKit・Pages反映・実配信照合を実施中 |
