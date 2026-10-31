# SAAプロジェクト 引継書

作成日：2026-10-31 JST。対象：`hiroshimu0113-web/SAA`。調査基準はmainの `cda3164dfc32ec22b11bda4936e8f15038262db6`。本書はコード・生成進捗・作業記録・レビュー対応を照合した現状の入口である。公開確認の過去実績と今回の検証を分けて記載する。

## 1. 目的と現在地

AWS Certified Solutions Architect – Associate（SAA-C03）取得を目指す初学者向けに、日本語教材、演習、音声、知識の地図、AWS構成を題材にしたカードゲームを提供する。主な利用環境はiPhone縦画面、学習時間は1日20〜30分を想定する。独自教材であり、AWS公式教材・実際の試験問題ではない。

現在は「教材2章と3ミッションだけ」の段階を越え、12章の教材と改訂3のカード冒険を公開した段階。直近の依頼は、ゲームのオプションに選択キャラの3ビルドを表示し、その関連カードを縮小表示すること。この実装・公開は既存記録上完了している。次の新機能・納期は未確定であり、本人の試遊フィードバックと品質改善が継続候補となる。

**公開済み、構造検査済み、独立監査済み、本人が理解済みはそれぞれ別の状態。** ゲームの勝利・学習履修数・演習正答率から本試験合格を保証しない。

## 2. 入口と最初に読む資料

| 用途 | 場所 |
|---|---|
| GitHub・更新履歴 | https://github.com/hiroshimu0113-web/SAA |
| 学習アプリ | https://hiroshimu0113-web.github.io/SAA/ |
| 現行カード冒険 | https://hiroshimu0113-web.github.io/SAA/tower/index.html |
| ゲーム内学習室 | https://hiroshimu0113-web.github.io/SAA/tower/study.html |
| 旧冒険・旧セーブの継続 | https://hiroshimu0113-web.github.io/SAA/tower/legacy.html |
| 音声教材 | https://hiroshimu0113-web.github.io/SAA/audio/index.html |
| 知識の地図 | https://hiroshimu0113-web.github.io/SAA/knowledge/index.html |
| 作業規約 | [ルートAGENTS.md](../../AGENTS.md)、[materials/AGENTS.md](../AGENTS.md) |
| 最新の経緯 | [CHECKPOINT.md](CHECKPOINT.md)、[TASKS.md](TASKS.md)の末尾 |
| 教材の数量と保管先 | [CONTENT_PROGRESS.md](CONTENT_PROGRESS.md)、[CONTENT_LIBRARY.md](CONTENT_LIBRARY.md) |
| 現行冒険の仕様・制限 | [BUILD_ADVENTURE_RELEASE.md](BUILD_ADVENTURE_RELEASE.md) |
| 原計画・実装の基本方針 | [SAAへの道.md](../SAAへの道.md)、[PROJECT.md](PROJECT.md) |

README、PROJECT、CHECKPOINT/TASKSの冒頭には「2章・20問」「模試未作成」「公開ブロック」等の初期記録が残る。最新データと後続の完了記録を優先し、古い未完了表記をそのまま現在の課題に転記しない。過去資料にある7:00停止、予約、認証障害は現在の指示や稼働中の自動化を意味しない。

## 3. 教材・学習機能の現状

| 対象 | 現在の数量・状態 | 留保 |
|---|---|---|
| 本文 | 12章・58レッスン公開 | 全技術主張の独立監査完了ではない |
| 通常問題 | 235問公開 | 正答・誤答理由・出典の継続点検が必要 |
| 条件変更演習 | 65問×2セット | 独立した到達度評価とは区別 |
| 到達度確認 | 独立セット65問 | 初回未読は自己申告。本試験相当の難度・識別力は未測定 |
| 問題合計 | 通常235＋演習130＋評価65＝430問 | ゲーム専用設計演習26問は別管理 |
| 細分化知識 | 26単位、確認済み0・確認待ち26 | draftを学習者の理解状態と混同しない |
| ゲーム分類台帳 | 532件、取り込み済み282件 | 全教材の分類完了ではない |
| 分類内訳 | 用語122・概念83・システム0・役9・ビルド18・ケース300 | システム0は本文が存在しない意味ではない |

読む・問題を解く・解説を見る・復習・用語検索・履歴・バックアップ・オフライン利用を実装。演習は単一／複数選択、各65問セットは130分。教材版を保存し、旧版の成績を現行版で再採点しない。条件変更演習と独立セットを分け、再回答を初回未読に戻さない。

生成検査では学習室用の練習268問・評価65問、旧来の部屋用クイズ250問を確認した。教材430問と各モードの利用件数は、選択形式・用途・補足問題の取り込み条件が異なるため一致しない。通常冒険の採用30形態と、カタログの候補カード30件も対象・IDを照合して扱う。

知識の正本は`knowledge/units.json`と`relations.json`。グラフや棚卸しは生成物である。[EXPANSION_PLAN.md](../knowledge/EXPANSION_PLAN.md)の「14単位」等は当時の段階別計画であり、現在の数量26単位と区別する。

## 4. 現行ゲームの詳細

通常入口は改訂3の30カード形態・6系統。6キャラクターとランダムを7枠のシリンダーで選ぶ。固有モチーフと立ち絵を分離し、選択・開始・戦闘・マップで対応させる。通常カード採用数は一旦30種類までという方針で、設計候補181形態をすべて採用したものではない。

- 8階層、分岐経路、途中2階の強敵経路、最終ボス。カード報酬・スキップ・強化・回復と、休憩／交換所／知識の間の寄り道を実装。
- 共通／専用／支援カード、ビルド系統ごとの配色、デッキ構成を優先する強敵報酬、4種のレリックを実装。
- 扇形手札、長押し・キーボードによる詳細、設備の再開・撤去・復元、保存・バックアップを提供。
- 設備行動→敵→自分の順をポップアップ表示。設備と演出に共通図形を使い、敵予告の妨害対象、稼働・停止・破損を見えるようにする。
- オプションの「ビルド」に現在のキャラの3案を表示。全体で18案。関連カードはキー→オプション→コネクション順に3列で表示し、現在採用中かつ当該キャラのプール内のカードに限定する。
- ゲーム内学習室は通常教材と設計演習26問等を利用。単一選択のランダムクイズだけで学習を完結させず、複数選択や評価セットへ進む導線を持つ。

直近の公開実績は実装`0b0084a`、検査待機の修正`713163b`、公開確認記録`cda3164`。[Actions 39694628369](https://github.com/hiroshimu0113-web/SAA/actions/runs/39694628369)で166テスト、全6キャラの縮小カード・詳細・復帰・保存不変・320/390/1024pxのWebKit検査、ビルド・配信照合に成功した記録がある。確認用URL：https://hiroshimu0113-web.github.io/SAA/tower/index.html?v=713163b 。これは過去の公開確認記録であり、本書作成時の実機再検証ではない。

未導入・制限：全181形態、全25脅威、正式レア度70/25/5、全レリック、仕事の部分成果UI、旧冒険のデバフ5種の新モード移植等。可視性タイムアウトの競合受信者やプレイスメントグループのホスト故障等も未実装。未対応項目を動作済みと説明しない。独立試作・設計資料・旧モード・通常冒険の機能を混同しない。

## 5. 音声・配布物・アート

音声は写真工房を題材にEC2・S3・IAMロールを説明する約5分版。台本・章移動・速度変更・確認問題2問と各7秒の思考時間がある。本人が選んだVOICEVOX:冥鳴ひまり（ノーマル）を基本とする。現行MP3は`public/audio/photo-studio-himari-v2-5min.mp3`。style 14、speedScale 1.05、intonationScale 0.9、pitchScale -0.03、後処理atempoなし。5分全体の自然さ・発音は本人の再試聴待ち、30分版は未制作。

再生成は[audio/README.md](../audio/README.md)、[COMPARISON.md](../audio/COMPARISON.md)、[VOICEVOX_LICENSE.md](../audio/VOICEVOX_LICENSE.md)を参照。Python、numpy、soundfile、ffmpegとエンジンが必要。記録上の仮想環境パスは新環境に存在する保証がない。旧音声・比較版・規約・クレジットは保持する。

`deliverables/`のHTML・EPUB・ZIPは作成時点の配布物で、現在のゲームや全教材を反映した最新版とは限らない。通常は展開済みソースを編集し、ZIPを無断で上書きしない。`artifacts/backup.json`等は検証用であり本人の学習実績ではない。6人の立ち絵は同梱のオリジナル生成アート。画像アトラスと表示窓を変更する場合は全6人の実画像decodeと切り抜きを検査する。

## 6. 技術構成と正本

実作業ディレクトリは`materials/`。React 19、TypeScript、Vite 6、Node.js 24、pnpm 11.19.0。静的サイトとしてGitHub Pagesへ配信する。ゲームは主に`public/tower/`のJavaScriptモジュールとCSSで実装し、ビルドで配信HTMLを生成する。ログイン・サーバー同期・課金・App Store・実AWSリソース作成は初版対象外。

| 内容 | 正本・主なファイル | 更新時の注意 |
|---|---|---|
| 教材・公開設定 | `src/content/part1.ts`、`part2.ts`、`index.ts`、`readiness/`、`rereview/`、`build-gap-expansion.ts` | 取り込み元と公開設定を両方確認 |
| 共通型・学習保存 | `src/types.ts`、`learning.ts`、`storage.ts`、`exams.ts` | ID・版・採点集合と既存履歴を保持 |
| 知識単位・関係 | `knowledge/units.json`、`relations.json` | export/checkでグラフと棚卸しを再生成 |
| 分類・補足・設計演習 | `knowledge/game-classifications.json`、`game-supplement.json`、`game-design-questions.json` | 分類理由・出典・取り込み状態を記録 |
| 現行戦闘・進行 | `public/tower/build-lab-engine.mjs`、`build-adventure-engine.mjs` | 独立試作との共用範囲と保存互換性に注意 |
| 現行ゲームUI | `public/tower/build-adventure-app.mjs`、`options-ui.mjs`、`build-adventure.css` | 詳細表示・戻る位置・フォーカス・タッチ幅を維持 |
| 冒険教材の書出し | `scripts/export-build-adventure.mjs` | `public/tower/build-adventure-content.json`を直接編集しない |
| 学習室 | `public/tower/study-state.mjs`、`study-ui.mjs` | 結果・履歴・バックアップの整合性を維持 |
| ゲーム／サイト生成 | `scripts/export-game-catalog.ts`、`build-tower.mjs`、`build-sw.mjs` | 学習カタログ・dist・Service Workerは生成物 |
| 公開 | `../../.github/workflows/deploy.yml` | main更新→検査→ビルド→Pages→実配信照合 |

18ビルドの所属は既存の`characterCardAllocation.builds`を利用する。設計案と実装の対応は[BUILD_ADVENTURE_RELEASE.md](BUILD_ADVENTURE_RELEASE.md)、カード関連レビュー、`public/design/`の資料をたどる。設計資料に掲載された効果をすべて実装済みと解釈しない。

## 7. 保存・更新・復元

| 保存対象 | 保存先 |
|---|---|
| 学習アプリ | IndexedDB `saa-learning/state/progress` |
| 現行冒険 | localStorage `saa-build-adventure-v1` |
| 旧冒険 | `saa-tower-run-v1` |
| 独立バランス試作 | `saa-build-lab-v1` |
| ゲーム内学習室 | localStorage `saa-tower-study-v1` |

保存領域を相互に削除・上書き・暗黙移行しない。全記録が単一バックアップに含まれるとは仮定せず、各画面で書出し／復元の対象を確認する。ブラウザーのサイトデータ消去で記録が失われる可能性があるため、本人のバックアップを優先する。破損データを黙ってリセットしない。

Service Workerはビルド単位のキャッシュを作り、全ファイル保存後に準備完了とする。手動更新が完了するまで旧版を保持する。開発サーバーだけでオフライン動作を判定せず、ビルド版を用いる。古い画面が残る場合はバックアップ後に設定の更新操作、オンライン起動、URLと配信版を確認する。キャッシュ／サイトデータの削除を最初の対処にしない。

## 8. レビューの到達点と残課題

| 領域 | 到達点 | まだ必要なこと |
|---|---|---|
| FR-001 | 条件変更演習m2-065の解説不整合は再レビューで解消 | 全430問の全主張・出典監査とは別 |
| FR-002 | 独立65問267候補を点検、59問改訂。指摘例と候補設計は改善 | 本試験相当の難度・識別力は未認定 |
| GR-001 | assessment-007の通信経路制約を明記し、独立再レビューで受入 | 当該指摘を再び未修正扱いにしない |
| GQR-001/002 | 未確定回答と履歴、矛盾バックアップ受理を修正・検査・公開した記録あり | 修正版への独立受入レビューは別工程 |
| 教材全体 | 範囲拡充・出典・構造検査・部分レビューあり | 全詳細スキル網羅、全技術主張の独立監査、本人の初回実績 |
| カード効果 | 30形態を冒険に実装・公開 | 独立意味監査、最終バランス、人手試遊 |
| 端末 | Chromium/WebKitの回帰記録あり | 実機iPhoneの受入表は未確認 |

根拠：[SAA_FR_RESPONSE_REVIEW.md](SAA_FR_RESPONSE_REVIEW.md)、[SAA_GR_RESPONSE_REVIEW.md](SAA_GR_RESPONSE_REVIEW.md)、[SAA_GAME_READINESS_RESPONSE_REVIEW_RESPONSE.md](SAA_GAME_READINESS_RESPONSE_REVIEW_RESPONSE.md)。旧CONTENT_REVIEWや旧対応表の未完了表記は、後続記録と照合して扱う。

運用上の課題は、長い追記台帳と古い入口文書による状態の読み違い、旧ゲーム演出検査の待機超過、立ち絵の端末依存表示・操作感の未確認。旧演出検査は10秒から30秒へ待機上限を合わせ、busy/表示状態/バナーの診断を追加済み。原因を断定した修正ではないため、再発時はログから調べる。

## 9. 今後の進め方・優先順位

以下は既存の残作業に基づく提案であり、新たに確約した納期・実装指示ではない。

1. **実機と本人の試遊を確認する。** [IPHONE_CHECK.md](IPHONE_CHECK.md)へ機種・iOS・日付・URLを記録。縦画面、シリンダー、立ち絵、縮小カードと長押し、戻る／閉じる、演出、保存、ホーム画面起動、機内モード、バックアップ復元を確認。実機で確認した結果だけを受入表に記入する。
2. **教材・学習結果の信頼性を固める。** GQR修正の独立受入、430問を小分けにした技術・出典監査、分野1〜3を含む詳細スキル対応の確認を進める。到達度セットの解答を読む前に本人の初回未読を実施し、時間配分・分野別誤答理由を残す。正答を含む点検表の事前閲覧や、本試験スコアへの換算は避ける。
3. **現行30形態の意味とバランスを確認する。** 加速者優位、復旧者の停止時の弱さ等の既存仮説を、複数方策・人手試遊で比較する。シミュレーション結果だけで最終バランスとしない。設備の停止／破損、再開／復元、役・報酬・初動をAWSの意味と照合する。
4. **入口文書を整理する。** README、PROJECT、CHECKPOINT/TASKS冒頭を最新状態へ整合させ、過去記録は保持する。修正済み指摘と残課題の索引を維持する。本書自体も次の変更時に更新する。
5. **知識・音声を段階的に育てる。** 既存26単位のレビューから始め、条件を変えた転移問題、IAM→VPC/EC2→ストレージ/DB→疎結合→DR→総合設計へ拡張する。音声は現行5分版の試聴後に30分版の方針を決める。
6. **大きな追加は別途範囲を決める。** 全181形態・全脅威・レリック拡張は現行30形態の評価後に検討。候補数をそのまま採用数にしない。

完了条件は「変更を保存」「必要な検査が成功」「GitHubへ同期」「サイト変更ならCI配信と公開物一致を確認」「残作業と次の着手点を台帳へ記録」。本人理解度や未実施の独立監査を完了に含めない。

## 10. 開発・検証・公開手順

```sh
cd materials
pnpm install --frozen-lockfile
pnpm progress:check
pnpm content:status
pnpm test
pnpm knowledge:check
pnpm game:check
pnpm build
pnpm dev
```

ビルド版の配信は`pnpm start`または`pnpm preview`。ブラウザー検査はビルド後、対象に応じて`node scripts/build-adventure-browser-check.mjs`、`node scripts/cylinder-browser-check.mjs`、`node scripts/study-browser-check.mjs`等を実行する。Chromium指定は`CHROME_PATH=/usr/bin/chromium`、WebKit指定は`BROWSER=webkit`で、環境にブラウザーの導入が必要。正式な全回帰の対象・順序は配信ワークフローを正とする。

教材変更時は[CONTENT_CLASSIFICATION_GUIDE.md](CONTENT_CLASSIFICATION_GUIDE.md)、[GAME_CONTENT_UPDATE.md](GAME_CONTENT_UPDATE.md)、knowledgeのREADME・INVENTORY・EXPANSION_PLANを先に読み、正本→分類／出典→export→check→進捗表の順に更新する。`pnpm progress:update`、`knowledge:export`は対象データの変更時に実行し、生成JSONを直接直して検査を通さない。

公開ワークフローはmainの`materials/**`または自身の変更で起動し、手動実行にも対応。テスト・knowledge検査・型検査とビルド・WebKit回帰後にPagesへ配信し、`verify-publication.py`でHTTP200と成果物SHA256一致を検査する。Pages SourceはGitHub Actions。認証・Pages権限・WebKit導入・生成物不一致・実配信のどこで止まったかを区別する。ソースのpush成功だけでサイト公開成功としない。

文書のみで配信を意図的に省略するコミットには既存運用の`[skip ci]`を利用できる。その場合はGitHub上の文書保存を確認し、サイトの再配信とは区別して報告する。

不具合時は元の学習記録を保護し、失敗ログ・URL・コミット・再現操作を保存。修正または過去の正常版へのrevertを新コミットで行い、再配信・一致確認を行う。共有mainの強制pushや保存形式の破壊的変更は通常手順に含めない。

## 11. 作業上の重要事項

- 日本語で記録・報告する。インターネット調査は無料公開情報のみ。有料記事・有料APIによる情報取得は禁止。
- 現行の学習用語は教材由来とする。新規造語をカード名等に混ぜない。通常入口は30形態・6系統であり、旧3主人公やデバフ5種の固定名称規約は適用するモードを確認する。
- 分類は`game-classifications.json`で管理し、`units.json`へ無断でゲームタグを追加しない。draft/candidateを実装だけで監査済みに変えない。
- ユーザーの更新依頼は既存公式Pagesへの反映確認までを含む。未反映なら理由を明記する。本依頼は引継書のGitHub保存であり、ゲーム機能変更はない。
- 利用上限情報が取得できる場合は作業開始・区切りで確認し、いずれかが90%以上／利用不可なら新規タスク・追加委任を止めて成果物と残作業を保存する。取得不能は無制限の意味ではない。回復だけでの自動再開は設定済みと扱わない。
- GitHub公開リポジトリのため、本人の成績・バックアップ・秘密情報を無断でコミットしない。担当者の連絡先、確定納期、実際の試験予約、本人の理解度は今回資料から確定できない。

## 12. 今回の確認範囲

2026-10-31 JST、ローカル基準コミットとGitHub mainの先端一致、作業開始時の未コミット変更なしを確認。GitHub連携のIssue／PR検索では結果0件であり、本書の残課題は主にリポジトリ内台帳から抽出した。検索結果だけで課題なしと判断しない。

`pnpm progress:check`と`pnpm content:status`により上記数量を現環境で確認。今回の追加検証結果はCHECKPOINT/TASKSの「包括引継書」項に記録する。既存の公開・WebKit成功は記録の照合であり、今回の実機確認・全出典再監査・本人実績の確認ではない。
