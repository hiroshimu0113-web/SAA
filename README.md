# SAA取得への道

AWS Certified Solutions Architect – Associate（SAA-C03）を、日本語の教材と小さな設計ゲームで学ぶプロジェクトです。

## ここから始める

**[学習アプリ・設計クエストを開く](https://hiroshimu0113-web.github.io/SAA/)** — iPhoneのSafariで開き、ホームの「設計クエストを遊ぶ」を選びます。

- **5分の音声サンプル**：[写真工房で覚える、EC2・S3・IAMロール](https://hiroshimu0113-web.github.io/SAA/audio/index.html)。合成音声・確認問題2問・台本付き。
- **ゲーム**：学習アプリのホームから「設計クエストを遊ぶ」。8枚のカード・3ミッション、目安5〜10分の試作です。
- **教材を読む**：[先行版HTML](materials/deliverables/SAA-starter.html)をダウンロードしてブラウザーで開くか、[EPUB](materials/deliverables/SAA-starter.epub)をiPhoneの「ブック」に取り込みます。
- **理解のつながりを見る**：[ナレッジグラフ](https://hiroshimu0113-web.github.io/SAA/knowledge/index.html)。14概念の型と、前提・確認方法・関連教材をたどれます。
- **学習を続ける**：[学習ガイド](materials/docs/STUDY_GUIDE.md)と[学習記録](materials/docs/STUDY_LOG.md)を使います。
- **次の作業を確認する**：[現在のチェックポイント](materials/docs/CHECKPOINT.md)、[タスク台帳](materials/docs/TASKS.md)を参照します。

先行教材は **2章6レッスン・20問・用語21件**。12章36レッスン・通常200問の原稿もありますが、全体監査は未完了です。模擬試験130問は未作成です。試作ゲームのクリアや正答率は、試験合格の判定ではありません。

## 資料の配置

| 場所 | 内容 |
|---|---|
| `materials/src/` | 今後更新する学習アプリ・教材・試作ゲームのソース |
| `materials/docs/` | 設計、教材監査、学習手順、進捗・引き継ぎ |
| `materials/deliverables/` | 移行時のEPUB・HTML・配布ZIP。新しいゲームは含みません |
| `materials/artifacts/` | 移行時の検証画像・サンプルバックアップ。本人の学習実績とは扱いません |
| `materials/SAAへの道.md` | 元の全体計画 |
| `.github/workflows/deploy.yml` | `materials/` をビルドして配信するGitHub Pages用ワークフロー |

配布ZIPは移行時点の記録として保存しています。通常の編集は展開済みのソースで行います。ZIPからの復元経緯は[移行記録](materials/docs/MIGRATION.md)にあります。

## 開発・検証

Node.js 24、pnpm 11.19.0で検証しています。

```sh
cd materials
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

ビルド済みアプリを動かす場合は同じディレクトリで `pnpm start`。オフライン機能は開発サーバーではなく、ビルド後のアプリで確認します。

ゲームのブラウザー検証は `CHROME_PATH=/usr/bin/chromium node scripts/game-browser-check.mjs`。Chromeの場所は環境に合わせて指定します。

## iPhoneで遊ぶための公開

GitHubの Settings → Pages → Source を **GitHub Actions** に設定し、リポジトリルートの配信ワークフローを実行します。成功後、Pages設定に表示されるHTTPS URLをSafariで開きます。公開状況は[チェックポイント](materials/docs/CHECKPOINT.md)を参照してください。

ホーム画面への追加とオフライン確認は[実機チェック](materials/docs/IPHONE_CHECK.md)、試作の遊び方は[ゲーム仕様](materials/docs/GAME_PROTOTYPE.md)を参照してください。
