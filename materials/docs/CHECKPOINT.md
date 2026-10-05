# 現在のチェックポイント

更新：2026-10-05 JST。ゲーム試作は公開済み（当初の目標は2026-10-06 07:00 JST）。現在の依頼は **5分の音声サンプルと、教材を拡充するための細分化・ナレッジグラフの型の作成**。GitHub Pages公開は承認済み。情報収集は無料の公開資料のみとし、有料記事・有料API等は利用しない。

## 今回できたこと

- `main` の資料を取得し、同梱ZIPから不足していた管理資料・ビルド設定等13ファイルを復元。
- リポジトリの入口、学習ガイド、本人用の空の学習記録を整備。配布物と監査待ち原稿を区別。
- 「設計クエスト」を追加：8カード・3ミッション、条件判定、失敗と再挑戦、星、解説、教材への導線。
- ゲームのカード選択・判定・クリア状態を既存学習記録へ保存。バックアップとオフライン再開に対応。
- AWS公式資料でロール・MFA・ALB・S3の説明を無料で照合。範囲と前提は [GAME_PROTOTYPE.md](GAME_PROTOTYPE.md)。
- `materials/` の配置に対応したリポジトリルートのGitHub Pagesワークフローを用意。

## 現環境での検証

- Node.js 24.19.0 / pnpm 11.19.0。`pnpm install --frozen-lockfile` 成功。
- `pnpm test`：13件成功（既存9件＋ゲーム4件）。ゲームは全カード組合せ、全ミッションクリア、再挑戦、破損記録、バックアップ復元を検査。
- `pnpm build`：TypeScriptと配信用ビルド成功。
- ゲームのChromiumモバイル検証：全3ミッション、失敗からの再挑戦、星、途中保存、オフライン再読込、完了記録、教材リンク、リセットと取消、320px幅、`/SAA/`配下での動作に成功。
- 既存ブラウザー試験：教材、演習、オフライン、バックアップ復元成功。
- Service Worker更新試験：更新失敗時の旧版保持、明示的な新版適用、キャッシュ欠落の修復に成功。
- 既存配布物4点のSHA256、ZIP CRC、EPUBの構造・20問と解説の参照検査に成功。
- 単一HTML教材：JavaScript無効のChromiumでHTTP配信を使い、表示・問題と解説の往復リンク成功。file://は環境ポリシーで拒否されたためHTTPで検証。
- `pnpm start`：ホーム、ゲームを含むJS、Service WorkerのHTTP応答を確認。依存インストールの再実行も成功。
- WebKit：ブラウザー配布元がDomain forbiddenで導入不可。Safari/iPhoneの検証としては計上しない。
- 環境ドラフトに `install_script` と `start_skill` を保存済み。保存は新しいクラウド環境の公開・復元検証を意味しない。
- 教材原稿の数量：12章36レッスン・通常200問、模試0問。数量は内容監査完了を意味しない。

## 公開と実機の状態

公開URL：**https://hiroshimu0113-web.github.io/SAA/**

ユーザー側でリポジトリ公開・Pages有効化後、旧実行の2回目はビルド・成果物アップロードまで成功し、setup-nodeのキャッシュ保存で失敗していました。ロックファイル不足ではなく、リポジトリ直下で検出したpnpm storeと、materials/pnpm-workspace.yamlが指定するstoreDirの不一致が原因です。

`3976bc2` で自動キャッシュを置き換え、materials内で `pnpm store path --silent` を実行して実際の保存先をactions/cacheへ渡すよう修正。[Actions実行37320530772](https://github.com/hiroshimu0113-web/SAA/actions/runs/37320530772)は13テスト・ビルド・キャッシュ保存・Pages配信まで全て成功。npmのロックファイルは追加していません。

公開URLと全7ファイルをTLS検証有効のまま取得し、検証済みローカルビルドとのSHA256一致を確認。同じ内容のローカル配信で、モバイル相当の全ミッション・再挑戦・保存・オフライン再開を再検証しました。

公開URLへのChromium直接接続はクラウド環境のCA未登録で失敗。OSで信頼済みの環境CAをChromiumにも永続登録する操作は、今後のTLS信頼範囲を広げるとの理由で自動承認レビューに拒否され、実施していません。証明書検証を無効化せず、HTTPS取得と配信ファイル一致確認で代替しています。実際のiPhone受入は未確認です。

## 残作業と次の着手点

1. 公開URLをiPhoneのSafariで開き、ホームの「設計クエストを遊ぶ」へ進む。
2. iPhoneのSafari／ホーム画面でゲーム全3ミッションと途中再開を確認。[IPHONE_CHECK.md](IPHONE_CHECK.md)参照。
3. 実機の文字量・操作感に基づき試作を改善。
4. 全教材の監査、模試、本格ゲームは別途継続。試作完成をG1〜G5全体の完成としない。

## 過去資料との区別

旧チェックポイントは元の `deliverables/SAA-project-source.zip` に保存されています。そこにある7:00停止・自動フォローアップ・過去の端末の検証は当時の記録です。本環境の予約や現在の検証結果を意味しません。ユーザー本人の学習実績は未確認で、`artifacts/backup.json` を本人の進捗として扱いません。

## 音声サンプル A-P1（2026-10-05 JST）

- 内容：写真工房を題材にEC2・S3・IAMロールを説明。確認問題2問、各7秒の思考時間。
- 成果物：`public/audio/photo-studio-5min.mp3`、`public/audio/index.html`、`audio/TRANSCRIPT.md`。約5分00秒、約3.5MiB。
- 無料のpyopenjtalk 0.4.1／HTS Voice Meiでローカル合成。声のライセンスとクレジットを付記。有料API・有料情報は利用していない。
- EC2、IAM、S3の公式資料で説明を照合。専門用語の読みを指定し、テンポ・音量を調整。
- 検証：MP3全体のデコード成功、長さ300.15秒、統合ラウドネス-18.27 LUFS、トゥルーピーク-1.71 dBTP。
- Chromiumのモバイル相当画面で、再生・章への移動・速度変更・台本・320px幅・オフライン再生を確認。Service Workerのディレクトリ内ページと音声Range応答に対応し、206／416を検証。既存の更新失敗・適用・キャッシュ修復試験も成功。
- 声質や発音全体の聴取評価、iPhone実機確認は未実施。ユーザーの試聴フィードバックを受けて30分版の方針を決める。30分版はまだ制作していない。
- 再生成手順は `audio/README.md`。`9937b3b`をmainへ反映し、Actions実行37325349805はテスト・ビルド・配信成功。公開URL：https://hiroshimu0113-web.github.io/SAA/audio/index.html 。HTTPSでプレーヤー・MP3・時刻情報・Service Workerを取得し、ローカル成果物とのSHA256一致を確認。

## 理解のナレッジグラフ K-P1

- 音声は作成・公開済み。その後の依頼に基づき、後続エージェントが内容を重厚にするための型を整備。
- 正本：`knowledge/units.json`（14単位、説明・適用の確認28問）と `relations.json`。目標、前提、誤解、期待する回答要素、参照教材、次の拡充を記録。
- 全12章・36レッスン・通常200問を棚卸し。155個の概念ID、407ノード・609エッジを生成。概念タグの表記揺れや複合タグは未監査で、自動統合していない。
- ブラウザーで見る地図：`public/knowledge/index.html`。14概念を選び、前提・次の単位・区別・組合せ・関連教材をたどれる。
- `knowledge/README.md`、`EXPANSION_PLAN.md`、`INVENTORY.md`、JSON Schemaを用意。AGENTS.mdにも開始時の参照先を追記。
- 14単位の監査状態はすべてdraft。本人の理解度はunassessed。既存教材の公開状態とは分離。学習者の実績は作成していない。
- 検証：17テスト成功、グラフ生成と保存ファイルの一致確認、型検査・ビルド成功。モバイル相当の検索、前提への移動、回答基準表示、キーボード操作、12章の表示、320px幅を確認。
- 次の制作は `knowledge/EXPANSION_PLAN.md` の順：14単位の独立レビュー → 条件を変えた転移問題 → 先行2章の残り → VPC等。型の完成を全教材の完成としない。
- 公開URL：https://hiroshimu0113-web.github.io/SAA/knowledge/index.html 。`7cbf350`をmainへ反映し、Actions実行37327612847で17テスト・knowledge:check・ビルド・配信成功。公開HTML・グラフJSON・Service Worker・既存音声をHTTPSで取得し、ローカル成果物とのSHA256一致を確認。

## A-P2 声質改善の比較版（2026-10-06 JST）

- 状態：比較音声作成・ローカル検証・公開確認完了、本人の試聴待ち。AivisSpeechは接続制限でブロック。
- ユーザー試聴で前回のMei音声が高く鋭いとの評価。VOICEVOX 0.25.2で青山龍星ノーマル／しっとり、波音リツノーマルを合成。従来音声の抜粋を含む4種類を同じ台本・同程度の音量で比較。
- 成果物：public/audio/comparison.html、compare-*.mp3、comparison.json。約29〜33秒。再生成と調査結果はaudio/COMPARISON.md、同梱規約はVOICEVOX_LICENSE.md。
- 検証：MP3デコード・長さ・音量成功。17テスト、knowledge:check、型検査とビルド成功。Chromiumモバイル相当で4音声の再生、同時再生防止、320px幅、台本、オフライン・Range応答成功。既存5分版の再生試験も成功。新しい音声の聴取品質は未評価。
- 次：公開URL確認→本人の声の選択→5分版へ反映。AivisSpeechモデル取得先と規約参照先の追加設定案を保存済み。保存と環境への適用・公開は別。

- A-P2公開確認：`6b13102`をmainへ反映。Actions実行37335729840でテスト・ビルド・Pages配信成功。https://hiroshimu0113-web.github.io/SAA/audio/comparison.html 。公開HTML・JSON・4音声・既存プレーヤー・Service Workerの計8ファイルをTLS検証付きで取得し、検証済みdistとのSHA256一致を確認。

## A-P3 波音リツ版の5分教材

- ユーザーが3番・波音リツノーマルを暫定選択。「もう少し若い感じがあるといいが妥協点」との評価を保持。声質に満足済みとは扱わない。
- VOICEVOX 0.25.2、style 9、pitchScale 0、speedScale 0.95、intonationScale 0.9で既存台本を再合成。有料APIなし。5分に合わせ音程を保った1.1039倍のテンポ補正。確認問題後の7秒は維持。
- 成果物：public/audio/photo-studio-ritsu-5min.mp3、sample-01.json、index.html、audio/TRANSCRIPT.md。旧音声と旧時刻情報sample-mei.jsonは保持。生成手順はaudio/README.md。
- 検証：300.15秒、-18.45 LUFS、-2.40 dBTP、全体デコード成功。17テスト・knowledge:check・型検査とビルド成功。Chromiumモバイル相当で再生・速度変更・章移動・台本・320px・オフライン・Range応答成功。比較版の再生試験も成功。`3982a31`をmainに反映し、Actions実行37336673197で配信成功。公開プレーヤー・新音声・時刻情報・比較ページ・Service Workerの5ファイルをTLS検証付きで取得し、検証済みdistとのSHA256一致を確認。公開URL：https://hiroshimu0113-web.github.io/SAA/audio/index.html 。
- 次：波音リツ5分版の試聴評価。若い声への希望は将来の候補比較に残す。30分版は未制作。

## A-P4 若めの女性音声候補

- 本人の5分版評価：波音リツの高さはよいが、年齢感とこもりが気になる。次は高音化よりモデル固有の声質を比較する。
- 成果物：public/audio/female-comparison.html、female-comparison.json、compare-hau/himari/sora.mp3。雨晴はう33.57秒、冥鳴ひまり32.73秒、九州そら52.17秒。比較用に波音リツ32.73秒も掲載。同じ台本と合成設定（速さ0.95・抑揚0.9・音高0）、音量のみ正規化。各モデルの自然な話速・高さは異なる。
- 検証：3音声の全体デコード成功、-18.44〜-18.46 LUFS、ピーク-2.43dBTP以下。17テスト、knowledge:check、型検査・ビルド成功。聴取評価は本人待ち。
- 同梱利用条件を確認・転記し、クレジットと規約リンク付き。有料APIなし。5分版は選択まで波音リツを保持。
- 再生成：scripts/generate-female-comparison.py。次：比較試聴で声を選択→5分版反映。公開確認は追記。
